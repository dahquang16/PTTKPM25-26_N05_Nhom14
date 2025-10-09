package com.onlinebookstore.OnlineBookStore.dao;

import com.onlinebookstore.OnlineBookStore.exceptions.DataAccessException;
import com.onlinebookstore.OnlineBookStore.models.BookCategory;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BookCategoryDao {
    
    @Autowired
    private SessionFactory sessionFactory;
    
    public void saveBookCategory(BookCategory bookCategory) {
        try (Session session = sessionFactory.openSession()) {
            session.saveOrUpdate(bookCategory); // Spring will handle the transaction
        } catch (Exception e) {
            e.printStackTrace();
            throw new DataAccessException("Failed to save book category", e);
        }
    }

    public List<BookCategory> findAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("FROM BookCategory", BookCategory.class).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            throw new DataAccessException("Failed to retrieve all book categories", e);
        }
    }

    public BookCategory findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(BookCategory.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            throw new DataAccessException("Failed to retrieve book category by ID", e);
        }
    }

    public void deleteBookCategory(Long id) {
        try (Session session = sessionFactory.openSession()) {
            BookCategory bookCategory = session.get(BookCategory.class, id);
            if (bookCategory != null) {
                session.beginTransaction();
                session.delete(bookCategory);
                session.getTransaction().commit();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new DataAccessException("Failed to delete book category", e);
        }
    }

    public void updateBookCategory(BookCategory bookCategory) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.update(bookCategory);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            throw new DataAccessException("Failed to update book category", e);
        }
    }
}
