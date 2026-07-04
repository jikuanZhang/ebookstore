package com.example.bookstore.dto;

import java.math.BigDecimal;
import java.util.List;

public class CustomerPurchaseStatResponse {

    private Long totalCount;
    private BigDecimal totalAmount;
    private List<BookSalesStatResponse> books;

    public CustomerPurchaseStatResponse() {
    }

    public CustomerPurchaseStatResponse(Long totalCount, BigDecimal totalAmount, List<BookSalesStatResponse> books) {
        this.totalCount = totalCount;
        this.totalAmount = totalAmount;
        this.books = books;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<BookSalesStatResponse> getBooks() {
        return books;
    }

    public void setBooks(List<BookSalesStatResponse> books) {
        this.books = books;
    }
}
