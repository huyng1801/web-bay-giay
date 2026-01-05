
// Controller xử lý các chức năng trang chủ, sản phẩm, đơn hàng, khách hàng, voucher, shipping...
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.student.polyshoes.dto.CustomerDto;
import vn.student.polyshoes.dto.LoginUserDto;
import vn.student.polyshoes.dto.OrderDto;
import vn.student.polyshoes.dto.OrderItemDto;
import vn.student.polyshoes.dto.OrderRequestDto;
import vn.student.polyshoes.dto.RegisterDto;
import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.exception.InvalidCredentialsException;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.CustomerAddress;
import vn.student.polyshoes.model.ProductDetails;
import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.response.CategoryResponse;
import vn.student.polyshoes.response.CustomerResponse;
import vn.student.polyshoes.response.OrderResponse;
import vn.student.polyshoes.response.OrderStatusHistoryResponse;
import vn.student.polyshoes.response.ProductDetailsResponse;
import vn.student.polyshoes.response.ProductResponse;
import vn.student.polyshoes.response.ProductImageResponse;
import vn.student.polyshoes.response.SubCategoryResponse;
import vn.student.polyshoes.service.BannerService;
import vn.student.polyshoes.service.CategoryService;
import vn.student.polyshoes.service.CustomerService;
import vn.student.polyshoes.service.HomeService;
import vn.student.polyshoes.service.OrderService;
import vn.student.polyshoes.service.OrderShippingService;
import vn.student.polyshoes.service.OrderStatusHistoryService;
import vn.student.polyshoes.service.ProductDetailsService;
import vn.student.polyshoes.service.ProductImageService;
import vn.student.polyshoes.service.ProductService;
import vn.student.polyshoes.service.SubCategoryService;
import vn.student.polyshoes.service.VoucherService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến trang chủ
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/home/")
public class HomeController {

    // Inject các service xử lý logic cho từng chức năng
    @Autowired
    private BannerService bannerService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private SubCategoryService subCategoryService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductDetailsService productDetailsService;
    @Autowired
    private ProductImageService productImageService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private VoucherService voucherService;
    @Autowired
    private HomeService homeService;
    @Autowired
    private OrderShippingService orderShippingService;
    @Autowired
    private vn.student.polyshoes.repository.CustomerAddressRepository customerAddressRepository;

    // ========== API banner ========== 
    // Lấy danh sách banner
    @GetMapping("banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    // ========== API danh mục & danh mục con ========== 
    // Lấy danh sách danh mục
    @GetMapping("categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // Lấy danh sách danh mục con theo categoryId và giới tính
    @GetMapping("subcategories")
    public ResponseEntity<List<SubCategoryResponse>> getSubCategories(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "gender", required = false) Gender gender) {
        return ResponseEntity.ok(subCategoryService.getSubCategories(categoryId, gender));
    }

    // ========== API sản phẩm ========== 
        // Lấy danh sách sản phẩm theo bộ lọc
        @GetMapping("products")
        public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Integer subCategoryId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String productName) {
        List<ProductResponse> productResponses = productService.getAllProducts(subCategoryId, gender, productName);
        List<ProductResponse> activeProducts = productResponses.stream()
            .filter(product -> product.getIsActive() != null && product.getIsActive())
            .collect(Collectors.toList());
        return ResponseEntity.ok(activeProducts);
        }

    // Lấy thông tin sản phẩm theo id
    @GetMapping("product/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId) {
        ProductResponse productResponse = productService.getProductById(productId);
        if (productResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productResponse);
    }

    // Lấy danh sách chi tiết sản phẩm theo productId (màu sắc và kích cỡ)
    @GetMapping("product-details/{productId}")
    public ResponseEntity<List<ProductDetailsResponse>> getProductDetailsByProductId(@PathVariable Integer productId) {
        return ResponseEntity.ok(productDetailsService.getProductDetailsResponseByProductId(productId));
    }

    // Lấy danh sách chi tiết sản phẩm khả dụng theo productId
    @GetMapping("product-details/available/{productId}")
    public ResponseEntity<List<ProductDetailsResponse>> getAvailableProductDetailsByProductId(@PathVariable Integer productId) {
        List<ProductDetails> availableDetails = productDetailsService.getAvailableProductDetailsByProductId(productId);
        List<ProductDetailsResponse> response = availableDetails.stream()
                .map(productDetailsService::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách hình ảnh của sản phẩm
    @GetMapping("product-image/{productId}")
    public ResponseEntity<List<ProductImageResponse>> getImagesByProductId(@PathVariable Integer productId) {
        return ResponseEntity.ok(productImageService.getProductImagesResponseByProductId(productId));
    }

    // ========== API đơn hàng ========== 
    // Tạo mới đơn hàng
    @PostMapping("orders")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        CustomerDto customerDto = orderRequestDto.getCustomerDto();
        OrderDto orderDto = orderRequestDto.getOrderDto();
        int customerId = orderRequestDto.getCustomerId();
        List<OrderItemDto> orderItemDtos = orderRequestDto.getOrderItemDtos();
        OrderResponse orderResponse = orderService.createOrder(customerId, customerDto, orderDto, orderItemDtos);
        return ResponseEntity.ok(orderResponse);
    }

    // Lấy danh sách đơn hàng theo id khách hàng
    @GetMapping("orders/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomerId(@PathVariable Integer customerId) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByCustomerId(customerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Lấy lịch sử trạng thái đơn hàng
    @GetMapping("orders/{orderId}/history")
    public ResponseEntity<?> getOrderStatusHistory(@PathVariable String orderId) {
        try {
            List<OrderStatusHistoryResponse> history = orderStatusHistoryService.getOrderStatusHistory(orderId);
            history.forEach(h -> {
                h.setIpAddress("***");
                if (h.getChangedBy() != null && h.getChangedBy().startsWith("Admin:")) {
                    h.setChangedBy("Nhân viên hệ thống");
                }
            });
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy lịch sử trạng thái thành công",
                    "history", history));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lấy lịch sử: " + e.getMessage()));
        }
    }

    // ========== API thanh toán VNPAY ========== 
    // Tạo url thanh toán VNPAY cho đơn hàng
    @PostMapping("vnpay-payment")
    public ResponseEntity<?> createVNPayPayment(@RequestParam String orderId, @RequestParam long amount) {
        String paymentUrl = orderService.createVNPayPaymentUrl(orderId, amount);
        return ResponseEntity.ok(paymentUrl);
    }

    // Xử lý kết quả trả về từ VNPAY
    @GetMapping("vnpay-return")
    public ResponseEntity<String> vnpayReturn(@RequestParam Map<String, String> params) {
        String orderId = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        if ("00".equals(vnp_ResponseCode)) {
            orderService.paidOrder(orderId);
            return ResponseEntity.ok("Thanh toán thành công! Đơn hàng #" + orderId + " đã được cập nhật.");
        } else {
            return ResponseEntity.ok("Thanh toán không thành công! Vui lòng thử lại.");
        }
    }

    // ========== API voucher ========== 
    // Lấy danh sách voucher khả dụng cho khách hàng
    @GetMapping("vouchers/available")
    public ResponseEntity<List<Voucher>> getAvailableVouchers(
            @RequestParam Integer customerId,
            @RequestParam Double orderValue) {
        try {
            List<Voucher> availableVouchers = homeService.getAvailableVouchersForCustomer(customerId, orderValue);
            return ResponseEntity.ok(availableVouchers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Kiểm tra tính hợp lệ của voucher
    @PostMapping("vouchers/validate")
    public ResponseEntity<HomeService.VoucherValidationResult> validateVoucher(
            @RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("voucherCode");
            Integer customerId = (Integer) request.get("customerId");
            Double orderValue = Double.parseDouble(request.get("orderValue").toString());
            HomeService.VoucherValidationResult result = homeService.validateVoucher(code, customerId, orderValue);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HomeService.VoucherValidationResult(false, "Lỗi kiểm tra voucher: " + e.getMessage(), null, null));
        }
    }

    // Áp dụng voucher cho đơn hàng (chỉ kiểm tra, chưa lưu)
    @PostMapping("vouchers/apply")
    public ResponseEntity<Map<String, Object>> applyVoucherForValidation(
            @RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("voucherCode");
            Integer customerId = (Integer) request.get("customerId");
            Double orderValue = Double.parseDouble(request.get("orderValue").toString());
            HomeService.VoucherValidationResult result = homeService.validateVoucher(code, customerId, orderValue);
            if (result.isValid()) {
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "message", "Voucher hợp lệ",
                        "discountAmount", result.getDiscountAmount(),
                        "voucher", result.getVoucher()));
            } else {
                return ResponseEntity.ok(Map.of(
                        "valid", false,
                        "message", result.getMessage(),
                        "discountAmount", 0));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Lỗi áp dụng voucher: " + e.getMessage(),
                    "discountAmount", 0));
        }
    }

    // Áp dụng voucher cho đơn hàng (lưu vào DB)
    @PostMapping("vouchers/apply-to-order")
    public ResponseEntity<String> applyVoucherToOrder(
            @RequestParam String code,
            @RequestParam Integer customerId,
            @RequestParam String orderId) {
        try {
            voucherService.applyVoucherToOrder(code, customerId, orderId);
            return ResponseEntity.ok("Voucher đã được áp dụng thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== API khách hàng ========== 
    // Đăng ký tài khoản khách hàng
    @PostMapping("register")
    public ResponseEntity<Customer> register(@RequestBody RegisterDto registerDto) {
        try {
            Customer registeredCustomer = customerService.register(registerDto);
            return ResponseEntity.ok(registeredCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Đăng nhập khách hàng
    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginUserDto loginDto) {
        try {
            String token = customerService.login(loginDto);
            return ResponseEntity.ok(token);
        } catch (ResourceNotFoundException | InvalidCredentialsException e) {
            return ResponseEntity.status(401).body("Thông tin đăng nhập không hợp lệ");
        }
    }

    // Lấy thông tin khách hàng theo id
    @GetMapping("customer/{customerId}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toCustomerResponse(customer));
    }

    // Lấy thông tin khách hàng theo email
    @GetMapping("customer/email/{email}")
    public ResponseEntity<CustomerResponse> getCustomerByEmail(@PathVariable("email") String email) {
        Customer customer = customerService.getCustomerByEmail(email);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toCustomerResponse(customer));
    }

    // Lấy địa chỉ mặc định của khách hàng
    @GetMapping("customer/{customerId}/addresses/default")
    public ResponseEntity<CustomerAddress> getCustomerDefaultAddress(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        // Get default address from CustomerAddress repository
        Optional<CustomerAddress> defaultAddress = customerAddressRepository.findDefaultAddressByCustomerId(customerId);

        if (defaultAddress.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(defaultAddress.get());
    }

    // Lấy tất cả địa chỉ của khách hàng
    @GetMapping("customer/{customerId}/addresses")
    public ResponseEntity<List<CustomerAddress>> getCustomerAddresses(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        // Get all addresses from CustomerAddress repository
        List<CustomerAddress> addresses = customerAddressRepository.findByCustomerCustomerId(customerId);

        return ResponseEntity.ok(addresses);
    }

    // Hàm hỗ trợ: chuyển đổi từ Customer sang CustomerResponse
    private CustomerResponse toCustomerResponse(Customer customer) {
        return new CustomerResponse(
                customer.getCustomerId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getIsActive()
        );
    }
    // ========== API huỷ đơn hàng ========== 

    // Huỷ đơn hàng cho khách hàng
    @PostMapping("order/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrderForCustomer(
            @PathVariable String orderId,
            @RequestParam(required = true) Integer customerId,
            @RequestBody(required = false) Map<String, String> body) {
        // Kiểm tra tham số đầu vào
        if (orderId == null || orderId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (customerId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        String cancelReason = body != null ? body.getOrDefault("cancelReason", null) : null;
        try {
            // Lấy tên khách hàng để ghi lịch sử
            String changedBy = null;
            try {
                Customer customer = customerService.getCustomerById(customerId);
                changedBy = customer != null ? customer.getFullName() : "Khách hàng";
            } catch (Exception e) {
                changedBy = "Khách hàng";
            }
            OrderResponse response = orderService.updateOrderStatus(
                orderId,
                vn.student.polyshoes.enums.OrderStatus.CANCELED,
                changedBy,
                cancelReason,
                "127.0.0.1"
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // ========== API shipping ========== 
    
    // Tính cước phí vận chuyển tối ưu
    @PostMapping("calculate-fee")
    public ResponseEntity<Map<String, Object>> calculateOptimalShippingFee(
            @RequestParam Integer toDistrictId,
            @RequestParam String toWardCode,
            @RequestParam Long orderValue,
            @RequestParam(required = false) Integer weight,
            @RequestParam(required = false) Integer length,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height) {
        try {
            // Gọi service để tính phí vận chuyển tối ưu
            Map<String, Object> result = orderShippingService.calculateOptimalShippingFee(
                toDistrictId, toWardCode, orderValue,
                weight, length, width, height
            );
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "shippingFee", 30000,
                "serviceName", "Giao hàng tiêu chuẩn", 
                "estimatedTime", "3-5 ngày",
                "message", "Lỗi khi tính cước, sử dụng phí mặc định"
            ));
        }
    }

}