package com.codingping.controller;

import com.codingping.dto.FavoriteRequest;
import com.codingping.entity.Storage;
import com.codingping.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/storage")
public class StorageController {
    private final StorageService storageService;

    // 즐겨찾기 여부 확인 API
    @GetMapping("/check")
    public ResponseEntity<?> checkFavorite(@RequestParam Long userId, @RequestParam Integer episodeId) {
        boolean isFavorite = storageService.isFavorite(userId, episodeId);
        return ResponseEntity.ok().body("{\"isFavorite\": " + isFavorite + "}");
    }

    // 즐겨찾기 추가 API
    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteRequest request) {
        storageService.addFavorite(request.getUserId(), request.getEpisodeId());
        return ResponseEntity.ok().body("{\"message\": \"Favorite added successfully\"}");
    }

    // 즐겨찾기 제거 API
    @PostMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestBody FavoriteRequest request) {
        storageService.removeFavorite(request.getUserId(), request.getEpisodeId());
        return ResponseEntity.ok().body("{\"message\": \"Favorite removed successfully\"}");
    }
}