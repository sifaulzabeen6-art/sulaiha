package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;

import java.util.List;


// =====================================================
// REPORTS SERVICE
// =====================================================

public interface ReportsService {


    // =====================================================
    // GET ALL ORDER REPORT RECORDS
    // =====================================================

    List<Order> getAllReportRecords();


    // =====================================================
    // GET TOTAL PRODUCTS
    // =====================================================

    long getTotalProducts();

}