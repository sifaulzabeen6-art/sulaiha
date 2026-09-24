package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final OrderRepository orderRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public InvoiceServiceImpl(OrderRepository orderRepository) {

        this.orderRepository = orderRepository;

    }


    // =====================================================
    // GET ALL INVOICE RECORDS
    // =====================================================

    @Override
    public List<Order> getAllInvoiceRecords() {

        return orderRepository.findAll();

    }


    // =====================================================
    // GET INVOICE RECORD BY ID
    // =====================================================

    @Override
    public Order getInvoiceById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invoice record not found"
                        )
                );

    }


    // =====================================================
    // UPDATE INVOICE RECORD
    // =====================================================

    @Override
    public Order updateInvoice(
            Long id,
            String customerName,
            String orderId,
            Double amount,
            String status,
            String invoiceDate
    ) {

        Order order =
                getInvoiceById(id);


        // =================================================
        // UPDATE CUSTOMER NAME
        // =================================================

        if (customerName != null &&
                !customerName.trim().isEmpty()) {

            order.setCustomerName(
                    customerName.trim()
            );

        }


        // =================================================
        // UPDATE ORDER ID
        // =================================================

        if (orderId != null &&
                !orderId.trim().isEmpty()) {

            order.setOrderId(
                    orderId.trim()
            );

        }


        // =================================================
        // UPDATE TOTAL AMOUNT
        // =================================================

        if (amount != null) {

            if (amount < 0) {

                throw new IllegalArgumentException(
                        "Invoice amount cannot be negative"
                );

            }

            order.setTotalAmount(amount);

        }


        // =================================================
        // UPDATE PAYMENT STATUS
        // =================================================

        if (status != null &&
                !status.trim().isEmpty()) {

            order.setPaymentStatus(
                    status.trim().toUpperCase()
            );

        }


        // =================================================
        // INVOICE DATE
        // =================================================
        /*
         * The current Order entity does not contain
         * a separate invoiceDate field.
         *
         * Therefore, invoiceDate is intentionally
         * not saved here.
         *
         * The existing orderDate is used as the
         * invoice date by the frontend.
         */


        // =================================================
        // SAVE UPDATED RECORD
        // =================================================

        return orderRepository.save(order);

    }


    // =====================================================
    // DELETE INVOICE RECORD
    // =====================================================

    @Override
    public void deleteInvoice(Long id) {

        Order order =
                getInvoiceById(id);

        orderRepository.delete(order);

    }

}
