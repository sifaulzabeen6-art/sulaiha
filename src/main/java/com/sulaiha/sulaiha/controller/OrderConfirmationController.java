package com.sulaiha.sulaiha.controller;


   import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OrderConfirmationController {

    @GetMapping("/order-confirmation")
    public String orderConfirmation() {

        return "user/order-confirmation";
    }
} 

