package com.example.bookstore.service;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import java.util.List;

public interface BookService {

    List<BookResponse> findAllBooks(String keyword);

    BookResponse findBookById(Long id);

    BookResponse createBook(BookRequest request);

    BookResponse updateBook(Long id, BookRequest request);

    void deleteBook(Long id);
}
