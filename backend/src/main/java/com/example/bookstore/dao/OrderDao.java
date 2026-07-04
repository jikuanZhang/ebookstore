package com.example.bookstore.dao;

import com.example.bookstore.entity.Book;
import com.example.bookstore.entity.CartItem;
import com.example.bookstore.entity.PurchaseOrder;
import com.example.bookstore.entity.User;
import java.util.List;
import java.util.Optional;

public interface OrderDao {

    Optional<User> findUserById(Long userId);

    List<CartItem> findCartItemsByUserId(Long userId);

    Book saveBook(Book book);

    PurchaseOrder saveOrder(PurchaseOrder order);

    void deleteCartItemsByUserId(Long userId);

    List<PurchaseOrder> findOrdersByUserIdDesc(Long userId);

    List<PurchaseOrder> findAllOrdersDesc();
}
