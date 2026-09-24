package com.sulaiha.sulaiha.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // ORDER DETAILS
    // =====================================================

    @Column(unique = true, nullable = false)
    private String orderId;

    private String customerName;

    private String mobileNumber;

    private String email;

    private String deliveryAddress;

    private String city;

    private String pincode;

    private Double totalAmount;


    // =====================================================
    // ORDER STATUS
    // =====================================================

    private String orderStatus;


    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    private String paymentStatus;

    private String paymentMethod;


    // =====================================================
    // ORDER DATE
    // =====================================================

    private LocalDateTime orderDate;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Order() {
    }


    // =====================================================
    // GETTER - ID
    // =====================================================

    public Long getId() {
        return id;
    }


    // =====================================================
    // GETTER & SETTER - ORDER ID
    // =====================================================

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }


    // =====================================================
    // GETTER & SETTER - CUSTOMER NAME
    // =====================================================

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }


    // =====================================================
    // GETTER & SETTER - MOBILE NUMBER
    // =====================================================

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }


    // =====================================================
    // GETTER & SETTER - EMAIL
    // =====================================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    // =====================================================
    // GETTER & SETTER - DELIVERY ADDRESS
    // =====================================================

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }


    // =====================================================
    // GETTER & SETTER - CITY
    // =====================================================

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }


    // =====================================================
    // GETTER & SETTER - PINCODE
    // =====================================================

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }


    // =====================================================
    // GETTER & SETTER - TOTAL AMOUNT
    // =====================================================

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }


    // =====================================================
    // GETTER & SETTER - ORDER STATUS
    // =====================================================

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }


    // =====================================================
    // GETTER & SETTER - PAYMENT STATUS
    // =====================================================

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }


    // =====================================================
    // GETTER & SETTER - PAYMENT METHOD
    // =====================================================

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    // =====================================================
    // GETTER & SETTER - ORDER DATE
    // =====================================================

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

}