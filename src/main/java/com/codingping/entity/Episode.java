package com.codingping.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "episodes")
public class Episode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "episode_id")
    private Integer episodeId;

    @Column(name = "series_id", nullable = true)
    private Integer seriesId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "avg_rating")
    private Double avgRating;

    @Column(name = "img_url", length = 2083)
    private String imgUrl;

    @Column(name = "air_year_quarter", columnDefinition = "TEXT")
    private String airYearQuarter;
}
