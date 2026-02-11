package com.certifyai.certify_ai_backend.controller;

import com.certifyai.certify_ai_backend.entity.Certification;
import com.certifyai.certify_ai_backend.entity.Course;
import com.certifyai.certify_ai_backend.entity.User;
import com.certifyai.certify_ai_backend.repository.CertificationRepository;
import com.certifyai.certify_ai_backend.repository.CourseRepository;
import com.certifyai.certify_ai_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend calls
public class CertificationController {

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // ================= Get all certifications =================
    @GetMapping
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    // ================= Get certification by ID =================
    @GetMapping("/{id}")
    public Certification getCertificationById(@PathVariable Long id) {
        return certificationRepository.findById(id).orElse(null);
    }

    // ================= Create new certification =================
    @PostMapping
    public Certification createCertification(@RequestBody Certification certification) {
        User user = userRepository.findById(certification.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(certification.getCourse().getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        certification.setUser(user);
        certification.setCourse(course);

        // Ensure documentUrl is null for now if not provided
        if (certification.getDocumentUrl() == null) {
            certification.setDocumentUrl(null);
        }

        return certificationRepository.save(certification);
    }

    // ================= Update certification =================
    @PutMapping("/{id}")
    public Certification updateCertification(@PathVariable Long id,
                                             @RequestBody Certification updatedCert) {
        return certificationRepository.findById(id).map(cert -> {
            cert.setScore(updatedCert.getScore());
            cert.setCompletionStatus(updatedCert.getCompletionStatus());
            cert.setIssuedDate(updatedCert.getIssuedDate());
            cert.setExpiryDate(updatedCert.getExpiryDate());

            // Update new fields
            cert.setCertificateName(updatedCert.getCertificateName());
            cert.setIssuingOrg(updatedCert.getIssuingOrg());
            cert.setDocumentUrl(updatedCert.getDocumentUrl());

            return certificationRepository.save(cert);
        }).orElse(null);
    }

    // ================= Delete certification =================
    @DeleteMapping("/{id}")
    public void deleteCertification(@PathVariable Long id) {
        certificationRepository.deleteById(id);
    }
}