package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminSettingsController {

    /*
     * Admin Settings Page
     *
     * UI stage only.
     * No database, repository, service or JPA
     * connection is required at this stage.
     */

    @GetMapping("/admin/settings")
    public String showAdminSettingsPage() {

        return "admin/admin-settings";
    }
}
