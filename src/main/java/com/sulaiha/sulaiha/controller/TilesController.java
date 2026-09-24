package com.sulaiha.sulaiha.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TilesController {

    // Tiles Products Page
    @GetMapping("/tiles")
    public String showTilesPage() {
        return "user/tiles";
    }
}