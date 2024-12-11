package com.codingping.repository;

import com.codingping.entity.HelpComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<HelpComment, Long> {
    List<HelpComment> findByHelpId(Long helpId);

    @Modifying
    @Query("DELETE FROM HelpComment hc WHERE hc.help.id = :helpId")
    void deleteByHelpId(@Param("helpId") Long helpId);
}
