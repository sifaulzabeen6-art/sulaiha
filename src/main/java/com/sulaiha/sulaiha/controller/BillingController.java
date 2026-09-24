package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class BillingController {


    // =====================================================
    // SERVICE
    // =====================================================

    private final BillingService billingService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BillingController(BillingService billingService) {

        this.billingService = billingService;

    }


    // =====================================================
    // BILLING PAGE
    // =====================================================

    @GetMapping("/admin/billing")
    public String showBillingPage() {

        return "admin/billing";

    }


    // =====================================================
    // GET ALL BILLING RECORDS
    // =====================================================

    @GetMapping("/api/admin/billing")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllBillingRecords() {

        List<Order> billingRecords =
                billingService.getAllBillingRecords();

        return ResponseEntity.ok(billingRecords);

    }


    // =====================================================
    // GET BILLING RECORD BY ID
    // =====================================================

    @GetMapping("/api/admin/billing/{id}")
    @ResponseBody
    public ResponseEntity<?> getBillingById(
            @PathVariable Long id) {

        try {

            Order order =
                    billingService.getBillingById(id);

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Billing record not found: "
                                    + e.getMessage()
                    );

        }

    }


    // =====================================================
    // UPDATE BILLING RECORD
    // =====================================================

    @PutMapping("/api/admin/billing/{id}")
    @ResponseBody
    public ResponseEntity<?> updateBilling(
            @PathVariable Long id,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) Double amount,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String invoiceDate) {

        try {

            Order updatedOrder =
                    billingService.updateBilling(
                            id,
                            customerName,
                            orderId,
                            amount,
                            status,
                            invoiceDate
                    );

            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Unable to update billing record: "
                                    + e.getMessage()
                    );

        }

    }


    // =====================================================
    // DELETE BILLING RECORD
    // =====================================================

    @DeleteMapping("/api/admin/billing/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteBilling(
            @PathVariable Long id) {

        try {

            billingService.deleteBilling(id);

            return ResponseEntity.ok(
                    "Billing record deleted successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Unable to delete billing record: "
                                    + e.getMessage()
                    );

        }

    }

}