package com.codingping.domain.help.service;

import com.codingping.domain.helpComment.dto.request.HelpCommentRequest;
import com.codingping.domain.help.dto.request.HelpRequest;
import com.codingping.domain.help.dto.request.HelpUpdateRequest;
import com.codingping.domain.help.dto.response.HelpResponse;
import com.codingping.domain.help.entity.Help;
import com.codingping.domain.helpComment.entity.HelpComment;
import com.codingping.domain.user.entity.UserInfo;
import com.codingping.domain.helpComment.repository.HelpCommentRepository;
import com.codingping.domain.help.repository.HelpRepository;
import com.codingping.domain.user.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class HelpService {
    private final HelpRepository helpRepository;
    private final UserInfoRepository userInfoRepository;
    private final HelpCommentRepository helpCommentRepository;

    public Help createHelpRequest(HelpRequest helpRequest) {
        UserInfo userId = userInfoRepository.findByKakaoId(helpRequest.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + helpRequest.getUserId()));

        Help help = Help.builder()
            .user(userId)
            .title(helpRequest.getTitle())
            .content(helpRequest.getContent())
            .status(Help.Status.pending)
            .createdAt(LocalDateTime.now())
            .build();

        return helpRepository.save(help);
    }

    public List<HelpResponse> getHelpsByKakaoId(Long kakaoId) {
        List<Help> helps = helpRepository.findByKakaoId(kakaoId);
        return helps.stream()
                .map(help -> new HelpResponse(
                        help.getId(),
                        help.getTitle(),
                        help.getContent(),
                        help.getStatus().name(),
                        help.getCreatedAt().toString(),
                        help.getUser().getKakaoId(),
                        help.getUser().getName()
                ))
                .toList();
    }

    @Transactional
    public void deleteHelpById(Long id) {
        Help help = helpRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 문의를 찾을 수 없습니다."));
        helpCommentRepository.deleteByHelpId(help.getId());
        helpRepository.deleteById(id);
    }

    public void updateHelp(Long id, HelpUpdateRequest request) {
        Help help = helpRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 문의를 찾을 수 없습니다."));

        help.setTitle(request.getTitle());
        help.setContent(request.getContent());

        helpRepository.save(help);
    }

    public List<HelpResponse> getAllHelps() {
        return helpRepository.findAll().stream()
            .map(help -> new HelpResponse(
                help.getId(),
                help.getTitle(),
                help.getContent(),
                help.getStatus().name(),
                help.getCreatedAt().toString(),
                help.getUser().getKakaoId(),
                help.getUser().getName()
            ))
            .toList();
    }

    @Transactional
    public void saveHelpComment(HelpCommentRequest helpCommentRequest) {
        Help help = helpRepository.findById(helpCommentRequest.getHelpId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Help ID: " + helpCommentRequest.getHelpId()));

        UserInfo admin = userInfoRepository.findByKakaoId(helpCommentRequest.getAdminId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Admin ID: " + helpCommentRequest.getAdminId()));

        HelpComment helpComment = HelpComment.builder()
                .help(help)
                .admin(admin)
                .content(helpCommentRequest.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        helpCommentRepository.save(helpComment);
    }

    @Transactional
    public void updateHelpStatus(Long helpId, String newStatus) {
        Help help = helpRepository.findById(helpId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Help ID: " + helpId));

        help.setStatus(Help.Status.valueOf(newStatus));
        helpRepository.save(help);
    }

    public List<String> getHelpCommentsByHelpId(Long helpId) {
        return helpCommentRepository.findByHelpId(helpId)
                .stream()
                .map(HelpComment::getContent)
                .collect(Collectors.toList());
    }
}
