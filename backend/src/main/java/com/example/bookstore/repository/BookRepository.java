package com.example.bookstore.repository;

import com.example.bookstore.entity.Book;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

// BookRepository 负责 books 表的数据访问；findAll/findById 等基础方法由 JpaRepository 提供。
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(String title);

    boolean existsByIsbn(String isbn);

    boolean existsByIsbnAndIdNot(String isbn, Long id);
}
