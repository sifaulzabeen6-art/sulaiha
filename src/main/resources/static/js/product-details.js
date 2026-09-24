// =====================================================
// SULAIHA - PRODUCT DETAILS
// DATABASE DYNAMIC PRODUCT
// PRODUCT SIZE & PRICE CALCULATION
// =====================================================

let currentProduct = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // GET PRODUCT ID FROM URL
    // =================================================

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("id") || params.get("productId");


    if (!productId) {

        console.error(
            "Product ID not found in URL."
        );

        return;
    }


    // =================================================
    // LOAD PRODUCT
    // =================================================

    loadProduct(productId);

});


// =====================================================
// LOAD PRODUCT FROM DATABASE
// =====================================================

async function loadProduct(productId) {

    try {

        const response =
            await fetch(
                "/api/products/" +
                encodeURIComponent(productId)
            );


        if (!response.ok) {

            throw new Error(
                "Product not found"
            );

        }


        const product =
            await response.json();


        currentProduct = product;


        displayProduct(product);


    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );

        alert(
            "Unable to load product details."
        );

    }

}


// =====================================================
// DISPLAY PRODUCT
// =====================================================

function displayProduct(product) {

    // =================================================
    // BASIC DETAILS
    // =================================================

    document.getElementById(
        "productName"
    ).textContent =
        product.name || "-";


    document.getElementById(
        "productBreadcrumb"
    ).textContent =
        product.name || "Product Details";


    document.getElementById(
        "productCategory"
    ).textContent =
        product.category || "-";


    document.getElementById(
        "productDescription"
    ).textContent =
        product.description ||
        "No description available.";


    // =================================================
    // PRICE
    // =================================================

    const price =
        Number(product.price) || 0;

    const unit =
        product.unit || "";


    document.getElementById(
        "productPrice"
    ).textContent =
        formatPriceWithUnit(
            price,
            unit
        );


    // =================================================
    // SIZE & AREA
    // =================================================

    const dimension =
        calculateProductArea(product);


    document.getElementById(
        "productSize"
    ).textContent =
        dimension.sizeText;


    document.getElementById(
        "productAreaPerUnit"
    ).textContent =
        dimension.areaText;


    // =================================================
    // AVAILABILITY
    // =================================================

    const availability =
        getProductAvailability(product);


    document.getElementById(
        "productAvailability"
    ).textContent =
        availability;


    // =================================================
    // IMAGE
    // =================================================

    const productImage =
        document.getElementById(
            "productImage"
        );


    productImage.src =
        product.image ||
        "/images/product-placeholder.jpg";


    productImage.alt =
        product.name || "Product";


    // =================================================
    // PRODUCT INFORMATION
    // =================================================

    document.getElementById(
        "detailCategory"
    ).textContent =
        product.category || "-";


    document.getElementById(
        "detailName"
    ).textContent =
        product.name || "-";


    document.getElementById(
        "detailPrice"
    ).textContent =
        formatPriceWithUnit(
            price,
            unit
        );


    document.getElementById(
        "detailSize"
    ).textContent =
        dimension.sizeText;


    document.getElementById(
        "detailAreaPerUnit"
    ).textContent =
        dimension.areaText;


    document.getElementById(
        "detailAvailability"
    ).textContent =
        availability;


    // =================================================
    // QUANTITY
    // =================================================

    const quantityInput =
        document.getElementById(
            "productQuantity"
        );


    if (quantityInput) {

        quantityInput.value = 1;

        quantityInput.min = 1;

        // Do not allow quantity above available stock.
        if (Number(product.quantity) > 0) {

            quantityInput.max =
                Number(product.quantity);

        }


        quantityInput.addEventListener(
            "input",
            function () {

                updateCalculation(product);

            }
        );


        quantityInput.addEventListener(
            "change",
            function () {

                let quantity =
                    Number(this.value);


                if (
                    !Number.isFinite(quantity) ||
                    quantity < 1
                ) {

                    quantity = 1;

                }


                if (
                    Number(product.quantity) > 0 &&
                    quantity > Number(product.quantity)
                ) {

                    quantity =
                        Number(product.quantity);

                }


                this.value =
                    Math.floor(quantity);


                updateCalculation(product);

            }
        );

    }


    // =================================================
    // INITIAL CALCULATION
    // =================================================

    updateCalculation(product);


    // =================================================
    // ADD TO CART
    // =================================================

    setupAddToCart(product);



}


// =====================================================
// CALCULATE PRODUCT AREA
// =====================================================

function calculateProductArea(product) {

    const pricingType =
        String(
            product.pricingType || ""
        ).toUpperCase();


    const length =
        Number(product.length) || 0;


    const width =
        Number(product.width) || 0;


    const dimensionUnit =
        String(
            product.dimensionUnit || "ft"
        ).toLowerCase();


    // =================================================
    // NON-DIMENSION PRODUCT
    // =================================================

    if (
        pricingType !== "DIMENSION" ||
        length <= 0 ||
        width <= 0
    ) {

        return {

            sizeText: "-",

            areaPerUnit: 1,

            areaText: "1 unit"

        };

    }


    // =================================================
    // FEET
    // =================================================

    if (
        dimensionUnit === "ft" ||
        dimensionUnit === "feet"
    ) {

        const area =
            length * width;


        return {

            sizeText:
                `${formatNumber(length)} × ${formatNumber(width)} ft`,

            areaPerUnit:
                area,

            areaText:
                `${formatNumber(area)} sq.ft`

        };

    }


    // =================================================
    // INCHES
    // =================================================

    if (
        dimensionUnit === "in" ||
        dimensionUnit === "inch" ||
        dimensionUnit === "inches"
    ) {

        const area =
            (length * width) / 144;


        return {

            sizeText:
                `${formatNumber(length)} × ${formatNumber(width)} in`,

            areaPerUnit:
                area,

            areaText:
                `${formatNumber(area)} sq.ft`

        };

    }


    // =================================================
    // DEFAULT
    // =================================================

    const area =
        length * width;


    return {

        sizeText:
            `${formatNumber(length)} × ${formatNumber(width)} ${product.dimensionUnit || "ft"}`,

        areaPerUnit:
            area,

        areaText:
            `${formatNumber(area)} sq.ft`

    };

}


// =====================================================
// UPDATE CALCULATION
// =====================================================

function updateCalculation(product) {

    const quantityInput =
        document.getElementById(
            "productQuantity"
        );


    if (!quantityInput) {
        return;
    }


    let quantity =
        Number(quantityInput.value);


    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    quantity =
        Math.floor(quantity);


    // =================================================
    // LIMIT TO AVAILABLE STOCK
    // =================================================

    if (
        Number(product.quantity) > 0 &&
        quantity > Number(product.quantity)
    ) {

        quantity =
            Number(product.quantity);

        quantityInput.value =
            quantity;

    }


    const price =
        Number(product.price) || 0;


    const unit =
        String(
            product.unit || ""
        ).toLowerCase();


    const dimension =
        calculateProductArea(product);


    let totalArea;
    let totalAmount;


    // =================================================
    // SQ.FT CALCULATION
    // =================================================

    if (
        unit.includes("square") ||
        unit.includes("sq.ft") ||
        unit.includes("sq ft") ||
        unit.includes("sqft") ||
        String(product.pricingType).toUpperCase() === "DIMENSION"
    ) {

        totalArea =
            dimension.areaPerUnit *
            quantity;


        totalAmount =
            totalArea *
            price;

    }


    // =================================================
    // NORMAL UNIT CALCULATION
    // =================================================

    else {

        totalArea =
            quantity;


        totalAmount =
            price *
            quantity;

    }


    // =================================================
    // UPDATE UI
    // =================================================

    const calculationRate =
        document.getElementById(
            "calculationRate"
        );


    if (calculationRate) {

        calculationRate.textContent =
            formatPriceWithUnit(
                price,
                product.unit || ""
            );

    }


    const calculationAreaPerUnit =
        document.getElementById(
            "calculationAreaPerUnit"
        );


    if (calculationAreaPerUnit) {

        if (
            String(product.pricingType).toUpperCase() === "DIMENSION"
        ) {

            calculationAreaPerUnit.textContent =
                formatNumber(
                    dimension.areaPerUnit
                ) +
                " sq.ft";

        } else {

            calculationAreaPerUnit.textContent =
                "1 unit";

        }

    }


    const calculationQuantity =
        document.getElementById(
            "calculationQuantity"
        );


    if (calculationQuantity) {

        calculationQuantity.textContent =
            quantity;

    }


    const calculationTotalArea =
        document.getElementById(
            "calculationTotalArea"
        );


    if (calculationTotalArea) {

        if (
            String(product.pricingType).toUpperCase() === "DIMENSION"
        ) {

            calculationTotalArea.textContent =
                formatNumber(totalArea) +
                " sq.ft";

        } else {

            calculationTotalArea.textContent =
                quantity +
                " unit";

        }

    }


    const calculationTotalAmount =
        document.getElementById(
            "calculationTotalAmount"
        );


    if (calculationTotalAmount) {

        calculationTotalAmount.textContent =
            formatCurrency(totalAmount);

    }


    return {

        quantity: quantity,

        areaPerUnit:
            dimension.areaPerUnit,

        totalArea:
            totalArea,

        totalAmount:
            totalAmount

    };

}


// =====================================================
// ADD TO CART
// =====================================================

function setupAddToCart(product) {

    const addToCartButton =
        document.getElementById(
            "addToCartButton"
        );


    if (!addToCartButton) {
        return;
    }


    addToCartButton.onclick =
        function () {

            const quantityInput =
                document.getElementById(
                    "productQuantity"
                );


            let quantity =
                Number(
                    quantityInput.value
                );


            if (
                !Number.isFinite(quantity) ||
                quantity < 1
            ) {

                quantity = 1;

            }


            quantity =
                Math.floor(quantity);


            // =================================================
            // STOCK CHECK
            // =================================================

            if (
                Number(product.quantity) <= 0
            ) {

                alert(
                    "This product is currently out of stock."
                );

                return;

            }


            if (
                quantity > Number(product.quantity)
            ) {

                alert(
                    "Only " +
                    product.quantity +
                    " item(s) are available."
                );

                quantity =
                    Number(product.quantity);

                quantityInput.value =
                    quantity;

                updateCalculation(product);

                return;

            }


            // =================================================
            // CALCULATION
            // =================================================

            const calculation =
                updateCalculation(product);


            // =================================================
            // GET CART
            // =================================================

            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "sulaihaCart"
                    )
                ) || [];


            // =================================================
            // CHECK EXISTING PRODUCT
            // =================================================

            const existingProduct =
                cart.find(
                    item =>
                        String(item.id) ===
                        String(product.id)
                );


            if (existingProduct) {

                const newQuantity =
                    Number(existingProduct.quantity || 0) +
                    quantity;


                if (
                    newQuantity >
                    Number(product.quantity)
                ) {

                    alert(
                        "Available stock is only " +
                        product.quantity +
                        " item(s)."
                    );

                    return;

                }


                existingProduct.quantity =
                    newQuantity;


                // Keep the latest product information.
                existingProduct.price =
                    product.price;

                existingProduct.unit =
                    product.unit;

                existingProduct.pricingType =
                    product.pricingType;

                existingProduct.length =
                    product.length;

                existingProduct.width =
                    product.width;

                existingProduct.dimensionUnit =
                    product.dimensionUnit;

            }


            else {

                cart.push({

                    id: product.id,

                    name: product.name,

                    category: product.category,

                    image: product.image,

                    price: product.price,

                    unit: product.unit,

                    quantity: quantity,

                    pricingType:
                        product.pricingType,

                    length:
                        product.length,

                    width:
                        product.width,

                    dimensionUnit:
                        product.dimensionUnit,

                    areaPerUnit:
                        calculation.areaPerUnit

                });

            }


            // =================================================
            // SAVE CART
            // =================================================

            localStorage.setItem(
                "sulaihaCart",
                JSON.stringify(cart)
            );


            alert(
                product.name +
                " added to cart successfully."
            );


            window.location.href =
                "/cart";

        };

}


// =====================================================
// BUY NOW
// =====================================================

function setupBuyNow(product) {

    const buyNowButton =
        document.getElementById(
            "buyNowButton"
        );


    if (!buyNowButton) {
        return;
    }


    buyNowButton.onclick =
        function () {

            const quantityInput =
                document.getElementById(
                    "productQuantity"
                );


            const quantity =
                Number(
                    quantityInput.value
                ) || 1;


            if (
                Number(product.quantity) <= 0
            ) {

                alert(
                    "This product is currently out of stock."
                );

                return;

            }


            if (
                quantity >
                Number(product.quantity)
            ) {

                alert(
                    "Only " +
                    product.quantity +
                    " item(s) are available."
                );

                return;

            }


            alert(
                "Buy Now selected for " +
                product.name
            );

        };

}


// =====================================================
// AVAILABILITY
// =====================================================

function getProductAvailability(product) {

    const status =
        String(
            product.status || ""
        ).toLowerCase();


    if (
        status === "available" &&
        Number(product.quantity) > 0
    ) {

        return "In Stock";

    }


    if (
        status === "out of stock"
    ) {

        return "Out of Stock";

    }


    if (
        Number(product.quantity) > 0
    ) {

        return "In Stock";

    }


    return "Out of Stock";

}


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPriceWithUnit(price, unit) {

    const formattedPrice =
        formatCurrency(price);


    if (!unit) {

        return formattedPrice;

    }


    return (
        formattedPrice +
        " / " +
        unit
    );

}


// =====================================================
// FORMAT CURRENCY
// =====================================================

function formatCurrency(amount) {

    return (
        "₹" +
        Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );

}


// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(value) {

    return Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}