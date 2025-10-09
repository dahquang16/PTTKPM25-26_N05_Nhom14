package com.onlinebookstore.OnlineBookStore.dao;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.onlinebookstore.OnlineBookStore.models.Book;
import com.onlinebookstore.OnlineBookStore.models.BookCategory;

import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

@Repository
public class BookDao {
	@Autowired
    private SessionFactory sessionFactory;

	public List<Book> findAllWithCategories() {
	    try (Session session = sessionFactory.openSession()) {
	        return session.createQuery("SELECT b FROM Book b JOIN FETCH b.category ORDER BY b.id", Book.class).getResultList();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}

    public Book findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(Book.class, id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to find the book with ID: " + id, e);
        }
    }

    public void saveBook(Book book) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            session.save(book);
            session.getTransaction().commit();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save the book", e);
        }
    }

    public void updateBook(Book book) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            session.update(book);
            session.getTransaction().commit();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update the book", e);
        }
    }

    public void deleteBook(Long id) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            Book book = session.get(Book.class, id);
            if (book != null) {
                session.delete(book);
            }
            session.getTransaction().commit();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete the book with ID: " + id, e);
        }
    }

    public List<Book> findBooksByCategory(Long categoryId) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("FROM Book b WHERE b.category.id = :categoryId", Book.class)
                          .setParameter("categoryId", categoryId)
                          .list();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<BookCategory> findAllCategories() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("FROM BookCategory", BookCategory.class)
                          .list();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void updateBookStock(Long bookId, int quantity) throws Exception {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            Book book = session.get(Book.class, bookId);
            if (book != null && book.getStock() >= quantity) {
                book.setStock(book.getStock() - quantity);
                session.update(book);
            } else {
                throw new Exception("Insufficient stock or book not found.");
            }
            session.getTransaction().commit();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update book stock: " + e.getMessage(), e);
        }
    }
    

}
