package com.codingping.controller;

import com.codingping.dto.UserInfoRequest;
import com.codingping.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/profile/setup")
    public ResponseEntity<String> saveUserInfo(@ModelAttribute UserInfoRequest userInfoRequest) {
        log.info("POST /profile/setup 요청 수신");

        boolean newUser = userService.saveUserInfo(userInfoRequest);
        return newUser ? ResponseEntity.ok("사용자 정보 저장 완료") : ResponseEntity.status(500).body("사용자 정보 저장 실패");
    }
}