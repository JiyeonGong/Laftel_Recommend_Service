package com.codingping.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FavoriteRequest {
    private Long userId;
    private Integer episodeId;
}
