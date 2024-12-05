package com.codingping.service;

import com.codingping.dto.HelpRequest;
import com.codingping.dto.HelpResponse;
import com.codingping.dto.HelpUpdateRequest;
import com.codingping.entity.Help;
import com.codingping.entity.UserInfo;
import com.codingping.repository.HelpRepository;
import com.codingping.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class HelpService {
    private final HelpRepository helpRepository;
    private final UserInfoRepository userInfoRepository;

    public Help createHelpRequest(HelpRequest helpRequest) {
        UserInfo userId = userInfoRepository.findByKakaoId(helpRequest.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + helpRequest.getUserId()));

        Help help = Help.builder()
            .userId(userId)
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
                        help.getUserId().getKakaoId()
                ))
                .toList();
    }

    public void deleteHelpById(Long id) {
        if (!helpRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 ID의 문의를 찾을 수 없습니다.");
        }
        helpRepository.deleteById(id);
    }

    public void updateHelp(Long id, HelpUpdateRequest request) {
        Help help = helpRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 문의를 찾을 수 없습니다."));

        help.setTitle(request.getTitle());
        help.setContent(request.getContent());

        helpRepository.save(help);
    }
}
