package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.student.polyshoes.dto.ProductColorImageDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.ProductColor;
import vn.student.polyshoes.model.ProductColorImage;
import vn.student.polyshoes.repository.ProductColorImageRepository;
import vn.student.polyshoes.repository.ProductColorRepository;
import vn.student.polyshoes.response.ProductColorImageResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductColorImageService {

    @Autowired
    private ProductColorImageRepository productColorImageRepository;

    @Autowired
    private ProductColorRepository productColorRepository;

    @Autowired
    private FileService fileService; // Inject the fileService

    private final String productColorFolder = "product_color"; 
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    public List<ProductColorImageResponse> findByProductColorId(Integer productColorId) {
        return productColorImageRepository.findAll().stream()
                .filter(image -> image.getProductColor().getProductColorId().equals(productColorId))
                .map(image -> {
                    String imageUrl = image.getImageUrl();
                    String fullUrl = (imageUrl != null && !imageUrl.isEmpty() &&
                        !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) 
                        ? BASE_URL + imageUrl : imageUrl;
                    return new ProductColorImageResponse(image.getProductColorImageId(), fullUrl, image.getProductColor().getProductColorId());
                })
                .collect(Collectors.toList());
    }

    public List<ProductColorImageResponse> createProductColorImages(ProductColorImageDto productColorImageDto) throws IOException {
        ProductColor productColor = productColorRepository.findById(productColorImageDto.getProductColorId())
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with ID: " + productColorImageDto.getProductColorId()));
        return productColorImageDto.getImageFiles().stream()
                .map(imageFile -> {
                    try {
                        String relativePath = uploadAndGetRelativePath(productColor.getProductColorId(), imageFile);
                        ProductColorImage productColorImage = new ProductColorImage();
                        productColorImage.setImageUrl(relativePath);
                        productColorImage.setProductColor(productColor);
                        ProductColorImage savedImage = productColorImageRepository.save(productColorImage);
                        String fullUrl = (relativePath != null && !relativePath.isEmpty() &&
                                !relativePath.startsWith("http://") && !relativePath.startsWith("https://"))
                                ? BASE_URL + relativePath : relativePath;
                        return new ProductColorImageResponse(savedImage.getProductColorImageId(), fullUrl, productColor.getProductColorId());
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to save image: " + imageFile.getOriginalFilename(), e);
                    }
                }).collect(Collectors.toList());
    }

    public ProductColorImageResponse updateProductColorImage(Integer imageId, ProductColorImageDto productColorImageDto) throws IOException {
        ProductColorImage image = productColorImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));
        if (productColorImageDto.getImageFiles() != null && !productColorImageDto.getImageFiles().isEmpty()) {
            MultipartFile imageFile = productColorImageDto.getImageFiles().get(0);
            String relativePath = uploadAndGetRelativePath(image.getProductColor().getProductColorId(), imageFile);
            image.setImageUrl(relativePath);
        }
        ProductColorImage updatedImage = productColorImageRepository.save(image);
        String imageUrl = updatedImage.getImageUrl();
        String fullUrl = (imageUrl != null && !imageUrl.isEmpty() &&
                !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://"))
                ? BASE_URL + imageUrl : imageUrl;
        return new ProductColorImageResponse(updatedImage.getProductColorImageId(), fullUrl, image.getProductColor().getProductColorId());
    }

    public void deleteProductColorImage(Integer imageId) {
        ProductColorImage image = productColorImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));
        productColorImageRepository.delete(image);
    }

    private String uploadAndGetRelativePath(Integer productColorId, MultipartFile imageFile) throws IOException {
        String uniqueFileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
        String folder = getFolderForProductColor(productColorId);
        fileService.uploadFile(folder, uniqueFileName, imageFile.getInputStream(), imageFile.getSize(), imageFile.getContentType());
        return String.format("%s/%s", folder, uniqueFileName);
    }

    private String getFolderForProductColor(Integer productColorId) {
        return String.format("%s/%d", productColorFolder, productColorId);
    }
}
