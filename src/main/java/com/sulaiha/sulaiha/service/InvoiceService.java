
package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;

import java.util.List;

public interface InvoiceService {

    // =====================================================
    // GET ALL INVOICE RECORDS
    // =====================================================

    List<Order> getAllInvoiceRecords();


    // =====================================================
    // GET INVOICE RECORD BY ID
    // =====================================================

    Order getInvoiceById(Long id);


    // =====================================================
    // UPDATE INVOICE RECORD
    // =====================================================

    Order updateInvoice(
            Long id,
            String customerName,
            String orderId,
            Double amount,
            String status,
            String invoiceDate
    );


    // =====================================================
    // DELETE INVOICE RECORD
    // =====================================================

    void deleteInvoice(Long id);

}