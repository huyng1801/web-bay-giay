# Chatbot Poly Shoes - Rasa AI

Chatbot AI tự động tư vấn size và tìm kiếm sản phẩm cho website bán quần áo Poly Shoes, sử dụng dữ liệu thực tế từ backend Spring Boot.

## Tính năng

### 🎯 Tư vấn size thông minh
- **Size áo:** Tư vấn XS, S, M, L, XL, XXL dựa trên chiều cao, cân nặng, giới tính
- **Size quần:** Tư vấn size số (28, 29, 30...) cho nam và size chữ (S, M, L...) cho nữ
- **Chuẩn Việt Nam:** Logic tư vấn được thiết kế riêng cho người Việt Nam
- **Chi tiết:** Kèm hướng dẫn vòng ngực, vòng eo, vòng mông

### 🔍 Tìm kiếm sản phẩm thực tế
- Kết nối API backend để lấy dữ liệu sản phẩm thực tế
- Tìm theo tên, màu sắc, khoảng giá
- Hiển thị giá, giảm giá, link sản phẩm

### 💬 Hỗ trợ toàn diện
- Chính sách đổi trả, vận chuyển
- Khuyến mãi hiện tại
- Hướng dẫn đặt hàng
- Tra cứu đơn hàng

## Cài đặt

### 1. Cài đặt Rasa
```bash
pip install rasa
pip install rasa-sdk
pip install requests
```

### 2. Khởi tạo project
```bash
cd d:/Outsourcing/Java/Web/poly-shoes/chatbot
rasa init --no-prompt
```

### 3. Train model
```bash
rasa train
```

### 4. Chạy action server (Terminal 1)
```bash
# Đảm bảo tạo file __init__.py trong thư mục actions
rasa run actions --port 5055
```

### 5. Chạy chatbot server (Terminal 2)
```bash
rasa run --enable-api --cors "*" --port 5005
```

### 6. Test chatbot
```bash
# Terminal 3 (tùy chọn)
rasa shell
```

## Khắc phục lỗi

### Lỗi: "No module named 'actions'"
- Tạo file `actions/__init__.py` nếu chưa có
- Đảm bảo đã cài đặt `rasa-sdk`: `pip install rasa-sdk`
- Chạy từ thư mục chatbot root

### Lỗi: "Failed to execute custom action"
- Đảm bảo file `endpoints.yml` tồn tại với cấu hình đúng
- Action server phải chạy trước khi start Rasa server

## Cấu trúc project

```
chatbot/
├── data/
│   ├── nlu.yml          # Dữ liệu training intent và entity
│   ├── stories.yml      # Kịch bản hội thoại
│   └── rules.yml        # Quy tắc cứng
├── actions/
│   └── actions.py       # Logic xử lý action (tư vấn size, API call)
├── config.yml           # Cấu hình pipeline và policy
├── domain.yml           # Intent, entity, slot, response
└── endpoints.yml        # Cấu hình endpoint (tự tạo)
```

## Tích hợp vào website

### 1. Chạy Rasa server
```bash
rasa run --enable-api --cors "*" --port 5005
```

### 2. Thêm widget vào frontend
Chỉnh sửa file `frontend/src/layouts/CustomerLayout.jsx`:

```jsx
// Thêm vào cuối layout
<div style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000
}}>
    <iframe
        src="http://localhost:5005/static/widget.html"
        width="350"
        height="500"
        frameBorder="0"
        title="polyshoes Chatbot"
    />
</div>
```

### 3. Tạo widget HTML
Tạo file `chatbot/static/widget.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>polyshoes Chatbot</title>
    <script src="https://unpkg.com/@botframework/webchat/lib/index.js"></script>
</head>
<body>
    <div id="chatbot"></div>
    <script>
        // Widget chat đơn giản hoặc dùng Rasa X
    </script>
</body>
</html>
```

## Ví dụ sử dụng

### Tư vấn size áo
```
User: Tôi cao 1m70 nặng 65kg, nam, muốn mua áo sơ mi
Bot: Dựa trên thông tin chiều cao 170cm, cân nặng 65kg, giới tính nam, 
     tôi khuyên bạn nên chọn size áo L.
     
     Size L Nam: Chiều cao 168-175cm, cân nặng 65-75kg, rộng ngực 96-100cm
```

### Tìm kiếm sản phẩm
```
User: Tìm áo thun màu đỏ giá dưới 300000
Bot: Tôi tìm thấy 3 sản phẩm phù hợp:
     
     1. Áo thun nam basic màu đỏ
        Giá: 250,000đ
        Giảm giá: 20%
        Link: http://localhost:3000/product/123
```

## Mở rộng

### Thêm intent mới
1. Cập nhật `data/nlu.yml` với examples mới
2. Thêm action tương ứng trong `actions/actions.py`
3. Cập nhật `domain.yml`
4. Train lại: `rasa train`

### Kết nối API khác
Chỉnh sửa `BACKEND_API_URL` trong `actions/actions.py` để kết nối với API endpoint khác.

## Lưu ý
- Đảm bảo backend Spring Boot đang chạy ở `http://localhost:8080`
- Chatbot được thiết kế cho người Việt Nam với logic size riêng
- Có thể tùy chỉnh logic tư vấn size trong `actions/actions.py`

## Deploy production
1. Sử dụng Rasa X cho giao diện quản lý
2. Deploy lên server với Docker
3. Cấu hình HTTPS và domain riêng
4. Tối ưu performance với Redis/PostgreSQL