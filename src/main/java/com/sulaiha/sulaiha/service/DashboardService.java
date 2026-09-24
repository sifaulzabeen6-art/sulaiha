package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.dto.DashboardResponse;
import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.entity.Product;
import com.sulaiha.sulaiha.entity.Role;
import com.sulaiha.sulaiha.repository.OrderRepository;
import com.sulaiha.sulaiha.repository.ProductRepository;
import com.sulaiha.sulaiha.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final int LOW_STOCK_LIMIT = 5;
    private static final int RECENT_ORDER_LIMIT = 5;

    public DashboardService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // =====================================================
    // GET DASHBOARD DATA
    // =====================================================

    public DashboardResponse getDashboardData() {

        List<Order> orders =
                orderRepository.findAll();

        List<Product> products =
                productRepository.findAll();


        // =================================================
        // TOTAL CUSTOMERS
        // =================================================

        long totalCustomers =
                userRepository
                        .findByRole(Role.USER)
                        .size();


        // =================================================
        // TOTAL PRODUCTS
        // =================================================

        long totalProducts =
                products.size();


        // =================================================
        // TOTAL ORDERS
        // =================================================

        long totalOrders =
                orders.size();


        // =================================================
        // TOTAL SALES
        // =================================================

        double totalSales =
                calculateTotalSales(orders);


        // =================================================
        // RECENT ORDERS
        // =================================================

        List<Order> recentOrders =
                getRecentOrders(orders);


        // =================================================
        // LOW STOCK PRODUCTS
        // =================================================

        List<Product> lowStockProducts =
                getLowStockProducts(products);


        // =================================================
        // SALES OVERVIEW
        // =================================================

        Map<String, Double> salesOverview =
                calculateSalesOverview(orders);


        // =================================================
        // ORDER STATUS OVERVIEW
        // =================================================

        Map<String, Long> orderStatus =
                calculateOrderStatusOverview(orders);


        // =================================================
        // CREATE RESPONSE
        // =================================================

        DashboardResponse response =
                new DashboardResponse();


        response.setTotalCustomers(
                totalCustomers
        );

        response.setTotalProducts(
                totalProducts
        );

        response.setTotalOrders(
                totalOrders
        );

        response.setTotalSales(
                totalSales
        );

        response.setRecentOrders(
                recentOrders
        );

        response.setLowStockProducts(
                lowStockProducts
        );

        response.setSalesOverview(
                salesOverview
        );

        response.setOrderStatus(
                orderStatus
        );


        return response;
    }


    // =====================================================
    // CALCULATE TOTAL SALES
    // =====================================================

    private double calculateTotalSales(
            List<Order> orders) {

        double totalSales = 0.0;


        for (Order order : orders) {

            String status =
                    order.getOrderStatus();


            if (status != null &&
                    status.equalsIgnoreCase("CANCELLED")) {

                continue;
            }


            if (order.getTotalAmount() != null) {

                totalSales +=
                        order.getTotalAmount();
            }
        }


        return totalSales;
    }


    // =====================================================
    // GET RECENT ORDERS
    // =====================================================

    private List<Order> getRecentOrders(
            List<Order> orders) {

        List<Order> recentOrders =
                new ArrayList<>(orders);


        // Latest order first

        recentOrders.sort(
                (order1, order2) -> {

                    LocalDateTime date1 =
                            order1.getOrderDate();

                    LocalDateTime date2 =
                            order2.getOrderDate();


                    if (date1 == null &&
                            date2 == null) {

                        return 0;
                    }


                    if (date1 == null) {

                        return 1;
                    }


                    if (date2 == null) {

                        return -1;
                    }


                    return date2.compareTo(date1);
                }
        );


        // Keep only latest 5 orders

        if (recentOrders.size() >
                RECENT_ORDER_LIMIT) {

            recentOrders =
                    new ArrayList<>(
                            recentOrders.subList(
                                    0,
                                    RECENT_ORDER_LIMIT
                            )
                    );
        }


        return recentOrders;
    }


    // =====================================================
    // GET LOW STOCK PRODUCTS
    // =====================================================

    private List<Product> getLowStockProducts(
            List<Product> products) {

        List<Product> lowStockProducts =
                new ArrayList<>();


        for (Product product : products) {

            if (product.getQuantity() <=
                    LOW_STOCK_LIMIT) {

                lowStockProducts.add(product);
            }
        }


        return lowStockProducts;
    }


    // =====================================================
    // SALES OVERVIEW
    // =====================================================

    private Map<String, Double> calculateSalesOverview(
            List<Order> orders) {

        Map<String, Double> salesOverview =
                new LinkedHashMap<>();


        // Start with zero values

        salesOverview.put("MONDAY", 0.0);
        salesOverview.put("TUESDAY", 0.0);
        salesOverview.put("WEDNESDAY", 0.0);
        salesOverview.put("THURSDAY", 0.0);
        salesOverview.put("FRIDAY", 0.0);
        salesOverview.put("SATURDAY", 0.0);
        salesOverview.put("SUNDAY", 0.0);


        for (Order order : orders) {

            if (order.getOrderDate() == null) {
                continue;
            }


            if (order.getTotalAmount() == null) {
                continue;
            }


            String status =
                    order.getOrderStatus();


            // Cancelled orders are not included

            if (status != null &&
                    status.equalsIgnoreCase("CANCELLED")) {

                continue;
            }


            String day =
                    order.getOrderDate()
                            .getDayOfWeek()
                            .name();


            double currentAmount =
                    salesOverview.getOrDefault(
                            day,
                            0.0
                    );


            salesOverview.put(
                    day,
                    currentAmount +
                            order.getTotalAmount()
            );
        }


        return salesOverview;
    }


    // =====================================================
    // ORDER STATUS OVERVIEW
    // =====================================================

    private Map<String, Long> calculateOrderStatusOverview(
            List<Order> orders) {

        Map<String, Long> orderStatusOverview =
                new LinkedHashMap<>();


        orderStatusOverview.put(
                "PENDING",
                0L
        );

        orderStatusOverview.put(
                "CONFIRMED",
                0L
        );

        orderStatusOverview.put(
                "PROCESSING",
                0L
        );

        orderStatusOverview.put(
                "SHIPPED",
                0L
        );

        orderStatusOverview.put(
                "DELIVERED",
                0L
        );

        orderStatusOverview.put(
                "CANCELLED",
                0L
        );


        for (Order order : orders) {

            String status =
                    order.getOrderStatus();


            if (status == null ||
                    status.isBlank()) {

                continue;
            }


            String normalizedStatus =
                    status.trim()
                            .toUpperCase();


            if (orderStatusOverview.containsKey(
                    normalizedStatus)) {

                long currentCount =
                        orderStatusOverview.get(
                                normalizedStatus
                        );


                orderStatusOverview.put(
                        normalizedStatus,
                        currentCount + 1
                );
            }
        }


        return orderStatusOverview;
    }

}