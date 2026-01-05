package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.student.polyshoes.model.ProductDetails;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.Color;
import vn.student.polyshoes.model.Size;
import vn.student.polyshoes.repository.ProductDetailsRepository;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.repository.ColorRepository;
import vn.student.polyshoes.repository.SizeRepository;
import vn.student.polyshoes.response.ProductDetailsResponse;

import java.util.List;
import java.util.Date;
import java.util.Optional;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class để xử lý logic nghiệp vụ cho ProductDetails
 * Cung cấp các phương thức quản lý chi tiết sản phẩm (màu sắc và kích cỡ)
 */
@Service
public class ProductDetailsService {

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private SizeRepository sizeRepository;

    // Lấy tất cả chi tiết sản phẩm
    public List<ProductDetails> getAllProductDetails() {
        return productDetailsRepository.findAll();
    }

    // Lấy chi tiết sản phẩm theo ID
    public Optional<ProductDetails> getProductDetailsById(Integer id) {
        return productDetailsRepository.findById(id);
    }

    // Lấy chi tiết sản phẩm theo product ID
    public List<ProductDetails> getProductDetailsByProductId(Integer productId) {
        return productDetailsRepository.findByProductIdAndIsActiveTrue(productId);
    }

    // Lấy chi tiết sản phẩm theo product ID, color ID và size ID
    public Optional<ProductDetails> getProductDetailsByProductColorSize(Integer productId, Integer colorId, Integer sizeId) {
        return productDetailsRepository.findByProductIdAndColorIdAndSizeIdAndIsActiveTrue(productId, colorId, sizeId);
    }

    // Tạo chi tiết sản phẩm mới
    public ProductDetails createProductDetails(Integer productId, Integer colorId, Integer sizeId, Integer stockQuantity) {
        Optional<Product> product = productRepository.findById(productId);
        Optional<Color> color = colorRepository.findById(colorId);
        Optional<Size> size = sizeRepository.findById(sizeId);

        if (product.isPresent() && color.isPresent() && size.isPresent()) {
            // Kiểm tra xem đã tồn tại chưa
            Optional<ProductDetails> existing = getProductDetailsByProductColorSize(productId, colorId, sizeId);
            if (existing.isPresent()) {
                throw new RuntimeException("Chi tiết sản phẩm này đã tồn tại");
            }

            ProductDetails productDetails = new ProductDetails();
            productDetails.setProduct(product.get());
            productDetails.setColor(color.get());
            productDetails.setSize(size.get());
            productDetails.setStockQuantity(stockQuantity);
            productDetails.setIsActive(true);
            // Set thời gian tạo và cập nhật
            productDetails.setCreatedAt(new Date());
            productDetails.setUpdatedAt(new Date());

            return productDetailsRepository.save(productDetails);
        } else {
            throw new RuntimeException("Không tìm thấy sản phẩm, màu sắc hoặc kích cỡ");
        }
    }

    // Cập nhật chi tiết sản phẩm
    public ProductDetails updateProductDetails(ProductDetails productDetails) {
        return productDetailsRepository.save(productDetails);
    }

    // Cập nhật số lượng tồn kho
    public ProductDetails updateStockQuantity(Integer id, Integer stockQuantity) {
        Optional<ProductDetails> productDetails = productDetailsRepository.findById(id);
        if (productDetails.isPresent()) {
            ProductDetails details = productDetails.get();
            details.setStockQuantity(stockQuantity);
            return productDetailsRepository.save(details);
        } else {
            throw new RuntimeException("Không tìm thấy chi tiết sản phẩm");
        }
    }

    // Xóa chi tiết sản phẩm (soft delete)
    public void deleteProductDetails(Integer id) {
        Optional<ProductDetails> productDetails = productDetailsRepository.findById(id);
        if (productDetails.isPresent()) {
            ProductDetails details = productDetails.get();
            details.setIsActive(false);
            productDetailsRepository.save(details);
        } else {
            throw new RuntimeException("Không tìm thấy chi tiết sản phẩm");
        }
    }

    // Lấy chi tiết sản phẩm có hàng tồn kho
    public List<ProductDetails> getInStockProductDetails() {
        return productDetailsRepository.findInStock();
    }

    // Lấy chi tiết sản phẩm có sẵn theo product ID
    public List<ProductDetails> getAvailableProductDetailsByProductId(Integer productId) {
        return productDetailsRepository.findAvailableByProductId(productId);
    }

    // Kiểm tra tồn kho
    public boolean isInStock(Integer id) {
        Optional<ProductDetails> productDetails = productDetailsRepository.findById(id);
        return productDetails.isPresent() && 
               productDetails.get().getStockQuantity() > 0 && 
               productDetails.get().getIsActive();
    }

    // Giảm số lượng tồn kho (khi có đơn hàng)
    public ProductDetails decreaseStock(Integer id, Integer quantity) {
        Optional<ProductDetails> productDetails = productDetailsRepository.findById(id);
        if (productDetails.isPresent()) {
            ProductDetails details = productDetails.get();
            if (details.getStockQuantity() >= quantity) {
                details.setStockQuantity(details.getStockQuantity() - quantity);
                return productDetailsRepository.save(details);
            } else {
                throw new RuntimeException("Không đủ hàng tồn kho");
            }
        } else {
            throw new RuntimeException("Không tìm thấy chi tiết sản phẩm");
        }
    }

    // Tăng số lượng tồn kho (khi hủy đơn hàng)
    public ProductDetails increaseStock(Integer id, Integer quantity) {
        Optional<ProductDetails> productDetails = productDetailsRepository.findById(id);
        if (productDetails.isPresent()) {
            ProductDetails details = productDetails.get();
            details.setStockQuantity(details.getStockQuantity() + quantity);
            return productDetailsRepository.save(details);
        } else {
            throw new RuntimeException("Không tìm thấy chi tiết sản phẩm");
        }
    }

    // Mapper từ entity sang response
    public ProductDetailsResponse mapToResponse(ProductDetails productDetails) {
        ProductDetailsResponse response = new ProductDetailsResponse();
        response.setProductDetailsId(productDetails.getProductDetailsId());
        response.setProductId(productDetails.getProduct().getProductId());
        response.setProductName(productDetails.getProduct().getProductName());
        
        // Map color info
        ProductDetailsResponse.ColorInfo colorInfo = new ProductDetailsResponse.ColorInfo();
        colorInfo.setColorId(productDetails.getColor().getColorId());
        colorInfo.setColorName(productDetails.getColor().getColorName());
        response.setColor(colorInfo);
        
        // Map size info
        ProductDetailsResponse.SizeInfo sizeInfo = new ProductDetailsResponse.SizeInfo();
        sizeInfo.setSizeId(productDetails.getSize().getSizeId());
        sizeInfo.setSizeValue(productDetails.getSize().getSizeValue());
        response.setSize(sizeInfo);
        
        response.setStockQuantity(productDetails.getStockQuantity());
        response.setIsActive(productDetails.getIsActive());
        return response;
    }

    // Lấy tất cả chi tiết sản phẩm với response mapping
    public List<ProductDetailsResponse> getAllProductDetailsResponse() {
        return productDetailsRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Lấy chi tiết sản phẩm theo product ID với response mapping
    public List<ProductDetailsResponse> getProductDetailsResponseByProductId(Integer productId) {
        return productDetailsRepository.findByProductIdAndIsActiveTrue(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}