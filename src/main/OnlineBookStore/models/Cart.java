package com.onlinebookstore.OnlineBookStore.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "cart", fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    private Set<CartBook> cartBooks;

    public Cart() {
        cartBooks = new HashSet<>();
    }

    public Long getCartId() {
		return cartId;
	}

	public void setCartId(Long cartId) {
		this.cartId = cartId;
	}

	public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<CartBook> getCartBooks() {
        return cartBooks;
    }

    public void setCartBooks(Set<CartBook> cartBooks) {
        this.cartBooks = cartBooks;
    }

    public void addCartBook(CartBook cartBook) {
        this.cartBooks.add(cartBook);
        cartBook.setCart(this);
    }

    public void removeCartBook(CartBook cartBook) {
        this.cartBooks.remove(cartBook);
        cartBook.setCart(null);
    }

}