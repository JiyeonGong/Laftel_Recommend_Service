package com.codingping.dto;
import com.codingping.entity.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HelpRequest {
    private Long userId;
    private String title;
    private String content;
}