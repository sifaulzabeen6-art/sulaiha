package com.sulaiha.sulaiha.repository;

import com.sulaiha.sulaiha.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Find expenses by category
    List<Expense> findByCategoryIgnoreCase(String category);

}
