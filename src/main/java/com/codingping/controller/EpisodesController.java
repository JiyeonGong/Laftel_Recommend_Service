package com.codingping.controller;

import lombok.RequiredArgsConstructor;
import com.codingping.service.EpisodesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/episodes")
public class EpisodesController {
    private final EpisodesService episodesService;

    @GetMapping("/{episodeId}")
    public ResponseEntity<?> getEpisodeDetails(@PathVariable Integer episodeId) {
        return episodesService.getEpisodeById(episodeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
