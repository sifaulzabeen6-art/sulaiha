package com.sulaiha.sulaiha.config;



import com.sulaiha.sulaiha.entity.Role;
import com.sulaiha.sulaiha.entity.User;
import com.sulaiha.sulaiha.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@sulaiha.com";

            // Check whether Admin already exists
            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setFullName("Sulaiha Admin");
                admin.setEmail(adminEmail);
                admin.setPhone("9876543210");
                admin.setAddress("Sulaiha Smart Management System");
                
                // Password will be stored in encrypted form
                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                // This account is an ADMIN
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("=================================");
                System.out.println("ADMIN ACCOUNT CREATED");
                System.out.println("Email    : " + adminEmail);
                System.out.println("Password : Admin@123");
                System.out.println("Role     : ADMIN");
                System.out.println("=================================");

            } else {

                System.out.println("Admin account already exists.");
            }
        };
    }
}