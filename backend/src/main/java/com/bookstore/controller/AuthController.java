package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.entity.User;
import com.bookstore.service.UserService;
import com.bookstore.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }
    
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAdmin() {
        try {
            // Xóa admin cũ nếu tồn tại
            userService.findByEmail("admin@bookstore.com").ifPresent(user -> {
                userService.deleteUser(user.getId());
            });
            
            // Tạo admin mới
            RegisterRequest adminRequest = new RegisterRequest();
            adminRequest.setName("Admin");
            adminRequest.setEmail("admin@bookstore.com");
            adminRequest.setPassword("123456");
            adminRequest.setPhone("0123456789");
            adminRequest.setAddress("Admin Address");
            
            User admin = userService.createUser(adminRequest);
            admin.setRole(com.bookstore.entity.Role.ADMIN);
            userService.updateUser(admin.getId(), admin);
            
            String token = jwtUtil.generateToken(admin.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", admin);
            response.put("token", token);
            response.put("message", "Admin created successfully! Email: admin@bookstore.com, Password: 123456");
            
            return ResponseEntity.ok(ApiResponse.success("Admin created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(registerRequest);
            
            String token = jwtUtil.generateToken(user.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid password");
            }
            
            String token = jwtUtil.generateToken(user.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return ResponseEntity.ok(ApiResponse.success(currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody User userDetails) {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create a new User object with updated fields
            User userToUpdate = new User();
            userToUpdate.setName(userDetails.getName());
            userToUpdate.setPhone(userDetails.getPhone());
            userToUpdate.setAddress(userDetails.getAddress());
            
            User updatedUser = userService.updateUser(currentUser.getId(), userToUpdate);
            
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
