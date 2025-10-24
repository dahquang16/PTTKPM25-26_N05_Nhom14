package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.dto.UpdateUserRequest;
import com.bookstore.dto.UserDTO;
import com.bookstore.entity.Role;
import com.bookstore.entity.User;
import com.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<User> users = userService.findUsersWithFilters(name, email, phone, pageable);
            
            Page<UserDTO> userDTOs = users.map(user -> new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getAddress(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            ));
            
            return ResponseEntity.ok()
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .header("Pragma", "no-cache")
                    .header("Expires", "0")
                    .body(ApiResponse.success(userDTOs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error fetching users: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getAddress(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            );
            return ResponseEntity.ok(ApiResponse.success(userDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest updateRequest) {
        try {
            // Create a User object with only the fields to update
            User userDetails = new User();
            userDetails.setName(updateRequest.getName());
            userDetails.setPhone(updateRequest.getPhone());
            userDetails.setAddress(updateRequest.getAddress());
            userDetails.setRole(updateRequest.getRole());
            
            User updatedUser = userService.updateUser(id, userDetails);
            UserDTO userDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getPhone(),
                updatedUser.getRole(),
                updatedUser.getAddress(),
                updatedUser.getCreatedAt(),
                updatedUser.getUpdatedAt()
            );
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", userDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(registerRequest);
            return ResponseEntity.ok(ApiResponse.success("User created successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleData) {
        try {
            String role = roleData.get("role");
            if (role == null || (!role.equals("ADMIN") && !role.equals("CUSTOMER"))) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role. Must be ADMIN or CUSTOMER"));
            }
            
            User user = userService.getUserById(id);
            user.setRole(Role.valueOf(role));
            User updatedUser = userService.updateUser(id, user);
            
            return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        try {
            Map<String, Object> stats = userService.getUserStats();
            return ResponseEntity.ok(ApiResponse.success("User statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<User>>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Sort sort = Sort.by("name").ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<User> users = userService.searchUsers(query, pageable);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/current")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserDTO userDTO = new UserDTO(
                currentUser.getId(),
                currentUser.getName(),
                currentUser.getEmail(),
                currentUser.getPhone(),
                currentUser.getRole(),
                currentUser.getAddress(),
                currentUser.getCreatedAt(),
                currentUser.getUpdatedAt()
            );
            
            return ResponseEntity.ok(ApiResponse.success(userDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}


