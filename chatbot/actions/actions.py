import requests
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import logging

# URL của backend API
BACKEND_API_URL = "http://localhost:8080"
logger = logging.getLogger(__name__)

# Bảng quy đổi size giày từ độ dài bàn chân (cm) sang size EU
SHOE_SIZE_TABLE = {
    22.5: 36,
    23.0: 36,
    23.5: 37,
    24.0: 38,
    24.5: 39,
    25.0: 40,
    25.5: 41,
    26.0: 42,
    26.5: 43,
    27.0: 44,
    27.5: 45,
    28.0: 46,
    28.5: 47,
    29.0: 48
}

# Bảng chi tiết size giày
SHOE_SIZE_DETAILS = {
    36: {"length": "22.5-23.0cm", "foot_description": "Chân nhỏ"},
    37: {"length": "23.5cm", "foot_description": "Chân nhỏ"},
    38: {"length": "24.0cm", "foot_description": "Chân nhỏ - trung bình"},
    39: {"length": "24.5cm", "foot_description": "Chân trung bình"},
    40: {"length": "25.0cm", "foot_description": "Chân trung bình"},
    41: {"length": "25.5cm", "foot_description": "Chân trung bình - lớn"},
    42: {"length": "26.0cm", "foot_description": "Chân lớn"},
    43: {"length": "26.5cm", "foot_description": "Chân lớn"},
    44: {"length": "27.0cm", "foot_description": "Chân rất lớn"},
    45: {"length": "27.5cm", "foot_description": "Chân rất lớn"},
    46: {"length": "28.0cm", "foot_description": "Chân rất lớn"},
}

# Danh sách thương hiệu giày tại Poly Shoes
SHOE_BRANDS = [
    {"name": "Nike", "description": "Thương hiệu thể thao số 1 thế giới, nổi tiếng với giày chạy bộ và bóng rổ"},
    {"name": "Adidas", "description": "Thương hiệu Đức với công nghệ Boost, phong cách thể thao đường phố"},
    {"name": "Puma", "description": "Thương hiệu Đức, nổi bật với thiết kế năng động và giá cả phải chăng"},
    {"name": "Converse", "description": "Giày canvas cổ điển, phong cách casual trẻ trung"},
    {"name": "Vans", "description": "Giày skateboard, phong cách streetwear"},
    {"name": "New Balance", "description": "Chuyên giày chạy bộ với độ êm và hỗ trợ vượt trội"},
    {"name": "Timberland", "description": "Giày boot da cao cấp, phong cách outdoor"},
    {"name": "Reebok", "description": "Thương hiệu thể thao với công nghệ đệm DMX"}
]

# Suggestions templates
SIZE_AO_SUGGESTIONS = [
    "Tôi cao 170cm nặng 65kg cần tư vấn size áo",
]

def parse_foot_length(value: Any) -> float:
    """Chuyển đổi giá trị độ dài chân thành số (cm)"""
    if value is None:
        return None
    
    if isinstance(value, (int, float)):
        return float(value)
    
    if isinstance(value, str):
        value = value.strip().lower().replace('cm', '').replace(' ', '')
        try:
            return float(value)
        except ValueError:
            return None
    
    return None


def get_shoe_size_from_foot_length(foot_length: float) -> int:
    """Tìm size giày từ độ dài bàn chân"""
    if foot_length is None:
        return None
    
    # Tìm size gần nhất trong bảng
    closest_size = None
    min_diff = float('inf')
    
    for length, size in SHOE_SIZE_TABLE.items():
        diff = abs(foot_length - length)
        if diff < min_diff:
            min_diff = diff
            closest_size = size
    
    return closest_size


def get_foot_length_from_size(size: int) -> str:
    """Tìm độ dài chân từ size giày"""
    if size in SHOE_SIZE_DETAILS:
        return SHOE_SIZE_DETAILS[size]["length"]
    return "Không xác định"


class ActionTuVanSizeGiay(Action):
    """Action tư vấn size giày dựa trên độ dài bàn chân"""
    
    def name(self) -> Text:
        return "action_tu_van_size_giay"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy độ dài chân từ slot
        do_dai_chan_str = tracker.get_slot("do_dai_chan")
        do_dai_chan = parse_foot_length(do_dai_chan_str)
        
        logger.info(f"Shoe size action - Foot length: {do_dai_chan}cm")
        
        # Nếu user hỏi ngược: "size 40 dài bao nhiêu cm?"
        if do_dai_chan_str and any(str(s) in str(do_dai_chan_str) for s in range(36, 47)):
            try:
                size_num = int(''.join(filter(str.isdigit, str(do_dai_chan_str))))
                if 36 <= size_num <= 46:
                    foot_length = get_foot_length_from_size(size_num)
                    message = f"""
<div class="size-info">
    <h3 style="color: #28a745; margin-bottom: 15px;">👟 Thông tin size giày</h3>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <p><strong>👟 Size:</strong> <span style="color: #007bff; font-size: 18px; font-weight: bold;">{size_num} EU</span></p>
        <p><strong>📏 Độ dài chân phù hợp:</strong> {foot_length}</p>
    </div>
    
    {self.get_size_guide_table()}
    
    <div style="margin-top: 15px;">
        <p><strong>💡 Lưu ý:</strong> Nên đo chân vào buổi chiều vì chân có thể sưng nhẹ. Nếu chân nằm giữa 2 size, chọn size lớn hơn để thoải mái.</p>
        <p><a href="http://localhost:3000/product" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">🛒 Xem giày tại Poly Shoes</a></p>
    </div>
</div>
                    """
                    dispatcher.utter_message(text=message)
                    return []
            except:
                pass
        
        # Kiểm tra thông tin
        if do_dai_chan is None or do_dai_chan < 20 or do_dai_chan > 35:
            message = """
<div class="size-request">
    <h3 style="color: #17a2b8; margin-bottom: 15px;">👟 Tư vấn size giày</h3>
    <div style="background: #d1ecf1; padding: 15px; border-radius: 8px;">
        <p><strong>Vui lòng cho biết độ dài bàn chân của bạn (tính bằng cm):</strong></p>
        <p>📏 <em>Ví dụ: "Chân tôi dài 25cm", "25.5cm", "26"</em></p>
    </div>
    
    <div style="background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 10px 0;">
        <p><strong>💡 Gợi ý câu hỏi:</strong></p>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li style="color: #0066cc;">"Chân tôi dài 25cm nên mang size nào?"</li>
            <li style="color: #0066cc;">"Tư vấn size giày cho chân 26cm"</li>
            <li style="color: #0066cc;">"Size 40 dài bao nhiêu cm?"</li>
            <li style="color: #0066cc;">"Cách đo size chân"</li>
        </ul>
    </div>
</div>
            """
            dispatcher.utter_message(text=message)
            return []
        
        try:
            # Tính size giày phù hợp
            size_giay = get_shoe_size_from_foot_length(do_dai_chan)
            
            if size_giay is None:
                dispatcher.utter_message(text='<div style="color: #dc3545;"><h4>❌ Không tìm thấy size phù hợp. Vui lòng kiểm tra lại độ dài chân.</h4></div>')
                return []
            
            size_detail = SHOE_SIZE_DETAILS.get(size_giay, {})
            
            # Tạo response HTML
            message = f"""
<div class="size-advice">
    <h3 style="color: #28a745; margin-bottom: 15px;">✅ Kết quả tư vấn size giày</h3>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <p><strong>📏 Độ dài chân:</strong> {do_dai_chan}cm</p>
        <p><strong>👟 Size khuyến nghị:</strong> <span style="color: #007bff; font-size: 24px; font-weight: bold;">{size_giay} EU</span></p>
        <p><strong>👣 Loại chân:</strong> {size_detail.get("foot_description", "")}</p>
    </div>
    
    {self.get_size_guide_table()}
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>💡 Lưu ý khi chọn giày:</strong></p>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li>Đo chân vào buổi chiều vì chân có thể sưng nhẹ trong ngày</li>
            <li>Nếu chân nằm giữa 2 size, chọn size lớn hơn để thoải mái</li>
            <li>Giày thể thao nên vừa vặn, giày da có thể chọn rộng hơn 0.5 size</li>
            <li>Đo cả 2 chân vì có thể khác nhau, chọn theo chân lớn hơn</li>
        </ul>
    </div>
    
    <div style="margin-top: 15px;">
        <p><a href="http://localhost:3000/product" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🛒 Mua giày size {size_giay} tại Poly Shoes</a></p>
    </div>
</div>
            """
            
            dispatcher.utter_message(text=message)
            return [SlotSet("size_giay", str(size_giay))]
            
        except Exception as e:
            logger.error(f"Error in action_tu_van_size_giay: {str(e)}")
            dispatcher.utter_message(text='<div style="color: #dc3545;"><h4>❌ Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.</h4></div>')
            return []
    
    def get_size_guide_table(self) -> str:
        """Tạo bảng size giày đầy đủ"""
        html = """
<div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h4 style="color: #0277bd; margin-bottom: 10px;">📊 Bảng size giày Poly Shoes (EU)</h4>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #0277bd; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">Size EU</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Độ dài chân (cm)</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Loại chân</th>
            </tr>
        </thead>
        <tbody>
"""
        for size in sorted(SHOE_SIZE_DETAILS.keys()):
            detail = SHOE_SIZE_DETAILS[size]
            html += f"""
            <tr style="background: {'#f8f9fa' if size % 2 == 0 else 'white'};">
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;"><strong>{size}</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">{detail['length']}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">{detail['foot_description']}</td>
            </tr>
"""
        
        html += """
        </tbody>
    </table>
</div>
        """
        return html


class ActionDoChan(Action):
    """Action hướng dẫn cách đo size chân"""
    
    def name(self) -> Text:
        return "action_do_chan"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """
<div class="measurement-guide">
    <h3 style="color: #28a745; margin-bottom: 15px;">📏 Hướng dẫn đo size chân chính xác</h3>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h4 style="color: #007bff;">🎯 Chuẩn bị:</h4>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li>1 tờ giấy A4 trắng</li>
            <li>1 cây bút</li>
            <li>1 thước kẻ</li>
            <li>Đeo tất nếu bạn định mang giày với tất</li>
        </ul>
    </div>
    
    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h4 style="color: #0277bd;">📐 Các bước đo:</h4>
        <ol style="margin: 5px 0; padding-left: 20px;">
            <li><strong>Bước 1:</strong> Đặt tờ giấy A4 sát tường trên sàn phẳng</li>
            <li><strong>Bước 2:</strong> Đứng chân trần (hoặc mang tất) lên giấy, gót chân chạm tường</li>
            <li><strong>Bước 3:</strong> Đứng thẳng, trọng lượng phân bổ đều 2 chân</li>
            <li><strong>Bước 4:</strong> Dùng bút đánh dấu điểm xa nhất của ngón chân cái</li>
            <li><strong>Bước 5:</strong> Dùng thước đo khoảng cách từ mép giấy (tường) đến dấu vừa đánh</li>
            <li><strong>Bước 6:</strong> Làm tương tự với chân còn lại</li>
        </ol>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h4 style="color: #856404;">💡 Lưu ý quan trọng:</h4>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li>⏰ <strong>Thời điểm đo:</strong> Nên đo vào buổi chiều vì chân có thể sưng nhẹ</li>
            <li>👣 <strong>Đo cả 2 chân:</strong> Chân trái và phải có thể khác nhau, chọn số đo lớn hơn</li>
            <li>📏 <strong>Cộng thêm:</strong> Cộng thêm 0.5-1cm cho thoải mái (không bắt buộc)</li>
            <li>🧦 <strong>Mang tất:</strong> Nếu định mang giày với tất, đo khi đang mang tất</li>
            <li>📊 <strong>Kiểm tra lại:</strong> Đo 2-3 lần để đảm bảo chính xác</li>
        </ul>
    </div>
    
    <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h4 style="color: #155724;">✅ Ví dụ thực tế:</h4>
        <p>Nếu đo được chân dài <strong>25.3cm</strong>, bạn có thể:</p>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li>Chọn size <strong>40</strong> (25.0cm) - vừa khít, phù hợp giày thể thao</li>
            <li>Chọn size <strong>41</strong> (25.5cm) - thoải mái hơn, phù hợp giày da</li>
        </ul>
    </div>
    
    <div style="margin-top: 15px; text-align: center;">
        <p><strong>Sau khi đo xong, hãy hỏi tôi:</strong></p>
        <p style="color: #0066cc; font-size: 16px;">"Chân tôi dài 25cm nên mang size nào?"</p>
        <p><a href="http://localhost:3000/product" target="_blank" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">🛒 Mua giày tại Poly Shoes</a></p>
    </div>
</div>
        """
        
        dispatcher.utter_message(text=message)
        return []


class ActionHoiThuongHieu(Action):
    """Action cung cấp thông tin về thương hiệu giày"""
    
    def name(self) -> Text:
        return "action_hoi_thuong_hieu"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        thuong_hieu = tracker.get_slot("thuong_hieu")
        
        # Nếu hỏi về thương hiệu cụ thể
        if thuong_hieu:
            thuong_hieu_lower = thuong_hieu.lower()
            for brand in SHOE_BRANDS:
                if brand["name"].lower() == thuong_hieu_lower:
                    message = f"""
<div class="brand-info">
    <h3 style="color: #28a745; margin-bottom: 15px;">👟 Thông tin thương hiệu {brand['name']}</h3>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <p><strong>🏢 Thương hiệu:</strong> {brand['name']}</p>
        <p><strong>📝 Mô tả:</strong> {brand['description']}</p>
        <p><strong>✅ Có sẵn tại:</strong> <span style="color: #28a745; font-weight: bold;">Poly Shoes</span></p>
    </div>
    
    <div style="margin-top: 15px;">
        <p><a href="http://localhost:3000/product?brand={brand['name']}" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🛒 Xem giày {brand['name']}</a></p>
    </div>
</div>
                    """
                    dispatcher.utter_message(text=message)
                    return []
        
        # Nếu hỏi chung về thương hiệu
        message = """
<div class="brands-list">
    <h3 style="color: #28a745; margin-bottom: 15px;">👟 Các thương hiệu giày tại Poly Shoes</h3>
    
    <p style="margin-bottom: 15px;">Poly Shoes tự hào phân phối <strong>8 thương hiệu giày</strong> nổi tiếng thế giới:</p>
"""
        
        for i, brand in enumerate(SHOE_BRANDS, 1):
            bg_color = "#f8f9fa" if i % 2 == 1 else "#e3f2fd"
            message += f"""
    <div style="background: {bg_color}; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #007bff;">
        <p><strong>{i}. {brand['name']}</strong></p>
        <p style="margin: 5px 0; color: #6c757d;">{brand['description']}</p>
    </div>
"""
        
        message += """
    
    <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-top: 15px;">
        <p><strong>✅ Cam kết của Poly Shoes:</strong></p>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li>🔒 100% hàng chính hãng</li>
            <li>📦 Bảo hành đầy đủ theo chính sách nhà sản xuất</li>
            <li>🚚 Giao hàng toàn quốc</li>
            <li>↩️ Đổi trả miễn phí trong 7 ngày</li>
        </ul>
    </div>
    
    <div style="margin-top: 15px; text-align: center;">
        <p><a href="http://localhost:3000/product" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🛒 Xem tất cả sản phẩm</a></p>
    </div>
</div>
        """
        
        dispatcher.utter_message(text=message)
        return []


class ActionTimKiemGiay(Action):
    """Action tìm kiếm giày thông qua API backend"""
    
    def name(self) -> Text:
        return "action_tim_kiem_giay"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy thông tin tìm kiếm
        ten_giay = tracker.get_slot("ten_giay")
        mau_sac = tracker.get_slot("mau_sac")
        gia_min = tracker.get_slot("gia_min")
        gia_max = tracker.get_slot("gia_max")
        thuong_hieu = tracker.get_slot("thuong_hieu")
        
        try:
            # Gọi API backend để tìm kiếm sản phẩm giày
            api_url = f"{BACKEND_API_URL}/home/product"
            params = {}
            
            if ten_giay:
                params["productName"] = ten_giay
            if thuong_hieu:
                params["brand"] = thuong_hieu
            
            response = requests.get(api_url, params=params, timeout=5)
            
            if response.status_code == 200:
                products = response.json()
                
                if products:
                    # Lọc theo màu sắc và giá nếu có
                    filtered_products = self.filter_products(products, mau_sac, gia_min, gia_max)
                    
                    if filtered_products:
                        # Tạo HTML response cho danh sách giày
                        message = f"""
<div class="product-search-results">
    <h3 style="color: #28a745; margin-bottom: 15px;">🔍 Tìm thấy {len(filtered_products)} đôi giày phù hợp</h3>
    
    <div class="products-list">
"""
                        
                        # Hiển thị tối đa 5 sản phẩm đầu tiên
                        for i, product in enumerate(filtered_products[:5]):
                            discount_html = ""
                            if product.get('discountPercentage', 0) > 0:
                                original_price = product.get('sellingPrice', 0) / (1 - product.get('discountPercentage', 0)/100)
                                discount_html = f'<span style="text-decoration: line-through; color: #6c757d;">{original_price:,.0f}đ</span> <span style="color: #dc3545; font-weight: bold;">(-{product.get("discountPercentage", 0)}%)</span>'
                            
                            brand_html = f"<p><strong>🏢 Thương hiệu:</strong> {product.get('brandName', 'N/A')}</p>" if product.get('brandName') else ""
                            
                            message += f"""
        <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4 style="color: #007bff; margin-bottom: 10px;">👟 {i+1}. {product.get('productName', '')}</h4>
            {brand_html}
            <p><strong>💰 Giá:</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">{product.get('sellingPrice', 0):,}đ</span> {discount_html}</p>
            <a href="http://localhost:3000/product/{product.get('productId', '')}" target="_blank" style="background: #007bff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 5px;">🛒 Xem chi tiết</a>
        </div>
"""
                        
                        message += """
    </div>
"""
                        
                        if len(filtered_products) > 5:
                            message += f"""
    <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
        <p>... và <strong>{len(filtered_products) - 5}</strong> đôi giày khác nữa!</p>
        <a href="http://localhost:3000/product" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">🔗 Xem tất cả sản phẩm</a>
    </div>
"""
                        
                        message += """
</div>
                        """
                    else:
                        message = f"""
<div class="no-products-found">
    <h3 style="color: #dc3545; margin-bottom: 15px;">❌ Không tìm thấy giày phù hợp</h3>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <p><strong>💡 Gợi ý:</strong> Hãy thử tìm kiếm với từ khóa khác:</p>
        <ul style="margin: 5px 0; padding-left: 20px;">
            <li>"Giày Nike", "Giày Adidas", "Giày Puma"</li>
            <li>"Giày thể thao", "Giày chạy bộ", "Giày casual"</li>
            <li>"Giày màu đen", "Giày màu trắng"</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin-top: 15px;">
        <a href="http://localhost:3000/product" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🔗 Xem tất cả giày</a>
    </div>
</div>
                        """
                else:
                    message = """
<div class="no-products">
    <h3 style="color: #dc3545; margin-bottom: 15px;">❌ Không tìm thấy sản phẩm nào</h3>
    <div style="text-align: center;">
        <a href="http://localhost:3000/product" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🔗 Xem tất cả giày tại Poly Shoes</a>
    </div>
</div>
                    """
            else:
                message = f"""
<div class="api-error">
    <h3 style="color: #dc3545;">❌ Không thể kết nối đến hệ thống</h3>
    <p>Mã lỗi: {response.status_code}</p>
    <a href="http://localhost:3000/product" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🔗 Xem trực tiếp tại website</a>
</div>
                """
            
            dispatcher.utter_message(text=message)
            return []
            
        except requests.exceptions.Timeout:
            dispatcher.utter_message(text='<div style="color: #dc3545;"><h4>⏱️ Hết thời gian kết nối. Vui lòng thử lại sau.</h4><a href="http://localhost:3000/product" target="_blank">Xem sản phẩm trực tiếp</a></div>')
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            dispatcher.utter_message(text=f'<div style="color: #dc3545;"><h4>❌ Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.</h4><a href="http://localhost:3000/product" target="_blank">Xem sản phẩm trực tiếp</a></div>')
            return []
        except Exception as e:
            logger.error(f"Error in action_tim_kiem_giay: {str(e)}")
            dispatcher.utter_message(text='<div style="color: #dc3545;"><h4>❌ Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.</h4></div>')
            return []
    
    def filter_products(self, products: List[Dict], mau_sac: str, gia_min: str, gia_max: str) -> List[Dict]:
        """Lọc sản phẩm theo màu sắc và giá"""
        filtered = products
        
        # Lọc theo màu sắc
        if mau_sac:
            mau_sac_lower = mau_sac.lower()
            filtered = [p for p in filtered if mau_sac_lower in p.get('productName', '').lower()]
        
        # Lọc theo giá
        try:
            if gia_min:
                min_price = float(gia_min)
                filtered = [p for p in filtered if p.get('sellingPrice', 0) >= min_price]
            
            if gia_max:
                max_price = float(gia_max)
                filtered = [p for p in filtered if p.get('sellingPrice', 0) <= max_price]
        except ValueError:
            logger.warning(f"Invalid price filter: min={gia_min}, max={gia_max}")
        
        return filtered