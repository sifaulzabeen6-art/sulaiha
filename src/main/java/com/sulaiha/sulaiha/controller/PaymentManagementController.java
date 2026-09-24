package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class PaymentManagementController {

    private final OrderService orderService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PaymentManagementController(OrderService orderService) {
        this.orderService = orderService;
    }


    // =====================================================
    // PAYMENT MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/payments")
    public String paymentManagementPage() {
        return "admin/payment-management";
    }


    // =====================================================
    // GET ALL PAYMENT RECORDS
    // =====================================================

    @GetMapping("/api/admin/payments")
    @ResponseBody
    public ResponseEntity<List<Order>> getPayments() {

        try {

            List<Order> payments =
                    orderService.getAllOrders();

            return ResponseEntity.ok(payments);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // =====================================================
    // GET SINGLE PAYMENT
    // =====================================================

    @GetMapping("/api/admin/payments/{id}")
    @ResponseBody
    public ResponseEntity<Order> getPaymentById(
            @PathVariable Long id) {

        Optional<Order> payment =
                orderService.getOrderById(id);

        if (payment.isPresent()) {

            return ResponseEntity.ok(
                    payment.get()
            );
        }

        return ResponseEntity
                .notFound()
                .build();
    }


    // =====================================================
    // UPDATE PAYMENT STATUS
    // =====================================================

    @PutMapping("/api/admin/payments/{id}/status")
    @ResponseBody
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        try {

            if (status == null || status.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Payment status is required.");
            }


            String normalizedStatus =
                    status.trim().toUpperCase();


            if (!normalizedStatus.equals("PENDING")
                    && !normalizedStatus.equals("COMPLETED")
                    && !normalizedStatus.equals("FAILED")) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid payment status.");
            }


            Order updatedOrder =
                    orderService.updatePaymentStatus(
                            id,
                            normalizedStatus
                    );


            if (updatedOrder == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            return ResponseEntity.ok(
                    updatedOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to update payment status."
                    );
        }
    }


    // =====================================================
    // CANCEL PAYMENT / ORDER
    // =====================================================

    @DeleteMapping("/api/admin/payments/{id}")
    @ResponseBody
    public ResponseEntity<?> deletePayment(
            @PathVariable Long id) {

        try {

            Order cancelledOrder =
                    orderService.cancelOrder(id);


            if (cancelledOrder == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            return ResponseEntity.ok(
                    cancelledOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to cancel payment."
                    );
        }
    }
}