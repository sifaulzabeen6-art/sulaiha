package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminLogoutController {

    /*
     * Admin Logout Page
     *
     * UI stage only.
     * No service, repository or database
     * connection is required now.
     */

    @GetMapping("/admin/logout")
    public String showAdminLogoutPage() {

        return "admin/admin-logout";
    }
}
