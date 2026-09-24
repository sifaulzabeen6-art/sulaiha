package com.sulaiha.sulaiha.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CartController {

    // =====================================================
    // OPEN CART PAGE
    // =====================================================

    @GetMapping("/cart")
    public String showcartPage() {

        return "user/cart";
    }
}