package vn.student.polyshoes.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.ProductDto;
import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Brand;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductDetails;
import vn.student.polyshoes.model.SubCategory;
import vn.student.polyshoes.repository.BrandRepository;
import vn.student.polyshoes.repository.ProductDetailsRepository;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.repository.ProductImageRepository;
import vn.student.polyshoes.repository.SubCategoryRepository;
import vn.student.polyshoes.response.ProductResponse;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    private static final String BASE_URL = "http://localhost:8080/uploads/";

    public ProductResponse createProduct(ProductDto productDto) {
        Brand brand = brandRepository.findById(productDto.getBrandId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Brand not found with ID: " + productDto.getBrandId()));
        SubCategory subCategory = subCategoryRepository.findById(productDto.getSubCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "SubCategory not found with ID: " + productDto.getSubCategoryId()));
        Product product = new Product();
        product.setProductName(productDto.getProductName());
        product.setDescription(productDto.getDescription());
        product.setSellingPrice(productDto.getSellingPrice());
        product.setDiscountPercentage(productDto.getDiscountPercentage());
        product.setBrand(brand);
        product.setSubCategory(subCategory);
        Date now = new Date();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);
        return mapToResponse(productRepository.save(product));
    }

    public ProductResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    public ProductResponse updateProduct(Integer productId, ProductDto productDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Brand brand = brandRepository.findById(productDto.getBrandId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Brand not found with ID: " + productDto.getBrandId()));
        SubCategory subCategory = subCategoryRepository.findById(productDto.getSubCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "SubCategory not found with ID: " + productDto.getSubCategoryId()));
        product.setProductName(productDto.getProductName());
        product.setDescription(productDto.getDescription());
        product.setSellingPrice(productDto.getSellingPrice());
        product.setDiscountPercentage(productDto.getDiscountPercentage());
        product.setBrand(brand);
        product.setSubCategory(subCategory);
        product.setUpdatedAt(new Date());
        return mapToResponse(productRepository.save(product));
    }

    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    public Product toggleProductStatus(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (!product.getIsActive()) {
            if (!product.getBrand().getIsActive()) {
                throw new IllegalStateException("Không thể kích hoạt sản phẩm này vì thương hiệu đã ngừng hoạt động!");
            }
            if (!product.getSubCategory().getIsActive()) {
                throw new IllegalStateException("Không thể kích hoạt sản phẩm này vì danh mục con đã ngừng hoạt động!");
            }
            if (!product.getSubCategory().getCategory().getIsActive()) {
                throw new IllegalStateException("Không thể kích hoạt sản phẩm này vì danh mục cha đã ngừng hoạt động!");
            }
        }
        product.setIsActive(!product.getIsActive());
        product.setUpdatedAt(new Date());
        return productRepository.save(product);
    }

    public List<ProductResponse> getAllProducts(Integer subCategoryId, Gender gender, String productName) {
        List<Product> products = productRepository.findAll();
        if (subCategoryId != null) {
            products = products.stream()
                    .filter(product -> product.getSubCategory() != null &&
                            product.getSubCategory().getSubCategoryId().equals(subCategoryId))
                    .collect(Collectors.toList());
        }
        if (gender != null) {
            products = products.stream()
                    .filter(product -> product.getSubCategory() != null &&
                            product.getSubCategory().getGender() != null &&
                            product.getSubCategory().getGender().equals(gender))
                    .collect(Collectors.toList());
        }
        if (productName != null && !productName.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getProductName().toLowerCase().contains(productName.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // AI-enhanced search method with GET parameters
    public List<ProductResponse> searchProducts(String query, Integer subCategoryId, Integer brandId,
            Double minPrice, Double maxPrice, Boolean isActive, Boolean aiEnhanced) {
        List<Product> products = productRepository.findAll();

        // Filter by query (search in product name and description)
        if (query != null && !query.trim().isEmpty()) {
            String lowerQuery = query.toLowerCase().trim();
            products = products.stream()
                    .filter(product -> {
                        boolean nameMatch = product.getProductName().toLowerCase().contains(lowerQuery);
                        boolean descMatch = product.getDescription() != null &&
                                product.getDescription().toLowerCase().contains(lowerQuery);

                        // AI-enhanced search: also match brand and category names
                        if (aiEnhanced) {
                            boolean brandMatch = product.getBrand() != null &&
                                    product.getBrand().getBrandName().toLowerCase().contains(lowerQuery);
                            boolean categoryMatch = product.getSubCategory() != null &&
                                    product.getSubCategory().getSubCategoryName().toLowerCase().contains(lowerQuery);
                            return nameMatch || descMatch || brandMatch || categoryMatch;
                        }

                        return nameMatch || descMatch;
                    })
                    .collect(Collectors.toList());
        }

        // Filter by subcategory
        if (subCategoryId != null) {
            products = products.stream()
                    .filter(product -> product.getSubCategory() != null &&
                            product.getSubCategory().getSubCategoryId().equals(subCategoryId))
                    .collect(Collectors.toList());
        }

        // Filter by brand
        if (brandId != null) {
            products = products.stream()
                    .filter(product -> product.getBrand() != null &&
                            product.getBrand().getBrandId().equals(brandId))
                    .collect(Collectors.toList());
        }

        // Filter by price range
        if (minPrice != null) {
            products = products.stream()
                    .filter(product -> product.getSellingPrice() >= minPrice)
                    .collect(Collectors.toList());
        }
        if (maxPrice != null) {
            products = products.stream()
                    .filter(product -> product.getSellingPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        // Filter by status
        if (isActive != null) {
            products = products.stream()
                    .filter(product -> product.getIsActive().equals(isActive))
                    .collect(Collectors.toList());
        }

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        String imageUrl = null;

        // Get main image from ProductImage table
        var images = productImageRepository.findByProductId(product.getProductId());
        var mainImage = images.stream()
                .filter(img -> img.getIsMainImage() != null && img.getIsMainImage())
                .findFirst();
        
        if (mainImage.isPresent()) {
            String imgUrl = mainImage.get().getImageUrl();
            if (imgUrl != null && !imgUrl.isEmpty() &&
                !imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) {
                imageUrl = BASE_URL + imgUrl;
            } else {
                imageUrl = imgUrl;
            }
        } else if (!images.isEmpty()) {
            // Fallback: Lấy hình ảnh đầu tiên nếu không có main image
            String imgUrl = images.get(0).getImageUrl();
            if (imgUrl != null && !imgUrl.isEmpty() &&
                !imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) {
                imageUrl = BASE_URL + imgUrl;
            } else {
                imageUrl = imgUrl;
            }
        }

        Integer totalStock = calculateTotalStock(product.getProductId());
        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getDescription(),
                product.getSellingPrice(),
                product.getDiscountPercentage(),
                product.getSubCategory().getSubCategoryName(),
                product.getBrand().getBrandName(),
                product.getBrand().getBrandId(),
                product.getSubCategory().getSubCategoryId(),
                product.getIsActive(),
                product.getSubCategory().getGender().toString(),
                totalStock,
                product.getCreatedAt(),
                product.getUpdatedAt(),
                imageUrl);
    }

    private Integer calculateTotalStock(Integer productId) {
        return productDetailsRepository.findByProductIdAndIsActiveTrue(productId)
                .stream()
                .mapToInt(productDetails -> productDetails.getStockQuantity())
                .sum();
    }

}
