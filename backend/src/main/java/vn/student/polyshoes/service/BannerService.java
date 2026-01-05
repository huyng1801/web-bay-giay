package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.student.polyshoes.dto.BannerDto;
import vn.student.polyshoes.exception.FileUploadException;
import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.repository.BannerRepository;
import vn.student.polyshoes.repository.AdminUserRepository;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;

@Service
public class BannerService {

    private static final String BANNER_PATH = "banner/";
    private static final String BASE_URL = "http://localhost:8080/uploads/";  
    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private FileService fileService;

    public List<Banner> getAllBanners() {
        // Stream through all banners and update image URL to include the full host
        return bannerRepository.findAll().stream()
            .map(banner -> {
                // If the banner has an image URL and doesn't already contain http, prepend the base URL
                if (banner.getImageUrl() != null && !banner.getImageUrl().isEmpty() && 
                    !banner.getImageUrl().startsWith("http://") && !banner.getImageUrl().startsWith("https://")) {
                    banner.setImageUrl(BASE_URL + banner.getImageUrl());
                }
                return banner;
            })
            .collect(Collectors.toList());
    }

    public Banner getBannerById(Integer bannerId) {
        // Find the banner by ID, and if it exists, update the image URL to include the full host
        Banner banner = bannerRepository.findById(bannerId).orElse(null);
        if (banner != null && banner.getImageUrl() != null && !banner.getImageUrl().isEmpty() &&
            !banner.getImageUrl().startsWith("http://") && !banner.getImageUrl().startsWith("https://")) {
            banner.setImageUrl(BASE_URL + banner.getImageUrl());
        }
        return banner;
    }

    public Banner createBanner(BannerDto bannerDto) {
        String imageUrl = null;

        if (bannerDto.getImageFile() != null) {
            try {
                imageUrl = uploadImageToFileService(bannerDto.getImageFile(), bannerDto.getTitle());
            } catch (IOException e) {
                throw new FileUploadException("Error uploading image", e);
            }
        }

        // Get admin user who created this banner
        AdminUser createdByAdmin = null;
        if (bannerDto.getCreatedByAdminId() != null) {
            createdByAdmin = adminUserRepository.findById(bannerDto.getCreatedByAdminId()).orElse(null);
        }

        Banner banner = new Banner();
        banner.setTitle(bannerDto.getTitle());
        banner.setImageUrl(imageUrl);
        banner.setLink(bannerDto.getLink());
        banner.setIsActive(bannerDto.getIsActive());
        banner.setCreatedBy(createdByAdmin);
        banner.setUpdatedBy(createdByAdmin); // Initially same as createdBy
        banner.setCreatedAt(new Date());
        banner.setUpdatedAt(new Date());

        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Integer bannerId, BannerDto bannerDto) {
        Banner banner = bannerRepository.findById(bannerId)
            .orElse(null);

        if (bannerDto.getImageFile() != null && !bannerDto.getImageFile().isEmpty()) {
            try {
                String imageUrl = uploadImageToFileService(bannerDto.getImageFile(), bannerDto.getTitle());
                banner.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new FileUploadException("Error uploading image", e);
            }
        }

        // Get admin user who updated this banner
        AdminUser updatedByAdmin = null;
        if (bannerDto.getUpdatedByAdminId() != null) {
            updatedByAdmin = adminUserRepository.findById(bannerDto.getUpdatedByAdminId()).orElse(null);
        }

        banner.setTitle(bannerDto.getTitle());
        banner.setLink(bannerDto.getLink());
        banner.setIsActive(bannerDto.getIsActive());
        banner.setUpdatedBy(updatedByAdmin);
        banner.setUpdatedAt(new Date());

        return bannerRepository.save(banner);
    }

    public void deleteBanner(Integer bannerId) {
        bannerRepository.deleteById(bannerId);
    }

    private String uploadImageToFileService(MultipartFile imageFile, String title) throws IOException {
        try {
            return uploadImage(imageFile, title);
        } catch (IOException e) {
            throw new FileUploadException("Error uploading image", e);
        }
    }

    public String uploadImage(MultipartFile imageFile, String title) throws IOException {
        String originalFilename = imageFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        int width, height;

        // Read the image to get width and height
        try (InputStream inputStream = imageFile.getInputStream()) {
            BufferedImage bufferedImage = ImageIO.read(inputStream);
            if (bufferedImage == null) {
                throw new IOException("Invalid image file");
            }
            width = bufferedImage.getWidth();
            height = bufferedImage.getHeight();
        }

        // Format the title and generate a unique file name
        String formattedTitle = title.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String fileName = String.format("%s-%dx%d%s", formattedTitle, width, height, fileExtension);

        // Upload the image to the local folder
    fileService.uploadFile(BANNER_PATH, fileName, imageFile.getInputStream(), imageFile.getSize(), imageFile.getContentType());

        return BANNER_PATH + fileName;
    }

    public Banner toggleBannerStatus(Integer id) {
        Optional<Banner> optionalBanner = bannerRepository.findById(id);
        if (optionalBanner.isEmpty()) {
            throw new RuntimeException("Banner not found with ID: " + id);
        }

        Banner banner = optionalBanner.get();
        banner.setIsActive(!banner.getIsActive());
        banner.setUpdatedAt(new Date());
        return bannerRepository.save(banner);
    }
}
