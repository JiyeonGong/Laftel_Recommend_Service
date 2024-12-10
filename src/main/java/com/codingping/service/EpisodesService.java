package com.codingping.service;

import com.codingping.entity.Episode;
import com.codingping.repository.EpisodesRepository;
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