package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Expense;
import com.sulaiha.sulaiha.service.ExpenseService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


// =====================================================
// EXPENSE MANAGEMENT CONTROLLER
// =====================================================

@Controller
public class ExpenseManagementController {

    private final ExpenseService expenseService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ExpenseManagementController(
            ExpenseService expenseService) {

        this.expenseService = expenseService;
    }


    // =====================================================
    // EXPENSE MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/expenses")
    public String expenseManagementPage() {

        return "admin/expense-management";
    }


    // =====================================================
    // GET ALL EXPENSES
    // =====================================================

    @GetMapping("/api/admin/expenses")
    @ResponseBody
    public ResponseEntity<List<Expense>> getAllExpenses() {

        List<Expense> expenses =
                expenseService.getAllExpenses();

        return ResponseEntity.ok(expenses);
    }


    // =====================================================
    // GET SINGLE EXPENSE
    // =====================================================

    @GetMapping("/api/admin/expenses/{id}")
    @ResponseBody
    public ResponseEntity<Expense> getExpenseById(
            @PathVariable Long id) {

        try {

            Expense expense =
                    expenseService.getExpenseById(id);

            return ResponseEntity.ok(expense);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();

        }
    }


    // =====================================================
    // ADD EXPENSE
    // =====================================================

    @PostMapping("/api/admin/expenses")
    @ResponseBody
    public ResponseEntity<?> addExpense(
            @RequestBody Expense expense) {

        try {

            // -------------------------------------------------
            // Basic validation
            // -------------------------------------------------

            if (expense.getExpenseName() == null
                    || expense.getExpenseName().isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense name is required.");
            }


            if (expense.getCategory() == null
                    || expense.getCategory().isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense category is required.");
            }


            if (expense.getAmount() == null
                    || expense.getAmount() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense amount must be greater than zero.");
            }


            if (expense.getExpenseDate() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense date is required.");
            }


            // -------------------------------------------------
            // Save real expense to database
            // -------------------------------------------------

            Expense savedExpense =
                    expenseService.addExpense(expense);

            return ResponseEntity
                    .status(201)
                    .body(savedExpense);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to add expense.");

        }
    }


    // =====================================================
    // UPDATE EXPENSE
    // =====================================================

    @PutMapping("/api/admin/expenses/{id}")
    @ResponseBody
    public ResponseEntity<?> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense) {

        try {

            // -------------------------------------------------
            // Basic validation
            // -------------------------------------------------

            if (expense.getExpenseName() == null
                    || expense.getExpenseName().isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense name is required.");
            }


            if (expense.getCategory() == null
                    || expense.getCategory().isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense category is required.");
            }


            if (expense.getAmount() == null
                    || expense.getAmount() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense amount must be greater than zero.");
            }


            if (expense.getExpenseDate() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Expense date is required.");
            }


            // -------------------------------------------------
            // Update existing database record
            // -------------------------------------------------

            Expense updatedExpense =
                    expenseService.updateExpense(
                            id,
                            expense
                    );


            return ResponseEntity.ok(
                    updatedExpense
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to update expense.");

        }
    }


    // =====================================================
    // DELETE EXPENSE
    // =====================================================

    @DeleteMapping("/api/admin/expenses/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteExpense(
            @PathVariable Long id) {

        try {

            expenseService.deleteExpense(id);

            return ResponseEntity
                    .ok()
                    .body("Expense deleted successfully.");

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to delete expense.");

        }
    }


    // =====================================================
    // GET EXPENSES BY CATEGORY
    // =====================================================

    @GetMapping("/api/admin/expenses/category/{category}")
    @ResponseBody
    public ResponseEntity<List<Expense>> getExpensesByCategory(
            @PathVariable String category) {

        List<Expense> expenses =
                expenseService.getExpensesByCategory(
                        category
                );

        return ResponseEntity.ok(expenses);
    }

}
