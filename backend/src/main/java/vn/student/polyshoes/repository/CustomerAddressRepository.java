package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.student.polyshoes.model.CustomerAddress;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Integer> {

    /**
     * Tìm tất cả địa chỉ của một khách hàng
     */
    List<CustomerAddress> findByCustomerCustomerId(Integer customerId);

    /**
     * Tìm địa chỉ mặc định của khách hàng
     */
    @Query("SELECT ca FROM CustomerAddress ca WHERE ca.customer.customerId = :customerId AND ca.isDefault = true")
    Optional<CustomerAddress> findDefaultAddressByCustomerId(@Param("customerId") Integer customerId);

    /**
     * Tìm địa chỉ theo loại của khách hàng
     */
    @Query("SELECT ca FROM CustomerAddress ca WHERE ca.customer.customerId = :customerId AND ca.addressType = :addressType")
    List<CustomerAddress> findByCustomerIdAndAddressType(@Param("customerId") Integer customerId, @Param("addressType") String addressType);

    /**
     * Đếm số lượng địa chỉ của khách hàng
     */
    @Query("SELECT COUNT(ca) FROM CustomerAddress ca WHERE ca.customer.customerId = :customerId")
    long countByCustomerId(@Param("customerId") Integer customerId);

    /**
     * Xóa địa chỉ mặc định của khách hàng (để đặt địa chỉ mới làm mặc định)
     */
    @Query("UPDATE CustomerAddress ca SET ca.isDefault = false WHERE ca.customer.customerId = :customerId AND ca.isDefault = true")
    void clearDefaultAddressForCustomer(@Param("customerId") Integer customerId);
}