package com.certifyai.certify_ai_backend.controller;

import com.certifyai.certify_ai_backend.entity.Course;
import com.certifyai.certify_ai_backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;
    
    // 1️⃣ Public: Free courses only
    @GetMapping("/public")
    public List<Course> getPublicCourses() {
        return courseRepository.findByAccessType("free");
    }

    // 2️⃣ Private: All courses (requires auth)
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get course by ID
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    // Create a new course
    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    // Update course
    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(updatedCourse.getTitle());
            course.setDescription(updatedCourse.getDescription());
            course.setCategory(updatedCourse.getCategory());
            return courseRepository.save(course);
        }).orElse(null);
    }

    // Delete course
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
    }
}