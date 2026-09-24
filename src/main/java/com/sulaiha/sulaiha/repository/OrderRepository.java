package com.sulaiha.sulaiha.repository;

import com.sulaiha.sulaiha.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByOrderStatusIn(List<String> statuses);

    List<Order> findByOrderStatusInAndOrderDateBetween(
            List<String> statuses,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

}