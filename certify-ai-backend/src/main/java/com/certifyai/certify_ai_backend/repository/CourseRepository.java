package com.certifyai.certify_ai_backend.repository;

import com.certifyai.certify_ai_backend.entity.Course;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
	List<Course> findByAccessType(String accessType);
}