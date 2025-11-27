package com.codingping.domain.help.repository;

import com.codingping.domain.help.entity.Help;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpRepository extends JpaRepository<Help, Long> {
    @Query("SELECT h FROM Help h WHERE h.user.kakaoId = :kakaoId")
    List<Help> findByKakaoId(@Param("kakaoId") Long kakaoId);
}
