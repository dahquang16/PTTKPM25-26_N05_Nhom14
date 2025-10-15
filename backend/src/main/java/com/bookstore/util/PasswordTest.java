package com.bookstore.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Test password
        String password = "admin123";
        
        // Generate new hash
        String newHash = encoder.encode(password);
        System.out.println("New hash for 'admin123': " + newHash);
        
        // Test with the hash from database
        String dbHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
        boolean matches = encoder.matches(password, dbHash);
        System.out.println("Password 'admin123' matches database hash: " + matches);
        
        // Test with old hash
        String oldHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi";
        boolean oldMatches = encoder.matches(password, oldHash);
        System.out.println("Password 'admin123' matches old hash: " + oldMatches);
        
        // Generate SQL update statement
        System.out.println("\nSQL Update Statement:");
        System.out.println("UPDATE users SET password = '" + newHash + "' WHERE email = 'admin@bookstore.com';");
    }
}


