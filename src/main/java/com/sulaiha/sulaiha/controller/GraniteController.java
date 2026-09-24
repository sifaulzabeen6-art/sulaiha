package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GraniteController {

    // Granite Products Page
    @GetMapping("/granite")
    public String showGranitePage() {
        return "user/granite";
    }
}