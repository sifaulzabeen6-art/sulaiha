package com.sulaiha.sulaiha.repository;

import com.sulaiha.sulaiha.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}