package com.sulaiha.sulaiha.controller;



import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SettingsController {

    // Open Settings page
    @GetMapping("/settings")
    public String showSettingsPage() {

        return "user/settings";
    }
}
