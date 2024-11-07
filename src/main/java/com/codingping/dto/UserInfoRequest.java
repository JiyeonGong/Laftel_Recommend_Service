package com.codingping.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@Getter
@Setter
public class UserInfoRequest {
    private Long kakaoId;
    private String nickname;
    private String gender;
    private String ageRange;
    private String mbti;
    private MultipartFile profileImage;
}