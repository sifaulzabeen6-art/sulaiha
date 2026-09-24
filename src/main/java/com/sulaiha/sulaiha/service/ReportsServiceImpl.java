package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.repository.OrderRepository;
import com.sulaiha.sulaiha.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;


// =====================================================
// REPORTS SERVICE IMPLEMENTATION
// =====================================================

@Service
public class ReportsServiceImpl implements ReportsService {


    // =====================================================
    // REPOSITORIES
    // =====================================================

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ReportsServiceImpl(
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.orderRepository =
                orderRepository;

        this.productRepository =
                productRepository;
    }

@Override
public List<Order> getAllReportRecords() {

    return orderRepository.findAll();

}

    // =====================================================
    // GET TOTAL PRODUCTS
    // =====================================================

    @Override
    public long getTotalProducts() {

        return productRepository.count();

    }

}