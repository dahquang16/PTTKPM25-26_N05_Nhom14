package com.onlinebookstore.OnlineBookStore.dao;

import com.onlinebookstore.OnlineBookStore.exceptions.DataAccessException;
import com.onlinebookstore.OnlineBookStore.models.Cart;
import com.onlinebookstore.OnlineBookStore.models.CartBook;
import com.onlinebookstore.OnlineBookStore.models.Order;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class CartDao {

    private final SessionFactory sessionFactory;
    
    private static final Logger logger = LoggerFactory.getLogger(CartDao.class);


    @Autowired
    public CartDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public CartBook findCartBookById(Long cartId, Long bookId) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT cb FROM CartBook cb WHERE cb.cart.id = :cartId AND cb.book.id = :bookId", CartBook.class)
                          .setParameter("cartId", cartId)
                          .setParameter("bookId", bookId)
                          .uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void save(CartBook cartBook) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(cartBook);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            throw new RuntimeException("Failed to save CartBook", e);
        }
    }

    public void update(CartBook cartBook) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.update(cartBook);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            throw new RuntimeException("Failed to update CartBook", e);
        }
    }

    public List<CartBook> findAllByCartId(Long cartId) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT cb FROM CartBook cb WHERE cb.cart.id = :cartId", CartBook.class)
                          .setParameter("cartId", cartId)
                          .list();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    public void flush() {
        try (Session session = sessionFactory.openSession()) {
            session.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void saveOrUpdateCartBook(CartBook cartBook) {
        try (Session session = sessionFactory.getCurrentSession()) {
            session.saveOrUpdate(cartBook);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save or update CartBook", e);
        }
    }

    public Cart findByUserId(Long id) {
        try (Session session = sessionFactory.openSession()) {
            Query<Cart> query = session.createQuery("FROM Cart c WHERE c.user.id = :id", Cart.class);
            query.setParameter("id", id);
            return query.uniqueResult();
        } catch (Exception e) {
            return null;
        }
    }

    public List<CartBook> findCartBooksByCartId(Long cartId) {
        try (Session session = sessionFactory.openSession()) {
            Query<CartBook> query = session.createQuery("FROM CartBook cb WHERE cb.cart.cartId = :cartId", CartBook.class);
            query.setParameter("cartId", cartId);
            return query.list();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public void deleteCartBook(Long cartBookId) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            CartBook cartBook = session.get(CartBook.class, cartBookId);
            if (cartBook != null) {
                transaction = session.beginTransaction();
                session.delete(cartBook);
                transaction.commit();
            }
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            throw new DataAccessException("Failed to delete cart book", e);
        }
    }
    
//    Save an Order to the Database
    public void saveOrder(Order order) {
        Transaction transaction = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            transaction = session.beginTransaction();
            session.save(order);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw new RuntimeException("Failed to save order", e);
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void saveOrUpdateCart(Cart cart) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.saveOrUpdate(cart);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw new RuntimeException("Failed to save or update cart", e);
        }
    }

    public void clearCartItems(Long cartId) {
        Transaction transaction = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            transaction = session.beginTransaction();
            Cart cart = session.get(Cart.class, cartId);

            if (cart != null) {
                logger.info("Cart found with ID: " + cartId + ", attempting to clear items.");
                Query<Void> deleteQuery = session.createQuery("DELETE FROM CartBook cb WHERE cb.cart.id = :cartId", Void.class); // Specified Void as the generic type
                int deletedCount = deleteQuery.setParameter("cartId", cartId).executeUpdate();
                logger.info("Number of CartBooks deleted: " + deletedCount);
                session.flush();  // Ensuring all changes up to this point are persisted
                session.saveOrUpdate(cart);
                logger.info("Cart updated after clearing CartBooks.");
            }
            transaction.commit();
            logger.info("Transaction committed successfully.");
        } catch (Exception e) {
            logger.error("Error clearing cart items", e);
            if (transaction != null) {
                transaction.rollback();
                logger.info("Transaction rolled back due to errors.");
            }
            throw new RuntimeException("Failed to clear cart items", e);
        } finally {
            if (session != null) {
                session.close();
                logger.info("Session closed.");
            }
        }
    }

    public Cart findByCartId(Long cartId) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            return session.get(Cart.class, cartId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<Order> getOrdersByUsername(String username) {
        try (Session session = sessionFactory.openSession()) {
            Query<Order> query = session.createQuery("FROM Order o WHERE o.user.username = :username", Order.class);
            query.setParameter("username", username);
            return query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}
