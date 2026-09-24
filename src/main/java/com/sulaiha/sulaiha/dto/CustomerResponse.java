package com.sulaiha.sulaiha.dto;

import com.sulaiha.sulaiha.entity.User;

import java.time.LocalDateTime;

public class CustomerResponse {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String address;
    private String status;
    private LocalDateTime createdAt;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public CustomerResponse(User user) {

        this.id = user.getId();

        this.name = user.getFullName();

        this.email = user.getEmail();

        this.mobile = user.getPhone();

        this.address = user.getAddress();

        this.status =
                user.getStatus() != null
                        ? user.getStatus().name()
                        : "ACTIVE";

        this.createdAt = user.getCreatedAt();
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public String getEmail() {
        return email;
    }


    public String getMobile() {
        return mobile;
    }


    public String getAddress() {
        return address;
    }


    public String getStatus() {
        return status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}