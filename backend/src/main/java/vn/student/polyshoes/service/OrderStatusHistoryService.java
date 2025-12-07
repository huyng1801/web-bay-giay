package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.OrderStatusHistory;
import vn.student.polyshoes.repository.OrderStatusHistoryRepository;
import vn.student.polyshoes.response.OrderStatusHistoryResponse;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderStatusHistoryService {

    @Autowired
    private OrderStatusHistoryRepository statusHistoryRepository;

    public void createStatusHistory(Order order, OrderStatus fromStatus, OrderStatus toStatus, String changedBy, String changeReason, String ipAddress) {
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setChangedBy(changedBy);
        history.setChangeReason(changeReason);
        history.setIpAddress(ipAddress);
        history.setChangedAt(new java.util.Date());
        statusHistoryRepository.save(history);
    }

    public List<OrderStatusHistoryResponse> getOrderStatusHistory(String orderId) {
        List<OrderStatusHistory> histories = statusHistoryRepository.findByOrderIdOrderByChangedAtDesc(orderId);
        return histories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private OrderStatusHistoryResponse convertToResponse(OrderStatusHistory history) {
        OrderStatusHistoryResponse response = new OrderStatusHistoryResponse();
        response.setHistoryId(history.getHistoryId());
        response.setOrderId(history.getOrder().getOrderId());
        response.setFromStatus(history.getFromStatus());
        response.setToStatus(history.getToStatus());
        response.setChangedBy(history.getChangedBy());
        response.setChangeReason(history.getChangeReason());
        response.setChangedAt(history.getChangedAt());
        response.setIpAddress(history.getIpAddress());
        response.setFromStatusDisplay(getStatusDisplayName(history.getFromStatus()));
        response.setToStatusDisplay(getStatusDisplayName(history.getToStatus()));
        response.setTimeDisplay(formatDateTime(history.getChangedAt()));
        return response;
    }

    private String getStatusDisplayName(OrderStatus status) {
        if (status == null) return "Tạo mới";
        switch (status) {
            case PENDING_PAYMENT: return "Chờ thanh toán";
            case PAYMENT_CONFIRMED: return "Đã thanh toán";
            case PROCESSING: return "Đang xử lý";
            case SHIPPED: return "Đang vận chuyển";
            case OUT_FOR_DELIVERY: return "Đang giao hàng";
            case DELIVERED: return "Đã giao hàng";
            case CANCELED: return "Đã hủy";
            case RETURN_REQUESTED: return "Yêu cầu trả hàng";
            case RETURNED: return "Đã trả hàng";
            case REFUNDED: return "Đã hoàn tiền";
            case FAILED: return "Thất bại";
            default: return status.toString();
        }
    }

    private String formatDateTime(java.util.Date date) {
        if (date == null) return "";
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return formatter.format(date);
    }
}
