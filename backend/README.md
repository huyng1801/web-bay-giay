# Halley Shop - Backend API Documentation

## 📋 Tổng Quan

**Halley Shop** là một nền tảng thương mại điện tử chuyên bán giày, cung cấp API REST đầy đủ cho cả khách hàng và quản trị viên. Backend được xây dựng với **Spring Boot 3.3.3**, **JPA/Hibernate**, **JWT Authentication**, và **SQL Server**.

### Thông Tin Cơ Bản
- **Ngôn ngữ**: Java 21
- **Framework**: Spring Boot 3.3.3
- **Build Tool**: Maven
- **Database**: SQL Server (với MySQL connector)
- **Authentication**: JWT (JSON Web Token)
- **ORM**: JPA/Hibernate
- **Server Port**: 8080

---

## 🏗️ Kiến Trúc Backend

```
backend/
├── src/main/java/vn/student/polyshoes/
│   ├── Application.java                 # Điểm khởi động chính
│   ├── config/                         # Cấu hình Spring (Security, JWT, CORS, etc.)
│   ├── controller/                     # REST Controllers (19 controllers)
│   ├── service/                        # Business Logic (23 services)
│   ├── repository/                     # Data Access Layer (19 repositories)
│   ├── model/                          # JPA Entities (19 models)
│   ├── dto/                            # Data Transfer Objects (29 DTOs)
│   ├── response/                       # Response Objects
│   ├── exception/                      # Custom Exceptions
│   ├── enums/                          # Enumerations (Gender, Role, OrderStatus, PaymentMethod, ShippingType)
│   ├── seeder/                         # Database Seeders (7 seeders)
│   └── util/                           # Utility Classes (GenerateUtils, ValidationUtils)
├── src/main/resources/
│   ├── application.properties           # Spring Configuration
│   └── static/                         # Static files (uploads folder)
├── pom.xml                             # Maven Configuration
└── migration.sql                       # Database Schema Migration

```

---

## 📊 Model (Entity) Overview

### 1. **User & Authentication**
- **AdminUser** - Tài khoản quản trị viên (role: ADMIN, STAFF)
- **Customer** - Khách hàng đã đăng ký (có tài khoản)
- **Guest** - Khách hàng vãng lai (không đăng ký tài khoản)

### 2. **Product Management**
- **Product** - Sản phẩm chính
- **Category** - Danh mục sản phẩm (Nam, Nữ, Unisex, etc.)
- **SubCategory** - Danh mục con (Giày nam, Dép nam, etc.)
- **Brand** - Thương hiệu sản phẩm
- **ProductColor** - Màu sắc của sản phẩm
- **ProductColorImage** - Hình ảnh chi tiết theo màu
- **ProductSize** - Kích cỡ và số lượng tồn kho
- **Size** - Danh sách các kích cỡ (36, 37, 38, ..., 46)
- **Color** - Danh sách các màu sắc
- **ProductFeedback** - Đánh giá và bình luận của khách hàng

### 3. **Order Management**
- **Order** - Đơn hàng (liên kết Customer/Guest)
- **OrderItem** - Chi tiết từng sản phẩm trong đơn hàng
- **OrderStatusHistory** - Lịch sử thay đổi trạng thái đơn hàng

### 4. **Promotion & Shipping**
- **Voucher** - Mã giảm giá (SALE20, FIRST100, SUMMER15, VIP50K, MONTHLY10)
- **Shipping** - Phương thức vận chuyển và chi phí vận chuyển

### 5. **Additional**
- **Banner** - Quảng cáo trên trang chủ

---

## 🔐 Authentication & Authorization

### JWT Authentication Flow
```
1. Client gửi username + password → POST /auth/login
2. Server xác thực → trả về JWT Token
3. Client gửi kèm token → Authorization: Bearer <token>
4. Server xác minh token → trả về resource
```

### Roles
- **ADMIN** - Quản trị viên cấp cao (quản lý toàn bộ hệ thống)
- **STAFF** - Nhân viên (quản lý đơn hàng, khách hàng)

### Security Features
- Password hashing với BCryptPasswordEncoder
- JWT token với signature validation
- CORS configuration cho frontend communication
- Protected routes yêu cầu authentication

---

## 🛠️ Controllers & APIs (19 Controllers)

### 1. **AuthenticationController** (`/auth`)
Xử lý đăng nhập, đăng ký, và quản lý xác thực

```
POST   /auth/login           - Đăng nhập
POST   /auth/register        - Đăng ký tài khoản
GET    /auth/profile         - Lấy thông tin cá nhân
PUT    /auth/change-password - Thay đổi mật khẩu
```

### 2. **HomeController** (`/home/`)
API công khai cho khách hàng (trang chủ, product listing, checkout)

**Product & Category APIs**
```
GET    /home/banners                      - Lấy danh sách banner quảng cáo
GET    /home/categories                   - Lấy tất cả danh mục
GET    /home/subcategories                - Lấy danh mục con (filter theo category, gender)
GET    /home/products                     - Lấy danh sách sản phẩm (filter, search)
GET    /home/products/{productId}         - Chi tiết sản phẩm
GET    /home/products/{productId}/colors  - Lấy màu sắc của sản phẩm
GET    /home/products/{productId}/sizes   - Lấy kích cỡ của sản phẩm
```

**Customer & Order APIs**
```
POST   /home/register                     - Đăng ký khách hàng
POST   /home/login                        - Đăng nhập khách hàng
GET    /home/customer/email/{email}       - Lấy thông tin khách hàng
POST   /home/orders                       - Tạo đơn hàng
GET    /home/orders/{orderId}             - Chi tiết đơn hàng
GET    /home/order-history/{customerId}   - Lịch sử đơn hàng của khách
```

**Voucher & Shipping APIs**
```
GET    /home/vouchers/code/{code}         - Kiểm tra voucher (lấy discount)
GET    /home/vouchers/apply               - Áp dụng voucher vào order
GET    /home/shippings                    - Lấy danh sách phương thức vận chuyển
```

**Feedback APIs**
```
POST   /home/feedbacks                    - Tạo đánh giá sản phẩm
GET    /home/products/{productId}/feedbacks - Lấy đánh giá của sản phẩm
```

### 3. **AdminUserController** (`/users`)
Quản lý tài khoản admin (yêu cầu ADMIN role)

```
GET    /users                      - Lấy danh sách admin user
POST   /users/create              - Tạo admin user mới
PUT    /users/{userId}            - Cập nhật thông tin admin
DELETE /users/{userId}            - Xóa admin user
GET    /users/profile             - Lấy profile hiện tại
PUT    /users/update-profile      - Cập nhật profile
```

### 4. **CategoryController** (`/categories`)
Quản lý danh mục sản phẩm

```
GET    /categories                - Lấy tất cả danh mục
GET    /categories/active         - Lấy danh mục đang hoạt động
GET    /categories/{id}           - Chi tiết danh mục
POST   /categories                - Tạo danh mục (ADMIN)
PUT    /categories/{id}           - Cập nhật danh mục (ADMIN)
DELETE /categories/{id}           - Xóa danh mục (ADMIN)
PUT    /categories/{id}/toggle    - Bật/tắt danh mục (ADMIN)
```

### 5. **SubCategoryController** (`/subcategories`)
Quản lý danh mục con

```
GET    /subcategories                            - Lấy tất cả danh mục con (filter: categoryId, gender)
GET    /subcategories/{id}                       - Chi tiết danh mục con
POST   /subcategories                            - Tạo danh mục con (ADMIN)
PUT    /subcategories/{id}                       - Cập nhật danh mục con (ADMIN)
DELETE /subcategories/{id}                       - Xóa danh mục con (ADMIN)
PUT    /subcategories/{id}/toggle                - Bật/tắt danh mục con (ADMIN)
```

### 6. **ProductController** (`/products`)
Quản lý sản phẩm

```
GET    /products                   - Lấy danh sách sản phẩm (search, filter, page)
GET    /products/{id}              - Chi tiết sản phẩm
POST   /products                   - Tạo sản phẩm (ADMIN)
PUT    /products/{id}              - Cập nhật sản phẩm (ADMIN)
DELETE /products/{id}              - Xóa sản phẩm (ADMIN)
PUT    /products/{id}/toggle       - Bật/tắt sản phẩm (ADMIN)
```

### 7. **ProductColorController** (`/product-colors`)
Quản lý màu sắc sản phẩm

```
GET    /product-colors/{productId}          - Lấy tất cả màu của sản phẩm
GET    /product-colors/by-id/{colorId}      - Chi tiết màu sắc
POST   /product-colors                      - Tạo màu sắc sản phẩm (ADMIN)
PUT    /product-colors/{colorId}            - Cập nhật màu sắc (ADMIN)
DELETE /product-colors/{colorId}            - Xóa màu sắc (ADMIN)
```

### 8. **ProductColorImageController** (`/product-color-images`)
Quản lý hình ảnh theo màu sắc

```
GET    /product-color-images/{colorId}      - Lấy ảnh của màu
POST   /product-color-images                - Upload ảnh (ADMIN)
DELETE /product-color-images/{imageId}      - Xóa ảnh (ADMIN)
```

### 9. **ProductSizeController** (`/product-sizes`)
Quản lý kích cỡ & tồn kho

```
GET    /product-sizes/{productId}           - Lấy kích cỡ của sản phẩm
POST   /product-sizes                       - Tạo size sản phẩm (ADMIN)
PUT    /product-sizes/{id}                  - Cập nhật số lượng (ADMIN)
DELETE /product-sizes/{id}                  - Xóa size sản phẩm (ADMIN)
```

### 10. **SizeController** (`/sizes`)
Quản lý danh sách kích cỡ

```
GET    /sizes                     - Lấy tất cả kích cỡ
GET    /sizes/active              - Lấy kích cỡ đang hoạt động
GET    /sizes/page                - Lấy với phân trang
GET    /sizes/{id}                - Chi tiết kích cỡ
POST   /sizes                     - Tạo kích cỡ (ADMIN)
PUT    /sizes/{id}                - Cập nhật kích cỡ (ADMIN)
DELETE /sizes/{id}                - Xóa kích cỡ (ADMIN)
PUT    /sizes/{id}/toggle         - Bật/tắt kích cỡ (ADMIN)
```

### 11. **ColorController** (`/colors`)
Quản lý danh sách màu sắc

```
GET    /colors                    - Lấy tất cả màu
GET    /colors/active             - Lấy màu đang hoạt động
GET    /colors/{id}               - Chi tiết màu
POST   /colors                    - Tạo màu (ADMIN)
PUT    /colors/{id}               - Cập nhật màu (ADMIN)
DELETE /colors/{id}               - Xóa màu (ADMIN)
PUT    /colors/{id}/toggle        - Bật/tắt màu (ADMIN)
```

### 12. **BrandController** (`/brands`)
Quản lý thương hiệu

```
GET    /brands                    - Lấy tất cả thương hiệu
GET    /brands/active             - Lấy thương hiệu đang hoạt động
GET    /brands/{id}               - Chi tiết thương hiệu
POST   /brands                    - Tạo thương hiệu (ADMIN)
PUT    /brands/{id}               - Cập nhật thương hiệu (ADMIN)
DELETE /brands/{id}               - Xóa thương hiệu (ADMIN)
PUT    /brands/{id}/toggle        - Bật/tắt thương hiệu (ADMIN)
```

### 13. **BannerController** (`/banners`)
Quản lý quảng cáo

```
GET    /banners                   - Lấy tất cả banner
GET    /banners/active            - Lấy banner đang hoạt động
POST   /banners                   - Tạo banner (ADMIN)
PUT    /banners/{id}              - Cập nhật banner (ADMIN)
DELETE /banners/{id}              - Xóa banner (ADMIN)
PUT    /banners/{id}/toggle       - Bật/tắt banner (ADMIN)
```

### 14. **VoucherController** (`/vouchers`)
Quản lý voucher/mã giảm giá

```
GET    /vouchers                  - Lấy tất cả voucher
GET    /vouchers/{id}             - Chi tiết voucher
POST   /vouchers                  - Tạo voucher (ADMIN)
PUT    /vouchers/{id}             - Cập nhật voucher (ADMIN)
DELETE /vouchers/{id}             - Xóa voucher (ADMIN)
PUT    /vouchers/{id}/toggle      - Bật/tắt voucher (ADMIN)
```

### 15. **OrderController** (`/orders`)
Quản lý đơn hàng

```
GET    /orders                    - Lấy danh sách đơn hàng (filter, page)
GET    /orders/{orderId}          - Chi tiết đơn hàng
POST   /orders                    - Tạo đơn hàng (từ HomeController)
PUT    /orders/{orderId}/status   - Cập nhật trạng thái đơn hàng (ADMIN)
PUT    /orders/{orderId}/assign   - Gán nhân viên xử lý (ADMIN)
GET    /orders/customer/{customerId} - Lịch sử đơn hàng của khách
```

### 16. **OrderStatusHistoryController** (implicit in OrderController)
Lịch sử thay đổi trạng thái đơn hàng

```
GET    /orders/{orderId}/status-history - Xem lịch sử thay đổi trạng thái
```

### 17. **CustomerController** (`/customers`)
Quản lý khách hàng

```
GET    /customers                 - Lấy danh sách khách hàng (ADMIN)
GET    /customers/{customerId}    - Chi tiết khách hàng
POST   /customers                 - Tạo khách hàng (ADMIN)
PUT    /customers/{customerId}    - Cập nhật khách hàng (ADMIN)
DELETE /customers/{customerId}    - Xóa khách hàng (ADMIN)
```

### 18. **GuestController** (`/api/guests`)
Quản lý khách vãng lai

```
GET    /api/guests/{guestId}      - Chi tiết khách vãng lai
POST   /api/guests                - Tạo khách vãng lai
PUT    /api/guests/{guestId}      - Cập nhật khách vãng lai
DELETE /api/guests/{guestId}      - Xóa khách vãng lai
```

### 19. **ShippingController** (`/shippings`)
Quản lý phương thức vận chuyển

```
GET    /shippings                 - Lấy tất cả phương thức vận chuyển
GET    /shippings/active          - Lấy phương thức đang hoạt động
GET    /shippings/{id}            - Chi tiết phương thức vận chuyển
POST   /shippings                 - Tạo phương thức vận chuyển (ADMIN)
PUT    /shippings/{id}            - Cập nhật phương thức vận chuyển (ADMIN)
DELETE /shippings/{id}            - Xóa phương thức vận chuyển (ADMIN)
```

### 20. **ProductFeedbackController** (`/feedback`)
Quản lý đánh giá sản phẩm

```
GET    /feedback                  - Lấy tất cả feedback
GET    /feedback/{feedbackId}     - Chi tiết feedback
GET    /feedback/product/{productId} - Lấy feedback của sản phẩm
POST   /feedback                  - Tạo feedback
DELETE /feedback/{feedbackId}     - Xóa feedback (ADMIN)
```

### 21. **StatisticController** (`/statistics`)
Thống kê và báo cáo

```
GET    /statistics/this-month     - Thống kê tháng hiện tại
GET    /statistics/current-month  - (Tương tự /this-month)
GET    /statistics/this-year      - Thống kê năm hiện tại
GET    /statistics/date-range     - Thống kê trong khoảng thời gian
GET    /statistics/monthly        - Thống kê theo từng tháng
GET    /statistics/yearly         - Thống kê theo từng năm
```

---

## 📦 Services (23 Services)

Mỗi service xử lý business logic cho từng model:

| Service | Chức Năng |
|---------|----------|
| **AdminUserService** | Quản lý tài khoản admin, password hashing |
| **AuthenticationService** | Login, token validation, logout |
| **CustomerService** | CRUD customer, login/register, profile |
| **GuestService** | CRUD guest (khách vãng lai) |
| **OrderService** | CRUD order, apply voucher, status management, order history |
| **OrderStatusHistoryService** | Ghi lại lịch sử thay đổi trạng thái |
| **ProductService** | CRUD product, search, filter, toggle status |
| **ProductColorService** | Quản lý màu sắc sản phẩm |
| **ProductColorImageService** | Upload, delete ảnh sản phẩm |
| **ProductSizeService** | Quản lý size & tồn kho |
| **ProductFeedbackService** | Create, get feedback |
| **CategoryService** | CRUD category |
| **SubCategoryService** | CRUD subcategory, filter |
| **BrandService** | CRUD brand |
| **ColorService** | CRUD color |
| **SizeService** | CRUD size |
| **BannerService** | CRUD banner |
| **VoucherService** | CRUD voucher, apply discount logic, track usage via Order |
| **ShippingService** | CRUD shipping, calculate cost |
| **StatisticService** | Tính toán doanh thu, số lượng bán, thống kê |
| **HomeService** | Xử lý logic trang chủ, recommendation |
| **JwtService** | Generate, validate JWT token |
| **FileService** | Upload file, handle AWS S3 |

---

## 🗄️ Repositories (19 Repositories)

Mỗi repository extend `JpaRepository` với các custom query methods:

```java
// Ví dụ:
OrderRepository.findByCustomer(Customer customer)
OrderRepository.findByVoucher(Voucher voucher)
ProductRepository.findByCategory(Category category)
CustomerRepository.findByEmail(String email)
VoucherRepository.findByCode(String code)
// ... và nhiều method khác
```

---

## 🎯 Key Business Logic

### 1. **Voucher System**
- Khách hàng nhập mã voucher khi checkout
- System kiểm tra valid (còn hạn, còn lượt sử dụng)
- Tính toán discount amount
- **Lưu trữ**: Voucher được lưu trong `Order` entity (không dùng bảng VoucherUsage)
- Voucher history có thể lấy từ `Order.createdAt`, `Order.voucherDiscount`, `Order.voucher`

### 2. **Order Management**
- Order được tạo từ cart items
- Support cả Customer (đăng ký) và Guest (vãng lai)
- Áp dụng Voucher khi checkout
- Theo dõi trạng thái: PENDING_PAYMENT → PROCESSING → SHIPPED → DELIVERED → CANCELLED
- Ghi lại lịch sử thay đổi trạng thái trong `OrderStatusHistory`

### 3. **Authentication**
- Customer/Admin login → nhận JWT token
- Mỗi request gửi token trong header: `Authorization: Bearer <token>`
- Server verify token → xác thực user

### 4. **Product Inventory**
- `ProductSize` lưu số lượng tồn kho (quantity)
- Khi order được tạo, số lượng tồn kho giảm
- Display mặt hàng có sẵn hoặc hết hàng

### 5. **File Upload**
- Support upload ảnh banner, brand, product color
- Lưu trữ trên server hoặc AWS S3
- FileService xử lý logic upload/delete

---

## 🚀 Setup & Running

### Prerequisites
- Java 21 JDK
- Maven 3.6+
- SQL Server 2019+
- (Optional) MySQL cho development

### Configuration

**1. Database Configuration** (application.properties)
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=poly-shoes;encrypt=true;trustServerCertificate=true;
spring.datasource.username=sa
spring.datasource.password=123456
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=update
```

**2. Build & Run**
```bash
# Clone repository
git clone <repo-url>
cd backend

# Build with Maven
mvn clean install

# Run application
mvn spring-boot:run

# Or: java -jar target/polyshoes-0.0.1-SNAPSHOT.jar
```

### Database Seeders
- Ứng dụng tự động chạy seeders khi khởi động (nếu bảng trống)
- Seeders tạo dữ liệu mẫu cho:
  - Brands (Nike, Adidas, Converse, etc.)
  - Colors (Đỏ, Xanh, Đen, etc.)
  - Sizes (36-46)
  - Categories (Nam, Nữ, Unisex)
  - SubCategories (Giày thể thao, Dép, etc.)
  - Vouchers (SALE20, FIRST100, SUMMER15, VIP50K, MONTHLY10)
  - Products (50+ sản phẩm)
  - Customers (5 khách hàng)
  - Guests (3 khách vãng lai)
  - Orders (6 đơn hàng)
  - Feedbacks (product reviews)

---

## 🔧 Technologies Used

### Backend Stack
| Tech | Version | Usage |
|------|---------|-------|
| Spring Boot | 3.3.3 | Web framework |
| Spring Security | 6.1.x | Authentication/Authorization |
| Spring Data JPA | 3.3.3 | Database access |
| Hibernate | 6.5.2 | ORM |
| JWT (jjwt) | 0.11.5 | Token authentication |
| SQL Server | 2019+ | Primary database |
| MySQL | 8.2.0 | Optional alt database |
| Lombok | 1.18.x | Annotations (auto-gen getters/setters) |
| Validation | 6.1.x | Bean validation |
| Actuator | 6.1.x | Health monitoring |

### Build & Deployment
- Maven for dependency management
- Docker support (optional)
- AWS S3 for file storage (optional)

---

## 📝 DTOs (Data Transfer Objects)

DTOs dùng để transfer data giữa client-server, tách biệt database model:

```
AdminUserDto          - Input data cho admin user
BannerDto            - Input data cho banner
BrandDto             - Input data cho brand
CategoryDto          - Input data cho category
ColorDto             - Input data cho color
CustomerDto          - Input data cho customer
GuestDto             - Input data cho guest
OrderDto             - Data đơn hàng (output)
OrderItemDto         - Chi tiết item trong order
OrderRequestDto      - Request tạo đơn hàng (input)
OrderFilterDto       - Filter params cho order search
ProductDto           - Input data cho product
ProductColorDto      - Input data cho product color
ProductColorImageDto - Input data cho product image
ProductFeedbackDto   - Input data cho feedback
ProductSizeDto       - Input data cho product size
ShippingDto          - Input data cho shipping
SizeDto              - Input data cho size
SubCategoryDto       - Input data cho subcategory
VoucherDto           - Input data cho voucher
VoucherUsageDto      - Voucher usage info (output)
LoginUserDto         - Login credentials
RegisterDto          - User registration
UpdateProfileDto     - Profile update
ChangePasswordDto     - Password change
...
```

---

## 🔒 Security Best Practices

1. **Password Security**
   - Mật khẩu được hash bằng BCryptPasswordEncoder
   - Không lưu plaintext password

2. **JWT Token**
   - Token có expiration time (thường 24h)
   - Sign bằng secret key
   - Verify khi mỗi request

3. **Authorization**
   - Admin/Staff routes yêu cầu ADMIN role
   - Customer routes yêu cầu authentication
   - Public routes không yêu cầu auth

4. **Input Validation**
   - Sử dụng Bean Validation (`@Valid`)
   - Custom validation rules
   - Error handling & response

5. **CORS Configuration**
   - Allow requests từ frontend domain
   - Configurable trong `WebConfig.java`

---

## 🐛 Error Handling

### Exception Classes
```
ResourceNotFoundException    - Resource không tìm thấy (404)
InvalidCredentialsException  - Sai username/password (401)
BadRequestException          - Request không hợp lệ (400)
UnauthorizedException        - Không có quyền truy cập (403)
// ... Custom exceptions khác
```

### Response Format
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email already exists"
  }
}
```

---

## 📊 Database Schema Highlights

### Key Relationships
```
Customer 1 ----- * Order (khách hàng có nhiều đơn hàng)
Guest 1 ----- * Order (khách vãng lai có nhiều đơn hàng)
Order 1 ----- * OrderItem (đơn hàng có nhiều chi tiết)
Product 1 ----- * OrderItem (sản phẩm bán trong nhiều đơn)
Order * ----- 1 Voucher (đơn hàng sử dụng voucher)
Voucher
Product 1 ----- * ProductColor (sản phẩm có nhiều màu)
ProductColor 1 ----- * ProductColorImage (màu có nhiều hình)
Product 1 ----- * ProductSize (sản phẩm có nhiều size)
Size 1 ----- * ProductSize (size được sử dụng ở nhiều sản phẩm)
Category 1 ----- * SubCategory (danh mục chứa nhiều danh mục con)
SubCategory 1 ----- * Product (danh mục con có nhiều sản phẩm)
Brand 1 ----- * Product (thương hiệu có nhiều sản phẩm)
Product 1 ----- * ProductFeedback (sản phẩm nhận nhiều đánh giá)
Order 1 ----- * OrderStatusHistory (ghi lại lịch sử thay đổi)
AdminUser 1 ----- * Order (nhân viên xử lý nhiều đơn hàng)
```

---

## 🎓 Enumerations

```java
Gender             - NAM (Nam), NU (Nữ), UNISEX (Unisex)
Role               - ADMIN, STAFF
OrderStatus        - PENDING_PAYMENT, PROCESSING, SHIPPED, DELIVERED, CANCELLED
PaymentMethod      - BANK_TRANSFER, CASH_ON_DELIVERY, VNPAY, CREDIT_CARD
ShippingType       - STANDARD, EXPRESS, SAME_DAY
```

---

## 🔄 API Response Pattern

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

---

## 📱 Frontend Integration

Frontend (React) communicate với backend qua HTTP requests:

```javascript
// Example: Login
const response = await fetch('http://localhost:8080/home/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const token = await response.text(); // JWT token
localStorage.setItem('token', token);

// Example: Get Products
const response = await fetch('http://localhost:8080/home/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const products = await response.json();
```

---

## 📚 Useful Links & Resources

- [Spring Boot Official Docs](https://spring.io/projects/spring-boot)
- [Spring Security Docs](https://spring.io/projects/spring-security)
- [JPA/Hibernate Docs](https://hibernate.org/orm/)
- [JWT.io](https://jwt.io)

---

## 📧 Support & Contact

- **Issue Tracking**: GitHub Issues
- **Documentation**: Xem code comments (Vietnamese)
- **Team**: Halley Shop Development Team

---

## 📜 License

[License Information Here]

---

**Last Updated**: December 24, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
