package com.example.bookstore.service.impl;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import com.example.bookstore.entity.Book;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.service.BookService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class BookServiceImpl implements BookService {

    // Service 实现类不直接写 SQL，而是通过 Repository 读取数据库。
    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> findAllBooks(String keyword) {
        // 对应 GET /api/v1/books，返回数据库中的全部图书。
        List<Book> books = StringUtils.hasText(keyword)
                ? bookRepository.findByTitleContainingIgnoreCase(keyword.trim())
                : bookRepository.findAll();
        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponse findBookById(Long id) {
        // 对应 GET /api/v1/book/{id}，找不到时交给 Controller 返回 404。
        return bookRepository.findById(id)
                .map(BookResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));
    }

    @Override
    @Transactional
    public BookResponse createBook(BookRequest request) {
        Book book = new Book();
        fillBook(book, request);
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new IllegalArgumentException("ISBN already exists.");
        }
        return BookResponse.from(bookRepository.save(book));
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));
        fillBook(book, request);
        if (bookRepository.existsByIsbnAndIdNot(book.getIsbn(), id)) {
            throw new IllegalArgumentException("ISBN already exists.");
        }
        return BookResponse.from(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Book not found: " + id);
        }
        bookRepository.deleteById(id);
    }

    private void fillBook(Book book, BookRequest request) {
        String title = clean(request.getTitle());
        String author = clean(request.getAuthor());
        String isbn = clean(request.getIsbn());
        BigDecimal price = request.getPrice();
        Integer stock = request.getStock();

        if (!StringUtils.hasText(title)) {
            throw new IllegalArgumentException("Book title is required.");
        }
        if (!StringUtils.hasText(author)) {
            throw new IllegalArgumentException("Book author is required.");
        }
        if (!StringUtils.hasText(isbn)) {
            throw new IllegalArgumentException("ISBN is required.");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Book price must be greater than or equal to zero.");
        }
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("Book stock must be greater than or equal to zero.");
        }

        book.setTitle(title);
        book.setAuthor(author);
        book.setPublisher(clean(request.getPublisher()));
        book.setIsbn(isbn);
        book.setPrice(price);
        book.setStock(stock);
        book.setCover(defaultIfBlank(request.getCover(), "/assets/images/book-1.svg"));
        book.setDescription(clean(request.getDescription()));
        book.setCategory(defaultIfBlank(request.getCategory(), "综合图书"));
        book.setIntro(clean(request.getIntro()));
        book.setAudience(clean(request.getAudience()));
        book.setReason(clean(request.getReason()));
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }

    private String defaultIfBlank(String value, String fallback) {
        String cleaned = clean(value);
        return StringUtils.hasText(cleaned) ? cleaned : fallback;
    }
}
