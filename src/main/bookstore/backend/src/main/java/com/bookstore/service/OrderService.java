package com.bookstore.service;

import com.bookstore.dto.OrderDTO;
import com.bookstore.dto.OrderItemDTO;
import com.bookstore.entity.*;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private BookService bookService;
    
    public OrderDTO createOrder(User user, String shippingAddress, String shippingPhone,
                                PaymentMethod paymentMethod, String notes, List<OrderItemDTO> orderItems) {
        
        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Order order = new Order(user, shippingAddress, shippingPhone, totalAmount, paymentMethod);
        order.setNotes(notes);
        order.setStatus(OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);

        for (OrderItemDTO itemDTO : orderItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            
            Book book = new Book();
            book.setId(itemDTO.getBookId());
            orderItem.setBook(book);
            
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemDTO.getPrice());
            
            orderItemRepository.save(orderItem);
            
            // Update book stock
            bookService.updateStock(itemDTO.getBookId(), itemDTO.getQuantity());
        }
        
        return convertToDTO(savedOrder);
    }
    
    public Page<OrderDTO> findOrdersByUser(User user, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return orders.map(this::convertToDTO);
    }
    
    public Page<OrderDTO> findAllOrdersWithFilters(OrderStatus status, LocalDateTime startDate,
                                                   LocalDateTime endDate, Pageable pageable) {
        Page<Order> orders = orderRepository.findOrdersWithFilters(status, startDate, endDate, pageable);
        return orders.map(this::convertToDTO);
    }
    
    public Page<OrderDTO> findAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAllOrdersOrderByCreatedAtDesc(pageable);
        return orders.map(this::convertToDTO);
    }
    
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToDTO(order);
    }
    
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }
    
    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList());
        
        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getUser().getEmail(),
                order.getShippingAddress(),
                order.getShippingPhone(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getNotes(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                orderItemDTOs
        );
    }
    
    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        return new OrderItemDTO(
                orderItem.getId(),
                orderItem.getBook().getId(),
                orderItem.getBook().getTitle(),
                orderItem.getBook().getAuthor(),
                orderItem.getBook().getImageUrl(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getSubtotal()
        );
    }
}


