package com.codingping.controller;

import com.codingping.dto.TokenRequest;
import com.codingping.dto.TokenResponse;
import com.codingping.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/kakaoApi")
public class AuthController {
    private final AuthService authService;

    // 액세스 토큰 발급 -> 사용자 정보 조회 -> jwt 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> kakaoApi(@RequestBody Map<String, String> requestBody) {
        log.info("POST /kakaoApi 요청 수신");

        // 1. 인가 코드 추출
        String code = requestBody.get("code");
        log.info("받은 code: {}", code);

        // 2. 액세스 토큰 발급
        String accessToken = authService.getAccessToken(code);
        log.info("받은 accessToken: {}", accessToken);

        // 3. 사용자 정보 조회
        Map<String, Object> userInfo = authService.getUserInfo(accessToken);
        Long kakaoId = (Long) userInfo.get("kakaoId");
        log.info("사용자 kakaoId 조회 완료: {}", kakaoId);

        // 4. JWT 토큰 생성
        String jwtToken = authService.generateJwtToken(kakaoId);
        String refreshToken = authService.generateRefreshToken(kakaoId);
        log.info("JWT 토큰 생성 완료");

        Map<String, Object> response = Map.of(
                "kakaoAccessToken", accessToken,
                "jwtToken", jwtToken,
                "refreshToken", refreshToken,
                "kakaoId", kakaoId,
                "isExistingUser", userInfo.get("isExistingUser")
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-tokens")
    public ResponseEntity<TokenResponse> refreshTokens(@RequestBody TokenRequest tokenRequest) {
        TokenResponse tokenResponse = authService.refreshTokens(tokenRequest);
        return ResponseEntity.ok(tokenResponse);
    }
}