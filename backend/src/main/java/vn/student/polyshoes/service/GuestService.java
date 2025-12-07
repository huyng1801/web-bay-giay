package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.GuestDto;
import vn.student.polyshoes.model.Guest;
import vn.student.polyshoes.repository.GuestRepository;
import vn.student.polyshoes.response.GuestResponse;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuestService {
    @Autowired
    private GuestRepository guestRepository;

    public GuestResponse createGuest(GuestDto guestDto) {
        Guest guest = new Guest();
        guest.setFullName(guestDto.getFullName());
        guest.setEmail(guestDto.getEmail());
        guest.setPhone(guestDto.getPhone());
        guest.setAddress(guestDto.getAddress());
        guest.setAddress2(guestDto.getAddress2());
        guest.setCity(guestDto.getCity());
        Date now = new Date();
        guest.setCreatedAt(now);
        guest.setUpdatedAt(now);
        return mapToResponse(guestRepository.save(guest));
    }

    public GuestResponse getGuestById(Integer guestId) {
        Guest guest = guestRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("Guest not found with id: " + guestId));
        return mapToResponse(guest);
    }

    public GuestResponse updateGuest(Integer guestId, GuestDto guestDto) {
        Guest guest = guestRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("Guest not found with id: " + guestId));
        guest.setFullName(guestDto.getFullName());
        guest.setEmail(guestDto.getEmail());
        guest.setPhone(guestDto.getPhone());
        guest.setAddress(guestDto.getAddress());
        guest.setAddress2(guestDto.getAddress2());
        guest.setCity(guestDto.getCity());
        guest.setUpdatedAt(new Date());
        return mapToResponse(guestRepository.save(guest));
    }

    public void deleteGuest(Integer guestId) {
        Guest guest = guestRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("Guest not found with id: " + guestId));
        guestRepository.delete(guest);
    }

    public List<GuestResponse> getAllGuests() {
        return guestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GuestResponse mapToResponse(Guest guest) {
        return new GuestResponse(
                guest.getGuestId(),
                guest.getFullName(),
                guest.getEmail(),
                guest.getPhone(),
                guest.getAddress(),
                guest.getAddress2(),
                guest.getCity(),
                guest.getCreatedAt(),
                guest.getUpdatedAt()
        );
    }
}
