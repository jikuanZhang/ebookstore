package com.example.bookstore.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.bookstore.entity.Book;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:bookstore-test;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.sql.init.mode=never",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=false"
})
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    void findByTitleContainingIgnoreCaseSearchesByBookName() {
        bookRepository.save(book("JavaScript 高级程序设计", "9787115545381"));
        bookRepository.save(book("CSS 权威指南", "9787512387603"));

        List<Book> result = bookRepository.findByTitleContainingIgnoreCase("javascript");

        assertThat(result)
                .extracting(Book::getTitle)
                .containsExactly("JavaScript 高级程序设计");
    }

    private Book book(String title, String isbn) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor("课程作者");
        book.setPublisher("课程出版社");
        book.setIsbn(isbn);
        book.setPrice(new BigDecimal("59.00"));
        book.setStock(20);
        book.setCover("/assets/images/book-1.svg");
        book.setDescription("用于 Repository 测试的图书。");
        book.setCategory("测试图书");
        return book;
    }
}
