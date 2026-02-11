package com.certifyai.certify_ai_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.certifyai.certify_ai_backend.service.AnalyticsService;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    // ================= USER ANALYTICS =================

    @GetMapping("/users/most-active")
    public List<Map<String, Object>> getMostActiveUsers() {
        return analyticsService.getMostActiveUsers();
    }

    @GetMapping("/users/recent")
    public List<Map<String, Object>> getRecentUsers() {
        return analyticsService.getRecentUsers();
    }

    @GetMapping("/users/logins-per-day")
    public List<Map<String, Object>> getDailyLogins() {
        return analyticsService.getDailyLogins();
    }

    // ================= COURSE ANALYTICS =================

    @GetMapping("/courses/top")
    public List<Map<String, Object>> getTopCoursesByCertifications() {
        return analyticsService.getTopCoursesByCertifications();
    }

    @GetMapping("/courses/free-vs-premium")
    public List<Map<String, Object>> getFreeVsPremiumCourseCertifications() {
        return analyticsService.getFreeVsPremiumCourseCertifications();
    }

    // ================= AI ANALYTICS =================

    @GetMapping("/ai/recommendation-usage")
    public List<Map<String, Object>> getRecommendationUsage() {
        return analyticsService.getRecommendationUsage();
    }
    
    // ================ ADVANCED USER ANALYTICS ==========
    @GetMapping("/users/new")
    public List<Map<String, Object>> getNewUsers() {
        return analyticsService.getNewUsers();
    }

    @GetMapping("/users/active")
    public List<Map<String, Object>> getActiveUsers() {
        return analyticsService.getActiveUsers();
    }

    @GetMapping("/users/inactive")
    public List<Map<String, Object>> getInactiveUsers() {
        return analyticsService.getInactiveUsers();
    }
    
 // ================= CSV EXPORT =================

    @GetMapping("/export")
    public void exportAnalyticsCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"analytics.csv\"");

        PrintWriter writer = response.getWriter();

        // ================= USERS =================
        writer.println("=== New Users ===");
        writer.println("User ID,Email,Created At");
        analyticsService.getNewUsers().forEach(u -> {
            String createdAt = u.get("created_at") != null ? u.get("created_at").toString() : "N/A";
            writer.printf("%s,%s,%s%n", u.get("user_id"), u.get("email"), createdAt);
        });
        writer.println();

        writer.println("=== Active Users ===");
        writer.println("User ID,Email,Last Active");
        analyticsService.getActiveUsers().forEach(u -> {
            String lastActive = u.get("last_active") != null ? u.get("last_active").toString() : "N/A";
            writer.printf("%s,%s,%s%n", u.get("user_id"), u.get("email"), lastActive);
        });
        writer.println();

        writer.println("=== Inactive Users ===");
        writer.println("User ID,Email,Last Active");
        analyticsService.getInactiveUsers().forEach(u -> {
            String lastActive = u.get("last_active") != null ? u.get("last_active").toString() : "N/A";
            writer.printf("%s,%s,%s%n", u.get("user_id"), u.get("email"), lastActive);
        });
        writer.println();

        // ================= MOST ACTIVE USERS =================
        writer.println("=== Most Active Users ===");
        writer.println("User ID,Activity Count");
        analyticsService.getMostActiveUsers().forEach(m -> {
            writer.printf("%s,%s%n", m.get("user_id"), m.get("activity_count"));
        });
        writer.println();

        // ================= DAILY LOGINS =================
        writer.println("=== Daily Logins ===");
        writer.println("Day,Login Count");
        analyticsService.getDailyLogins().forEach(d -> {
            writer.printf("%s,%s%n", d.get("day"), d.get("login_count"));
        });
        writer.println();

        // ================= TOP COURSES =================
        writer.println("=== Top Courses ===");
        writer.println("Course ID,Title,Certifications");
        analyticsService.getTopCoursesByCertifications().forEach(c -> {
            writer.printf("%s,%s,%s%n", c.get("course_id"), c.get("course_name"), c.get("certification_count"));
        });
        writer.println();

        // ================= FREE VS PREMIUM =================
        writer.println("=== Free vs Premium Courses ===");
        writer.println("Course Type,Certification Count");
        analyticsService.getFreeVsPremiumCourseCertifications().forEach(f -> {
            writer.printf("%s,%s%n", f.get("course_type"), f.get("certification_count"));
        });
        writer.println();

        // ================= AI RECOMMENDATION USAGE =================
        writer.println("=== AI Recommendation Usage ===");
        writer.println("Day,Usage Count");
        analyticsService.getRecommendationUsage().forEach(a -> {
            writer.printf("%s,%s%n", a.get("day"), a.get("usage_count"));
        });

        writer.flush();
    }
}