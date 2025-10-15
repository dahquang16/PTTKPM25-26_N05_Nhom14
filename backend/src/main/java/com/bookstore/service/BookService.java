package com.bookstore.service;

import com.bookstore.dto.BookDTO;
import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    public Page<BookDTO> findBooksWithFilters(String title, String author, String category,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              Pageable pageable) {
        Page<Book> books = bookRepository.findBooksWithFilters(title, author, category, minPrice, maxPrice, pageable);
        return books.map(this::convertToDTO);
    }
    
    public Page<BookDTO> findPopularBooks(Pageable pageable) {
        Page<Book> books = bookRepository.findPopularBooks(pageable);
        return books.map(this::convertToDTO);
    }
    
    public Page<BookDTO> findAvailableBooks(Pageable pageable) {
        Page<Book> books = bookRepository.findAvailableBooks(pageable);
        return books.map(this::convertToDTO);
    }
    
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }
    
    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return convertToDTO(book);
    }
    
    public BookDTO createBook(BookDTO bookDTO) {
        Book book = convertToEntity(bookDTO);
        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }
    
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setPublisher(bookDTO.getPublisher());
        book.setIsbn(bookDTO.getIsbn());
        book.setDescription(bookDTO.getDescription());
        book.setSummary(bookDTO.getSummary());
        book.setPrice(bookDTO.getPrice());
        book.setImageUrl(bookDTO.getImageUrl());
        book.setCategory(bookDTO.getCategory());
        book.setStockQuantity(bookDTO.getStockQuantity());
        
        Book updatedBook = bookRepository.save(book);
        return convertToDTO(updatedBook);
    }
    
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        
        bookRepository.delete(book);
    }
    
    public void updateStock(Long bookId, Integer quantity) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        book.setStockQuantity(book.getStockQuantity() - quantity);
        bookRepository.save(book);
    }
    
    private BookDTO convertToDTO(Book book) {
        return new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getIsbn(),
                book.getDescription(),
                book.getSummary(),
                book.getPrice(),
                book.getImageUrl(),
                book.getCategory(),
                book.getStockQuantity(),
                book.getRating(),
                book.getReviewCount(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }
    
    private Book convertToEntity(BookDTO bookDTO) {
        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setPublisher(bookDTO.getPublisher());
        book.setIsbn(bookDTO.getIsbn());
        book.setDescription(bookDTO.getDescription());
        book.setSummary(bookDTO.getSummary());
        book.setPrice(bookDTO.getPrice());
        book.setImageUrl(bookDTO.getImageUrl());
        book.setCategory(bookDTO.getCategory());
        book.setStockQuantity(bookDTO.getStockQuantity());
        return book;
    }
}


