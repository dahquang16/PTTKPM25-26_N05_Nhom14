package com.onlinebookstore.OnlineBookStore.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "book_categories")
public class BookCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Book> books;
    
    public BookCategory() {
        // Initialize the books set to prevent null pointer exceptions
        books = new HashSet<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public Set<Book> getBooks() {
        if (this.books == null) {
            this.books = new HashSet<>();
        }
        return books;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }

    public void addBook(Book book) {
        this.books.add(book);
        book.setCategory(this);
    }

    public void removeBook(Book book) {
        this.books.remove(book);
        book.setCategory(null);
    }


}
