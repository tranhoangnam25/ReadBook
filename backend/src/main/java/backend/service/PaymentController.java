package backend.controller;

import backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // =====================================================
    // 🔥 1. CREATE PAYOS PAYMENT (REAL)
    // =====================================================
    @PostMapping("/create-payos")
    public Map<String, Object> createPayOS(@RequestParam Long orderId) {
        return paymentService.createPayOSPayment(orderId);
    }

    // =====================================================
    // 🔥 2. WEBHOOK PAYOS (AUTO UPDATE)
    // =====================================================
    @PostMapping("/payos/webhook")
    public String webhook(@RequestBody Map<String, Object> body) {
         System.out.println("🔥 WEBHOOK RECEIVED: " + body);
        return paymentService.handlePayOSWebhook(body);
    }

    // =====================================================
    // 🔥 3. VIETQR (GIỮ LẠI ĐỂ TEST / DEMO)
    // =====================================================
    //@PostMapping("/create-vietqr")
    //public Map<String, Object> createQR(@RequestParam Long orderId) {
     //   return paymentService.createVietQR(orderId);
    //}

    // =====================================================
    // 🔥 4. CHECK STATUS (DÙNG CHUNG)
    // =====================================================
    @GetMapping("/status")
    public Map<String, Object> status(@RequestParam Long orderId) {
        return paymentService.getPaymentStatus(orderId);
    }

    // =====================================================
    // ❌ 5. VNPay (BẠN CÓ THỂ XÓA NẾU KHÔNG DÙNG)
    // =====================================================
    //@GetMapping("/vnpay-return")
    //public String paymentReturn(@RequestParam Map<String, String> params) {
     //   return paymentService.handlePaymentReturn(params);
    //}
}