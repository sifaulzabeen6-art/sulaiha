package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AllProductController {

    @GetMapping("/products")
    public String showAllProductsPage() {
        return "user/all-products";
    }
}
