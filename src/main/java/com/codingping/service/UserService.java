package com.codingping.service;

import com.codingping.dto.UserInfoRequest;
import com.codingping.entity.UserInfo;
import com.codingping.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserService {
    private final UserInfoRepository userInfoRepository;

    public boolean saveUserInfo(UserInfoRequest userInfoRequest, String profileImageUrl) {
        try {
            // 기존 사용자 조회
            Optional<UserInfo> existingUser = userInfoRepository.findByKakaoId(userInfoRequest.getKakaoId());

            // 기존 사용자인 경우
            if (existingUser.isPresent()) {
                log.info("기존 사용자입니다.");
                return false;
            } else {
                // 신규 사용자인 경우
                log.info("신규 사용자입니다.");
                UserInfo newUserInfo = UserInfo.builder()
                        .kakaoId(userInfoRequest.getKakaoId())
                        .name(userInfoRequest.getNickname())
                        .gender(userInfoRequest.getGender())
                        .ageRange(userInfoRequest.getAgeRange())
                        .mbti(userInfoRequest.getMbti())
                        .profileImg(profileImageUrl)
                        .build();

                userInfoRepository.save(newUserInfo);
                return true;
            }
        } catch (Exception e) {
            log.error("사용자 정보 저장 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }
}
