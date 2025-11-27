package com.codingping.domain.helpComment.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class HelpCommentRequest {
    private Long helpId;
    private Long adminId;
    private String content;
}
