package com.sulaiha.sulaiha.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // EXPENSE DETAILS
    // =====================================================

    @Column(nullable = false)
    private String expenseName;


    @Column(nullable = false)
    private String category;


    @Column(nullable = false)
    private Double amount;
    

    @Column(nullable = false)
private String paymentStatus;

    @Column(length = 500)
    private String description;


    @Column(nullable = false)
    private LocalDateTime expenseDate;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Expense() {
    }


    // =====================================================
    // GETTER & SETTER - ID
    // =====================================================

    public Long getId() {
        return id;
    }


    // =====================================================
    // GETTER & SETTER - EXPENSE NAME
    // =====================================================

    public String getExpenseName() {
        return expenseName;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }


    // =====================================================
    // GETTER & SETTER - CATEGORY
    // =====================================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    // =====================================================
    // GETTER & SETTER - AMOUNT
    // =====================================================

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }


    // =====================================================
    // GETTER & SETTER - DESCRIPTION
    // =====================================================

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    // =====================================================
    // GETTER & SETTER - EXPENSE DATE
    // =====================================================

    public LocalDateTime getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDateTime expenseDate) {
        this.expenseDate = expenseDate;
    }
    public String getPaymentStatus() {
    return paymentStatus;
}

public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
}
}
