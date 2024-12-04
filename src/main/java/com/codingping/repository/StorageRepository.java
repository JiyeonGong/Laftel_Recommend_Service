package com.codingping.repository;

import com.codingping.entity.Storage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StorageRepository extends JpaRepository<Storage, Long> {
    Optional<Storage> findByUserIdAndEpisodeId(Long userId, Integer episodeId);
    void deleteByUserIdAndEpisodeId(Long userId, Integer episodeId);

    Page<Storage> findByUserId(Long userId, Pageable pageable);
}