package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileController {


// Open User Profile page
@GetMapping("/profile")
public String showProfilePage() {

    return "user/profile";
}


}
