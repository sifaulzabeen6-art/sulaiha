package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Order;
import com.sulaiha.sulaiha.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BillingServiceImpl implements BillingService {

    private final OrderRepository orderRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BillingServiceImpl(OrderRepository orderRepository) {

        this.orderRepository = orderRepository;

    }


    // =====================================================
    // GET ALL BILLING RECORDS
    // =====================================================

    @Override
    public List<Order> getAllBillingRecords() {

        return orderRepository.findAll();

    }


    // =====================================================
    // GET BILLING RECORD BY ID
    // =====================================================

    @Override
    public Order getBillingById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Billing record not found"
                        )
                );

    }


    // =====================================================
    // UPDATE BILLING RECORD
    // =====================================================

    @Override
    public Order updateBilling(
            Long id,
            String customerName,
            String orderId,
            Double amount,
            String status,
            String invoiceDate
    ) {

        Order order = getBillingById(id);


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
        // UPDATE AMOUNT
        // =================================================

        if (amount != null &&
                amount >= 0) {

            order.setTotalAmount(
                    amount
            );

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
        // UPDATE BILLING DATE
        // =================================================

        if (invoiceDate != null &&
                !invoiceDate.trim().isEmpty()) {

            try {

                /*
                 * HTML date input sends:
                 *
                 * yyyy-MM-dd
                 *
                 * Example:
                 * 2026-08-30
                 */

                LocalDate date =
                        LocalDate.parse(
                                invoiceDate.trim()
                        );


                /*
                 * Order entity uses LocalDateTime.
                 *
                 * Therefore, keep the selected date
                 * and set the time to the beginning
                 * of that day.
                 */

                LocalDateTime dateTime =
                        LocalDateTime.of(
                                date,
                                LocalTime.MIN
                        );


                order.setOrderDate(
                        dateTime
                );

            } catch (Exception e) {

                throw new RuntimeException(
                        "Invalid billing date: "
                                + invoiceDate
                );

            }

        }


        // =================================================
        // SAVE UPDATED BILLING RECORD
        // =================================================

        return orderRepository.save(order);

    }


    // =====================================================
    // DELETE BILLING RECORD
    // =====================================================

    @Override
    public void deleteBilling(Long id) {

        Order order =
                getBillingById(id);

        orderRepository.delete(order);

    }

}