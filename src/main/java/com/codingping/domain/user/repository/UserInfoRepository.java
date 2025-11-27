package com.codingping.domain.user.repository;

import com.codingping.domain.user.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByKakaoId(Long kakaoId);
}
