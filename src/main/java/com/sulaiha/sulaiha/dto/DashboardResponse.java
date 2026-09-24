package com.sulaiha.sulaiha.dto;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.entity.Product;

import java.util.List;
import java.util.Map;

/**
 * =====================================================
 * SULAIHA SMART MANAGEMENT SYSTEM
 * DASHBOARD RESPONSE DTO
 * =====================================================
 *
 * Carries dashboard data from:
 *
 * Service
 *    ↓
 * Controller
 *    ↓
 * Frontend JavaScript
 *
 * No business logic is written here.
 *
 * =====================================================
 */

public class DashboardResponse {

    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    private long totalCustomers;

    private long totalProducts;

    private long totalOrders;

    private double totalSales;


    // =====================================================
    // DASHBOARD LIST DATA
    // =====================================================

    private List<Order> recentOrders;

    private List<Product> lowStockProducts;


    // =====================================================
    // SALES OVERVIEW
    // =====================================================
    //
    // Key   → Month
    // Value → Total sales for that month
    //
    // Example:
    // January → 25000
    // February → 32000
    //
    // Values will come from the database
    // through DashboardService.
    // =====================================================

    private Map<String, Double> salesOverview;


    // =====================================================
    // ORDER STATUS
    // =====================================================
    //
    // Key   → Order status
    // Value → Number of orders
    //
    // Example:
    // PENDING → 3
    // DELIVERED → 5
    //
    // Values will come from the database
    // through DashboardService.
    // =====================================================

    private Map<String, Long> orderStatus;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public DashboardResponse() {
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }


    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }


    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }


    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }


    public List<Order> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(
            List<Order> recentOrders) {

        this.recentOrders = recentOrders;
    }


    public List<Product> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(
            List<Product> lowStockProducts) {

        this.lowStockProducts = lowStockProducts;
    }


    // =====================================================
    // SALES OVERVIEW GETTER / SETTER
    // =====================================================

    public Map<String, Double> getSalesOverview() {
        return salesOverview;
    }

    public void setSalesOverview(
            Map<String, Double> salesOverview) {

        this.salesOverview = salesOverview;
    }


    // =====================================================
    // ORDER STATUS GETTER / SETTER
    // =====================================================

    public Map<String, Long> getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(
            Map<String, Long> orderStatus) {

        this.orderStatus = orderStatus;
    }

}