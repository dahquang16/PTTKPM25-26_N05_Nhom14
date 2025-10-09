package com.onlinebookstore.OnlineBookStore.controller;


import java.io.File;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.onlinebookstore.OnlineBookStore.models.Book;
import com.onlinebookstore.OnlineBookStore.models.BookCategory;
import com.onlinebookstore.OnlineBookStore.models.User;
import com.onlinebookstore.OnlineBookStore.services.BookCategoryService;
import com.onlinebookstore.OnlineBookStore.services.BookService;
import com.onlinebookstore.OnlineBookStore.services.userService;

@Controller
@RequestMapping("/admin") 
public class AdminController {
	
	@Autowired
    private userService userService;
	@Autowired
    private BookCategoryService bookCategoryService;
	@Autowired
    private BookService bookService;
	
	@GetMapping("/home")
	public String adminHome() {
	    return "adminHome";
	}
	
	@GetMapping("users")
    public String adminUserMangPage(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "adminUserMang";
    }
	
	@GetMapping("/delete-user")
    public String deleteUser(@RequestParam("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }

	@GetMapping("/edit-user")
	public String editUser(@RequestParam("id") long id, Model model) {
	    User user = userService.getUserById(id);
	    if (user != null) {
	        model.addAttribute("user", user);
	        model.addAttribute("mode", "MODE_UPDATE");
	    } else {
	        throw new RuntimeException("User not found");
	    }
	    return "adminUserMang";
	}
	

	@PostMapping("/update-user")
	public String updateUser(@ModelAttribute("user") User user, Model model) {
	    if (user.getId() == null) {
	        model.addAttribute("error", "User ID cannot be null.");
	        return "admin/user-form";
	    }

	    try {
	        userService.updateUser(user);
	    } catch (RuntimeException e) {
	        model.addAttribute("error", "Error updating user: " + e.getMessage());
	        return "admin/user-form";
	    }

	    return "redirect:/admin/users";
	}

    @GetMapping("/book-categories")
    public String listBookCategories(Model model) {
        model.addAttribute("bookCategories", bookCategoryService.listAllCategories());
        return "bookCategories";
    }

    // Add a New Book Category
    @PostMapping("/addBookCategory")
    public String addBookCategory(BookCategory bookCategory) {
        bookCategoryService.saveBookCategory(bookCategory);
        return "redirect:/admin/book-categories";
    }

    // Delete a Book Category    
    @PostMapping("/deleteBookCategory")
    public String deleteBookCategory(@RequestParam Long id) {
        bookCategoryService.deleteCategory(id);
        return "redirect:/admin/book-categories";
    }

    // Edit Book Category Form
    @GetMapping("/editBookCategory/{id}")
    public String editBookCategoryForm(@PathVariable Long id, Model model) {
        BookCategory bookCategory = bookCategoryService.getCategoryById(id);
        model.addAttribute("bookCategory", bookCategory);
        return "redirect:/admin/book-categories"; // Assuming you have a separate JSP for editing a category
    }

    //  Update Book Category Details
    @PostMapping("/updateBookCategory")
    public String updateBookCategory(@RequestParam("id") Long id, @RequestParam("name") String name) {
        BookCategory category = bookCategoryService.getCategoryById(id);
        if (category != null) {
            category.setName(name);
            bookCategoryService.updateCategory(category);
        }
        return "redirect:/admin/book-categories";
    }
  
    @GetMapping("/manageBooks")
    public String showManageBooks(@RequestParam(value = "category_id", required = false) Long categoryId, Model model) {
        List<Book> books = (categoryId != null && categoryId > 0) ? bookService.findBooksByCategoryId(categoryId) : bookService.getAllBooks();
        List<BookCategory> categories = bookCategoryService.listAllCategories();
        model.addAttribute("books", books);
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategoryId", categoryId);
        return "manageBooks";
    }
 
 // Form to Edit Book Details
    @GetMapping("/editBook/{id}")
    public String editBookForm(@PathVariable Long id, Model model) {
        Book book = bookService.getBookById(id);
        List<BookCategory> categories = bookCategoryService.listAllCategories();  // Fetch categories
        if (book == null) {
            return "redirect:/admin/manageBooks";
        }
        model.addAttribute("book", book);
        model.addAttribute("categories", categories);  // Add categories to model
        return "updateBook";
    }
    
//  Form to Add New Book
    @GetMapping("/addBookForm")
    public String addBookForm(Model model) {
        List<BookCategory> categories = bookCategoryService.listAllCategories();  // Fetch categories
        model.addAttribute("categories", categories); 
        model.addAttribute("book", new Book());
        return "addBook";
    }
//    Add New Book with Image Upload
    @PostMapping("/addBook")
    public String addBook(@ModelAttribute("book") Book book, 
                          @RequestParam("category_id") Long categoryId,
                          @RequestParam(value = "imageUrl", required = false) String imageUrl,
                          @RequestParam("imageFile") MultipartFile imageFile,
                          HttpServletRequest request,
                          RedirectAttributes redirectAttributes) {

        if (categoryId != null) {
            BookCategory category = bookCategoryService.getCategoryById(categoryId);
            if (category != null) {
                book.setCategory(category);
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Invalid book category.");
                return "redirect:/admin/addBookForm";
            }
        }

        if (!imageFile.isEmpty()) {
            String imagePath = saveFile(imageFile, request);
            if (imagePath != null) {
                book.setImage(imagePath);
            }
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            book.setImage(imageUrl);
        }

        bookService.addBook(book);
        redirectAttributes.addFlashAttribute("successMessage", "Book added successfully!");
        return "redirect:/admin/manageBooks";
    }

    @PostMapping("/updateBook/{id}")
    public String updateBook(@PathVariable Long id, 
            @ModelAttribute("book") Book updatedBook, 
            @RequestParam("category_id") Long categoryId,
            @RequestParam(value = "imageUrl", required = false) String imageUrl, // Capture the image URL from the form
            BindingResult result, 
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile,
            HttpServletRequest request) {
        
        if (result.hasErrors()) {
            return "updateBook";
        }

        Book existingBook = bookService.getBookById(id);
        if (existingBook == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Book not found!");
            return "redirect:/admin/manageBooks";
        }

        if (!updatedBook.getTitle().isEmpty()) {
            existingBook.setTitle(updatedBook.getTitle());
        }
        if (!updatedBook.getAuthor().isEmpty()) {
            existingBook.setAuthor(updatedBook.getAuthor());
        }
        if (updatedBook.getPrice() != null) {
            existingBook.setPrice(updatedBook.getPrice());
        }
        if (updatedBook.getStock() != null) {
            existingBook.setStock(updatedBook.getStock());
        }
        if (!updatedBook.getDescription().isEmpty()) {
            existingBook.setDescription(updatedBook.getDescription());
        }

        if (categoryId != null) {
            BookCategory category = bookCategoryService.getCategoryById(categoryId);
            if (category != null) {
                existingBook.setCategory(category);
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Selected category does not exist.");
                return "redirect:/admin/manageBooks";
            }
        }
        if (!imageFile.isEmpty()) {
            String imagePath = saveFile(imageFile, request);
            if (imagePath != null) {
                existingBook.setImage(imagePath);
            } else {
            }
        } else if (imageUrl != null && !imageUrl.isEmpty()) {
            existingBook.setImage(imageUrl); // Set image URL if no file is uploaded
        } else {
        }

        bookService.updateBook(existingBook);
        redirectAttributes.addFlashAttribute("successMessage", "Book updated successfully!");
        return "redirect:/admin/manageBooks";
    }

    private String saveFile(MultipartFile file, HttpServletRequest request) {
        String uploadsDir = "/uploads/";
        String realPathtoUploads = request.getServletContext().getRealPath(uploadsDir);
        if (!new File(realPathtoUploads).exists()) {
            new File(realPathtoUploads).mkdir();
        }

        String orgName = file.getOriginalFilename();
        String filePath = realPathtoUploads + orgName;
        File dest = new File(filePath);
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            return null;
        }

        String savedPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + uploadsDir + orgName;
        return savedPath;
    }
    
    @PostMapping("/deleteBook")
    public String deleteBook(@RequestParam("id") Long id, RedirectAttributes redirectAttributes) {
        try {
            bookService.deleteBook(id);
            redirectAttributes.addFlashAttribute("successMessage", "Book deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting book: " + e.getMessage());
        }
        return "redirect:/admin/manageBooks";
    }

}
