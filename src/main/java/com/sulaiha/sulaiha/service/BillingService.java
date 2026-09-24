package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;

import java.util.List;

public interface BillingService {

    // =====================================================
    // GET ALL BILLING RECORDS
    // =====================================================

    List<Order> getAllBillingRecords();


    // =====================================================
    // GET BILLING RECORD BY ID
    // =====================================================

    Order getBillingById(Long id);


    // =====================================================
    // UPDATE BILLING RECORD
    // =====================================================

    Order updateBilling(
            Long id,
            String customerName,
            String orderId,
            Double amount,
            String status,
            String invoiceDate
    );


    // =====================================================
    // DELETE BILLING RECORD
    // =====================================================

    void deleteBilling(Long id);

}
