package com.example.bookstore.controller;

import com.example.bookstore.dto.CustomerPurchaseStatResponse;
import com.example.bookstore.dto.OrderResponse;
import com.example.bookstore.service.OrderService;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> getOrders(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String bookName) {
        return orderService.findOrders(userId, startDate, endDate, bookName);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@PathVariable Long userId) {
        OrderResponse order = orderService.createOrderFromCart(userId);
        return ResponseEntity
                .created(URI.create("/api/v1/users/" + userId + "/orders/" + order.getId()))
                .body(order);
    }

    @GetMapping("/stats")
    public CustomerPurchaseStatResponse getCustomerStats(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return orderService.findCustomerStats(userId, startDate, endDate);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException error) {
        return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
    }
}
