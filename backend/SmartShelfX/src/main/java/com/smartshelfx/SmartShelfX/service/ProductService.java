package com.smartshelfx.SmartShelfX.service;

import com.smartshelfx.SmartShelfX.model.Product;
import com.smartshelfx.SmartShelfX.model.User;
import com.smartshelfx.SmartShelfX.repository.ProductRepository;
import com.smartshelfx.SmartShelfX.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.smartshelfx.SmartShelfX.dto.ProductUpdateRequest;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Base64;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Product saveProduct(String name, String details, double price, int quantity,
                               Integer reorderThreshold, Long userId, MultipartFile image) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = new Product();
        product.setName(name);
        product.setDetails(details);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setReorderThreshold(reorderThreshold);
        product.setUser(user);

        // ✅ Store image as BLOB
        if (image != null && !image.isEmpty()) {
            product.setImageData(image.getBytes());
            product.setImageType(image.getContentType());
        }

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return productRepository.findByUser(user);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product product = existing.get();
            product.setName(updatedProduct.getName());
            product.setDetails(updatedProduct.getDetails());
            product.setPrice(updatedProduct.getPrice());
            product.setQuantity(updatedProduct.getQuantity());
            product.setReorderThreshold(updatedProduct.getReorderThreshold());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found");
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProductImage(Long id, MultipartFile image) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (image != null && !image.isEmpty()) {
            product.setImageData(image.getBytes());
            product.setImageType(image.getContentType());
        }

        return productRepository.save(product);
    }
    
    public Product updateProductWithImage(Long id, ProductUpdateRequest req) {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) throw new RuntimeException("Product not found");
        Product product = opt.get();

        if (req.getName() != null) product.setName(req.getName());
        if (req.getDetails() != null) product.setDetails(req.getDetails());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getQuantity() != null) product.setQuantity(req.getQuantity());
        if (req.getReorderThreshold() != null) product.setReorderThreshold(req.getReorderThreshold());

        String imgBase64 = req.getImageBase64();
        if (imgBase64 != null && !imgBase64.isBlank()) {
            // remove data URL prefix if present
            if (imgBase64.contains(",")) {
                imgBase64 = imgBase64.substring(imgBase64.indexOf(",") + 1);
            }
            byte[] bytes = Base64.getDecoder().decode(imgBase64);
            product.setImageData(bytes);
        }

        return productRepository.save(product);
    }
}
