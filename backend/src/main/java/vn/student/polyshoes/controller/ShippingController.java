package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.ShippingDto;
import vn.student.polyshoes.service.ShippingService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shippings")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    @GetMapping
    public ResponseEntity<List<ShippingDto>> getAllShippings() {
        List<ShippingDto> shippings = shippingService.getAllShippings();
        return ResponseEntity.ok(shippings);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ShippingDto>> getActiveShippings() {
        List<ShippingDto> shippings = shippingService.getActiveShippings();
        return ResponseEntity.ok(shippings);
    }



    @GetMapping("/{id}")
    public ResponseEntity<ShippingDto> getShippingById(@PathVariable Integer id) {
        Optional<ShippingDto> shipping = shippingService.getShippingById(id);
        return shipping.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ShippingDto> getShippingByCode(@PathVariable String code) {
        Optional<ShippingDto> shipping = shippingService.getShippingByCode(code);
        return shipping.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createShipping(@RequestBody ShippingDto shippingDto) {
        ShippingDto createdShipping = shippingService.createShipping(shippingDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdShipping);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateShipping(@PathVariable Integer id, @RequestBody ShippingDto shippingDto) {
        ShippingDto updatedShipping = shippingService.updateShipping(id, shippingDto);
        return ResponseEntity.ok(updatedShipping);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShipping(@PathVariable Integer id) {
        shippingService.deleteShipping(id);
        return ResponseEntity.ok("Xóa phương thức vận chuyển thành công");
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleShippingStatus(@PathVariable Integer id) {
        ShippingDto updatedShipping = shippingService.toggleShippingStatus(id);
        return ResponseEntity.ok(updatedShipping);
    }

    @GetMapping("/type/{shippingType}")
    public ResponseEntity<List<ShippingDto>> getShippingsByType(@PathVariable String shippingType) {
        List<ShippingDto> shippings = shippingService.getShippingsByType(shippingType);
        return ResponseEntity.ok(shippings);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ShippingDto>> searchShippingsByName(@RequestParam String name) {
        List<ShippingDto> shippings = shippingService.searchShippingsByName(name);
        return ResponseEntity.ok(shippings);
    }


}
