package com.codingping.controller;

import com.codingping.dto.UserInfoDTO;
import com.codingping.dto.TokenRequestDTO;
import com.codingping.dto.TokenResponseDTO;
import com.codingping.service.AuthService;
import com.codingping.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/kakaoApi")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    // 액세스 토큰 발급 -> 사용자 정보 조회 -> jwt 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> kakaoApi(@RequestBody Map<String, String> requestBody) {
        log.info("POST /kakaoApi 요청 수신");

        // 인가 코드 추출
        String code = requestBody.get("code");
        log.info("받은 code: {}", code);

        // 액세스 토큰 발급
        String accessToken = authService.getAccessToken(code);
        log.info("받은 accessToken: {}", accessToken);

        // 사용자 정보 조회
        UserInfoDTO userInfo = authService.getUserInfo(accessToken);
        if (userInfo == null) {
            log.error("사용자 정보 조회 실패");
            return ResponseEntity.status(500).body(Map.of("error", "Failed to retrieve user info from Kakao API"));
        }
        log.info("사용자 정보 조회 완료: {}", userInfo);

        // 새로운 사용자인지 확인 + DB에 사용자 정보 저장/업데이트
        // !! 새로운 사용자일 때 redirect 되도록 코드 수정 필요 !!
        boolean isNewUser = userService.saveUser(userInfo);
        if (isNewUser) {
            log.info("새 사용자 정보 저장 완료");
        } else {
            log.info("기존 사용자 정보 업데이트 완료");
        }

        // JWT 토큰 생성
        String jwtToken = authService.generateJwtToken(userInfo.getKakaoId());
        String refreshToken = authService.generateRefreshToken(userInfo.getKakaoId());
        log.info("JWT 토큰 생성 완료");

        Map<String, Object> response = Map.of(
                "kakaoAccessToken", accessToken,
                "jwtToken", jwtToken,
                "refreshToken", refreshToken,
                "kakaoId", userInfo.getKakaoId()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-tokens")
    public ResponseEntity<TokenResponseDTO> refreshTokens(@RequestBody TokenRequestDTO tokenRequest) {
        TokenResponseDTO tokenResponse = authService.refreshTokens(tokenRequest);
        return ResponseEntity.ok(tokenResponse);
    }
}