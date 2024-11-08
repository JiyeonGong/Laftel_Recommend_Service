package com.codingping.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true") // 모든 도메인에서 접근 허용 (프론트엔드와의 연계 위해)
@RestController
@RequestMapping("/api")
public class RecommendationController {

    @Value("${python.server.url}") // application.properties에서 Python 서버 URL 설정
    private String pythonServerUrl;

    private final WebClient webClient;

    public RecommendationController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // MBTI 추천 API 엔드포인트
    @PostMapping("/get-mbti-recommendations")
    public Mono<ResponseEntity<Object>> getMbtiRecommendations(@RequestBody Map<String, String> request) {
        String userMbti = request.get("mbti");
        if (userMbti == null || userMbti.isEmpty()) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "MBTI is required"));
        }

        return webClient.post()
                .uri(pythonServerUrl + "/api/mbti_recommendations")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorResume(error -> Mono.just(ResponseEntity.status(500).body("Failed to get MBTI recommendations from Python server")));
    }

    // 날씨 추천 API 엔드포인트
    @PostMapping("/get-weather-recommendations")
    public Mono<ResponseEntity<Object>> getWeatherRecommendations(@RequestBody Map<String, String> request) {
        String cityName = request.get("city");
        String apiKey = request.get("api_key");

        if (cityName == null || cityName.isEmpty() || apiKey == null || apiKey.isEmpty()) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "City name and API key are required"));
        }

        return webClient.post()
                .uri(pythonServerUrl + "/api/weather_recommendations")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorResume(error -> Mono.just(ResponseEntity.status(500).body("Failed to get weather recommendations from Python server")));
    }
}
