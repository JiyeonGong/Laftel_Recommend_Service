package com.codingping.service;

import com.codingping.entity.Storage;
import com.codingping.repository.StorageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StorageService {
    private final StorageRepository storageRepository;

    // 즐겨찾기 여부 확인
    public boolean isFavorite(Long userId, Integer episodeId) {
        return storageRepository.findByUserIdAndEpisodeId(userId, episodeId).isPresent();
    }

    // 즐겨찾기 추가
    public void addFavorite(Long userId, Integer episodeId) {
        if (!isFavorite(userId, episodeId)) {
            Storage storage = new Storage();
            storage.setUserId(userId);
            storage.setEpisodeId(episodeId);
            storageRepository.save(storage);
        }
    }

    // 즐겨찾기 제거
    @Transactional
    public void removeFavorite(Long userId, Integer episodeId) {
        storageRepository.deleteByUserIdAndEpisodeId(userId, episodeId);
    }
}