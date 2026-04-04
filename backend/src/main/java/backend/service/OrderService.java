package backend.service;

import backend.dto.response.OrderResponse;
import backend.entity.Book;
import backend.entity.Order;
import backend.entity.User;
import backend.enums.StatusOrder;
import backend.repository.OrderRepository;
import backend.repository.BookRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookRepository bookRepo;

    public OrderResponse createOrder(Integer userId, Integer bookId, Double price) {

    User user = userRepo.findById(userId.longValue()).orElseThrow();
    Book book = bookRepo.findById(bookId.longValue()).orElseThrow();

    Order order = new Order();
    order.setUser(user);
    order.setBook(book);
    order.setPrice(BigDecimal.valueOf(price));
    order.setStatus(StatusOrder.PENDING);
    order.setCreatedAt(LocalDateTime.now());

    Order saved = orderRepo.save(order);

    // 👉 map sang DTO
    return OrderResponse.builder()
            .orderId(saved.getId())
            .price(saved.getPrice())
            .status(saved.getStatus().name())
            .userId(saved.getUser().getId())
            .bookId(saved.getBook().getId())
            .build();
}

    public void updateStatus(Long orderId, String status) {
    Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    try {
        order.setStatus(StatusOrder.valueOf(status.toLowerCase()));
    } catch (Exception e) {
        throw new RuntimeException("Invalid status: " + status);
    }

    orderRepo.save(order);
}
}
