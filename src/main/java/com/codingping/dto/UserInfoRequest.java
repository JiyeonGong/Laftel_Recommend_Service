package com.codingping.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class UserInfoRequest {
    private Long kakaoId;
    private String nickname;
    private String gender;
    private String ageRange;
    private String mbti;
}