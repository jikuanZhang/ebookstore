package com.example.bookstore.dto;

import com.example.bookstore.entity.CartItem;
import java.math.BigDecimal;

public class CartItemResponse {

    private Long id;
    private BookResponse book;
    private Integer quantity;
    private BigDecimal subtotal;

    public CartItemResponse() {
    }

    public CartItemResponse(Long id, BookResponse book, Integer quantity, BigDecimal subtotal) {
        this.id = id;
        this.book = book;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public static CartItemResponse from(CartItem item) {
        BigDecimal subtotal = item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(item.getId(), BookResponse.from(item.getBook()), item.getQuantity(), subtotal);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BookResponse getBook() {
        return book;
    }

    public void setBook(BookResponse book) {
        this.book = book;
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
