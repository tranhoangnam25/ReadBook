package backend.service;

import backend.dto.response.OrderAdminResponse;
import backend.dto.response.OrderResponse;
import backend.dto.response.OrderStatsResponse;
import backend.entity.Book;
import backend.entity.Order;
import backend.entity.User;
import backend.enums.StatusOrder;
import backend.repository.OrderRepository;
import backend.repository.BookRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.*;
import backend.dto.response.OrderExportResponse;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
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
    public boolean checkPurchased(Long userId, Long bookId) {
        return orderRepo.existsByUser_IdAndBook_IdAndStatus(
                userId,
                bookId,
                backend.enums.StatusOrder.PAID
        );
    }
    public Page<OrderAdminResponse> getPaidOrdersForAdmin(String keyword, int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepo.findAdminOrdersByStatus(StatusOrder.PAID, keyword, pageable);
    }

    public OrderStatsResponse getPaidOrdersStatsForAdmin() {
        return orderRepo.getAdminStatsByStatus(StatusOrder.PAID);
    }

    public OrderAdminResponse getOrderDetailsForAdmin(Long orderId) {
        return orderRepo.findAdminOrderDetailsById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng mã số: " + orderId));
    }
    public ByteArrayInputStream exportOrders() {

    List<OrderExportResponse> orders =
            orderRepo.exportOrders();

    try (
            Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream out =
                    new ByteArrayOutputStream()
    ) {

        

        Sheet sheet =
                workbook.createSheet("Orders");

        

        Font headerFont =
                workbook.createFont();

        headerFont.setBold(true);

        CellStyle headerStyle =
                workbook.createCellStyle();

        headerStyle.setFont(headerFont);

       

        Row headerRow =
                sheet.createRow(0);

        String[] columns = {
                "Mã đơn",
                "Khách hàng",
                "Email",
                "Tên sách",
                "Số tiền",
                "Trạng thái",
                "Phương thức",
                "Ngày tạo"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell =
                    headerRow.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);
        }

        

        int rowIdx = 1;

        for (OrderExportResponse order : orders) {

            Row row =
                    sheet.createRow(rowIdx++);

            
            row.createCell(0)
                    .setCellValue(
                            order.getOrderId()
                    );

           
            row.createCell(1)
                    .setCellValue(
                            order.getCustomerName()
                    );

            
            row.createCell(2)
                    .setCellValue(
                            order.getCustomerEmail()
                    );

            
            row.createCell(3)
                    .setCellValue(
                            order.getBookTitle()
                    );

           
            row.createCell(4)
                    .setCellValue(
                            order.getAmount().doubleValue()
                    );

            
            row.createCell(5)
                    .setCellValue(
                            order.getStatus()
                    );

            
            
            row.createCell(7)
                    .setCellValue(
                            order.getCreatedAt().toString()
                    );
        }

        

        for (int i = 0; i < columns.length; i++) {

            sheet.autoSizeColumn(i);
        }

        

        workbook.write(out);

        return new ByteArrayInputStream(
                out.toByteArray()
        );

    } catch (Exception e) {

        throw new RuntimeException(
                "Export excel failed",
                e
        );
    }
}
}
