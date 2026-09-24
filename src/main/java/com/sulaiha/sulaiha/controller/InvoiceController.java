
package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class InvoiceController {


    // =====================================================
    // SERVICE
    // =====================================================

    private final InvoiceService invoiceService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public InvoiceController(InvoiceService invoiceService) {

        this.invoiceService = invoiceService;

    }


    // =====================================================
    // INVOICE PAGE
    // =====================================================

    @GetMapping("/admin/invoice")
    public String showInvoicePage() {

        return "admin/invoice";

    }


    // =====================================================
    // GET ALL INVOICE RECORDS
    // =====================================================

    @GetMapping("/api/admin/invoice")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllInvoiceRecords() {

        List<Order> invoiceRecords =
                invoiceService.getAllInvoiceRecords();

        return ResponseEntity.ok(invoiceRecords);

    }


    // =====================================================
    // GET INVOICE RECORD BY ID
    // =====================================================

    @GetMapping("/api/admin/invoice/{id}")
    @ResponseBody
    public ResponseEntity<?> getInvoiceById(
            @PathVariable Long id) {

        try {

            Order order =
                    invoiceService.getInvoiceById(id);

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invoice record not found: "
                                    + e.getMessage()
                    );

        }

    }


    // =====================================================
    // UPDATE INVOICE RECORD
    // =====================================================

    @PutMapping("/api/admin/invoice/{id}")
    @ResponseBody
    public ResponseEntity<?> updateInvoice(
            @PathVariable Long id,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) Double amount,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String invoiceDate) {

        try {

            Order updatedOrder =
                    invoiceService.updateInvoice(
                            id,
                            customerName,
                            orderId,
                            amount,
                            status,
                            invoiceDate
                    );

            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Unable to update invoice record: "
                                    + e.getMessage()
                    );

        }

    }


    // =====================================================
    // DELETE INVOICE RECORD
    // =====================================================

    @DeleteMapping("/api/admin/invoice/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteInvoice(
            @PathVariable Long id) {

        try {

            invoiceService.deleteInvoice(id);

            return ResponseEntity.ok(
                    "Invoice record deleted successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Unable to delete invoice record: "
                                    + e.getMessage()
                    );

        }

    }

}