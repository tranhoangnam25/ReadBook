package backend.service;

import backend.dto.request.SaleRequest;
import backend.entity.Sale;
import backend.entity.SaleBook;
import backend.repository.SaleBookRepository;
import backend.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;


@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepo;

    @Autowired
    private SaleBookRepository saleBookRepo;
    @PersistenceContext
    private EntityManager entityManager;

    // Đổi tên thành createSale để trùng khớp với SaleController
    @Transactional
    public Sale createSale(SaleRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu không thể sau ngày kết thúc.");
        }

        Sale sale = new Sale();
        sale.setTitle(request.getTitle());
        sale.setDescription(request.getDescription());
        sale.setDiscountPercentage(request.getDiscountPercentage());
        sale.setStartDate(request.getStartDate());
        sale.setEndDate(request.getEndDate());
        sale.setStatus("active");

        Sale savedSale = saleRepo.save(sale);

        if (request.getBookIds() != null) {
            for (Long bookId : request.getBookIds()) {
                SaleBook saleBook = new SaleBook();
                saleBook.setSaleId(savedSale.getId());
                saleBook.setBookId(bookId);
                saleBookRepo.save(saleBook);
            }
        }
        return savedSale;
    }

    
    // Đổi tên thành getCurrentDiscount để khớp với OrderService và SaleController
    public Integer getCurrentDiscount(Long bookId) {
        return saleRepo.findCurrentDiscountByBookId(bookId, LocalDateTime.now()).orElse(0);
    }
    // 1. Hàm lấy danh sách đợt Sale phân trang + tìm kiếm theo Title cho Admin
    public Page<Sale> getSalesPageForAdmin(String keyword, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Nếu có keyword thì tìm theo title, nếu không thì lấy tất cả
        if (keyword != null && !keyword.trim().isEmpty()) {
            return saleRepo.findByTitleContainingIgnoreCase(keyword, pageable);
        }
        
        return saleRepo.findAll(pageable);
    }

    // 2. Các hàm đếm số lượng phục vụ widget thống kê
    public long countTotalSales() {
        return saleRepo.count();
    }

    public long countActiveSales() {
        LocalDateTime now = LocalDateTime.now();
        return saleRepo.countByStartDateBeforeAndEndDateAfter(now, now); 
    }

    public long countUpcomingSales() {
        LocalDateTime now = LocalDateTime.now();
        return saleRepo.countByStartDateAfter(now);
    }
    
    // 5. Logic chỉnh sửa đợt Sale
    @Transactional
public Sale updateSale(Long id, SaleRequest saleRequest) {
    // 1. Tìm và cập nhật các thông tin cơ bản của chiến dịch Sale
    Sale existingSale = saleRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt sale với ID: " + id));

    existingSale.setTitle(saleRequest.getTitle());
    existingSale.setDiscountPercentage(saleRequest.getDiscountPercentage());
    existingSale.setStartDate(saleRequest.getStartDate());
    existingSale.setEndDate(saleRequest.getEndDate());
    existingSale.setDescription(saleRequest.getDescription()); // Đồng bộ trường description từ form

    // Lưu thông tin bảng Sales trước
    Sale savedSale = saleRepo.save(existingSale);

    // 2. CẬP NHẬT BẢNG TRUNG GIAN THỦ CÔNG QUA SQL NATIVE
    // Bước A: Xóa sạch các liên kết cũ của sale_id này trong bảng Sale_Books
    saleRepo.deleteBookLinksBySaleId(id);

    // Bước B: Thêm mới các liên kết dựa trên mảng bookIds gửi từ Frontend lên
    if (saleRequest.getBookIds() != null && !saleRequest.getBookIds().isEmpty()) {
        for (Long bookId : saleRequest.getBookIds()) {
            saleRepo.insertBookLink(id, bookId);
        }
    }

    return savedSale;
}

    // ==========================================
    // THÊM MỚI: Logic xóa đợt Sale
    // ==========================================
    @Transactional
    public void deleteSale(Long id) {
        // Kiểm tra xem ID có tồn tại không trước khi xóa
        if (!saleRepo.existsById(id)) {
            throw new RuntimeException("Không tìm thấy đợt sale với ID: " + id);
        }
        
        // Tiến hành xóa cứng khỏi database
        saleRepo.deleteById(id);
    }
    public List<Map<String, Object>> getBooksBySaleId(Long saleId) {
        String sql = "SELECT b.book_id AS id, b.title AS title " +
                     "FROM books b " +
                     "JOIN sale_books sb ON b.book_id = sb.book_id " +
                     "WHERE sb.sale_id = :saleId";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("saleId", saleId);
        
        List<Object[]> results = query.getResultList();
        List<Map<String, Object>> bookList = new ArrayList<>();
        
        for (Object[] row : results) {
            Map<String, Object> bookMap = new HashMap<>();
            // Row[0] là book_id, Row[1] là title sách
            bookMap.put("id", row[0]);
            bookMap.put("title", row[1]);
            bookList.add(bookMap);
        }
        
        return bookList;
    }
    
}