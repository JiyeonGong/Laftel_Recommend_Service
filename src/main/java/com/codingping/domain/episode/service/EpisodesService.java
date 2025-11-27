package com.codingping.domain.episode.service;

import com.codingping.domain.episode.entity.Episode;
import com.codingping.domain.episode.repository.EpisodesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Service
public class EpisodesService {
    private final EpisodesRepository episodesRepository;

    public Optional<Episode> getEpisodeById(Integer episodeId) {
        return episodesRepository.findByEpisodeId(episodeId);
    }
}