package com.bookstore.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "admin123";
        String hashedPassword = encoder.encode(password);
        
        System.out.println("Original password: " + password);
        System.out.println("Hashed password: " + hashedPassword);
        
        // Test if the password matches
        boolean matches = encoder.matches(password, hashedPassword);
        System.out.println("Password matches: " + matches);
    }
}


