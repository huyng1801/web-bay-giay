// Controller quản lý các chức năng liên quan đến khách hàng
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.CustomerDto;
import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.response.CustomerResponse;
import vn.student.polyshoes.service.CustomerService;

import java.util.List;
import java.util.stream.Collectors;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến khách hàng
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/customers")
public class CustomerController {

    // Inject CustomerService để xử lý logic liên quan đến khách hàng
    @Autowired
    private CustomerService customerService;

    // Tạo mới một khách hàng
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody CustomerDto customerDto) {
        try {
            Customer createdCustomer = customerService.createCustomer(customerDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(createdCustomer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lấy danh sách tất cả khách hàng
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerResponse> responseList = customers.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // Lấy thông tin khách hàng theo id
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(toResponse(customer));
    }

    // Cập nhật thông tin khách hàng theo id
    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateCustomer(@PathVariable Integer customerId, @RequestBody CustomerDto customerDto) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(customerId, customerDto);
            return ResponseEntity.ok(toResponse(updatedCustomer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa khách hàng theo id
    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }

    // Đổi trạng thái hoạt động của khách hàng (ẩn/hiện)
    @PutMapping("/{customerId}/toggle-status")
    public ResponseEntity<?> toggleCustomerStatus(@PathVariable Integer customerId) {
        try {
            Customer customer = customerService.toggleCustomerStatus(customerId);
            return ResponseEntity.ok(toResponse(customer));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Hàm hỗ trợ: chuyển đổi từ Customer sang CustomerResponse
    private CustomerResponse toResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setCustomerId(customer.getCustomerId());
        response.setFullName(customer.getFullName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setAddress(customer.getAddress());
        response.setAddress2(customer.getAddress2());
        response.setCity(customer.getCity());
        response.setIsActive(customer.getIsActive());
        return response;
    }
}
