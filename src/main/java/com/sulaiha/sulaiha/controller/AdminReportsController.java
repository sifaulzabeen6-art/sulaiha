
package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Expense;
import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.service.ExpenseService;
import com.sulaiha.sulaiha.service.ReportsService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


// =====================================================
// ADMIN REPORTS CONTROLLER
// =====================================================

@Controller
public class AdminReportsController {


    // =====================================================
    // SERVICES
    // =====================================================

    private final ReportsService reportsService;

    private final ExpenseService expenseService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminReportsController(
            ReportsService reportsService,
            ExpenseService expenseService) {

        this.reportsService =
                reportsService;

        this.expenseService =
                expenseService;

    }


    // =====================================================
    // REPORTS PAGE
    // =====================================================

    @GetMapping("/admin/reports")
    public String showReportsPage() {

        return "admin/reports";

    }


    // =====================================================
    // GET REPORT DATA
    // =====================================================

    @GetMapping("/api/admin/reports")
    @ResponseBody
    public ResponseEntity<Map<String, Object>>
    getReportData() {

        // -------------------------------------------------
        // GET ALL ORDERS
        // -------------------------------------------------

        List<Order> reportRecords =
                reportsService.getAllReportRecords();


        // -------------------------------------------------
        // GET TOTAL PRODUCTS
        // -------------------------------------------------

        long totalProducts =
                reportsService.getTotalProducts();


        // -------------------------------------------------
        // GET ALL EXPENSES
        // -------------------------------------------------

        List<Expense> expenseRecords =
                expenseService.getAllExpenses();


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "orders",
                reportRecords
        );


        response.put(
                "totalProducts",
                totalProducts
        );


        response.put(
                "expenses",
                expenseRecords
        );


        // -------------------------------------------------
        // RETURN RESPONSE
        // -------------------------------------------------

        return ResponseEntity.ok(
                response
        );

    }

}