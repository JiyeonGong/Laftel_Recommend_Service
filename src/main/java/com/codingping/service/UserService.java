package com.codingping.service;

import com.codingping.dto.UserInfoRequest;
import com.codingping.entity.UserInfo;
import com.codingping.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserService {
    private final UserInfoRepository userInfoRepository;

    //private static final Set<Long> ADMIN_KAKAO_IDS = Set.of(, );

    private String determineRole(Long kakaoId) {
        // 특정 kakaoId를 기준으로 역할 설정
        if ("특정_관리자_kakaoId".equals(kakaoId)) {
            return "ADMIN";
        }
        return "USER";
    }

    public boolean saveUserInfo(UserInfoRequest userInfoRequest) {
        try {
            //String role = determineRole(userInfoRequest.getKakaoId());
            UserInfo userInfo = UserInfo.builder()
                        .kakaoId(userInfoRequest.getKakaoId())
                        .name(userInfoRequest.getNickname())
                        .gender(userInfoRequest.getGender())
                        .ageRange(userInfoRequest.getAgeRange())
                        .mbti(userInfoRequest.getMbti())
                        .build();

            userInfoRepository.save(userInfo);
            return true;

        } catch (Exception e) {
            log.error("사용자 정보 저장 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }


    }
}
