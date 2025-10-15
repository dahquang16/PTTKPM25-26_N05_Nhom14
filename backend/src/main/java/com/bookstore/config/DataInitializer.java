package com.bookstore.config;

import com.bookstore.entity.Role;
import com.bookstore.entity.User;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Tạo admin user nếu chưa tồn tại
        if (!userRepository.existsByEmail("admin@bookstore.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@bookstore.com");
            admin.setPhone("0123456789");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAddress("Admin Address");
            admin.setRole(Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println("Admin user created successfully!");
        }
    }
}


