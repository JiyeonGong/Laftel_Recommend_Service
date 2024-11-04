package com.codingping.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class UserInfoDTO {
    private Long kakaoId;
    private String gender;
    private String ageRange;

    @Builder
    public UserInfoDTO(Long kakaoId, String gender, String ageRange) {
        this.kakaoId = kakaoId;
        this.gender = gender;
        this.ageRange = ageRange;
    }
}