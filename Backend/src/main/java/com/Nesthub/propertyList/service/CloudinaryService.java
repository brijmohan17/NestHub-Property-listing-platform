package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.entity.ImageEmbed;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final String folder;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret,
            @Value("${cloudinary.folder}") String folder) {
        this.folder = folder;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public ImageEmbed upload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", folder));
        String url = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");
        return new ImageEmbed(url, publicId);
    }
}
