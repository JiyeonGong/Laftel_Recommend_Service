package com.codingping.repository;

import com.codingping.entity.HelpComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<HelpComment, Long> {
    List<HelpComment> findByHelpId(Long helpId);
}
