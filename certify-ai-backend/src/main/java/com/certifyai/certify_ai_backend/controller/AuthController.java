package com.certifyai.certify_ai_backend.controller;

import com.certifyai.certify_ai_backend.entity.User;
import com.certifyai.certify_ai_backend.repository.UserRepository;
import com.certifyai.certify_ai_backend.dto.LoginRequest;
import com.certifyai.certify_ai_backend.security.JwtResponse;
import com.certifyai.certify_ai_backend.security.JwtUtil;
import com.certifyai.certify_ai_backend.service.UserActivityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users") // base path for all user-related endpoints
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserActivityService userActivityService; // 🔹 Inject the activity service

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                    		loginRequest.getEmail(),
                    		loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Incorrect email or password");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Authentication failed");
        }

        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

//        final String jwt = jwtUtil.generateToken(loginRequest.getEmail());
        
        final String jwt = jwtUtil.generateToken(
                loginRequest.getEmail(),
                userOpt.get().getRole()
        );// to include the role and email from the user:
        
        User user = userOpt.get();
        
     // 🔹 Log LOGIN activity
        userActivityService.logActivity(user.getUserId(), "LOGIN");

        return ResponseEntity.ok(new JwtResponse(jwt));
    }
    
 // ================= LOGOUT (Optional) =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            userRepository.findByEmail(email).ifPresent(user -> {
                userActivityService.logActivity(user.getUserId(), "LOGOUT");
            });
        }
        return ResponseEntity.ok("Logged out successfully");
    }
}