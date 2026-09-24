package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CheckoutController {

    // =====================================================
    // OPEN CHECKOUT PAGE
    // =====================================================

    @GetMapping("/checkout")
    public String showCheckoutPage() {

        return "user/checkout";
    }

}