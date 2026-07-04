package com.example.bookstore.service;

import com.example.bookstore.dto.CartItemRequest;
import com.example.bookstore.dto.CartItemResponse;
import java.util.List;

public interface CartService {

    List<CartItemResponse> findCartItems(Long userId);

    CartItemResponse addToCart(Long userId, CartItemRequest request);

    List<CartItemResponse> setQuantity(Long userId, Long bookId, CartItemRequest request);

    List<CartItemResponse> removeItem(Long userId, Long bookId);

    void clearCart(Long userId);
}
