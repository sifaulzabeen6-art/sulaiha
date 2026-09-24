package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Product;
import com.sulaiha.sulaiha.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    // =====================================================
    // PRODUCT MANAGEMENT PAGE
    // =====================================================

    @GetMapping("/admin/products")
    public String productManagement() {

        return "admin/product-management";
    }


    // =====================================================
    // ADD PRODUCT PAGE
    // =====================================================

    @GetMapping("/admin/products/add")
    public String addProductPage() {

        return "admin/product-management";
    }


    // =====================================================
    // VIEW PRODUCT PAGE
    // =====================================================

    @GetMapping("/admin/products/view")
    public String viewProductPage() {

        return "admin/product-management";
    }


    // =====================================================
    // EDIT PRODUCT PAGE
    // =====================================================

    @GetMapping("/admin/products/edit")
    public String editProductPage() {

        return "admin/product-management";
    }


    // =====================================================
    // GET ALL PRODUCTS - ADMIN
    // =====================================================

    @GetMapping("/api/admin/products")
    @ResponseBody
    public List<Product> getAllProducts() {

        return productService.getAllProducts();
    }


    // =====================================================
    // GET ALL PRODUCTS - USER
    // =====================================================

    @GetMapping("/api/products")
    @ResponseBody
    public List<Product> getUserProducts() {

        return productService.getAllProducts();
    }


    // =====================================================
    // GET SINGLE PRODUCT - USER
    // =====================================================

    @GetMapping("/api/products/{id}")
    @ResponseBody
    public ResponseEntity<Product> getUserProductById(
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
    // GET SINGLE PRODUCT - ADMIN
    // =====================================================

    @GetMapping("/api/admin/products/{id}")
    @ResponseBody
    public ResponseEntity<Product> getProductById(
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
    // ADD PRODUCT
    // =====================================================

    @PostMapping("/api/admin/products")
    @ResponseBody
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product
    ) {

        Product savedProduct =
                productService.addProduct(product);

        return ResponseEntity.ok(savedProduct);
    }


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    @PutMapping("/api/admin/products/{id}")
    @ResponseBody
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        try {

            Product updatedProduct =
                    productService.updateProduct(
                            id,
                            product
                    );

            return ResponseEntity.ok(
                    updatedProduct
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    @DeleteMapping("/api/admin/products/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id
    ) {

        try {

            productService.deleteProduct(id);

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }
}