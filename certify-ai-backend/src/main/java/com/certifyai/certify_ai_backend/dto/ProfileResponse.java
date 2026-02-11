package com.certifyai.certify_ai_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

//@Data
//@AllArgsConstructor
public class ProfileResponse {
    private String name;
    private String email;
    private String username;
    private String role;
    
    // No-arg constructor required for ModelMapper
    public ProfileResponse() {}
	
 // All-args constructor (optional, handy for manual instantiation)
	public ProfileResponse(String name, String email, String username, String role) {
		super();
		this.name = name;
		this.email = email;
		this.username = username;
		this.role = role;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
}