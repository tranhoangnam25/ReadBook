package backend.controller;

import backend.dto.response.DashboardStatsResponse;
import backend.dto.response.OrderAdminResponse;
import backend.dto.response.OrderStatsResponse;
import backend.enums.StatusOrder;
import backend.repository.OrderRepository;
import backend.repository.UserRepository;
import backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADM')")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        OrderStatsResponse orderStats = orderService.getPaidOrdersStatsForAdmin();
        long newUsers = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(10));
        
        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalRevenue(orderStats.getTotalRevenue())
                .totalOrdersCount(orderStats.getTotalOrdersCount())
                .newUsersCount(newUsers)
                .build();
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-orders")
    @PreAuthorize("hasRole('ADM')")
    public ResponseEntity<List<OrderAdminResponse>> getRecentOrders() {
        List<OrderAdminResponse> recentOrders = orderRepository.findRecentOrders(
                StatusOrder.PAID, 
                LocalDateTime.now().minusDays(7)
        );
        return ResponseEntity.ok(recentOrders);
    }
}
