package vn.student.polyshoes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsageDTO {
    private Long usageId;
    private Long voucherId;
    private String voucherCode;
    private Integer customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Integer guestId;
    private String guestName;
    private String guestPhone;
    private String guestEmail;
    private String orderId;
    private String orderStatus;
    private Long originalPrice;
    private Long totalPrice;
    private Long voucherDiscount;
    private Double discountAmount;
    private LocalDateTime usedAt;
    private Date createdAt;
}