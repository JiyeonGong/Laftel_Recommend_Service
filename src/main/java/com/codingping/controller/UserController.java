package com.codingping.controller;

import com.codingping.dto.UserInfoRequest;
import com.codingping.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/profile/setup")
    public ResponseEntity<String> saveUserInfo(
            @ModelAttribute UserInfoRequest userInfoRequest,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        log.info("POST /profile/setup 요청 수신");

        String fileUrl;

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                Path uploadDir = Paths.get("uploads/");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
                Path filePath = uploadDir.resolve(fileName);
                profileImage.transferTo(filePath.toFile());
                fileUrl = "/uploads/" + fileName;

            } catch (IOException e) {
                return ResponseEntity.status(500).body("파일 저장 실패");
            }
        } else {
            // 기본 이미지 설정
            fileUrl = "/uploads/default.jpg";
        }

        boolean newUser = userService.saveUserInfo(userInfoRequest, fileUrl);
        return newUser ? ResponseEntity.ok("사용자 정보 저장 완료") : ResponseEntity.status(500).body("사용자 정보 저장 실패");
    }
}
