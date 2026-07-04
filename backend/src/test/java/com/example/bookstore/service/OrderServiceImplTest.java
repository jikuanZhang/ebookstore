package com.example.bookstore.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.bookstore.dto.OrderResponse;
import com.example.bookstore.entity.Book;
import com.example.bookstore.entity.CartItem;
import com.example.bookstore.entity.PurchaseOrder;
import com.example.bookstore.entity.User;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.CartItemRepository;
import com.example.bookstore.repository.OrderRepository;
import com.example.bookstore.repository.UserRepository;
import com.example.bookstore.service.impl.OrderServiceImpl;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void createOrderFromCartReducesStockAndClearsCart() {
        User user = new User("reader", "123456", "reader@example.com", "读者");
        user.setId(1L);
        Book book = book();
        CartItem cartItem = new CartItem(user, book, 2);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));
        when(bookRepository.save(book)).thenReturn(book);
        when(orderRepository.save(any(PurchaseOrder.class))).thenAnswer(invocation -> {
            PurchaseOrder order = invocation.getArgument(0);
            order.setId(100L);
            return order;
        });

        OrderResponse response = orderService.createOrderFromCart(1L);

        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getTotalAmount()).isEqualByComparingTo("178.00");
        assertThat(response.getItems()).hasSize(1);
        assertThat(book.getStock()).isEqualTo(8);
        verify(bookRepository).save(book);
        verify(orderRepository).save(any(PurchaseOrder.class));
        verify(cartItemRepository).deleteByUserId(1L);
    }

    private Book book() {
        Book book = new Book();
        book.setId(1L);
        book.setTitle("JavaScript 高级程序设计");
        book.setAuthor("Nicholas C. Zakas");
        book.setPublisher("人民邮电出版社");
        book.setIsbn("9787115545381");
        book.setPrice(new BigDecimal("89.00"));
        book.setStock(10);
        book.setCover("/assets/images/book-1.svg");
        book.setDescription("JavaScript book");
        book.setCategory("前端开发");
        return book;
    }
}
