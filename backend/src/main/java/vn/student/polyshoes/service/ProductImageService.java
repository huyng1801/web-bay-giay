package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.student.polyshoes.model.ProductImage;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.repository.ProductImageRepository;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.response.ProductImageResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class để xử lý logic nghiệp vụ cho ProductImage
 * Cung cấp các phương thức quản lý hình ảnh sản phẩm
 */
@Service
public class ProductImageService {

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileService fileService;

    private final String productImageFolder = "product_image";
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    // Lấy tất cả hình ảnh sản phẩm
    public List<ProductImage> getAllProductImages() {
        return productImageRepository.findAll();
    }

    // Lấy hình ảnh sản phẩm theo ID
    public Optional<ProductImage> getProductImageById(Integer id) {
        return productImageRepository.findById(id);
    }

    // Lấy tất cả hình ảnh theo product ID
    public List<ProductImage> getProductImagesByProductId(Integer productId) {
        return productImageRepository.findByProductId(productId);
    }

    // Tạo hình ảnh sản phẩm mới
    public ProductImage createProductImage(Integer productId, String imageUrl) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product.get());
            productImage.setImageUrl(imageUrl);
            return productImageRepository.save(productImage);
        } else {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }
    }

    // Upload multiple images for a product
    public List<ProductImage> uploadMultipleImages(Integer productId, MultipartFile[] imageFiles) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        List<ProductImage> uploadedImages = new ArrayList<>();
        List<ProductImage> existingImages = productImageRepository.findByProductId(productId);
        boolean isFirstImage = existingImages.isEmpty();

        try {
            for (MultipartFile imageFile : imageFiles) {
                if (imageFile != null && !imageFile.isEmpty()) {
                    String relativePath = uploadAndGetRelativePath(productId, imageFile);
                    
                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(product);
                    productImage.setImageUrl(relativePath);
                    productImage.setIsMainImage(isFirstImage && uploadedImages.isEmpty()); // First image is main
                    productImage.setCreatedAt(new Date());
                    productImage.setUpdatedAt(new Date());
                    
                    uploadedImages.add(productImageRepository.save(productImage));
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi upload hình ảnh: " + e.getMessage());
        }

        return uploadedImages;
    }

    private String uploadAndGetRelativePath(Integer productId, MultipartFile imageFile) throws IOException {
        String fileName = productId + "_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        fileService.uploadFile(productImageFolder, fileName, imageFile.getInputStream(), imageFile.getSize(), imageFile.getContentType());
        return productImageFolder + "/" + fileName;
    }

    // Set main image for product
    public ProductImage setMainImage(Integer imageId) {
        ProductImage targetImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hình ảnh với ID: " + imageId));

        Product product = targetImage.getProduct();

        // Reset all images of the same product to not main
        List<ProductImage> allImagesOfProduct = productImageRepository.findByProductId(product.getProductId());
        for (ProductImage img : allImagesOfProduct) {
            if (img.getIsMainImage() != null && img.getIsMainImage()) {
                img.setIsMainImage(false);
                img.setUpdatedAt(new Date());
                productImageRepository.save(img);
            }
        }

        // Set target image as main
        targetImage.setIsMainImage(true);
        targetImage.setUpdatedAt(new Date());
        return productImageRepository.save(targetImage);
    }

    // Cập nhật hình ảnh sản phẩm
    public ProductImage updateProductImage(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }

    // Xóa hình ảnh sản phẩm
    public void deleteProductImage(Integer id) {
        if (productImageRepository.existsById(id)) {
            ProductImage imageToDelete = productImageRepository.findById(id).orElse(null);
            if (imageToDelete != null) {
                Product product = imageToDelete.getProduct();
                boolean wasMainImage = imageToDelete.getIsMainImage() != null && imageToDelete.getIsMainImage();
                
                // Delete the image
                productImageRepository.deleteById(id);
                
                // If deleted image was main image, set another image as main
                if (wasMainImage) {
                    List<ProductImage> remainingImages = productImageRepository.findByProductId(product.getProductId());
                    if (!remainingImages.isEmpty()) {
                        // Set first remaining image as main
                        ProductImage newMainImage = remainingImages.get(0);
                        newMainImage.setIsMainImage(true);
                        newMainImage.setUpdatedAt(new Date());
                        productImageRepository.save(newMainImage);
                    }
                }
            }
        } else {
            throw new RuntimeException("Không tìm thấy hình ảnh sản phẩm");
        }
    }

    // Đếm số lượng hình ảnh của sản phẩm
    public Long countImagesByProductId(Integer productId) {
        return productImageRepository.countByProductId(productId);
    }

    // Xóa tất cả hình ảnh của một sản phẩm
    public void deleteAllImagesByProductId(Integer productId) {
        List<ProductImage> images = getProductImagesByProductId(productId);
        productImageRepository.deleteAll(images);
    }

    // Mapper từ entity sang response
    public ProductImageResponse mapToResponse(ProductImage productImage) {
        ProductImageResponse response = new ProductImageResponse();
        response.setProductImageId(productImage.getProductImageId());
        response.setProductId(productImage.getProduct().getProductId());
        response.setProductName(productImage.getProduct().getProductName());
        
        // Add BASE_URL if needed for imageUrl
        String imageUrl = productImage.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty() &&
            !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            response.setImageUrl(BASE_URL + imageUrl);
        } else {
            response.setImageUrl(imageUrl);
        }
        
        response.setIsMainImage(productImage.getIsMainImage());
        response.setCreatedAt(productImage.getCreatedAt());
        response.setUpdatedAt(productImage.getUpdatedAt());
        return response;
    }

    // Lấy tất cả hình ảnh với response mapping
    public List<ProductImageResponse> getAllProductImagesResponse() {
        return productImageRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Lấy hình ảnh theo product ID với response mapping
    public List<ProductImageResponse> getProductImagesResponseByProductId(Integer productId) {
        return productImageRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}