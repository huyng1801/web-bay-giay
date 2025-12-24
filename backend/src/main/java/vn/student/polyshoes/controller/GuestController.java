// Controller quản lý các chức năng liên quan đến khách vãng lai (guest)
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.GuestDto;
import vn.student.polyshoes.response.GuestResponse;
import vn.student.polyshoes.service.GuestService;

import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến khách vãng lai
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/api/guests")
public class GuestController {
    // Inject GuestService để xử lý logic liên quan đến khách vãng lai
    @Autowired
    private GuestService guestService;

    // Tạo mới một khách vãng lai
    @PostMapping
    public ResponseEntity<GuestResponse> createGuest(@RequestBody GuestDto guestDto) {
        GuestResponse createdGuestResponse = guestService.createGuest(guestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGuestResponse);
    }

    // Lấy thông tin khách vãng lai theo id
    @GetMapping("/{guestId}")
    public ResponseEntity<GuestResponse> getGuestById(@PathVariable Integer guestId) {
        GuestResponse guestResponse = guestService.getGuestById(guestId);
        return ResponseEntity.ok(guestResponse);
    }

    // Cập nhật thông tin khách vãng lai theo id
    @PutMapping("/{guestId}")
    public ResponseEntity<GuestResponse> updateGuest(@PathVariable Integer guestId, @RequestBody GuestDto guestDto) {
        GuestResponse updatedGuestResponse = guestService.updateGuest(guestId, guestDto);
        return ResponseEntity.ok(updatedGuestResponse);
    }

    // Xóa khách vãng lai theo id
    @DeleteMapping("/{guestId}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Integer guestId) {
        guestService.deleteGuest(guestId);
        return ResponseEntity.noContent().build();
    }

    // Lấy danh sách tất cả khách vãng lai
    @GetMapping
    public ResponseEntity<List<GuestResponse>> getAllGuests() {
        List<GuestResponse> guests = guestService.getAllGuests();
        return ResponseEntity.ok(guests);
    }
}
