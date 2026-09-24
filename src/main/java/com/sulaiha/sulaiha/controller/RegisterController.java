package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.service.UserService;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegisterController {

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "common/register";
    }

    @PostMapping("/register")
    public String createAccount(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String password,
            @RequestParam String confirmPassword) {

        // Check whether both passwords are the same.
        if (!password.equals(confirmPassword)) {
            return "redirect:/register?error=passwordMismatch";
        }

        try {

            // Register the new customer.
            userService.registerUser(
                    fullName,
                    email,
                    phone,
                    address,
                    password
            );

            // Registration successful.
            return "redirect:/login?registered=true";

        } catch (IllegalArgumentException e) {

            // Email already exists.
            return "redirect:/register?error=emailExists";
        }
    }
}