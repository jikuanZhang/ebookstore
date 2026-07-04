package com.example.bookstore.dto;

import com.example.bookstore.entity.PurchaseOrder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private String number;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemResponse> items;

    public OrderResponse() {
    }

    public OrderResponse(
            Long id,
            String number,
            Long userId,
            String username,
            LocalDateTime createdAt,
            BigDecimal totalAmount,
            String status,
            List<OrderItemResponse> items) {
        this.id = id;
        this.number = number;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.totalAmount = totalAmount;
        this.status = status;
        this.items = items;
    }

    public static OrderResponse from(PurchaseOrder order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getNumber(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getCreatedAt(),
                order.getTotalAmount(),
                order.getStatus(),
                items);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}
