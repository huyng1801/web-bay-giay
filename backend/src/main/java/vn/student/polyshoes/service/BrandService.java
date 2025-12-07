package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.student.polyshoes.dto.BrandDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Brand;
import vn.student.polyshoes.repository.BrandRepository;
import vn.student.polyshoes.repository.ProductRepository;

import java.io.IOException;




import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;



@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileService fileService;

    private static final String BASE_URL = "http://localhost:8080/uploads/"; 
    private static final String BRAND_PATH = "brand/";

    public List<Brand> getAllBrands() {
        return brandRepository.findAll().stream()
            .peek(brand -> {
                if (brand.getImageUrl() != null && !brand.getImageUrl().isEmpty() &&
                    !brand.getImageUrl().startsWith("http://") && !brand.getImageUrl().startsWith("https://")) {
                    brand.setImageUrl(BASE_URL + brand.getImageUrl());
                }
            })
            .collect(Collectors.toList());
    }

    public Brand getBrandById(Integer id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));
        if (brand.getImageUrl() != null && !brand.getImageUrl().isEmpty() &&
            !brand.getImageUrl().startsWith("http://") && !brand.getImageUrl().startsWith("https://")) {
            brand.setImageUrl(BASE_URL + brand.getImageUrl());
        }
        return brand;
    }

    public Brand createBrand(BrandDto brandDto) throws IOException {
        Brand brand = new Brand();
        brand.setBrandName(brandDto.getBrandName());
        if (brandDto.getImageFile() != null && !brandDto.getImageFile().isEmpty()) {
            brand.setImageUrl(uploadFile(brandDto.getImageFile(), BRAND_PATH));
        }
        Date now = new Date();
        brand.setCreatedAt(now);
        brand.setUpdatedAt(now);
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Integer id, BrandDto brandDto) throws IOException {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));
        brand.setBrandName(brandDto.getBrandName());
        if (brandDto.getImageFile() != null && !brandDto.getImageFile().isEmpty()) {
            brand.setImageUrl(uploadFile(brandDto.getImageFile(), BRAND_PATH));
        }
        brand.setUpdatedAt(new Date());
        return brandRepository.save(brand);
    }

    public void deleteBrand(Integer id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));
        brandRepository.delete(brand);
    }

    public Brand toggleBrandStatus(Integer id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));
        if (brand.getIsActive() && hasActiveProducts(id)) {
            throw new IllegalStateException("Không thể ngừng hoạt động thương hiệu này vì đang có sản phẩm sử dụng!");
        }
        if (brand.getIsActive()) {
            productRepository.deactivateProductsByBrand(id);
        }
        brand.setIsActive(!brand.getIsActive());
        brand.setUpdatedAt(new Date());
        return brandRepository.save(brand);
    }

    private boolean hasActiveProducts(Integer brandId) {
        return productRepository.countByBrandBrandIdAndIsActiveTrue(brandId) > 0;
    }
    public String uploadFile(MultipartFile file, String folderName) throws IOException {
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String filePath = folderName + uniqueFileName;
        fileService.uploadFile(folderName, uniqueFileName, file.getInputStream(), file.getSize(), file.getContentType());
        return filePath;
    }

}
