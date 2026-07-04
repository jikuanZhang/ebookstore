package com.example.bookstore.service;

import com.example.bookstore.dto.BookSalesStatResponse;
import com.example.bookstore.dto.CustomerPurchaseStatResponse;
import com.example.bookstore.dto.OrderResponse;
import com.example.bookstore.dto.UserConsumptionStatResponse;
import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    List<OrderResponse> findOrders(Long userId, LocalDate startDate, LocalDate endDate, String bookName);

    List<OrderResponse> findAllOrders(LocalDate startDate, LocalDate endDate, String bookName);

    OrderResponse createOrderFromCart(Long userId);

    List<BookSalesStatResponse> findBookSales(LocalDate startDate, LocalDate endDate);

    List<UserConsumptionStatResponse> findUserConsumptions(LocalDate startDate, LocalDate endDate);

    CustomerPurchaseStatResponse findCustomerStats(Long userId, LocalDate startDate, LocalDate endDate);
}
