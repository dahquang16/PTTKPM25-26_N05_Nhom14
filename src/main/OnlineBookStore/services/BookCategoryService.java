package com.onlinebookstore.OnlineBookStore.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.onlinebookstore.OnlineBookStore.models.BookCategory;
import com.onlinebookstore.OnlineBookStore.dao.BookCategoryDao;

@Service
public class BookCategoryService {
    @Autowired
    private BookCategoryDao bookCategoryDao;

    @Transactional
    public void saveBookCategory(BookCategory bookCategory) {
        bookCategoryDao.saveBookCategory(bookCategory);
    }

    @Transactional(readOnly = true)
    public List<BookCategory> listAllCategories() {
        return bookCategoryDao.findAll();
    }

    @Transactional(readOnly = true)
    public BookCategory getCategoryById(Long id) {
        return bookCategoryDao.findById(id);
    }

    @Transactional
    public void deleteCategory(Long id) {
        bookCategoryDao.deleteBookCategory(id);
    }

    @Transactional
    public void updateCategory(BookCategory bookCategory) {
        bookCategoryDao.updateBookCategory(bookCategory);
    }
}
