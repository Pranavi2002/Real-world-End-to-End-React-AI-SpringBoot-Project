package com.certifyai.certify_ai_backend.service;

import com.certifyai.certify_ai_backend.entity.UserActivity;
import com.certifyai.certify_ai_backend.repository.UserActivityRepository;
import com.certifyai.certify_ai_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserActivityService {

    @Autowired
    private UserActivityRepository repository;

    @Autowired
    private UserRepository userRepository;

    // ================= Generic logging by userId =================
    public void logActivity(Long userId, String action) {
        UserActivity activity = new UserActivity();
        activity.setUserId(userId);
        activity.setAction(action);
        repository.save(activity); // actionDate auto-filled by DB
    }

    // ================= Helper: log activity by email =================
    public void logActivityFromEmail(String email, String action) {
        userRepository.findByEmail(email).ifPresent(user -> {
            logActivity(user.getUserId(), action);
        });
    }
}