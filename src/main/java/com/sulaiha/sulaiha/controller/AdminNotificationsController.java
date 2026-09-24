package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminNotificationsController {

    /*
     * Admin Notifications Page
     *
     * UI stage only.
     * No database, service or repository is required.
     */

    @GetMapping("/admin/notifications")
    public String showAdminNotificationsPage() {

        return "admin/admin-notifications";
    }
}