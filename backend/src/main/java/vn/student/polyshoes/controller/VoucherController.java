package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.VoucherUsageDto;
import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.service.VoucherService;

import java.util.*;

// Controller quản lý các API liên quan đến voucher khuyến mãi
@RestController
@RequestMapping("/vouchers")
public class VoucherController {

    // Inject service xử lý logic liên quan đến voucher
    @Autowired
    private VoucherService voucherService;

    // Lấy danh sách tất cả voucher
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(vouchers);
    }

    // Lấy thông tin voucher theo id
    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable Long id) {
        Optional<Voucher> voucher = voucherService.getVoucherById(id);
        return voucher.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới một voucher
    @PostMapping
    public ResponseEntity<Voucher> createVoucher(@RequestBody Voucher voucher) {
        Voucher createdVoucher = voucherService.createVoucher(voucher);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVoucher);
    }

    // Cập nhật thông tin voucher theo id
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucher) {
        Voucher updatedVoucher = voucherService.updateVoucher(id, voucher);
        return ResponseEntity.ok(updatedVoucher);
    }

    // Xóa voucher theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.noContent().build();
    }

    // Lấy trạng thái hiện tại của voucher (tính toán động)
    @GetMapping("/{id}/status")
    public ResponseEntity<String> getVoucherStatus(@PathVariable Long id) {
        Optional<Voucher> voucherOpt = voucherService.getVoucherById(id);
        if (voucherOpt.isPresent()) {
            String status = voucherOpt.get().getVoucherStatus();
            return ResponseEntity.ok(status);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy lịch sử sử dụng voucher của khách hàng (chỉ cho admin)
    @GetMapping("/history/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerVoucherHistory(@PathVariable Long customerId) {
        List<Order> history = voucherService.getCustomerVoucherHistory(customerId);
        return ResponseEntity.ok(history);
    }

    // Lấy lịch sử sử dụng voucher theo id (chỉ cho admin)
    @GetMapping("/{id}/usage-history")
    public ResponseEntity<List<Order>> getVoucherUsageHistory(@PathVariable Long id) {
        List<Order> history = voucherService.getVoucherUsageHistory(id);
        return ResponseEntity.ok(history);
    }

    // Kiểm tra khách hàng đã từng sử dụng voucher chưa (theo mã, id, email, hoặc số điện thoại)
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

    // Lấy thống kê chi tiết lịch sử sử dụng voucher
    @GetMapping("/{voucherId}/usage-stats")
    public ResponseEntity<?> getVoucherUsageStats(@PathVariable Long voucherId) {
        try {
            Optional<Voucher> voucherOpt = voucherService.getVoucherById(voucherId);
            if (voucherOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            List<VoucherUsageDto> usageHistory = voucherService.getVoucherUsageHistoryDTO(voucherId);
            return ResponseEntity.ok(usageHistory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
