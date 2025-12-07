package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.VoucherUsageDTO;
import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.model.VoucherUsage;
import vn.student.polyshoes.service.VoucherService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vouchers")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    // Lấy tất cả voucher
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(vouchers);
    }

    // Lấy voucher theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable Long id) {
        Optional<Voucher> voucher = voucherService.getVoucherById(id);
        return voucher.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Tạo voucher mới
    @PostMapping
    public ResponseEntity<Voucher> createVoucher(@RequestBody Voucher voucher) {
        Voucher createdVoucher = voucherService.createVoucher(voucher);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVoucher);
    }

    // Cập nhật voucher
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucher) {
        Voucher updatedVoucher = voucherService.updateVoucher(id, voucher);
        return ResponseEntity.ok(updatedVoucher);
    }

    // Xóa voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.noContent().build();
    }

    // Get voucher status (dynamic computation)
    @GetMapping("/{id}/status")
    public ResponseEntity<String> getVoucherStatus(@PathVariable Long id) {
        Optional<Voucher> voucherOpt = voucherService.getVoucherById(id);
        if (voucherOpt.isPresent()) {
            String status = voucherOpt.get().getVoucherStatus();
            return ResponseEntity.ok(status);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy lịch sử sử dụng voucher của customer (admin only)
    @GetMapping("/history/customer/{customerId}")
    public ResponseEntity<List<VoucherUsage>> getCustomerVoucherHistory(@PathVariable Long customerId) {
        List<VoucherUsage> history = voucherService.getCustomerVoucherHistory(customerId);
        return ResponseEntity.ok(history);
    }

    // Lấy thống kê sử dụng voucher (admin only)
    @GetMapping("/{id}/usage-history")
    public ResponseEntity<List<VoucherUsage>> getVoucherUsageHistory(@PathVariable Long id) {
        List<VoucherUsage> history = voucherService.getVoucherUsageHistory(id);
        return ResponseEntity.ok(history);
    }

    // Kiểm tra lịch sử sử dụng voucher của khách hàng
    @GetMapping("/usage-history")
    public ResponseEntity<?> checkVoucherUsageHistory(
            @RequestParam String voucherCode,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String customerEmail,
            @RequestParam(required = false) String customerPhone) {
        try {
            boolean hasUsed = voucherService.checkVoucherUsageHistoryByIdentifier(
                    voucherCode, customerId, customerEmail, customerPhone);
            return ResponseEntity.ok().body(Map.of("hasUsed", hasUsed));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Lấy thống kê chi tiết sử dụng voucher
    @GetMapping("/{voucherId}/usage-stats")
    public ResponseEntity<?> getVoucherUsageStats(@PathVariable Long voucherId) {
        try {
            Optional<Voucher> voucherOpt = voucherService.getVoucherById(voucherId);
            if (voucherOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<VoucherUsageDTO> usageHistory = voucherService.getVoucherUsageHistoryDTO(voucherId);
            
            return ResponseEntity.ok(usageHistory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
