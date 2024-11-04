package com.codingping.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class TokenResponseDTO {
    private String jwtToken;
    private String kakaoAccessToken;

    @Builder
    public TokenResponseDTO(String jwtToken, String kakaoAccessToken) {
        this.jwtToken = jwtToken;
        this.kakaoAccessToken = kakaoAccessToken;
    }
}
