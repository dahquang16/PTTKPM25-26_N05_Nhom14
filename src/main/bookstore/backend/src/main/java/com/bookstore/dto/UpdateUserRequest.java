package com.bookstore.dto;

import com.bookstore.entity.Role;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    
    @Size(max = 50)
    private String name;
    
    @Size(max = 20)
    private String phone;
    
    @Size(max = 200)
    private String address;
    
    private Role role;
    
    public UpdateUserRequest() {}
    
    public UpdateUserRequest(String name, String phone, String address, Role role) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
}

