package com.codingping.domain.help.controller;

import com.codingping.domain.helpComment.dto.request.HelpCommentRequest;
import com.codingping.domain.help.dto.request.HelpRequest;
import com.codingping.domain.help.dto.response.HelpResponse;
import com.codingping.domain.help.entity.Help;
import com.codingping.domain.help.service.HelpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHelp(@PathVariable Long id) {
        try {
            helpService.deleteHelpById(id);
            return ResponseEntity.ok("문의가 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("해당 ID의 문의를 찾을 수 없습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("문의 삭제 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<HelpResponse>> getAllHelps() {
        List<HelpResponse> allHelps = helpService.getAllHelps();
        return ResponseEntity.ok(allHelps);
    }

    @PostMapping("comment")
    public ResponseEntity<Void> createHelpComment(@RequestBody HelpCommentRequest helpCommentRequest) {
        helpService.saveHelpComment(helpCommentRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{helpId}/status")
    public ResponseEntity<String> updateHelpStatus(@PathVariable Long helpId, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        helpService.updateHelpStatus(helpId, newStatus);
        return ResponseEntity.ok("상태가 성공적으로 업데이트되었습니다.");
    }

    @GetMapping("/{helpId}/comments")
    public ResponseEntity<List<String>> getCommentsByHelpId(@PathVariable Long helpId) {
        List<String> comments = helpService.getHelpCommentsByHelpId(helpId);
        return ResponseEntity.ok(comments);
    }
}