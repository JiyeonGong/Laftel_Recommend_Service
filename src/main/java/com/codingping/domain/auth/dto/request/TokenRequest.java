package com.codingping.domain.auth.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class TokenRequest {
    private String jwtToken;
    private String refreshToken;
    private String kakaoId;

    @Builder
    public TokenRequest(String jwtToken, String refreshToken, String kakaoId) {
        this.jwtToken = jwtToken;
        this.refreshToken = refreshToken;
        this.kakaoId = kakaoId;
    }
}
