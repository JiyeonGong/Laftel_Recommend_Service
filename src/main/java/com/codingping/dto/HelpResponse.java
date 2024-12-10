package com.codingping.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HelpResponse {
    private Long id;
    private String title;
    private String content;
    private String status;
    private String createdAt;
    private Long userId;
    private String name;
}
