package com.example.bookstore.service.impl;

import com.example.bookstore.dao.OrderDao;
import com.example.bookstore.dto.BookSalesStatResponse;
import com.example.bookstore.dto.CustomerPurchaseStatResponse;
import com.example.bookstore.dto.OrderResponse;
import com.example.bookstore.dto.UserConsumptionStatResponse;
import com.example.bookstore.entity.Book;
import com.example.bookstore.entity.CartItem;
import com.example.bookstore.entity.OrderItem;
import com.example.bookstore.entity.PurchaseOrder;
import com.example.bookstore.entity.User;
import com.example.bookstore.service.OrderService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderDao orderDao;

    public OrderServiceImpl(OrderDao orderDao) {
        this.orderDao = orderDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> findOrders(Long userId, LocalDate startDate, LocalDate endDate, String bookName) {
        ensureUser(userId);
        return orderDao.findOrdersByUserIdDesc(userId).stream()
                .filter(order -> matchesDate(order, startDate, endDate))
                .filter(order -> matchesBookName(order, bookName))
                .map(OrderResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> findAllOrders(LocalDate startDate, LocalDate endDate, String bookName) {
        return orderDao.findAllOrdersDesc().stream()
                .filter(order -> matchesDate(order, startDate, endDate))
                .filter(order -> matchesBookName(order, bookName))
                .map(OrderResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse createOrderFromCart(Long userId) {
        User user = ensureUser(userId);
        List<CartItem> cartItems = orderDao.findCartItemsByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty.");
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime now = LocalDateTime.now();
        PurchaseOrder order = new PurchaseOrder(buildOrderNumber(userId, now), user, now, totalAmount, "completed");

        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            int nextStock = book.getStock() - cartItem.getQuantity();
            if (nextStock < 0) {
                throw new IllegalArgumentException("Not enough stock for " + book.getTitle() + ".");
            }
            book.setStock(nextStock);
            orderDao.saveBook(book);
            order.addItem(new OrderItem(book, cartItem.getQuantity()));
        }

        PurchaseOrder savedOrder = orderDao.saveOrder(order);
        orderDao.deleteCartItemsByUserId(userId);
        return OrderResponse.from(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookSalesStatResponse> findBookSales(LocalDate startDate, LocalDate endDate) {
        Map<Long, BookSalesStatResponse> stats = new LinkedHashMap<>();
        for (PurchaseOrder order : filteredOrders(startDate, endDate)) {
            for (OrderItem item : order.getItems()) {
                Long bookId = item.getBook().getId();
                BookSalesStatResponse stat = stats.computeIfAbsent(
                        bookId,
                        id -> new BookSalesStatResponse(
                                id,
                                item.getBookTitle(),
                                item.getBookAuthor(),
                                0L,
                                BigDecimal.ZERO));
                stat.setSalesCount(stat.getSalesCount() + item.getQuantity());
                stat.setSalesAmount(stat.getSalesAmount().add(item.getSubtotal()));
            }
        }

        return stats.values().stream()
                .sorted(Comparator.comparing(BookSalesStatResponse::getSalesCount).reversed())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserConsumptionStatResponse> findUserConsumptions(LocalDate startDate, LocalDate endDate) {
        Map<Long, UserConsumptionStatResponse> stats = new LinkedHashMap<>();
        for (PurchaseOrder order : filteredOrders(startDate, endDate)) {
            Long userId = order.getUser().getId();
            long count = order.getItems().stream()
                    .mapToLong(OrderItem::getQuantity)
                    .sum();
            UserConsumptionStatResponse stat = stats.computeIfAbsent(
                    userId,
                    id -> new UserConsumptionStatResponse(
                            id,
                            order.getUser().getUsername(),
                            0L,
                            BigDecimal.ZERO));
            stat.setBookCount(stat.getBookCount() + count);
            stat.setTotalAmount(stat.getTotalAmount().add(order.getTotalAmount()));
        }

        return stats.values().stream()
                .sorted(Comparator.comparing(UserConsumptionStatResponse::getTotalAmount).reversed())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerPurchaseStatResponse findCustomerStats(Long userId, LocalDate startDate, LocalDate endDate) {
        ensureUser(userId);
        List<PurchaseOrder> orders = orderDao.findOrdersByUserIdDesc(userId).stream()
                .filter(order -> matchesDate(order, startDate, endDate))
                .toList();
        Map<Long, BookSalesStatResponse> bookStats = new LinkedHashMap<>();
        long totalCount = 0L;
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseOrder order : orders) {
            totalAmount = totalAmount.add(order.getTotalAmount());
            for (OrderItem item : order.getItems()) {
                totalCount += item.getQuantity();
                Long bookId = item.getBook().getId();
                BookSalesStatResponse stat = bookStats.computeIfAbsent(
                        bookId,
                        id -> new BookSalesStatResponse(
                                id,
                                item.getBookTitle(),
                                item.getBookAuthor(),
                                0L,
                                BigDecimal.ZERO));
                stat.setSalesCount(stat.getSalesCount() + item.getQuantity());
                stat.setSalesAmount(stat.getSalesAmount().add(item.getSubtotal()));
            }
        }

        List<BookSalesStatResponse> books = bookStats.values().stream()
                .sorted(Comparator.comparing(BookSalesStatResponse::getSalesCount).reversed())
                .toList();
        return new CustomerPurchaseStatResponse(totalCount, totalAmount, books);
    }

    private User ensureUser(Long userId) {
        return orderDao.findUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    private String buildOrderNumber(Long userId, LocalDateTime now) {
        String timePart = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        return timePart + String.format("%04d", userId);
    }

    private List<PurchaseOrder> filteredOrders(LocalDate startDate, LocalDate endDate) {
        List<PurchaseOrder> result = new ArrayList<>();
        for (PurchaseOrder order : orderDao.findAllOrdersDesc()) {
            if (matchesDate(order, startDate, endDate)) {
                result.add(order);
            }
        }
        return result;
    }

    private boolean matchesDate(PurchaseOrder order, LocalDate startDate, LocalDate endDate) {
        LocalDate orderDate = order.getCreatedAt().toLocalDate();
        if (startDate != null && orderDate.isBefore(startDate)) {
            return false;
        }
        return endDate == null || !orderDate.isAfter(endDate);
    }

    private boolean matchesBookName(PurchaseOrder order, String bookName) {
        if (bookName == null || bookName.trim().isEmpty()) {
            return true;
        }
        String keyword = bookName.trim().toLowerCase();
        return order.getItems().stream()
                .anyMatch(item -> item.getBookTitle().toLowerCase().contains(keyword));
    }
}
