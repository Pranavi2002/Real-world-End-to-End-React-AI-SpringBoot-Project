package com.certifyai.certify_ai_backend.repository;

import com.certifyai.certify_ai_backend.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
}