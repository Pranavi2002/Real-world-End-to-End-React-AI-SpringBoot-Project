package com.certifyai.certify_ai_backend.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class AnalyticsRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 🔹 Most active users (by total activity count)
    public List<Map<String, Object>> findMostActiveUsers() {
        String sql = """
            SELECT user_id, COUNT(*) AS activity_count
            FROM user_activity
            GROUP BY user_id
            ORDER BY activity_count DESC
            LIMIT 10
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // 🔹 Recently active users
    public List<Map<String, Object>> findRecentUsers() {
        String sql = """
            SELECT DISTINCT user_id, MAX(action_date) AS last_active
            FROM user_activity
            GROUP BY user_id
            ORDER BY last_active DESC
            LIMIT 10
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // 🔹 Logins per day
    public List<Map<String, Object>> findDailyLogins() {
        String sql = """
            SELECT DATE(action_date) AS day, COUNT(*) AS login_count
            FROM user_activity
            WHERE action = 'LOGIN'
            GROUP BY DATE(action_date)
            ORDER BY day
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // 🔹 Top courses by certifications
//    public List<Map<String, Object>> findTopCourses() {
//        String sql = """
//            SELECT course_id, COUNT(*) AS cert_count
//            FROM certifications
//            GROUP BY course_id
//            ORDER BY cert_count DESC
//            LIMIT 10
//        """;
//        return jdbcTemplate.queryForList(sql);
//    } // this just uses course id
    public List<Map<String, Object>> findTopCourses() {
        String sql = """
            SELECT c.course_id, c.title AS course_name, COUNT(*) AS certification_count
            FROM certifications cert
            JOIN courses c ON cert.course_id = c.course_id
            GROUP BY c.course_id, c.title
            ORDER BY certification_count DESC
            LIMIT 10
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // 🔹 Free vs Premium course certifications
//    public List<Map<String, Object>> findFreeVsPremium() {
//        String sql = """
//            SELECT is_premium, COUNT(*) AS count
//            FROM certifications
//            GROUP BY is_premium
//        """;
//        return jdbcTemplate.queryForList(sql);
//    }
    public List<Map<String, Object>> findFreeVsPremium() {
        String sql = """
            SELECT c.access_type AS course_type, COUNT(cert.cert_id) AS certification_count
        	FROM certifications cert
        	JOIN courses c ON cert.course_id = c.course_id
        	GROUP BY c.access_type
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // 🔹 AI recommendation usage
    public List<Map<String, Object>> findRecommendationUsage() {
        String sql = """
            SELECT DATE(action_date) AS day, COUNT(*) AS usage_count
            FROM user_activity
            WHERE action = 'AI_RECOMMENDATION'
            GROUP BY DATE(action_date)
            ORDER BY day
        """;
        return jdbcTemplate.queryForList(sql);
    }
    
 // 🆕 New Users (last 7 days)
    public List<Map<String, Object>> findNewUsers() {
        String sql = """
            SELECT user_id, email, created_at
            FROM users
            WHERE created_at >= NOW() - INTERVAL '7 days'
            ORDER BY created_at DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // ✅ Active Users (last 7 days)
    public List<Map<String, Object>> findActiveUsers() {
        String sql = """
            SELECT ua.user_id, u.email, MAX(ua.action_date) AS last_active
            FROM user_activity ua
            JOIN users u ON ua.user_id = u.user_id
            GROUP BY ua.user_id, u.email
            HAVING MAX(ua.action_date) >= NOW() - INTERVAL '7 days'
            ORDER BY last_active DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    // 💤 Inactive Users (no activity in 30 days OR never active)
    public List<Map<String, Object>> findInactiveUsers() {
        String sql = """
            SELECT u.user_id, u.email, MAX(ua.action_date) AS last_active
            FROM users u
            LEFT JOIN user_activity ua ON u.user_id = ua.user_id
            GROUP BY u.user_id, u.email
            HAVING MAX(ua.action_date) < NOW() - INTERVAL '30 days'
                OR MAX(ua.action_date) IS NULL
            ORDER BY last_active
        """;
        return jdbcTemplate.queryForList(sql);
    }
}