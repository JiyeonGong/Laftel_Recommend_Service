package com.codingping.controller;

import com.codingping.dto.UserInfoRequest;
import com.codingping.service.AuthService;
import com.codingping.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/profile/setup")
    public ResponseEntity<String> saveUserInfo(@ModelAttribute UserInfoRequest userInfoRequest) {
        MultipartFile file = userInfoRequest.getProfileImage();
        String fileUrl = null;

        if (file != null && !file.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads/" + fileName);
                file.transferTo(filePath.toFile()); // 파일을 서버의 uploads 폴더 경로에 저장
                fileUrl = "/uploads/" + fileName; // 파일 접근 URL
            } catch (IOException e) {
                return ResponseEntity.status(500).body("파일 저장 실패");
            }
        }

        boolean newUser = userService.saveUserInfo(userInfoRequest, fileUrl);
        if (newUser) {
            return ResponseEntity.ok("사용자 정보 저장 완료");
        } else {
            return ResponseEntity.status(500).body("사용자 정보 저장 실패");
        }
    }
}
