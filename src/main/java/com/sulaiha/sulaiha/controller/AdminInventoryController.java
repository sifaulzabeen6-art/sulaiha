package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Product;
import com.sulaiha.sulaiha.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class AdminInventoryController {

    private final ProductService productService;

    public AdminInventoryController(ProductService productService) {
        this.productService = productService;
    }


    // =====================================================
    // OPEN INVENTORY MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/inventory")
    public String inventoryManagement() {

        return "admin/inventory-management";
    }


    // =====================================================
    // GET ALL INVENTORY
    // =====================================================

    @GetMapping("/api/admin/inventory")
    @ResponseBody
    public List<Product> getInventory() {

        return productService.getAllProducts();
    }


    // =====================================================
    // GET SINGLE INVENTORY ITEM
    // =====================================================

    @GetMapping("/api/admin/inventory/{id}")
    @ResponseBody
    public ResponseEntity<Product> getInventoryById(
            @PathVariable Long id
    ) {

        try {

            Product product =
                    productService.getProductById(id);

            return ResponseEntity.ok(product);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =====================================================
    // UPDATE INVENTORY
    // =====================================================

    @PutMapping("/api/admin/inventory/{id}")
    @ResponseBody
    public ResponseEntity<Product> updateInventory(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        try {

            Product updatedProduct =
                    productService.updateProduct(
                            id,
                            product
                    );

            return ResponseEntity.ok(updatedProduct);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }
}