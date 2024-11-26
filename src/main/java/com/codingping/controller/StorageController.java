package com.codingping.controller;

import com.codingping.entity.Storage;
import com.codingping.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/storage")
public class StorageController {
    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    // 보관함 저장
    @PostMapping
    public ResponseEntity<Storage> saveStorage(@RequestBody Storage storage) {
        Storage savedStorage = storageService.saveStorage(storage);
        return ResponseEntity.ok(savedStorage);
    }

    // 사용자별 보관함 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<Storage>> getStorageByUserId(@PathVariable Long userId) {
        List<Storage> storageList = storageService.getStorageByUserId(userId);
        return ResponseEntity.ok(storageList);
    }
}