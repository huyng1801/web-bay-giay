package vn.student.polyshoes.enums;

/**
 * Enum định nghĩa các khu vực vận chuyển trong nước Việt Nam
 * Dùng để tính phí vận chuyển và quản lý các khu vực giao hàng
 */
public enum ShippingType {
    // Nội thành Hà Nội (phí vận chuyển thấp nhất)
    HANOI_INNER("Nội thành Hà Nội", "Trong tỉnh Hà Nội"),
    // Miền Bắc: các tỉnh từ Hà Giang đến Ninh Bình (trừ Hà Nội)
    NORTHERN("Miền Bắc", "Các tỉnh miền Bắc (trừ Hà Nội)"),
    // Miền Trung: từ Thanh Hóa đến Lâm Đồng
    CENTRAL("Miền Trung", "Các tỉnh miền Trung"),
    // Miền Nam: từ TP. Hồ Chí Minh đến Cà Mau
    SOUTHERN("Miền Nam", "Các tỉnh miền Nam");

    // Tên hiển thị của khu vực
    private final String displayName;
    // Mô tả chi tiết về khu vực
    private final String description;

    // Constructor khởi tạo ShippingType
    ShippingType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    // Lấy tên hiển thị của khu vực
    public String getDisplayName() {
        return displayName;
    }

    // Lấy mô tả chi tiết của khu vực
    public String getDescription() {
        return description;
    }

    /**
     * Lấy danh sách tỉnh thành/thành phố thuộc khu vực này
     * @return mảng chứa tên các tỉnh thành
     */
    public String[] getProvinces() {
        switch (this) {
            case HANOI_INNER:
                return new String[]{
                    // Hà Nội
                    "Hà Nội"
                };
                
            case NORTHERN:
                // Miền Bắc gồm 24 tỉnh thành
                return new String[]{
                    "Hà Giang", "Cao Bằng", "Bắc Kạn", "Tuyên Quang", "Lào Cai", "Điện Biên",
                    "Lai Châu", "Sơn La", "Yên Bái", "Hòa Bình", "Thái Nguyên", "Lạng Sơn",
                    "Quảng Ninh", "Bắc Giang", "Phú Thọ", "Vĩnh Phúc", "Bắc Ninh", "Hải Dương",
                    "Hải Phòng", "Hưng Yên", "Thái Bình", "Hà Nam", "Nam Định", "Ninh Bình"
                };
                
            case CENTRAL:
                // Miền Trung gồm 19 tỉnh thành
                return new String[]{
                    "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế",
                    "Đà Nẵng", "Quảng Nam", "Quảng Ngãi", "Bình Định", "Phú Yên", "Khánh Hòa",
                    "Ninh Thuận", "Bình Thuận", "Kon Tum", "Gia Lai", "Đắk Lắk", "Đắk Nông", "Lâm Đồng"
                };
                
            case SOUTHERN:
                // Miền Nam gồm 21 tỉnh thành
                return new String[]{
                    "TP. Hồ Chí Minh", "Bình Phước", "Tây Ninh", "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu",
                    "Long An", "Tiền Giang", "Bến Tre", "Trà Vinh", "Vĩnh Long", "Đồng Tháp",
                    "An Giang", "Kiên Giang", "Cần Thơ", "Hậu Giang", "Sóc Trăng", "Bạc Liêu", "Cà Mau"
                };
                
            default:
                return new String[]{};
        }
    }

    /**
     * Tìm khu vực vận chuyển dựa trên tên tỉnh/thành phố
     * @param provinceName tên tỉnh/thành phố cần tìm
     * @return khu vực tương ứng, mặc định trả về NORTHERN nếu không tìm thấy
     */
    public static ShippingType findByProvince(String provinceName) {
        for (ShippingType type : values()) {
            for (String province : type.getProvinces()) {
                // So sánh không phân biệt hoa thường
                if (province.toLowerCase().contains(provinceName.toLowerCase()) ||
                    provinceName.toLowerCase().contains(province.toLowerCase())) {
                    return type;
                }
            }
        }
        // Mặc định trả về NORTHERN nếu không tìm thấy
        return NORTHERN;
    }
}