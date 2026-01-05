package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.CustomerDto;
import vn.student.polyshoes.dto.LoginUserDto;
import vn.student.polyshoes.dto.RegisterDto;
import vn.student.polyshoes.enums.Role;
import vn.student.polyshoes.exception.InvalidCredentialsException;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.CustomerAddress;
import vn.student.polyshoes.repository.CustomerRepository;
import vn.student.polyshoes.repository.CustomerAddressRepository;

import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private CustomerAddressRepository customerAddressRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    
    public Customer createCustomer(CustomerDto customerDto) {
        // Validate duplicate email
        if (customerDto.getEmail() != null && !customerDto.getEmail().trim().isEmpty()) {
            Optional<Customer> existingCustomerByEmail = customerRepository.findByEmail(customerDto.getEmail());
            if (existingCustomerByEmail.isPresent()) {
                throw new IllegalArgumentException("Email đã tồn tại trong hệ thống!");
            }
        }
        
        // Validate duplicate phone
        if (customerDto.getPhone() != null && !customerDto.getPhone().trim().isEmpty()) {
            List<Customer> existingCustomersByPhone = customerRepository.findAllByPhone(customerDto.getPhone());
            if (!existingCustomersByPhone.isEmpty()) {
                throw new IllegalArgumentException("Số điện thoại đã tồn tại trong hệ thống!");
            }
        }
        
        Customer customer = new Customer();
        customer.setCustomerType(vn.student.polyshoes.enums.CustomerType.REGISTERED);
        customer.setFullName(customerDto.getFullName());
        customer.setEmail(customerDto.getEmail());
        String password = customerDto.getHashPassword();
        if (password == null || password.trim().isEmpty()) {
            password = "123456";
        }
        customer.setHashPassword(passwordEncoder.encode(password));
        customer.setEmailConfirmed(false);
        customer.setPhone(customerDto.getPhone());
        Date now = new Date();
        customer.setCreatedAt(now);
        customer.setUpdatedAt(now);
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }


        public Customer getCustomerByEmail(String email) {
                return customerRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        }
    public Customer getCustomerById(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
    }

    public Customer updateCustomer(Integer customerId, CustomerDto customerDto) {
        Customer customer = getCustomerById(customerId);
        
        // Validate duplicate email (exclude current customer)
        if (customerDto.getEmail() != null && !customerDto.getEmail().trim().isEmpty()) {
            Optional<Customer> existingCustomerByEmail = customerRepository.findByEmail(customerDto.getEmail());
            if (existingCustomerByEmail.isPresent() && !existingCustomerByEmail.get().getCustomerId().equals(customerId)) {
                throw new IllegalArgumentException("Email đã tồn tại trong hệ thống!");
            }
        }
        
        // Validate duplicate phone (exclude current customer)
        if (customerDto.getPhone() != null && !customerDto.getPhone().trim().isEmpty()) {
            List<Customer> existingCustomersByPhone = customerRepository.findAllByPhone(customerDto.getPhone());
            boolean phoneExistsInOtherCustomer = existingCustomersByPhone.stream()
                .anyMatch(c -> !c.getCustomerId().equals(customerId));
            if (phoneExistsInOtherCustomer) {
                throw new IllegalArgumentException("Số điện thoại đã tồn tại trong hệ thống!");
            }
        }
        
        customer.setFullName(customerDto.getFullName());
        customer.setEmail(customerDto.getEmail());
        if (customerDto.getHashPassword() != null && !customerDto.getHashPassword().trim().isEmpty()) {
            customer.setHashPassword(passwordEncoder.encode(customerDto.getHashPassword()));
        }
        customer.setPhone(customerDto.getPhone());
        customer.setUpdatedAt(new Date());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Integer customerId) {
        customerRepository.delete(getCustomerById(customerId));
    }

    public Customer register(RegisterDto registerDto) {
        if (customerRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }
        Customer customer = new Customer();
        customer.setCustomerType(vn.student.polyshoes.enums.CustomerType.REGISTERED);
        customer.setFullName(registerDto.getFullName());
        customer.setEmail(registerDto.getEmail());
        customer.setHashPassword(passwordEncoder.encode(registerDto.getPassword()));
        customer.setEmailConfirmed(true);
        customer.setPhone(registerDto.getPhone());
        Date now = new Date();
        customer.setCreatedAt(now);
        customer.setUpdatedAt(now);
        Customer savedCustomer = customerRepository.save(customer);

        // Tạo địa chỉ cho khách hàng
        CustomerAddress address = new CustomerAddress();
        address.setCustomer(savedCustomer);
        address.setAddress(registerDto.getAddress());
        address.setGhnProvinceId(registerDto.getProvinceId());
        address.setGhnDistrictId(registerDto.getDistrictId());
        address.setGhnWardCode(registerDto.getWardCode());
        address.setIsDefault(true); // Địa chỉ đầu tiên là mặc định
        address.setAddressType("HOME");
        address.setCreatedAt(now);
        address.setUpdatedAt(now);
        customerAddressRepository.save(address);

        return savedCustomer;
    }

    public String login(LoginUserDto loginDto) {
        Customer customer = customerRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginDto.getEmail()));
        if (!passwordEncoder.matches(loginDto.getPassword(), customer.getHashPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }
        if (!customer.getIsActive()) {
            throw new InvalidCredentialsException("Tài khoản của bạn đã bị ngừng hoạt động. Vui lòng liên hệ hỗ trợ.");
        }
        return jwtService.generateToken(customer, Role.CUSTOMER);
    }

    public Customer toggleCustomerStatus(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        customer.setIsActive(!customer.getIsActive());
        customer.setUpdatedAt(new Date());
        return customerRepository.save(customer);
    }
}
