
package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesService {

    private final OrderRepository orderRepository;

    public SalesService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getSales() {

        return orderRepository.findAll()
                .stream()
                .filter(order ->
                        order.getPaymentStatus() != null &&
                        order.getPaymentStatus()
                                .equalsIgnoreCase("PAID"))
                .filter(order ->
                        order.getOrderStatus() == null ||
                        !order.getOrderStatus()
                                .equalsIgnoreCase("CANCELLED"))
                .toList();
    }
}