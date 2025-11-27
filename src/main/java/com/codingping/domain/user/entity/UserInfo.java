package com.codingping.domain.user.entity;

import com.codingping.domain.help.entity.Help;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor //Builder와 함께 쓰여야함
@NoArgsConstructor
@Getter
@Setter
@Table(name = "user_info")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kakao_id", nullable = false)
    private Long kakaoId;

    @Column(name = "name")
    private String name;

    @Column(name = "gender")
    private String gender;

    @Column(name = "age_range")
    private String ageRange;

    @Column(name = "fav_genre", columnDefinition = "VARCHAR(255) DEFAULT 'unknown'")
    private String favGenre;

    @Column(name = "fav_tag", columnDefinition = "VARCHAR(255) DEFAULT 'unknown'")
    private String favTag;

    @Column(name = "mbti")
    private String mbti;

    @Column(name = "role")
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Help> helps = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (favGenre == null) {
            this.favGenre = "unknown";
        }
        if (favTag == null) {
            this.favTag = "unknown";
        }
    }
}