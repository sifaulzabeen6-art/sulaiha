package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Role;
import com.sulaiha.sulaiha.entity.User;
import com.sulaiha.sulaiha.entity.UserStatus;
import com.sulaiha.sulaiha.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // =====================================================
    // REGISTER USER / CUSTOMER
    // =====================================================

    public User registerUser(String fullName,
                             String email,
                             String phone,
                             String address,
                             String password) {

        if (userRepository.existsByEmail(email)) {

            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }


        User user = new User();

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(address);


        // Password must never be stored as plain text

        user.setPassword(
                passwordEncoder.encode(password)
        );


        // Public registration creates USER

        user.setRole(Role.USER);


        // Newly registered customers are ACTIVE

        user.setStatus(UserStatus.ACTIVE);


        return userRepository.save(user);
    }


    // =====================================================
    // FIND USER BY EMAIL
    // =====================================================

    public User findByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }


    // =====================================================
    // UPDATE PASSWORD
    // =====================================================

    public void updatePassword(String email,
                                String newPassword) {

        User user = findByEmail(email);


        user.setPassword(
                passwordEncoder.encode(newPassword)
        );


        userRepository.save(user);
    }


    // =====================================================
    // GET ALL CUSTOMERS
    // =====================================================
    //
    // Only users with Role.USER are customers.
    // Admin users are not included.
    //

    public List<User> getAllCustomers() {

        return userRepository
                .findByRoleOrderByIdDesc(Role.USER);
    }


    // =====================================================
    // GET CUSTOMER BY ID
    // =====================================================

    public User getCustomerById(Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Customer not found"
                                )
                        );


        // Make sure the requested user
        // is actually a customer.

        if (user.getRole() != Role.USER) {

            throw new IllegalArgumentException(
                    "User is not a customer"
            );
        }


        return user;
    }


    // =====================================================
    // UPDATE CUSTOMER
    // =====================================================

    public User updateCustomer(Long id,
                               String name,
                               String email,
                               String mobile,
                               UserStatus status) {

        User customer =
                getCustomerById(id);


        // -------------------------------------------------
        // Check whether another customer already
        // uses the new email address.
        // -------------------------------------------------

        userRepository
                .findByEmail(email)
                .ifPresent(existingUser -> {

                    if (!existingUser.getId().equals(id)) {

                        throw new IllegalArgumentException(
                                "Email already registered"
                        );
                    }

                });


        // -------------------------------------------------
        // Update customer information
        // -------------------------------------------------

        customer.setFullName(name);
        customer.setEmail(email);
        customer.setPhone(mobile);
        customer.setStatus(status);


        return userRepository.save(customer);
    }


    // =====================================================
    // REMOVE CUSTOMER
    // =====================================================
    //
    // Soft remove:
    // Customer is NOT deleted from database.
    // Status becomes INACTIVE.
    //

    public void removeCustomer(Long id) {

        User customer =
                getCustomerById(id);


        customer.setStatus(
                UserStatus.INACTIVE
        );


        userRepository.save(customer);
    }

}