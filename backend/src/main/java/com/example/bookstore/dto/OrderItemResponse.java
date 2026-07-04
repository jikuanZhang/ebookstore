package com.example.bookstore.dto;

import com.example.bookstore.entity.OrderItem;
import java.math.BigDecimal;

public class OrderItemResponse {

    private Long id;
    private Long bookId;
    private String title;
    private String author;
    private String cover;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(
            Long id,
            Long bookId,
            String title,
            String author,
            String cover,
            BigDecimal price,
            Integer quantity,
            BigDecimal subtotal) {
        this.id = id;
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.cover = cover;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getBook().getId(),
                item.getBookTitle(),
                item.getBookAuthor(),
                item.getBookCover(),
                item.getPrice(),
                item.getQuantity(),
                item.getSubtotal());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
