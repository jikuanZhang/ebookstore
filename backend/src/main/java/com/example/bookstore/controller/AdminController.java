package com.example.bookstore.controller;

import com.example.bookstore.dto.BookSalesStatResponse;
import com.example.bookstore.dto.OrderResponse;
import com.example.bookstore.dto.UserConsumptionStatResponse;
import com.example.bookstore.service.OrderService;
import com.example.bookstore.service.UserService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UserService userService;
    private final OrderService orderService;

    public AdminController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public List<OrderResponse> getAllOrders(
            @RequestParam Long adminId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String bookName) {
        userService.ensureAdmin(adminId);
        return orderService.findAllOrders(startDate, endDate, bookName);
    }

    @GetMapping("/stats/books")
    public List<BookSalesStatResponse> getBookSalesStats(
            @RequestParam Long adminId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        userService.ensureAdmin(adminId);
        return orderService.findBookSales(startDate, endDate);
    }

    @GetMapping("/stats/users")
    public List<UserConsumptionStatResponse> getUserConsumptionStats(
            @RequestParam Long adminId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        userService.ensureAdmin(adminId);
        return orderService.findUserConsumptions(startDate, endDate);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException error) {
        return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
    }
}
