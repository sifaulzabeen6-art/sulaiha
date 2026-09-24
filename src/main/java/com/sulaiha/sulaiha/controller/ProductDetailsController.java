package com.sulaiha.sulaiha.controller;

import com.sulaiha.sulaiha.entity.Product;
import com.sulaiha.sulaiha.service.ProductService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProductDetailsController {

    private final ProductService productService;

    public ProductDetailsController(ProductService productService) {
        this.productService = productService;
    }

    // =====================================================
    // PRODUCT DETAILS PAGE
    // =====================================================

    @GetMapping("/product-details")
    public String productDetails(
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "id", required = false) Long id,
            Model model) {

        // =================================================
        // ACCEPT BOTH:
        // /product-details?productId=4
        // /product-details?id=4
        // =================================================

        Long finalProductId = productId != null
                ? productId
                : id;

        // =================================================
        // CHECK PRODUCT ID
        // =================================================

        if (finalProductId == null) {

            return "redirect:/products";
        }

        // =================================================
        // GET PRODUCT FROM DATABASE
        // =================================================

        Product product =
                productService.getProductById(finalProductId);

        // =================================================
        // SEND PRODUCT TO PAGE
        // =================================================

        model.addAttribute(
                "product",
                product
        );

        // =================================================
        // OPEN PRODUCT DETAILS HTML
        // =================================================

        return "user/product-details";
    }
}