package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.dto.CustomerResponse;
import com.sulaiha.sulaiha.entity.User;
import com.sulaiha.sulaiha.entity.UserStatus;
import com.sulaiha.sulaiha.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class CustomerManagementController {

    private final UserService userService;

    public CustomerManagementController(UserService userService) {
        this.userService = userService;
    }


    // =====================================================
    // CUSTOMER MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/customers")
    public String showCustomerManagementPage() {

        return "admin/customer-management";
    }


    // =====================================================
    // GET ALL CUSTOMERS
    // =====================================================

    @GetMapping("/api/admin/customers")
    @ResponseBody
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {

        List<CustomerResponse> customers =
                userService.getAllCustomers()
                        .stream()
                        .map(CustomerResponse::new)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(customers);
    }


    // =====================================================
    // GET SINGLE CUSTOMER
    // VIEW CUSTOMER
    // =====================================================

    @GetMapping("/api/admin/customers/{id}")
    @ResponseBody
    public ResponseEntity<CustomerResponse> getCustomerById(
            @PathVariable Long id) {

        try {

            User customer =
                    userService.getCustomerById(id);

            return ResponseEntity.ok(
                    new CustomerResponse(customer)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =====================================================
    // UPDATE CUSTOMER
    // EDIT CUSTOMER
    // =====================================================

    @PutMapping("/api/admin/customers/{id}")
    @ResponseBody
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerUpdateRequest request) {

        try {

            UserStatus status =
                    UserStatus.valueOf(
                            request.status().toUpperCase()
                    );

            User updatedCustomer =
                    userService.updateCustomer(
                            id,
                            request.name(),
                            request.email(),
                            request.mobile(),
                            status
                    );

            return ResponseEntity.ok(
                    new CustomerResponse(updatedCustomer)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().build();
        }
    }


    // =====================================================
    // REMOVE CUSTOMER
    // SOFT DELETE
    // =====================================================

    @DeleteMapping("/api/admin/customers/{id}")
    @ResponseBody
    public ResponseEntity<Void> removeCustomer(
            @PathVariable Long id) {

        try {

            userService.removeCustomer(id);

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =====================================================
    // UPDATE REQUEST
    // =====================================================

    public record CustomerUpdateRequest(
            String name,
            String email,
            String mobile,
            String status
    ) {
    }
}