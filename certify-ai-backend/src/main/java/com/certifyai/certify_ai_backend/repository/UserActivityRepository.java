package com.certifyai.certify_ai_backend.repository;

import com.certifyai.certify_ai_backend.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    // Optional: Add methods to filter by userId if needed
}