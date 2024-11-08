package com.codingping.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "profile_img")
    private String profileImg;
}