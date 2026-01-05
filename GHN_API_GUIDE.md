# Hướng dẫn tích hợp GHN (Giao Hàng Nhanh) API

## Tổng quan
Dự án đã được tích hợp với API Giao Hàng Nhanh để tự động tính cước phí vận chuyển dựa trên địa chỉ giao hàng thực tế.

## Cấu hình

### 1. Lấy thông tin từ GHN
1. Truy cập https://sso.ghn.vn/register để đăng ký tài khoản
2. Sau khi đăng nhập, vào phần thông tin cá nhân để lấy Token API
3. Vào "Quản lý cửa hàng" để lấy Shop ID

### 2. Cập nhật application.properties
```properties
# Token GHN (thay YOUR_GHN_TOKEN_HERE bằng token thật)
ghn.api.token=d9c77253-e447-11f0-89c7-9a7048578509

# Shop ID GHN (thay YOUR_SHOP_ID_HERE bằng shop ID thật)  
ghn.api.shop-id=6106628

# ID quận/huyện kho hàng (mặc định: 1542 - Hà Đông, Hà Nội)
ghn.api.from-district-id=1542
```

## API Endpoints

### 1. Lấy danh sách địa chỉ
```http
GET /api/admin/ghn/provinces
GET /api/admin/ghn/districts?provinceId=201
GET /api/admin/ghn/wards?districtId=1542
```

### 2. Lấy dịch vụ vận chuyển
```http
GET /api/admin/ghn/services?toDistrictId=1442
```

### 3. Tính cước phí
```http
POST /api/admin/ghn/calculate-fee
Content-Type: application/json

{
    "service_id": 53321,
    "insurance_value": 500000,
    "to_district_id": 1442,
    "to_ward_code": "20314",
    "weight": 1000,
    "length": 15,
    "width": 15,
    "height": 15
}
```

### 4. Đồng bộ dịch vụ vào database
```http
POST /api/admin/ghn/sync-services?toDistrictId=1442&provinceName=Hồ Chí Minh
```

### 5. Tính cước cho đơn hàng
```http
POST /api/admin/ghn/calculate-order-fee
?serviceId=53321
&toDistrictId=1442
&toWardCode=20314
&orderValue=500000
&weight=1000
&length=15
&width=15
&height=15
```

## Cách sử dụng trong code

### 1. Service tính cước phí
```java
@Autowired
private GHNIntegrationService ghnIntegrationService;

// Tính cước phí cho đơn hàng
Integer shippingFee = ghnIntegrationService.calculateShippingFee(
    serviceId, toDistrictId, toWardCode, orderValue,
    weight, length, width, height
);
```

### 2. Đồng bộ dịch vụ vận chuyển
```java
// Đồng bộ dịch vụ từ GHN vào database
List<Shipping> services = ghnIntegrationService.syncShippingServicesFromGHN(
    toDistrictId, provinceName
);
```

### 3. Lấy thông tin địa chỉ
```java
@Autowired
private GHNService ghnService;

// Lấy tỉnh/thành
GHNProvinceDTO provinces = ghnService.getProvinces();

// Lấy quận/huyện  
GHNDistrictDTO districts = ghnService.getDistricts(provinceId);

// Lấy phường/xã
GHNWardDTO wards = ghnService.getWards(districtId);
```

## Lưu ý quan trọng

### 1. API Rate Limiting
- GHN có giới hạn số lần gọi API mỗi phút
- Implement caching cho danh sách tỉnh/quận/phường để giảm số lần gọi API

### 2. Xử lý lỗi
- Luôn có phí vận chuyển mặc định (30.000đ) khi API GHN lỗi
- Log lỗi để theo dõi và debug

### 3. Bảo mật
- Không để token GHN trong code
- Sử dụng environment variables trong production

### 4. Test Mode vs Production
- URL sandbox: https://online-gateway.ghn.vn/shiip/public-api
- URL production: giữ nguyên, chỉ đổi token và shop ID thật

## Ví dụ Frontend (React)

### 1. Lấy danh sách tỉnh
```javascript
const getProvinces = async () => {
    try {
        const response = await fetch('/api/admin/ghn/provinces');
        const data = await response.json();
        setProvinces(data.data);
    } catch (error) {
        console.error('Lỗi lấy danh sách tỉnh:', error);
    }
};
```

### 2. Tính cước phí
```javascript
const calculateShippingFee = async (orderData) => {
    try {
        const response = await fetch('/api/admin/ghn/calculate-order-fee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serviceId: orderData.serviceId,
                toDistrictId: orderData.districtId,
                toWardCode: orderData.wardCode,
                orderValue: orderData.totalValue,
                weight: 1000 // 1kg default
            })
        });
        const result = await response.json();
        return result.shippingFee;
    } catch (error) {
        console.error('Lỗi tính cước phí:', error);
        return 30000; // Phí mặc định
    }
};
```

## Database Schema Changes

Các bảng đã được cập nhật với tên tiếng Việt:

```sql
-- Bảng vận chuyển với fields GHN
CREATE TABLE van_chuyen (
    ma_van_chuyen INT IDENTITY(1,1) PRIMARY KEY,
    ma_dich_vu_van_chuyen NVARCHAR(50) UNIQUE NOT NULL,
    ten_dich_vu_van_chuyen NVARCHAR(200) NOT NULL,
    phi_van_chuyen INT NOT NULL,
    thoi_gian_giao_hang NVARCHAR(100) NOT NULL,
    loai_van_chuyen NVARCHAR(20) NOT NULL,
    ma_dich_vu_ghn INT,
    loai_dich_vu_ghn INT,
    trang_thai_kich_hoat BIT NOT NULL DEFAULT 1,
    thoi_gian_tao DATETIME2 NOT NULL,
    thoi_gian_cap_nhat DATETIME2 NOT NULL
);
```

## Troubleshooting

### 1. Token không hợp lệ
- Kiểm tra token đã được cập nhật đúng trong application.properties
- Verify token còn hiệu lực trên portal GHN

### 2. Shop ID không tồn tại  
- Kiểm tra Shop ID từ trang quản lý cửa hàng GHN
- Đảm bảo shop đã được kích hoạt

### 3. API trả về lỗi 400/500
- Kiểm tra request parameters có đúng format không
- Verify district ID và ward code có tồn tại không

### 4. Không tính được cước phí
- Kiểm tra service_id có hợp lệ với route vận chuyển không
- Verify trọng lượng và kích thước hàng hóa

## Contact Support
- GHN Support: https://ghn.vn/lien-he
- Technical Issues: Kiểm tra logs trong application để debug chi tiết