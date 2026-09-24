package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.dto.DashboardResponse;
import com.sulaiha.sulaiha.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * =====================================================
 * SULAIHA SMART MANAGEMENT SYSTEM
 * ADMIN DASHBOARD CONTROLLER
 * =====================================================
 *
 * Responsibilities:
 *
 * 1. Open Admin Dashboard page
 * 2. Provide Dashboard API response
 *
 * Business logic is NOT written here.
 * All dashboard calculations are handled by
 * DashboardService.
 *
 * =====================================================
 */

@Controller
public class AdminDashboardController {


    // =====================================================
    // SERVICE
    // =====================================================

    private final DashboardService dashboardService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminDashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }


    // =====================================================
    // ADMIN DASHBOARD PAGE
    // =====================================================

    @GetMapping("/admin/dashboard")
    public String showAdminDashboard() {

        return "admin/dashboard";
    }


    // =====================================================
    // DASHBOARD DATA API
    // =====================================================

    @GetMapping("/api/admin/dashboard")
    @ResponseBody
    public ResponseEntity<DashboardResponse>
    getDashboardData() {

        DashboardResponse response =
                dashboardService.getDashboardData();

        return ResponseEntity.ok(response);
    }

}