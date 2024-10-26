package com.codingping.controller;

import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/kakao")
public class kakaoApiController {

    @PostMapping
    public ResponseEntity<?> getKakaoAccessToken(@RequestBody Map<String, String> codeData) {
        String code = codeData.get("code");

        // AccessToken을 받기 위한 요청 URL 및 파라미터 설정
        String tokenRequestUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();

        // 요청 파라미터 설정
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "YOUR_KAKAO_CLIENT_ID");  // 카카오 REST API 키
        params.add("redirect_uri", "YOUR_KAKAO_REDIRECT_URI"); // 카카오에 등록한 리다이렉트 URI
        params.add("code", code);

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            // 액세스 토큰 요청
            ResponseEntity<Map> response = restTemplate.exchange(tokenRequestUrl, HttpMethod.POST, request, Map.class);

            // 액세스 토큰 확인
            String accessToken = (String) response.getBody().get("access_token");
            return ResponseEntity.ok().body(Map.of("accessToken", accessToken));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching access token");
        }
    }
}