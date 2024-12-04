package com.codingping.repository;

import com.codingping.entity.HelpComment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HelpCommentRepository extends JpaRepository<HelpComment, Long> {
}
