package com.codingping.domain.user.service;

import com.codingping.domain.user.dto.request.UserInfoRequest;
import com.codingping.domain.user.entity.UserInfo;
import com.codingping.domain.user.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserService {
    private final UserInfoRepository userInfoRepository;

    private static final Set<Long> ADMIN_KAKAO_IDS = Set.of(0L, 3768643496L);
    private String determineRole(Long kakaoId) {
        if (ADMIN_KAKAO_IDS.contains(kakaoId)) {
            return "ADMIN";
        }
        return "USER";
    }

    public boolean saveUserInfo(UserInfoRequest userInfoRequest) {
        try {
            String role = determineRole(userInfoRequest.getKakaoId());
            UserInfo userInfo = UserInfo.builder()
                .kakaoId(userInfoRequest.getKakaoId())
                .name(userInfoRequest.getNickname())
                .gender(userInfoRequest.getGender())
                .ageRange(userInfoRequest.getAgeRange())
                .mbti(userInfoRequest.getMbti())
                .role(role)
                .build();

            userInfoRepository.save(userInfo);
            return true;

        } catch (Exception e) {
            log.error("사용자 정보 저장 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }

    public Optional<UserInfo> getUserInfoByKakaoId(Long kakaoId) {
        try {
            Optional<UserInfo> userInfo = userInfoRepository.findByKakaoId(kakaoId);
            if (userInfo.isPresent()) {
                log.info("사용자 정보 조회 성공: {}", userInfo.get());
            } else {
                log.warn("사용자 정보를 찾을 수 없습니다. KakaoId: {}", kakaoId);
            }
            return userInfo;
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }
}
