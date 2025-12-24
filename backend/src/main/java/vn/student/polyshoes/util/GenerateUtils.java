
// Lớp tiện ích dùng để sinh chuỗi ngày giờ định dạng và UUID
package vn.student.polyshoes.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;


/**
 * Lớp tiện ích hỗ trợ sinh chuỗi ngày giờ định dạng và UUID ngẫu nhiên
 */
public class GenerateUtils {


    /**
     * Lấy chuỗi ngày giờ hiện tại theo định dạng yyyyMMddHHmmss
     * @return Chuỗi ngày giờ, ví dụ: 20251224153045
     */
    public static String getFormattedDate() {
        return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    }


    /**
     * Sinh chuỗi UUID ngẫu nhiên (dạng 36 ký tự)
     * @return Chuỗi UUID, ví dụ: 123e4567-e89b-12d3-a456-426614174000
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString();
    }
}
