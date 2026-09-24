package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Expense;
import com.sulaiha.sulaiha.repository.ExpenseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }


    // =====================================================
    // GET ALL EXPENSES
    // =====================================================

    public List<Expense> getAllExpenses() {

        return expenseRepository.findAll();

    }


    // =====================================================
    // GET EXPENSE BY ID
    // =====================================================

    public Expense getExpenseById(Long id) {

        return expenseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Expense not found with ID: " + id
                        )
                );

    }


    // =====================================================
    // ADD EXPENSE
    // =====================================================

    public Expense addExpense(Expense expense) {

        return expenseRepository.save(expense);

    }


    // =====================================================
    // UPDATE EXPENSE
    // =====================================================

    public Expense updateExpense(
            Long id,
            Expense expenseDetails) {

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expense not found with ID: " + id
                                )
                        );


        // -------------------------------------------------
        // Update existing record
        // ID is NOT changed
        // -------------------------------------------------

        existingExpense.setExpenseName(
                expenseDetails.getExpenseName()
        );

        existingExpense.setCategory(
                expenseDetails.getCategory()
        );

        existingExpense.setAmount(
                expenseDetails.getAmount()
        );

        existingExpense.setDescription(
                expenseDetails.getDescription()
        );

        existingExpense.setExpenseDate(
                expenseDetails.getExpenseDate()
        );
        existingExpense.setPaymentStatus(expenseDetails.getPaymentStatus());

        return expenseRepository.save(
                existingExpense
        );

    }


    // =====================================================
    // DELETE EXPENSE
    // =====================================================

    public void deleteExpense(Long id) {

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expense not found with ID: " + id
                                )
                        );


        expenseRepository.delete(
                existingExpense
        );

    }


    // =====================================================
    // GET EXPENSES BY CATEGORY
    // =====================================================

    public List<Expense> getExpensesByCategory(
            String category) {

        return expenseRepository
                .findByCategoryIgnoreCase(category);

    }

}
