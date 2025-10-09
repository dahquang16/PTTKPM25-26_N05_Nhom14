package com.onlinebookstore.OnlineBookStore.controller;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.onlinebookstore.OnlineBookStore.models.User;
import com.onlinebookstore.OnlineBookStore.models.Book;
import com.onlinebookstore.OnlineBookStore.models.BookCategory;
import com.onlinebookstore.OnlineBookStore.models.Cart;
import com.onlinebookstore.OnlineBookStore.models.Order;
import com.onlinebookstore.OnlineBookStore.services.BookCategoryService;
import com.onlinebookstore.OnlineBookStore.services.BookService;
import com.onlinebookstore.OnlineBookStore.services.CartService;
import com.onlinebookstore.OnlineBookStore.services.userService;

import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private userService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private BookCategoryService bookCategoryService;

    @Autowired
    private CartService cartService;

    @GetMapping("/registration")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "registration";
    }

    @PostMapping("/registration")
    public String registerUser(@ModelAttribute("user") @Valid User user,
                               BindingResult result,
                               RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "registration";
        }
        try {
            user.setRole("USER");
            userService.saveUser(user);
            redirectAttributes.addFlashAttribute("successMessage", "Đăng ký thành công! Mời đăng nhập.");
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Tên đăng nhập hoặc email đã tồn tại!");
            return "redirect:/user/registration";
        }
    }

    @GetMapping("/profile")
    public String showUserProfile(Model model, HttpSession session) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return "redirect:/login";
        }
        User user = userService.findByUsername(sessionUser.getUsername());
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "userProfile";
    }

    @PostMapping("/updateProfile")
    public String updateUser(@ModelAttribute("user") User formUser, HttpSession session, Model model) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return "redirect:/login";
        }
        formUser.setId(sessionUser.getId());
        try {
            userService.updateUser(formUser);
            session.setAttribute("user", userService.getUserById(sessionUser.getId()));
            model.addAttribute("message", "Profile updated successfully!");
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "userProfile";
        }
        return "redirect:/user/profile";
    }

    @GetMapping("/home")
    public String userHome(HttpSession session, Model model,
                           @RequestParam(value = "category_id", required = false) Long categoryId) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            List<Book> books = (categoryId != null && categoryId > 0)
                    ? bookService.findBooksByCategoryId(categoryId)
                    : bookService.getAllBooks();
            List<BookCategory> categories = bookCategoryService.listAllCategories();
            model.addAttribute("books", books);
            model.addAttribute("categories", categories);
            model.addAttribute("selectedCategoryId", categoryId);
            return "userHome";
        }
        return "redirect:/login";
    }

    @PostMapping("/addToCart/{bookId}")
    public String addToCart(HttpSession session,
                            @PathVariable Long bookId,
                            RedirectAttributes redirectAttributes) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            try {
                cartService.addBookToCart(user.getId(), bookId, 1);
                redirectAttributes.addFlashAttribute("successMessage", "Book added to cart successfully!");
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("errorMessage", "There was a problem adding the book to the cart.");
            }
            return "redirect:/user/home";
        }
        return "redirect:/login";
    }

    @GetMapping("/cart")
    public String showCart(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/login";
        }
        Cart cart = cartService.getCurrentCart(user.getId());
        if (cart == null) {
            return "redirect:/error";
        }
        model.addAttribute("cart", cart);
        model.addAttribute("cartTotalCost", cartService.calculateTotal(cart));
        return "Cart";
    }

    @PostMapping("/removeBookFromCart")
    public String removeBookFromCart(@RequestParam("cartBookId") Long cartBookId,
                                     RedirectAttributes redirectAttributes) {
        try {
            cartService.removeBookFromCart(cartBookId);
            redirectAttributes.addFlashAttribute("successMessage", "Book removed from cart successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to remove book from cart.");
        }
        return "redirect:/user/cart";
    }

    @PostMapping("/checkout")
    public String checkout(HttpSession session, RedirectAttributes redirectAttributes) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/login";
        }
        try {
            cartService.checkout(user.getId());
            redirectAttributes.addFlashAttribute("successMessage", "Order placed successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to place order: " + e.getMessage());
        }
        return "redirect:/user/cart";
    }

    @GetMapping("/orders")
    public String showUserOrders(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/login";
        }
        List<Order> userOrders = cartService.getOrdersByUsername(user.getUsername());
        model.addAttribute("userOrders", userOrders);
        return "MyOrders";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
