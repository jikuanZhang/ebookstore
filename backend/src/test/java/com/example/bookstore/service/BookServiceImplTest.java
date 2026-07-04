package com.example.bookstore.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.bookstore.dto.BookResponse;
import com.example.bookstore.entity.Book;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.service.impl.BookServiceImpl;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    @Test
    void findAllBooksUsesRepositoryKeywordSearch() {
        Book javaScriptBook = book(1L, "JavaScript 高级程序设计");
        when(bookRepository.findByTitleContainingIgnoreCase("JavaScript"))
                .thenReturn(List.of(javaScriptBook));

        List<BookResponse> result = bookService.findAllBooks(" JavaScript ");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("JavaScript 高级程序设计");
        verify(bookRepository).findByTitleContainingIgnoreCase("JavaScript");
    }

    private Book book(Long id, String title) {
        Book book = new Book();
        book.setId(id);
        book.setTitle(title);
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
