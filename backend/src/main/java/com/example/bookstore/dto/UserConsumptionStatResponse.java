package com.example.bookstore.dto;

import java.math.BigDecimal;

public class UserConsumptionStatResponse {

    private Long userId;
    private String username;
    private Long bookCount;
    private BigDecimal totalAmount;

    public UserConsumptionStatResponse() {
    }

    public UserConsumptionStatResponse(Long userId, String username, Long bookCount, BigDecimal totalAmount) {
        this.userId = userId;
        this.username = username;
        this.bookCount = bookCount;
        this.totalAmount = totalAmount;
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

    public Long getBookCount() {
        return bookCount;
    }

    public void setBookCount(Long bookCount) {
        this.bookCount = bookCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
