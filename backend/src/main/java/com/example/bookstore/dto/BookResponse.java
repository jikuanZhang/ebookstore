package com.example.bookstore.dto;

import com.example.bookstore.entity.Book;
import java.math.BigDecimal;

public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String publisher;
    private String isbn;
    private BigDecimal price;
    private Integer stock;
    private String cover;
    private String description;
    private String category;
    private String intro;
    private String audience;
    private String reason;

    public BookResponse() {
    }

    public BookResponse(
            Long id,
            String title,
            String author,
            String publisher,
            String isbn,
            BigDecimal price,
            Integer stock,
            String cover,
            String description,
            String category,
            String intro,
            String audience,
            String reason) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.isbn = isbn;
        this.price = price;
        this.stock = stock;
        this.cover = cover;
        this.description = description;
        this.category = category;
        this.intro = intro;
        this.audience = audience;
        this.reason = reason;
    }

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getIsbn(),
                book.getPrice(),
                book.getStock(),
                book.getCover(),
                book.getDescription(),
                book.getCategory(),
                book.getIntro(),
                book.getAudience(),
                book.getReason());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getIntro() {
        return intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    public String getAudience() {
        return audience;
    }

    public void setAudience(String audience) {
        this.audience = audience;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
