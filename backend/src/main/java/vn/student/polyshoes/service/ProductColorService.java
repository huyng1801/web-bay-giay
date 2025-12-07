package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.student.polyshoes.dto.ProductColorDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductColor;
import vn.student.polyshoes.repository.ProductColorRepository;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.response.ProductColorResponse;

import java.io.IOException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductColorService {

    @Autowired
    private ProductColorRepository productColorRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileService fileService;

    private final String productColorFolder = "product_color";
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    public List<ProductColorResponse> findAll() {
        List<ProductColor> productColors = productColorRepository.findAll();
        return productColors.stream()
                .map(this::mapToProductColorResponse)  // Map to response in the service
                .collect(Collectors.toList());
    }

    public ProductColorResponse findById(Integer id) {
        ProductColor productColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));
        return mapToProductColorResponse(productColor);  // Map to response in the service
    }

    public ProductColorResponse createProductColor(ProductColorDto productColorDto) throws IOException {
    ProductColor productColor = new ProductColor();
    productColor.setColorName(productColorDto.getColorName());
    Product product = productRepository.findById(productColorDto.getProductId())
        .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productColorDto.getProductId()));
    productColor.setProduct(product);
    if (productColorDto.getImageFile() != null && !productColorDto.getImageFile().isEmpty()) {
        String imageUrl = uploadImage(product.getProductId(), productColorDto.getImageFile());
        productColor.setImageUrl(imageUrl);
    }
    return mapToProductColorResponse(productColorRepository.save(productColor));
    }

    public ProductColorResponse updateProductColor(Integer id, ProductColorDto productColorDto) throws IOException {
    ProductColor color = productColorRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));
    color.setColorName(productColorDto.getColorName());
    if (productColorDto.getImageFile() != null && !productColorDto.getImageFile().isEmpty()) {
        Integer productId = color.getProduct() != null ? color.getProduct().getProductId() : null;
        String imageUrl = uploadImage(productId, productColorDto.getImageFile());
        color.setImageUrl(imageUrl);
    }
    return mapToProductColorResponse(productColorRepository.save(color));
    }

    public void deleteProductColor(Integer id) {
        ProductColor existingColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));

        productColorRepository.delete(existingColor);
    }

    public List<ProductColorResponse> findByProduct_ProductId(Integer productId) {
        List<ProductColor> productColors = productColorRepository.findByProduct_ProductId(productId);
        return productColors.stream()
                .map(this::mapToProductColorResponse)
                .collect(Collectors.toList());
    }

    public ProductColorResponse toggleProductColorStatus(Integer id) {
        ProductColor existingColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));

        boolean newStatus = !existingColor.getIsActive();
        existingColor.setIsActive(newStatus);

        // If deactivating the color, also deactivate all its sizes
        if (!newStatus) {
            existingColor.getProductSizes().forEach(size -> {
                size.setIsActive(false);
            });
        }

        ProductColor updatedProductColor = productColorRepository.save(existingColor);
        return mapToProductColorResponse(updatedProductColor);
    }

    // Method to map ProductColor entity to ProductColorResponse DTO
    private ProductColorResponse mapToProductColorResponse(ProductColor productColor) {
        ProductColorResponse response = new ProductColorResponse();
        response.setProductColorId(productColor.getProductColorId());
        response.setColorName(productColor.getColorName());
        response.setIsActive(productColor.getIsActive());
        
        // Only add BASE_URL if the image URL doesn't already contain http
        String imageUrl = productColor.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty() &&
            !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            response.setImageUrl(BASE_URL + imageUrl);
        } else {
            response.setImageUrl(imageUrl);
        }
        
        return response;
    }

    private String uploadImage(Integer productId, MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        String folder = String.format("%s/p%d/", productColorFolder, productId);
        fileService.uploadFile(folder, uniqueFileName, file.getInputStream(), file.getSize(), file.getContentType());
        return folder + uniqueFileName;
    }
    

}
