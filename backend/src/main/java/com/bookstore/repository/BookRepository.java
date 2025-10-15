package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:category IS NULL OR LOWER(b.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:minPrice IS NULL OR b.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR b.price <= :maxPrice)")
    Page<Book> findBooksWithFilters(@Param("title") String title,
                                   @Param("author") String author,
                                   @Param("category") String category,
                                   @Param("minPrice") BigDecimal minPrice,
                                   @Param("maxPrice") BigDecimal maxPrice,
                                   Pageable pageable);
    
    @Query("SELECT DISTINCT b.category FROM Book b WHERE b.category IS NOT NULL ORDER BY b.category")
    List<String> findAllCategories();
    
    @Query("SELECT b FROM Book b ORDER BY b.rating DESC, b.reviewCount DESC")
    Page<Book> findPopularBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.stockQuantity > 0")
    Page<Book> findAvailableBooks(Pageable pageable);
}

