package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MarbleProductController {

    @GetMapping("/marble-products")
    public String showMarbleProductsPage() {

        return "user/marble-product";
    }
}