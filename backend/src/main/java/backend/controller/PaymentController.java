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

    
    
    
    @PostMapping("/create-payos")
    public Map<String, Object> createPayOS(@RequestParam Long orderId) {
        return paymentService.createPayOSPayment(orderId);
    }

    
    
    
    @PostMapping("/payos/webhook")
    public String webhook(@RequestBody Map<String, Object> body) {
         System.out.println("🔥 WEBHOOK RECEIVED: " + body);
        return paymentService.handlePayOSWebhook(body);
    }

    
    
    
    
    
     
    

    
    
    
    @GetMapping("/status")
    public Map<String, Object> status(@RequestParam Long orderId) {
        return paymentService.getPaymentStatus(orderId);
    }

    
    
    
    
    
     
    
}