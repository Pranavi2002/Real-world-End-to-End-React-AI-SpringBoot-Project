package com.certifyai.certify_ai_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.certifyai.certify_ai_backend.repository.AnalyticsRepository;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    public List<Map<String, Object>> getMostActiveUsers() {
        return analyticsRepository.findMostActiveUsers();
    }

    public List<Map<String, Object>> getRecentUsers() {
        return analyticsRepository.findRecentUsers();
    }

    public List<Map<String, Object>> getDailyLogins() {
        return analyticsRepository.findDailyLogins();
    }

    public List<Map<String, Object>> getTopCoursesByCertifications() {
        return analyticsRepository.findTopCourses();
    }

    public List<Map<String, Object>> getFreeVsPremiumCourseCertifications() {
        return analyticsRepository.findFreeVsPremium();
    }

    public List<Map<String, Object>> getRecommendationUsage() {
        return analyticsRepository.findRecommendationUsage();
    }
    
    public List<Map<String, Object>> getNewUsers() {
        return analyticsRepository.findNewUsers();
    }

    public List<Map<String, Object>> getActiveUsers() {
        return analyticsRepository.findActiveUsers();
    }

    public List<Map<String, Object>> getInactiveUsers() {
        return analyticsRepository.findInactiveUsers();
    }
}