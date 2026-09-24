package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.repository.OrderRepository;
import com.sulaiha.sulaiha.service.SalesService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class AdminSalesController {

    private final SalesService salesService;
    private final OrderRepository orderRepository;

    public AdminSalesController(
            SalesService salesService,
            OrderRepository orderRepository) {

        this.salesService = salesService;
        this.orderRepository = orderRepository;
    }


    // =====================================================
    // ADMIN SALES MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/sales")
    public String salesManagement() {

        return "admin/sales-management";
    }


    // =====================================================
    // GET ALL SALES
    // =====================================================

    @GetMapping("/api/admin/sales")
    @ResponseBody
    public List<Order> getSales() {

        return salesService.getSales();
    }


    // =====================================================
    // GET SINGLE SALE
    // =====================================================

    @GetMapping("/api/admin/sales/{id}")
    @ResponseBody
    public ResponseEntity<Order> getSaleById(
            @PathVariable Long id) {

        Optional<Order> sale =
                orderRepository.findById(id);

        if (sale.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                sale.get()
        );
    }


    // =====================================================
    // UPDATE SALE
    // =====================================================

    @PutMapping("/api/admin/sales/{id}")
    @ResponseBody
    public ResponseEntity<Order> updateSale(
            @PathVariable Long id,
            @RequestParam String paymentStatus,
            @RequestParam String orderStatus) {

        Optional<Order> optionalSale =
                orderRepository.findById(id);

        if (optionalSale.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        Order sale =
                optionalSale.get();


        // Update payment status

        if (paymentStatus != null &&
            !paymentStatus.isBlank()) {

            sale.setPaymentStatus(
                    paymentStatus.toUpperCase()
            );

        }


        // Update order status

        if (orderStatus != null &&
            !orderStatus.isBlank()) {

            sale.setOrderStatus(
                    orderStatus.toUpperCase()
            );

        }


        Order updatedSale =
                orderRepository.save(sale);


        return ResponseEntity.ok(
                updatedSale
        );
    }


    // =====================================================
    // DELETE / CANCEL SALE
    // =====================================================

    @DeleteMapping("/api/admin/sales/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteSale(
            @PathVariable Long id) {

        Optional<Order> optionalSale =
                orderRepository.findById(id);

        if (optionalSale.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        Order sale =
                optionalSale.get();


        /*
         * Do not physically delete the order.
         * Mark it as CANCELLED instead.
         */

        sale.setOrderStatus(
                "CANCELLED"
        );


        orderRepository.save(sale);


        return ResponseEntity.ok()
                .build();
    }

}