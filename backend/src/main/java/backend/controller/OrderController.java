package backend.controller;

import backend.dto.response.OrderAdminResponse;
import backend.dto.response.OrderResponse;
import backend.dto.response.OrderStatsResponse;
import backend.entity.Order;
import backend.service.OrderService;

import java.io.ByteArrayInputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

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

    @GetMapping("/check")
    public boolean checkPurchased(
            @RequestParam Long userId,
            @RequestParam Long bookId
    ) {
        return orderService.checkPurchased(userId, bookId);
    }

    
    @GetMapping("/admin")
    @CrossOrigin(origins = "http://localhost:3000") 
    public ResponseEntity<Page<OrderAdminResponse>> getAdminOrders(
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        Page<OrderAdminResponse> data = orderService.getPaidOrdersForAdmin(keyword, page, size);
        return ResponseEntity.ok(data);
    }

    
    @GetMapping("/admin/stats")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<OrderStatsResponse> getAdminStats() {
        OrderStatsResponse stats = orderService.getPaidOrdersStatsForAdmin();
        return ResponseEntity.ok(stats);
    }

    
    @GetMapping("/admin/{orderId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<OrderAdminResponse> getAdminOrderDetail(@PathVariable Long orderId) {
        OrderAdminResponse order = orderService.getOrderDetailsForAdmin(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/export")
public ResponseEntity<InputStreamResource> exportOrders() {

    String filename = "orders.xlsx";

    ByteArrayInputStream stream =
            orderService.exportOrders();

    InputStreamResource file =
            new InputStreamResource(stream);

    return ResponseEntity.ok()
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=" + filename
            )
            .contentType(
                    MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    )
            )
            .body(file);
}
}

