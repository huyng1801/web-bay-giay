package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.enums.ShippingType;
import vn.student.polyshoes.model.Shipping;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Integer> {
    
    List<Shipping> findByIsActiveTrue();
    
    Optional<Shipping> findByShippingCode(String shippingCode);
    
    List<Shipping> findByShippingTypeAndIsActiveTrue(ShippingType shippingType);
    
    @Query("SELECT s FROM Shipping s WHERE s.shippingName LIKE %:name% AND s.isActive = true")
    List<Shipping> findByShippingNameContainingAndIsActiveTrue(@Param("name") String name);
}
