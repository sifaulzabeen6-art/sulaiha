package com.sulaiha.sulaiha.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private double price;

    private int quantity;

    private int reorderLevel;

    private String status;

    private String image;

    @Column(length = 1000)
    private String description;

    private String unit;


    // =====================================================
    // MEASUREMENT / PRICING FIELDS
    // =====================================================

    /*
     * UNIT      = Cement, Bricks, Steel, Paint, etc.
     * DIMENSION = Marble, Granite, Tiles, Glass, Plywood, etc.
     */
    private String pricingType;

    /*
     * Product length.
     *
     * Example:
     * 6 ft
     * 2 ft
     * 8 ft
     */
    private double length;

    /*
     * Product width.
     *
     * Example:
     * 4 ft
     * 2 ft
     * 4 ft
     */
    private double width;

    /*
     * Dimension measurement unit.
     *
     * Example:
     * ft
     * inch
     */
    private String dimensionUnit;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Product() {
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }


    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }


    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }


    // =====================================================
    // MEASUREMENT GETTERS AND SETTERS
    // =====================================================

    public String getPricingType() {
        return pricingType;
    }

    public void setPricingType(String pricingType) {
        this.pricingType = pricingType;
    }


    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }


    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }


    public String getDimensionUnit() {
        return dimensionUnit;
    }

    public void setDimensionUnit(String dimensionUnit) {
        this.dimensionUnit = dimensionUnit;
    }
}