package com.sulaiha.sulaiha.service;

import com.sulaiha.sulaiha.entity.Product;
import com.sulaiha.sulaiha.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ProductService(ProductRepository productRepository) {

        this.productRepository = productRepository;

    }


    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    public List<Product> getAllProducts() {

        return productRepository.findAll();

    }


    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Product not found with id: " + id
                        )
                );

    }


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    public Product addProduct(Product product) {

        return productRepository.save(product);

    }


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    public Product updateProduct(Long id, Product product) {

        // -------------------------------------------------
        // Find existing product
        // -------------------------------------------------

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Product not found with id: " + id
                                )
                        );


        // -------------------------------------------------
        // Existing Product Fields
        // -------------------------------------------------

        existingProduct.setName(
                product.getName()
        );

        existingProduct.setCategory(
                product.getCategory()
        );

        existingProduct.setPrice(
                product.getPrice()
        );

        existingProduct.setQuantity(
                product.getQuantity()
        );

        existingProduct.setReorderLevel(
                product.getReorderLevel()
        );

        existingProduct.setStatus(
                product.getStatus()
        );

        existingProduct.setImage(
                product.getImage()
        );

        existingProduct.setDescription(
                product.getDescription()
        );

        existingProduct.setUnit(
                product.getUnit()
        );


        // -------------------------------------------------
        // NEW MEASUREMENT / PRICING FIELDS
        // -------------------------------------------------

        existingProduct.setPricingType(
                product.getPricingType()
        );

        existingProduct.setLength(
                product.getLength()
        );

        existingProduct.setWidth(
                product.getWidth()
        );

        existingProduct.setDimensionUnit(
                product.getDimensionUnit()
        );


        // -------------------------------------------------
        // Save Updated Product
        // -------------------------------------------------

        return productRepository.save(existingProduct);

    }


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    public void deleteProduct(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Product not found with id: " + id
                                )
                        );


        productRepository.delete(product);

    }

}