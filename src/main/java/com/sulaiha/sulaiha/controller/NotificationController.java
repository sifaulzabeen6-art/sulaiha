package com.sulaiha.sulaiha.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class NotificationController {


// Open Notifications page
@GetMapping("/notifications")
public String showNotificationsPage() {

    return "user/notification";
}


}
 