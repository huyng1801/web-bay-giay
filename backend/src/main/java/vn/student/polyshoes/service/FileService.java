
// FileService handles file upload, download, and deletion in the local filesystem.
package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(String folder, String fileName, InputStream inputStream, long contentLength, String contentType) throws IOException {
        Path folderPath = Paths.get(uploadDir, folder);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }
        Path filePath = folderPath.resolve(fileName);
        try (FileOutputStream fileOutputStream = new FileOutputStream(filePath.toFile())) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, bytesRead);
            }
        }
        return filePath.toString();
    }

    public File downloadFile(String fileName, String folder) {
        Path filePath = Paths.get(uploadDir, folder, fileName);
        File file = filePath.toFile();
        if (!file.exists()) {
            throw new RuntimeException("File not found: " + filePath);
        }
        return file;
    }

    public void deleteFile(String fileName, String folder) {
        Path filePath = Paths.get(uploadDir, folder, fileName);
        File file = filePath.toFile();
        if (file.exists()) {
            file.delete();
        } else {
            throw new RuntimeException("File not found: " + filePath);
        }
    }

    public String getFileUrl(String fileName, String folder) {
        return "/static/" + folder + "/" + fileName;
    }
}
