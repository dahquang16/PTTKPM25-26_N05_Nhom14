package com.onlinebookstore.OnlineBookStore.services;

import com.onlinebookstore.OnlineBookStore.models.Book;
import java.util.logging.Logger;

import com.onlinebookstore.OnlineBookStore.models.BookCategory;
import com.onlinebookstore.OnlineBookStore.dao.BookDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
	
    private static final Logger LOGGER = Logger.getLogger(BookService.class.getName());

	
    @Autowired
    private BookDao bookDao;

    @Transactional(readOnly = true)
    public List<Book> getAllBooks() {
        List<Book> books = bookDao.findAllWithCategories();
        LOGGER.info("Retrieved " + books.size() + " books from database");
        System.out.println("Retrieved " + books.size() + " books from database");
        return books.stream()
                    .sorted(Comparator.comparing(Book::getId))
                    .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Book getBookById(Long id) {
        return bookDao.findById(id);
    }

    @Transactional
    public void addBook(Book book) {
        bookDao.saveBook(book);
    }

    @Transactional
    public void updateBook(Book book) {
        Book existingBook = bookDao.findById(book.getId());
        if (existingBook != null) {
            existingBook.setTitle(book.getTitle());
            existingBook.setAuthor(book.getAuthor());
            existingBook.setImage(book.getImage());
            existingBook.setPrice(book.getPrice());
            existingBook.setStock(book.getStock());
            existingBook.setDescription(book.getDescription());
            existingBook.setCategory(book.getCategory());
            bookDao.updateBook(existingBook);
        }
    }

    @Transactional
    public void deleteBook(Long id) {
        bookDao.deleteBook(id);
    }

    @Transactional(readOnly = true)
    public List<Book> findBooksByCategoryId(Long categoryId) {
        return bookDao.findBooksByCategory(categoryId);
    }

    @Transactional(readOnly = true)
    public List<Book> getAllBooksInStock() {
        return bookDao.findAllWithCategories().stream()
                      .filter(book -> book.getStock() > 0)
                      .sorted(Comparator.comparing(Book::getId))
                      .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookCategory> getAllCategories() {
        return bookDao.findAllCategories();
    }
}
