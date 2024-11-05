package com.codingping.service;

import com.codingping.dto.UserInfoDTO;
import com.codingping.dto.TokenRequestDTO;
import com.codingping.dto.TokenResponseDTO;
import com.codingping.util.JwtUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

//사용자의 로그인 처리 서비스
@Slf4j
@Service
public class AuthService {

    @Value("${kakao.api.Key}")
    private String apiKey;

    @Value("${kakao.redirect.url}")
    private String redirectUri;

    //@Value("${jwt.secret.key}")
    //private String secretKey;

    // JWT 토큰 만료 기간
    private static final long JWT_EXPIRATION_MS = 3600000; // 1시간
    private static final long REFRESH_EXPIRATION_MS = 1209600000;// 2주

    private final SecretKey secretKey;
    public AuthService() {
        this.secretKey = JwtUtils.generateSecretKey();
    }

    // 액세스 토큰 발급
    public String getAccessToken(String code) {
        String accessToken = "";
        String reqUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();
        log.info("info = {}", reqUrl);

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
    public UserInfoDTO getUserInfo(String accessToken) {
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

            int responseCode = response.getStatusCode().value();
            log.info("[KakaoApi.getUserInfo] responseCode: {}", responseCode);

            // 응답을 성공적으로 받았을 때
            if (responseCode >= 200 && responseCode < 300) {
                Map<String, Object> body = response.getBody();

                // id 값이 null일 경우 처리
                Long id = Optional.ofNullable(body)
                        .map(b -> (Number) b.get("id"))
                        .map(Number::longValue)
                        .orElse(null);

                Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
                log.info("kakaoAccount: {}", kakaoAccount.toString());

                // has_gender와 has_age_range가 null일 때 기본값을 false로 처리
                boolean hasGender = Optional.ofNullable(kakaoAccount)
                        .map(account -> (Boolean) account.get("has_gender"))
                        .orElse(false);

                boolean hasAgeRange = Optional.ofNullable(kakaoAccount)
                        .map(account -> (Boolean) account.get("has_age_range"))
                        .orElse(false);

                // 성별과 연령대 값 존재 여부에 따른 처리
                String gender = hasGender ? (String) kakaoAccount.get("gender") : null;
                String ageRange = hasAgeRange ? (String) kakaoAccount.get("age_range") : null;
                log.info("gender: {}", gender);
                log.info("ageRange: {}", ageRange);

                UserInfoDTO userInfo = UserInfoDTO.builder()
                        .kakaoId(id)
                        .gender(gender)
                        .ageRange(ageRange)
                        .build();

                return userInfo;
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
    public TokenResponseDTO refreshTokens(TokenRequestDTO tokenRequest) {
        // 리프레시 토큰 검증 및 새로운 액세스 토큰 발급 로직 구현 !!
        TokenResponseDTO tokenResponse = null;
        return tokenResponse;
    }
}