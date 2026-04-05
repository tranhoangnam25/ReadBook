package backend.controller;

import backend.dto.response.OrderResponse;
import backend.entity.Order;
import backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public OrderResponse create(
            @RequestParam Integer userId,
            @RequestParam Integer bookId,
            @RequestParam Double price
    ) {
        return orderService.createOrder(userId, bookId, price);
    }
    @PutMapping("/{orderId}")
public String updateStatus(
        @PathVariable Long orderId,
        @RequestParam String status
) {
    orderService.updateStatus(orderId, status);
    return "Update success";
}
}
// POST http://localhost:8080/api/orders?userId=1&bookId=1&price=100
// PUT http://localhost:8080/api/orders/{orderId}?status=paid update status