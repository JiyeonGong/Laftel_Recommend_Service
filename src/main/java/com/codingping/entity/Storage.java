package com.codingping.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor //Builder와 함께 쓰여야함
@NoArgsConstructor
@Getter
@Setter
@Table(name = "storage")
public class Storage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storageId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int episodeId;

    @Column(nullable = true)
    private String status = "즐겨찾기";

    @Column(nullable = false, updatable = false)
    private LocalDateTime addedDate = LocalDateTime.now();
}
