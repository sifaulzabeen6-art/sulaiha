package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

/**
 * =====================================================
 * SULAIHA SMART MANAGEMENT SYSTEM
 * ORDER CONTROLLER
 * =====================================================
 *
 * Handles:
 *
 * 1. User My Orders page
 * 2. Admin Order Management page
 * 3. Create Order
 * 4. Get All Orders
 * 5. Get Single Order
 * 6. Update Order Status
 * 7. Update Payment Status
 * 8. Cancel Order
 *
 * Architecture:
 *
 * Controller
 *      ↓
 * OrderService
 *      ↓
 * OrderServiceImpl
 *      ↓
 * OrderRepository
 *      ↓
 * PostgreSQL
 *
 */
@Controller
public class OrderController {


    // =====================================================
    // SERVICE
    // =====================================================

    private final OrderService orderService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public OrderController(OrderService orderService) {

        this.orderService = orderService;
    }


    // =====================================================
    // USER - MY ORDERS PAGE
    // =====================================================

    @GetMapping("/orders")
    public String ordersPage() {

        return "user/orders";
    }


    // =====================================================
    // ADMIN - ORDER MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/orders")
    public String orderManagementPage() {

        return "admin/order-management";
    }


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @GetMapping("/api/admin/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllOrders() {

        List<Order> orders =
                orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }

// =====================================================
// GET SINGLE ORDER
// =====================================================

@GetMapping("/api/admin/orders/{id}")
@ResponseBody
public ResponseEntity<Order> getOrderById(
        @PathVariable Long id) {

    Optional<Order> order =
            orderService.getOrderById(id);

    if (order.isPresent()) {

        return ResponseEntity.ok(
                order.get()
        );
    }

    return ResponseEntity
            .notFound()
            .build();
}

    // =====================================================
    // CREATE ORDER
    // =====================================================

    @PostMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<?> createOrder(
            @RequestBody Order order) {

        try {

            Order savedOrder =
                    orderService.createOrder(order);

            return ResponseEntity
                    .status(201)
                    .body(savedOrder);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to create order.");
        }
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @PutMapping("/api/admin/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        try {

            Order updatedOrder =
                    orderService.updateOrderStatus(
                            id,
                            status
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
                    .body("Unable to update order status.");
        }
    }


    // =====================================================
    // UPDATE PAYMENT STATUS
    // =====================================================

    @PutMapping("/api/admin/orders/{id}/payment-status")
    @ResponseBody
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        try {

            Order updatedOrder =
                    orderService.updatePaymentStatus(
                            id,
                            status
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
                    .body("Unable to update payment status.");
        }
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @DeleteMapping("/api/admin/orders/{id}")
    @ResponseBody
    public ResponseEntity<?> cancelOrder(
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
                    .body("Unable to cancel order.");
        }
    }

}