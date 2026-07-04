package com.example.bookstore.controller;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import com.example.bookstore.service.BookService;
import com.example.bookstore.service.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {

    // Controller 只负责 HTTP 层，具体查询逻辑交给 BookService。
    private final BookService bookService;
    private final UserService userService;

    public BookController(BookService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    @GetMapping("/api/v1/books")
    public List<BookResponse> getBooks(@RequestParam(required = false) String keyword) {
        // 作业4接口：查询全部书籍，返回 JSON 数组。
        return bookService.findAllBooks(keyword);
    }

    @GetMapping("/api/v1/book/{id}")
    public BookResponse getBook(@PathVariable Long id) {
        // 作业4接口：根据路径参数 id 查询单本图书详情。
        return bookService.findBookById(id);
    }

    @PostMapping("/api/v1/admin/books")
    public BookResponse createBook(@RequestParam Long adminId, @RequestBody BookRequest request) {
        userService.ensureAdmin(adminId);
        return bookService.createBook(request);
    }

    @PutMapping("/api/v1/admin/books/{id}")
    public BookResponse updateBook(
            @RequestParam Long adminId,
            @PathVariable Long id,
            @RequestBody BookRequest request) {
        userService.ensureAdmin(adminId);
        return bookService.updateBook(id, request);
    }

    @DeleteMapping("/api/v1/admin/books/{id}")
    public ResponseEntity<Void> deleteBook(@RequestParam Long adminId, @PathVariable Long id) {
        userService.ensureAdmin(adminId);
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(IllegalArgumentException error) {
        // Service 找不到图书时抛异常，这里统一转成 404 响应。
        return ResponseEntity.status(404).body(Map.of("message", error.getMessage()));
    }
}
