package com.codingping.controller;

import com.codingping.dto.HelpRequest;
import com.codingping.dto.HelpResponse;
import com.codingping.entity.Help;
import com.codingping.service.HelpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/helps")
public class HelpController {
    private final HelpService helpService;

    @PostMapping
    public ResponseEntity<Help> createHelp(@RequestBody HelpRequest helpRequest) {
        log.info("POST /helps 요청 수신");
        Help createdHelp = helpService.createHelpRequest(helpRequest);

        if (helpRequest.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null.");
        }
        return ResponseEntity.ok(createdHelp);
    }

    @GetMapping("/list")
    public ResponseEntity<List<HelpResponse>> getHelpsByKakaoId(@RequestParam Long kakaoId) {
        List<HelpResponse> helps = helpService.getHelpsByKakaoId(kakaoId);
        return ResponseEntity.ok(helps);
    }
}
