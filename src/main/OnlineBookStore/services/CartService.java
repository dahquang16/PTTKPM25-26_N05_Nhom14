package com.onlinebookstore.OnlineBookStore.services;

import com.onlinebookstore.OnlineBookStore.dao.CartDao;
import com.onlinebookstore.OnlineBookStore.dao.BookDao;
import com.onlinebookstore.OnlineBookStore.dao.userDao;
import com.onlinebookstore.OnlineBookStore.models.CartBook;
import com.onlinebookstore.OnlineBookStore.models.Order;
import com.onlinebookstore.OnlineBookStore.models.Book;
import com.onlinebookstore.OnlineBookStore.models.Cart;
import com.onlinebookstore.OnlineBookStore.models.User;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartDao cartDao;
    private final BookDao bookDao;
    private final userDao userDao;
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);


    @Autowired
    public CartService(CartDao cartDao, BookDao bookDao, userDao userDao) {
        this.cartDao = cartDao;
        this.bookDao = bookDao;
        this.userDao = userDao;
    }

    @Transactional
    public void addBookToCart(Long userId, Long bookId, int quantity) {
        try {
            User user = userDao.getUserById(userId);
            Book book = bookDao.findById(bookId);
            CartBook cartBook = cartDao.findCartBookById(user.getCart().getCartId(), book.getId());

            if (cartBook == null) {
                cartBook = new CartBook();
                cartBook.setCart(user.getCart());
                cartBook.setBook(book);
                cartBook.setQuantity(quantity);
                cartDao.save(cartBook);
                logger.info("New CartBook added with book ID: " + bookId + " and quantity: " + quantity);
            } else {
                int newQuantity = cartBook.getQuantity() + quantity;
                cartBook.setQuantity(newQuantity);
                cartDao.update(cartBook);
                logger.info("Existing CartBook updated with book ID: " + bookId + " to new quantity: " + newQuantity);
            }
            
        } catch (Exception e) {
            logger.error("Failed to add book to cart", e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public Cart getCurrentCart(Long userId) {
        return cartDao.findByUserId(userId);
    }

    public double calculateTotal(Cart cart) {
        return cart.getCartBooks().stream()
                   .mapToDouble(cartBook -> cartBook.getBook().getPrice() * cartBook.getQuantity())
                   .sum();
    }

    public List<CartBook> getCartBooks(Long userId) {
        User user = userDao.getUserById(userId);
        Long cartId = user.getCart().getCartId();
        
        List<CartBook> cartBooks = cartDao.findAllByCartId(cartId);
        
        return cartBooks;
    }

    @Transactional
    public void removeBookFromCart(Long cartBookId) {
        cartDao.deleteCartBook(cartBookId);
    }
    
//    Process Checkout for a User, Place an Order, and Clear the Cart
    @Transactional
    public void checkout(Long userId) {
        logger.info("Starting checkout process for user ID: {}", userId);
        Cart cart = cartDao.findByUserId(userId);
        if (cart == null) {
            logger.error("No cart found for user ID: {}", userId);
            throw new IllegalStateException("Cart not found for user: " + userId);
        }

        try {
            double total = calculateTotal(cart);
            Order order = new Order();
            order.setUser(cart.getUser());
            order.setOrderDate(new java.util.Date());
            order.setTotalPrice(BigDecimal.valueOf(total));
            order.setStatus("Placed");
            cartDao.saveOrder(order);
            logger.info("Order saved for user ID: {}", userId);

            updateInventoryAndClearCart(cart);

            logger.info("Checkout completed successfully for user ID: {}", userId);
        } catch (Exception e) {
            logger.error("Checkout failed for user ID: {}", userId, e);
            throw new RuntimeException("Checkout process failed", e);
        }
    }

    private void updateInventoryAndClearCart(Cart cart) {
        for (CartBook cartBook : new ArrayList<>(cart.getCartBooks())) { 
            Book book = cartBook.getBook();
            int newStock = book.getStock() - cartBook.getQuantity();
            if (newStock < 0) {
                logger.error("Insufficient stock for book ID: {}", book.getId());
                throw new IllegalStateException("Insufficient stock for book: " + book.getId());
            }
            book.setStock(newStock);
            bookDao.updateBook(book);
            logger.info("Inventory updated for book ID: {}", book.getId());
        }
        clearCartItems(cart.getCartId());
        logger.info("Cart cleared for cart ID: {}", cart.getCartId());
    }

    public void clearCartItems(Long cartId) {
        logger.info("Attempting to clear cart items for cart ID: {}", cartId);
        Cart cart = cartDao.findByCartId(cartId);
        if (cart != null && cart.getCartBooks() != null) {
            cart.getCartBooks().clear();
            cartDao.saveOrUpdateCart(cart);
            logger.info("Cart items cleared for cart ID: {}", cartId);
        } else {
            logger.warn("Cart or CartBooks not found for cart ID: {}", cartId);
        }
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUsername(String username) {
        return cartDao.getOrdersByUsername(username);
    }
    
}
