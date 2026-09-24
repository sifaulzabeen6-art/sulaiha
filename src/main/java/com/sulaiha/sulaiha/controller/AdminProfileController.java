package com.sulaiha.sulaiha.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminProfileController {

    /*
     * Admin Profile Page
     *
     * UI stage only.
     * No service, repository or database
     * is required at this stage.
     */

    @GetMapping("/admin/profile")
    public String showAdminProfilePage() {

        return "admin/admin-profile";
    }
}