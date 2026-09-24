package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderService {

    // =====================================================
    // CREATE ORDER
    // =====================================================

    Order createOrder(Order order);


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    List<Order> getAllOrders();


    // =====================================================
    // GET SINGLE ORDER
    // =====================================================

    Optional<Order> getOrderById(Long id);


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    Order updateOrderStatus(Long id, String status);


    // =====================================================
    // UPDATE PAYMENT STATUS
    // =====================================================

    Order updatePaymentStatus(Long id, String status);


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    Order cancelOrder(Long id);


    // =====================================================
    // GET ORDERS BY STATUS
    // =====================================================

    List<Order> getOrdersByStatus(List<String> statuses);


    // =====================================================
    // GET ORDERS BY STATUS AND DATE RANGE
    // =====================================================

    List<Order> getOrdersByStatusAndDateRange(
            List<String> statuses,
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}
