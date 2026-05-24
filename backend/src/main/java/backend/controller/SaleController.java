package backend.controller;

import backend.dto.request.SaleRequest;
import backend.entity.Sale;
import backend.service.SaleService;
import backend.repository.SaleRepository;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;
    private SaleRepository saleRepository;

    // 1. Endpoint lấy danh sách đợt Sale phân trang + tìm kiếm cho Admin
    @GetMapping("/admin")
    public ResponseEntity<?> getSalesForAdmin(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // SỬA TẠI ĐÂY: Gọi qua saleService thay vì saleRepository
            Page<Sale> salesPage = saleService.getSalesPageForAdmin(keyword, status, page, size);
            return ResponseEntity.ok(salesPage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải danh sách: " + e.getMessage());
        }
    }

    // 2. Endpoint lấy số liệu thống kê chân trang cho Admin
    @GetMapping("/admin/stats")
public ResponseEntity<?> getSaleStats() {
    try {
        Map<String, Object> stats = new HashMap<>();
        
        // SỬA TẠI ĐÂY: Gọi qua saleService thay vì saleRepository
        stats.put("totalSales", saleService.countTotalSales());
        stats.put("activeSales", saleService.countActiveSales());
        stats.put("upcomingSales", saleService.countUpcomingSales());
        
        return ResponseEntity.ok(stats);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Lỗi tải thống kê: " + e.getMessage());
    }
}

    // Endpoint dành cho Admin khởi tạo sự kiện Flash Sale mới
    @PostMapping("/admin/create")
    public ResponseEntity<?> createSaleCampaign(@RequestBody SaleRequest saleRequest) {
        try {
            Sale createdSale = saleService.createSale(saleRequest);
            return ResponseEntity.ok(createdSale);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tạo chiến dịch Flash Sale: " + e.getMessage());
        }
    }

    // Endpoint kiểm tra nhanh một sách cụ thể xem hiện tại giảm giá bao nhiêu %
    @GetMapping("/check-discount/{bookId}")
    public ResponseEntity<Integer> checkDiscount(@PathVariable Long bookId) {
        Integer discount = saleService.getCurrentDiscount(bookId);
        return ResponseEntity.ok(discount);
    }
    // 5. API Chỉnh sửa đợt Sale (Update)
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updateSaleCampaign(
            @PathVariable Long id, 
            @RequestBody SaleRequest saleRequest) {
        try {
            Sale updatedSale = saleService.updateSale(id, saleRequest);
            return ResponseEntity.ok(updatedSale);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi chỉnh sửa chiến dịch Flash Sale: " + e.getMessage());
        }
    }

    // 6. API Xóa đợt Sale (Delete)
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteSaleCampaign(@PathVariable Long id) {
        try {
            saleService.deleteSale(id);
            return ResponseEntity.ok("Xóa chiến dịch Flash Sale thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xóa chiến dịch Flash Sale: " + e.getMessage());
        }
    }
    @GetMapping("/admin/{saleId}/books")
    public ResponseEntity<?> getBooksBySaleId(@PathVariable Long saleId) {
        try {
            // Bạn cần triển khai hàm getBooksBySaleId(saleId) này trong SaleService của bạn
            // Hàm này thực hiện câu Query Jpa hoặc Native SQL kết hợp bảng sale_book (image_daf129.png) và bảng book để lấy thông tin sách
            List<?> books = saleService.getBooksBySaleId(saleId); 
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải danh sách sách của đợt sale: " + e.getMessage());
        }
    }

}