package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.ProductSizeDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.ProductColor;
import vn.student.polyshoes.model.ProductSize;
import vn.student.polyshoes.repository.ProductColorRepository;
import vn.student.polyshoes.repository.ProductSizeRepository;
import vn.student.polyshoes.response.ProductSizeResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductSizeService {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private ProductColorRepository productColorRepository;

    public List<ProductSizeResponse> findAll() {
        return productSizeRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public ProductSizeResponse createProductSize(ProductSizeDto productSizeDto) {
        ProductColor productColor = productColorRepository.findById(productSizeDto.getProductColorId())
            .orElseThrow(() -> new ResourceNotFoundException("Product color not found with ID: " + productSizeDto.getProductColorId()));
        ProductSize productSize = new ProductSize();
        productSize.setSizeValue(productSizeDto.getSizeValue());
        productSize.setStockQuantity(productSizeDto.getStockQuantity());
        productSize.setProductColor(productColor);
        return mapToResponse(productSizeRepository.save(productSize));
    }

    public ProductSizeResponse updateProductSize(Integer id, ProductSizeDto productSizeDto) {
        ProductSize productSize = productSizeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product size not found with ID: " + id));
        ProductColor productColor = productColorRepository.findById(productSizeDto.getProductColorId())
            .orElseThrow(() -> new ResourceNotFoundException("Product color not found with ID: " + productSizeDto.getProductColorId()));
        productSize.setSizeValue(productSizeDto.getSizeValue());
        productSize.setStockQuantity(productSizeDto.getStockQuantity());
        productSize.setProductColor(productColor);
        return mapToResponse(productSizeRepository.save(productSize));
    }

    public void deleteProductSize(Integer id) {
        ProductSize productSize = productSizeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product size not found with ID: " + id));
        productSizeRepository.delete(productSize);
    }

    public ProductSizeResponse findById(Integer id) {
        ProductSize productSize = productSizeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product size not found with ID: " + id));
        return mapToResponse(productSize);
    }

    public List<ProductSizeResponse> findByProductColorId(Integer productColorId) {
        return productSizeRepository.findByProductColor_ProductColorId(productColorId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public ProductSizeResponse toggleProductSizeStatus(Integer id) {
        ProductSize productSize = productSizeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product size not found with ID: " + id));
        productSize.setIsActive(!productSize.getIsActive());
        return mapToResponse(productSizeRepository.save(productSize));
    }

    public ProductSizeResponse updateStockQuantity(Integer id, Integer stockQuantity) {
        ProductSize productSize = productSizeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product size not found with ID: " + id));
        if (stockQuantity < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative");
        }
        productSize.setStockQuantity(stockQuantity);
        return mapToResponse(productSizeRepository.save(productSize));
    }

    private ProductSizeResponse mapToResponse(ProductSize productSize) {
        return new ProductSizeResponse(
            productSize.getProductSizeId(),
            productSize.getSizeValue(),
            productSize.getStockQuantity(),
            productSize.getProductColor().getColorName(),
            productSize.getIsActive()
        );
    }
}
