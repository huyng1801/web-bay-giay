package vn.student.polyshoes.enums;

/**
 * Enum định nghĩa các khu vực vận chuyển
 */
public enum ShippingType {
    HANOI_INNER("Nội thành Hà Nội", "Trong tỉnh Hà Nội"),
    NORTHERN("Miền Bắc", "Các tỉnh miền Bắc (trừ Hà Nội)"),
    CENTRAL("Miền Trung", "Các tỉnh miền Trung"),
    SOUTHERN("Miền Nam", "Các tỉnh miền Nam");

    private final String displayName;
    private final String description;

    ShippingType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Lấy danh sách tỉnh thành thuộc khu vực
     */
    public String[] getProvinces() {
        switch (this) {
            case HANOI_INNER:
                return new String[]{
                    "Hà Nội"
                };
                
            case NORTHERN:
                return new String[]{
                    "Hà Giang", "Cao Bằng", "Bắc Kạn", "Tuyên Quang", "Lào Cai", "Điện Biên",
                    "Lai Châu", "Sơn La", "Yên Bái", "Hòa Bình", "Thái Nguyên", "Lạng Sơn",
                    "Quảng Ninh", "Bắc Giang", "Phú Thọ", "Vĩnh Phúc", "Bắc Ninh", "Hải Dương",
                    "Hải Phòng", "Hưng Yên", "Thái Bình", "Hà Nam", "Nam Định", "Ninh Bình"
                };
                
            case CENTRAL:
                return new String[]{
                    "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế",
                    "Đà Nẵng", "Quảng Nam", "Quảng Ngãi", "Bình Định", "Phú Yên", "Khánh Hòa",
                    "Ninh Thuận", "Bình Thuận", "Kon Tum", "Gia Lai", "Đắk Lắk", "Đắk Nông", "Lâm Đồng"
                };
                
            case SOUTHERN:
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
     * Tìm khu vực dựa trên tên tỉnh/thành phố
     */
    public static ShippingType findByProvince(String provinceName) {
        for (ShippingType type : values()) {
            for (String province : type.getProvinces()) {
                if (province.toLowerCase().contains(provinceName.toLowerCase()) ||
                    provinceName.toLowerCase().contains(province.toLowerCase())) {
                    return type;
                }
            }
        }
        return NORTHERN; // Mặc định
    }
}