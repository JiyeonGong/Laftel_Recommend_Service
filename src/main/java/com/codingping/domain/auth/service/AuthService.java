package com.codingping.domain.auth.service;

import com.codingping.domain.auth.dto.request.TokenRequest;
import com.codingping.domain.auth.dto.response.TokenResponse;
import com.codingping.domain.user.repository.UserInfoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Service
public class AuthService {
    private final UserInfoRepository userInfoRepository;
    private final SecretKey secretKey;

    @Value("${kakao.api.Key}")
    private String apiKey;

    @Value("${kakao.redirect.url}")
    private String redirectUri;

    // JWT 토큰 만료 기간
    private static final long JWT_EXPIRATION_MS = 3600000; // 1시간
    private static final long REFRESH_EXPIRATION_MS = 1209600000;// 2주

    // 액세스 토큰 발급
    public String getAccessToken(String code) {
        String accessToken = "";
        String reqUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "4fd8035dab85a9abd91f5269225e57b7");
        params.add("redirect_uri", "http://localhost:3000/oauth2/callback");
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        try {
            // Kakao API 호출
            ResponseEntity<String> response = restTemplate.exchange(
                    reqUrl, HttpMethod.POST, requestEntity, String.class
            );

            // 응답 처리
            if (response.getStatusCode() == HttpStatus.OK) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                accessToken = jsonNode.get("access_token").asText();
                log.info("accessToken: {}", accessToken);
            }
        } catch (Exception e) {
            log.error("액세스 토큰 오류: {}", e.getMessage(), e);
        }

        return accessToken;
    }

    // 사용자 정보 조회
    public Map<String, Object> getUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String reqUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        try {
            // Kakao API 호출
            ResponseEntity<Map> response = restTemplate.exchange(
                    reqUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            // 응답을 성공적으로 받았을 때
            int responseCode = response.getStatusCode().value();
            if (responseCode >= 200 && responseCode < 300) {
                Map<String, Object> body = response.getBody();

                Long kakaoId = Optional.ofNullable(body)
                        .map(b -> (Number) b.get("id"))
                        .map(Number::longValue)
                        .orElseThrow(() -> new IllegalArgumentException("Kakao ID가 존재하지 않습니다."));

                // 기존 사용자 여부 확인
                boolean isExistingUser = userInfoRepository.findByKakaoId(kakaoId).isPresent();
                if (isExistingUser) {
                    log.info("기존 사용자입니다.");
                } else {
                    log.info("신규 사용자입니다.");
                }

                Map<String, Object> result = new HashMap<>();
                result.put("kakaoId", kakaoId);
                result.put("isExistingUser", isExistingUser);
                return result;
            } else {
                log.error("사용자 정보 조회 응답 오류");
            }
        } catch (Exception e) {
            log.error("사용자 정보 요청 오류: {}", e.getMessage(), e);
        }

        return null;
    }

    // JWT 액세스 토큰 생성 (kakaoId 사용)
    public String generateJwtToken(Long kakaoId) {
        return Jwts.builder()
                .setSubject(String.valueOf(kakaoId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // JWT 리프레시 토큰 생성
    public String generateRefreshToken(Long kakaoId) {
        return Jwts.builder()
                .setSubject(String.valueOf(kakaoId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // JWT 리프레시 토큰으로 새로운 액세스 토큰 발급
    public TokenResponse refreshTokens(TokenRequest tokenRequest) {
        // 리프레시 토큰 검증 및 새로운 액세스 토큰 발급 로직 구현 !!
        TokenResponse tokenResponse = null;
        return tokenResponse;
    }
}