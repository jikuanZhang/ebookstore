package com.example.bookstore.service.impl;

import com.example.bookstore.dto.CartItemRequest;
import com.example.bookstore.dto.CartItemResponse;
import com.example.bookstore.entity.Book;
import com.example.bookstore.entity.CartItem;
import com.example.bookstore.entity.User;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.CartItemRepository;
import com.example.bookstore.repository.UserRepository;
import com.example.bookstore.service.CartService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public CartServiceImpl(
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemResponse> findCartItems(Long userId) {
        ensureUser(userId);
        return cartItemRepository.findByUserId(userId).stream()
                .map(CartItemResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        User user = ensureUser(userId);
        Book book = ensureBook(request.getBookId());
        int quantity = positiveQuantity(request.getQuantity(), 1);

        CartItem item = cartItemRepository.findByUserIdAndBookId(userId, book.getId())
                .orElseGet(() -> new CartItem(user, book, 0));
        int nextQuantity = item.getQuantity() + quantity;
        ensureEnoughStock(book, nextQuantity);
        item.setQuantity(nextQuantity);

        return CartItemResponse.from(cartItemRepository.save(item));
    }

    @Override
    @Transactional
    public List<CartItemResponse> setQuantity(Long userId, Long bookId, CartItemRequest request) {
        ensureUser(userId);
        Book book = ensureBook(bookId);
        int quantity = Math.max(0, request.getQuantity() == null ? 0 : request.getQuantity());

        if (quantity == 0) {
            cartItemRepository.deleteByUserIdAndBookId(userId, bookId);
            return findCartItems(userId);
        }

        ensureEnoughStock(book, quantity);
        CartItem item = cartItemRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found."));
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return findCartItems(userId);
    }

    @Override
    @Transactional
    public List<CartItemResponse> removeItem(Long userId, Long bookId) {
        ensureUser(userId);
        ensureBook(bookId);
        cartItemRepository.deleteByUserIdAndBookId(userId, bookId);
        return findCartItems(userId);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        ensureUser(userId);
        cartItemRepository.deleteByUserId(userId);
    }

    User ensureUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    private Book ensureBook(Long bookId) {
        if (bookId == null) {
            throw new IllegalArgumentException("Book id is required.");
        }
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + bookId));
    }

    private int positiveQuantity(Integer quantity, int fallback) {
        int value = quantity == null ? fallback : quantity;
        if (value <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero.");
        }
        return value;
    }

    private void ensureEnoughStock(Book book, int quantity) {
        if (book.getStock() < quantity) {
            throw new IllegalArgumentException("Not enough stock for " + book.getTitle() + ".");
        }
    }
}
