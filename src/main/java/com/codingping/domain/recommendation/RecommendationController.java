package com.codingping.domain.recommendation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // React 프론트엔드 접근 허용 (포트 맞추기)
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

    // 날씨 추천 API 엔드포인트 (위도와 경도 기반)
    @PostMapping("/get-weather-recommendations")
    public Mono<ResponseEntity<Object>> getWeatherRecommendations(@RequestBody Map<String, Object> request) {
        // 위도와 경도를 받아오기
        Double latitude = (Double) request.get("latitude");
        Double longitude = (Double) request.get("longitude");
        String apiKey = (String) request.get("api_key");

        if (latitude == null || longitude == null || apiKey == null || apiKey.isEmpty()) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude, Longitude, and API key are required"));
        }

        // Flask 서버로 요청 전송 (위도와 경도 사용)
        return webClient.post()
                .uri(pythonServerUrl + "/api/weather_recommendations")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorResume(error -> Mono.just(ResponseEntity.status(500).body("Failed to get weather recommendations from Python server")));
    }

    // 에피소드 상세 정보 API 엔드포인트 추가
    @GetMapping("/get-episode-detail")
    public Mono<ResponseEntity<Object>> getEpisodeDetail(@RequestParam String id) {
        return webClient.get()
                .uri(pythonServerUrl + "/api/episode_detail?id=" + id)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorResume(error -> Mono.just(ResponseEntity.status(500).body("Failed to get episode details from Python server")));
    }
    @Autowired
    private RestTemplate restTemplate;

    private static final String FLASK_BASE_URL = "http://localhost:5001/api";

    @PostMapping("/chatbot")
    public ResponseEntity<?> getChatbotRecommendation(@RequestBody Map<String, Object> userRequest) {
        String message = (String) userRequest.get("message");
        Double latitude = (Double) userRequest.get("latitude");
        Double longitude = (Double) userRequest.get("longitude");
        String apiKey = (String) userRequest.get("api_key");

        // Flask 서버에 보낼 요청 구성
        Map<String, Object> flaskRequest = new HashMap<>();
        flaskRequest.put("message", message);
        flaskRequest.put("latitude", latitude);
        flaskRequest.put("longitude", longitude);
        flaskRequest.put("api_key", apiKey);

        // Flask의 챗봇 엔드포인트로 요청을 전송
        String flaskUrl = FLASK_BASE_URL + "/chatbot";
        ResponseEntity<String> flaskResponse = restTemplate.postForEntity(flaskUrl, flaskRequest, String.class);

        // Flask 서버에서 받은 응답 반환
        return ResponseEntity.ok(flaskResponse.getBody());
    }


}