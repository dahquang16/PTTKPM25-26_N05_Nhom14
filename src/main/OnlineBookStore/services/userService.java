package com.onlinebookstore.OnlineBookStore.services;

import com.onlinebookstore.OnlineBookStore.dao.BookDao;
import com.onlinebookstore.OnlineBookStore.dao.userDao;
import com.onlinebookstore.OnlineBookStore.models.Book;
import com.onlinebookstore.OnlineBookStore.models.User;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class userService {

    @Autowired
    private userDao userDao;
    
    @Autowired
    private BookDao bookDao;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER"); 
        }
        userDao.save(user);
    }

    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Transactional("transactionManager")
    public void saveUserWithRole(User user, String role) {
        validateUserDoesNotExists(user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.saveUser(user, role);
    }

    public boolean checkUserExists(String username) {
        return userDao.userExists(username);
    }

    public User checkLogin(String username, String password) {
        return userDao.getUser(username, password);
    }

    @Transactional("transactionManager")
    public void deleteUser(long id) {
        userDao.deleteUser(id);
    }

    public User getUserById(long id) {
        return userDao.getUserById(id);
    }

    @Transactional("transactionManager")
    public void updateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new RuntimeException("Invalid user details provided");
        }
        User existingUser = userDao.getUserById(user.getId());
        if (existingUser == null) {
            throw new RuntimeException("User not found");
        }

        if (user.getFirstName() != null && !user.getFirstName().isEmpty()) existingUser.setFirstName(user.getFirstName());
        if (user.getLastName() != null && !user.getLastName().isEmpty()) existingUser.setLastName(user.getLastName());
        if (user.getUsername() != null && !user.getUsername().isEmpty()) existingUser.setUsername(user.getUsername());
        if (user.getEmail() != null && !user.getEmail().isEmpty()) existingUser.setEmail(user.getEmail());
        if (user.getAddress() != null && !user.getAddress().isEmpty()) existingUser.setAddress(user.getAddress());
        if (user.getRole() != null && !user.getRole().isEmpty()) existingUser.setRole(user.getRole());

        userDao.updateUser(existingUser);
    }

    private void validateUserDoesNotExists(User user) {
        if (userDao.userExists(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userDao.emailExists(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
    }

    @Transactional(readOnly = true)
    public List<Book> getUserBooksByCategory(Long categoryId) {
        if (categoryId != null && categoryId > 0) {
            return bookDao.findBooksByCategory(categoryId);
        } else {
            return bookDao.findAllWithCategories().stream()
                          .filter(book -> book.getStock() > 0)
                          .collect(Collectors.toList());
        }
    }

    public Long findUserIdByUsername(String username) {
        User user = userDao.findByUsername(username);
        return user != null ? user.getId() : null;
    }

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userDao.findByUsername(username);
    }
}
