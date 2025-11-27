package com.codingping.domain.help.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelpUpdateRequest {
    private String title;
    private String content;
}
