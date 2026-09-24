package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


// =====================================================
// CREATE ORDER
// =====================================================

@Override
public Order createOrder(Order order) {

    if (order == null) {
        throw new IllegalArgumentException(
                "Order cannot be null."
        );
    }


    // =================================================
    // ORDER ID
    // =================================================

    if (order.getOrderId() == null
            || order.getOrderId().isBlank()) {

        order.setOrderId(
                "SUL-" + System.currentTimeMillis()
        );
    }


    // =================================================
    // ORDER DATE
    // =================================================

    if (order.getOrderDate() == null) {

        order.setOrderDate(
                LocalDateTime.now()
        );
    }


    // =================================================
    // CUSTOMER NAME
    // =================================================
    //
    // Checkout sends:
    // fullName
    //
    // Order entity stores:
    // customerName
    //
    // =================================================

    if (order.getCustomerName() == null
            || order.getCustomerName().isBlank()) {

        throw new IllegalArgumentException(
                "Customer name is required."
        );
    }


    // =================================================
    // MOBILE NUMBER
    // =================================================

    if (order.getMobileNumber() == null
            || order.getMobileNumber().isBlank()) {

        throw new IllegalArgumentException(
                "Mobile number is required."
        );
    }


    // =================================================
    // EMAIL
    // =================================================

    if (order.getEmail() == null
            || order.getEmail().isBlank()) {

        throw new IllegalArgumentException(
                "Email is required."
        );
    }


    // =================================================
    // DELIVERY ADDRESS
    // =================================================

    if (order.getDeliveryAddress() == null
            || order.getDeliveryAddress().isBlank()) {

        throw new IllegalArgumentException(
                "Delivery address is required."
        );
    }


    // =================================================
    // CITY
    // =================================================

    if (order.getCity() == null
            || order.getCity().isBlank()) {

        throw new IllegalArgumentException(
                "City is required."
        );
    }


    // =================================================
    // PINCODE
    // =================================================

    if (order.getPincode() == null
            || order.getPincode().isBlank()) {

        throw new IllegalArgumentException(
                "Pincode is required."
        );
    }


    // =================================================
    // TOTAL AMOUNT
    // =================================================
    //
    // Order entity stores:
    // totalAmount
    //
    // =================================================

    if (order.getTotalAmount() == null
            || order.getTotalAmount() < 0) {

        throw new IllegalArgumentException(
                "Total amount is required."
        );
    }


    // =================================================
    // ORDER STATUS
    // =================================================

    if (order.getOrderStatus() == null
            || order.getOrderStatus().isBlank()) {

        order.setOrderStatus("PENDING");

    } else {

        order.setOrderStatus(
                order.getOrderStatus()
                        .trim()
                        .toUpperCase()
        );
    }


    // =================================================
    // PAYMENT STATUS
    // =================================================

    if (order.getPaymentStatus() == null
            || order.getPaymentStatus().isBlank()) {

        order.setPaymentStatus("PENDING");

    } else {

        order.setPaymentStatus(
                order.getPaymentStatus()
                        .trim()
                        .toUpperCase()
        );
    }


    // =================================================
    // PAYMENT METHOD
    // =================================================

    if (order.getPaymentMethod() != null
            && !order.getPaymentMethod().isBlank()) {

        order.setPaymentMethod(
                order.getPaymentMethod()
                        .trim()
                        .toUpperCase()
        );
    }


    // =================================================
    // SAVE ORDER
    // =================================================

    return orderRepository.save(order);
}

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @Override
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // =====================================================
    // GET SINGLE ORDER
    // =====================================================

    @Override
    public Optional<Order> getOrderById(Long id) {

        if (id == null) {
            return Optional.empty();
        }

        return orderRepository.findById(id);
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @Override
    public Order updateOrderStatus(
            Long id,
            String status) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "Order ID is required."
            );
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Order status is required."
            );
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found."
                        )
                );

        order.setOrderStatus(
                status.trim().toUpperCase()
        );

        return orderRepository.save(order);
    }


    // =====================================================
    // UPDATE PAYMENT STATUS
    // =====================================================

    @Override
    public Order updatePaymentStatus(
            Long id,
            String status) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "Order ID is required."
            );
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment status is required."
            );
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found."
                        )
                );

        order.setPaymentStatus(
                status.trim().toUpperCase()
        );

        return orderRepository.save(order);
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @Override
    public Order cancelOrder(Long id) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "Order ID is required."
            );
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found."
                        )
                );

        order.setOrderStatus("CANCELLED");

        return orderRepository.save(order);
    }


    // =====================================================
    // GET ORDERS BY STATUS
    // =====================================================

    @Override
    public List<Order> getOrdersByStatus(
            List<String> statuses) {

        if (statuses == null || statuses.isEmpty()) {
            return List.of();
        }

        List<String> normalizedStatuses =
                statuses.stream()
                        .filter(status ->
                                status != null
                                        && !status.isBlank())
                        .map(status ->
                                status.trim().toUpperCase())
                        .toList();

        if (normalizedStatuses.isEmpty()) {
            return List.of();
        }

        return orderRepository.findByOrderStatusIn(
                normalizedStatuses
        );
    }


    // =====================================================
    // GET ORDERS BY STATUS + DATE RANGE
    // =====================================================

    @Override
    public List<Order> getOrdersByStatusAndDateRange(
            List<String> statuses,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        if (statuses == null || statuses.isEmpty()) {
            return List.of();
        }

        if (startDate == null || endDate == null) {
            return List.of();
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date cannot be after end date."
            );
        }

        List<String> normalizedStatuses =
                statuses.stream()
                        .filter(status ->
                                status != null
                                        && !status.isBlank())
                        .map(status ->
                                status.trim().toUpperCase())
                        .toList();

        if (normalizedStatuses.isEmpty()) {
            return List.of();
        }

        return orderRepository
                .findByOrderStatusInAndOrderDateBetween(
                        normalizedStatuses,
                        startDate,
                        endDate
                );
    }
}
