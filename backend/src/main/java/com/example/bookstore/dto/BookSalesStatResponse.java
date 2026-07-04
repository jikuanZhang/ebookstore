package com.example.bookstore.dto;

import java.math.BigDecimal;

public class BookSalesStatResponse {

    private Long bookId;
    private String title;
    private String author;
    private Long salesCount;
    private BigDecimal salesAmount;

    public BookSalesStatResponse() {
    }

    public BookSalesStatResponse(Long bookId, String title, String author, Long salesCount, BigDecimal salesAmount) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.salesCount = salesCount;
        this.salesAmount = salesAmount;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Long getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Long salesCount) {
        this.salesCount = salesCount;
    }

    public BigDecimal getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(BigDecimal salesAmount) {
        this.salesAmount = salesAmount;
    }
}
