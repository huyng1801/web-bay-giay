package vn.student.polyshoes.config;


import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class VNPAYConfig {
    // URL thanh toán VNPAY
    public static String vnp_PayUrl;
    // URL trả về sau khi thanh toán
    public static String vnp_Returnurl;
    // Mã website VNPAY
    public static String vnp_TmnCode;
    // Khóa bí mật VNPAY
    public static String vnp_HashSecret;
    // API URL VNPAY
    public static String vnp_apiUrl;

    // Đọc cấu hình từ file properties
    @Value("${vnpay.pay-url}")
    public void setVnp_PayUrl(String url) { VNPAYConfig.vnp_PayUrl = url; }
    @Value("${vnpay.return-url}")
    public void setVnp_Returnurl(String url) { VNPAYConfig.vnp_Returnurl = url; }
    @Value("${vnpay.tmn-code}")
    public void setVnp_TmnCode(String code) { VNPAYConfig.vnp_TmnCode = code; }
    @Value("${vnpay.hash-secret}")
    public void setVnp_HashSecret(String secret) { VNPAYConfig.vnp_HashSecret = secret; }
    @Value("${vnpay.api-url}")
    public void setVnp_apiUrl(String url) { VNPAYConfig.vnp_apiUrl = url; }


    // Tạo chuỗi hash cho dữ liệu gửi VNPAY
    public static String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(vnp_HashSecret,sb.toString());
    }

    // Mã hóa HMAC SHA512
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException("Khóa hoặc dữ liệu không được để trống!");
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            // Trả về chuỗi rỗng và có thể log ra thông báo tiếng Việt nếu cần
            // System.err.println("Lỗi mã hóa HMAC SHA512: " + ex.getMessage());
            return "";
        }
    }

    // Lấy địa chỉ IP client
    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getLocalAddr();
            }
        } catch (Exception e) {
            ipAdress = "IP không hợp lệ: " + e.getMessage();
        }
        return ipAdress;
    }

    // Tạo chuỗi số ngẫu nhiên
    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}