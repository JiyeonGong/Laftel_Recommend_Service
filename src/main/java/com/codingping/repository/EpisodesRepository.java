package com.codingping.repository;

import com.codingping.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EpisodesRepository extends JpaRepository<Episode, Integer> {
    Optional<Episode> findByEpisodeId(Integer episodeId);
}