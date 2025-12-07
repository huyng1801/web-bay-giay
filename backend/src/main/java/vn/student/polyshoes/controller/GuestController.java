package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.GuestDto;
import vn.student.polyshoes.response.GuestResponse;
import vn.student.polyshoes.service.GuestService;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {
    @Autowired
    private GuestService guestService;

    @PostMapping
    public ResponseEntity<GuestResponse> createGuest(@RequestBody GuestDto guestDto) {
        GuestResponse createdGuestResponse = guestService.createGuest(guestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGuestResponse);
    }

    @GetMapping("/{guestId}")
    public ResponseEntity<GuestResponse> getGuestById(@PathVariable Integer guestId) {
        GuestResponse guestResponse = guestService.getGuestById(guestId);
        return ResponseEntity.ok(guestResponse);
    }

    @PutMapping("/{guestId}")
    public ResponseEntity<GuestResponse> updateGuest(@PathVariable Integer guestId, @RequestBody GuestDto guestDto) {
        GuestResponse updatedGuestResponse = guestService.updateGuest(guestId, guestDto);
        return ResponseEntity.ok(updatedGuestResponse);
    }

    @DeleteMapping("/{guestId}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Integer guestId) {
        guestService.deleteGuest(guestId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<GuestResponse>> getAllGuests() {
        List<GuestResponse> guests = guestService.getAllGuests();
        return ResponseEntity.ok(guests);
    }
}
