package com.codingping.service;

import com.codingping.dto.UserInfoDTO;
import com.codingping.entity.UserInfo;
import com.codingping.repository.UserInfoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class UserService {
    private final UserInfoRepository userInfoRepository;

    @Autowired
    public UserService(UserInfoRepository userInfoRepository) {
        this.userInfoRepository = userInfoRepository;
    }

    public boolean saveUser(UserInfoDTO userInfoDTO) {
        // 기존 사용자 조회
        Optional<UserInfo> existingUser = userInfoRepository.findByKakaoId(userInfoDTO.getKakaoId());

        // 기존 사용자일 경우
        if (existingUser.isPresent()) {
            log.info("기존 사용자입니다.");
            UserInfo user = existingUser.get();
            user.setGender(userInfoDTO.getGender());
            user.setAgeRange(userInfoDTO.getAgeRange());
            userInfoRepository.save(user);
            return false;
        }

        // 신규 사용자일 경우
        log.info("신규 사용자입니다.");
        UserInfo newUser = UserInfo.builder()
            .kakaoId(userInfoDTO.getKakaoId())
            .gender(userInfoDTO.getGender())
            .ageRange(userInfoDTO.getAgeRange())
            .build();

        userInfoRepository.save(newUser);
        return true;
    }
}
