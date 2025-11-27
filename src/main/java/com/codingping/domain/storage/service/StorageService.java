package com.codingping.domain.storage.service;

import com.codingping.domain.storage.entity.Storage;
import com.codingping.domain.storage.repository.StorageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class StorageService {
    private final StorageRepository storageRepository;

    // 보관함 리스트 조회
    public Page<Storage> findByUserId(Long userId, Pageable pageable) {
        return storageRepository.findByUserId(userId, pageable);
    }

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