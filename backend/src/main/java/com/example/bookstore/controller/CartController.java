package com.example.bookstore.controller;

import com.example.bookstore.dto.CartItemRequest;
import com.example.bookstore.dto.CartItemResponse;
import com.example.bookstore.service.CartService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItemResponse> getCart(@PathVariable Long userId) {
        return cartService.findCartItems(userId);
    }

    @PostMapping
    public CartItemResponse addToCart(@PathVariable Long userId, @RequestBody CartItemRequest request) {
        return cartService.addToCart(userId, request);
    }

    @PutMapping("/{bookId}")
    public List<CartItemResponse> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestBody CartItemRequest request) {
        return cartService.setQuantity(userId, bookId, request);
    }

    @DeleteMapping("/{bookId}")
    public List<CartItemResponse> removeItem(@PathVariable Long userId, @PathVariable Long bookId) {
        return cartService.removeItem(userId, bookId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException error) {
        return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
    }
}
