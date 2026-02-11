package com.certifyai.certify_ai_backend.controller;

import com.certifyai.certify_ai_backend.dto.ProfileResponse;

import com.certifyai.certify_ai_backend.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ModelMapper modelMapper;

    public ProfileController(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ProfileResponse getProfile(@AuthenticationPrincipal User user) {
        
//    	return new ProfileResponse(
//    	        user.getName(),
//    	        user.getEmail(),
//    	        user.getUsername(),
//    	        user.getRole()
//    	    );
    	
    	// Map User → ProfileResponse automatically
        return modelMapper.map(user, ProfileResponse.class);
    }
}