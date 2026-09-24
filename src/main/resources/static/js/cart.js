
/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   CART PAGE JAVASCRIPT
   SIZE & SQ.FT CALCULATION
   ===================================================== */


// =====================================================
// LOAD CART WHEN PAGE OPENS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    loadCart();

    setupCheckoutButton();

});


// =====================================================
// LOAD CART
// =====================================================

function loadCart() {

    let cart =
        JSON.parse(
            localStorage.getItem("sulaihaCart")
        ) || [];


    console.log(
        "Cart loaded:",
        cart
    );


    const cartItems =
        document.getElementById("cartItems");

    const emptyCartMessage =
        document.getElementById("emptyCartMessage");

    const cartItemCount =
        document.getElementById("cartItemCount");

    const summaryItemCount =
        document.getElementById("summaryItemCount");

    const cartTotalArea =
        document.getElementById("cartTotalArea");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const cartTotal =
        document.getElementById("cartTotal");


    // =================================================
    // CHECK CART CONTAINER
    // =================================================

    if (!cartItems) {

        console.error(
            "Cart items container not found."
        );

        return;

    }


    // =================================================
    // EMPTY CART
    // =================================================

    if (cart.length === 0) {

        cartItems.innerHTML = "";


        if (emptyCartMessage) {

            emptyCartMessage.style.display =
                "block";

        }


        if (cartItemCount) {

            cartItemCount.textContent =
                "0";

        }


        if (summaryItemCount) {

            summaryItemCount.textContent =
                "0";

        }


        if (cartTotalArea) {

            cartTotalArea.textContent =
                "0 sq.ft";

        }


        if (cartSubtotal) {

            cartSubtotal.textContent =
                "₹0.00";

        }


        if (cartTotal) {

            cartTotal.textContent =
                "₹0.00";

        }


        return;

    }


    // =================================================
    // HIDE EMPTY CART MESSAGE
    // =================================================

    if (emptyCartMessage) {

        emptyCartMessage.style.display =
            "none";

    }


    cartItems.innerHTML = "";


    let totalAmount = 0;

    let totalQuantity = 0;

    let totalArea = 0;


    // =================================================
    // DISPLAY CART PRODUCTS
    // =================================================

    cart.forEach(function (product, index) {


        const quantity =
            Number(product.quantity) || 1;


        const price =
            Number(product.price) || 0;


        // Calculate product amount

        const calculation =
            calculateCartProduct(
                product,
                quantity
            );


        const itemTotal =
            calculation.totalAmount;


        const itemArea =
            calculation.totalArea;


        // Add to overall totals

        totalAmount +=
            itemTotal;


        totalQuantity +=
            quantity;


        if (
            calculation.isDimensionProduct
        ) {

            totalArea +=
                itemArea;

        }


        // =================================================
        // CREATE CART ITEM
        // =================================================

        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <!-- PRODUCT IMAGE -->

            <div class="cart-item-image">

                <img src="${product.image || ""}"
                     alt="${product.name || "Product"}">

            </div>


            <!-- PRODUCT INFORMATION -->

            <div class="cart-item-info">

                <span class="cart-item-category">

                    ${product.category || ""}

                </span>


                <h4>

                    ${product.name || "Product"}

                </h4>


                <p class="cart-item-price">

                    ${formatCurrency(price)}
                    / ${product.unit || "unit"}

                </p>


                ${
                    calculation.sizeText
                        ? `
                        <p class="cart-calculation-line">

                            <strong>Size:</strong>

                            ${calculation.sizeText}

                        </p>
                        `
                        : ""
                }


                <p class="cart-calculation-line">

                    <strong>Area per Unit:</strong>

                    ${
                        calculation.isDimensionProduct
                            ? formatNumber(
                                calculation.areaPerUnit
                            ) + " sq.ft"
                            : "1 unit"
                    }

                </p>


                ${
                    calculation.isDimensionProduct
                        ? `
                        <p class="cart-calculation-line">

                            <strong>Total Area:</strong>

                            ${formatNumber(itemArea)}
                            sq.ft

                        </p>
                        `
                        : ""
                }

            </div>


            <!-- RIGHT SIDE -->

            <div class="cart-item-right">


                <!-- ITEM TOTAL -->

                <strong class="cart-item-total">

                    ${formatCurrency(itemTotal)}

                </strong>


                <!-- QUANTITY -->

                <div class="cart-quantity-control">


                    <button type="button"
                            class="quantity-minus"
                            data-index="${index}">

                        −

                    </button>


                    <span>

                        ${quantity}

                    </span>


                    <button type="button"
                            class="quantity-plus"
                            data-index="${index}">

                        +

                    </button>


                </div>


                <!-- REMOVE -->

                <button type="button"
                        class="remove-cart-button"
                        data-index="${index}">

                    Remove

                </button>


            </div>

        `;


        cartItems.appendChild(
            cartItem
        );

    });


    // =================================================
    // UPDATE CART COUNT
    // =================================================

    if (cartItemCount) {

        cartItemCount.textContent =
            totalQuantity;

    }


    if (summaryItemCount) {

        summaryItemCount.textContent =
            totalQuantity;

    }


    // =================================================
    // UPDATE TOTAL AREA
    // =================================================

    if (cartTotalArea) {

        cartTotalArea.textContent =
            formatNumber(totalArea) +
            " sq.ft";

    }


    // =================================================
    // UPDATE SUBTOTAL
    // =================================================

    if (cartSubtotal) {

        cartSubtotal.textContent =
            formatCurrency(totalAmount);

    }


    // =================================================
    // UPDATE TOTAL
    // =================================================

    if (cartTotal) {

        cartTotal.textContent =
            formatCurrency(totalAmount);

    }


    // =================================================
    // SETUP QUANTITY BUTTONS
    // =================================================

    setupQuantityButtons(cart);


    // =================================================
    // SETUP REMOVE BUTTONS
    // =================================================

    setupRemoveButtons(cart);

}


// =====================================================
// CALCULATE CART PRODUCT
// =====================================================

function calculateCartProduct(
    product,
    quantity
) {

    const price =
        Number(product.price) || 0;


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
    // DIMENSION PRODUCT
    // =================================================

    if (
        pricingType === "DIMENSION" &&
        length > 0 &&
        width > 0
    ) {

        let areaPerUnit;


        // =================================================
        // FEET
        // =================================================

        if (
            dimensionUnit === "ft" ||
            dimensionUnit === "feet"
        ) {

            areaPerUnit =
                length * width;

        }


        // =================================================
        // INCHES
        // =================================================

        else if (
            dimensionUnit === "in" ||
            dimensionUnit === "inch" ||
            dimensionUnit === "inches"
        ) {

            areaPerUnit =
                (length * width) / 144;

        }


        // =================================================
        // DEFAULT
        // =================================================

        else {

            areaPerUnit =
                length * width;

        }


        // Total area

        const totalArea =
            areaPerUnit * quantity;


        // Total amount

        const totalAmount =
            totalArea * price;


        return {

            isDimensionProduct: true,

            areaPerUnit: areaPerUnit,

            totalArea: totalArea,

            totalAmount: totalAmount,

            sizeText:
                `${formatNumber(length)} × ${formatNumber(width)} ${product.dimensionUnit || "ft"}`

        };

    }


    // =================================================
    // NORMAL PRODUCT
    // =================================================

    return {

        isDimensionProduct: false,

        areaPerUnit: 1,

        totalArea: 0,

        totalAmount:
            price * quantity,

        sizeText: ""

    };

}


// =====================================================
// QUANTITY BUTTONS
// =====================================================

function setupQuantityButtons(cart) {


    // =================================================
    // MINUS BUTTONS
    // =================================================

    const minusButtons =
        document.querySelectorAll(
            ".quantity-minus"
        );


    minusButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {


                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    let quantity =
                        Number(
                            cart[index].quantity
                        ) || 1;


                    // Minimum quantity is 1

                    if (quantity > 1) {

                        quantity--;

                    }


                    cart[index].quantity =
                        quantity;


                    saveCartAndReload(cart);

                }
            );

        }
    );


    // =================================================
    // PLUS BUTTONS
    // =================================================

    const plusButtons =
        document.querySelectorAll(
            ".quantity-plus"
        );


    plusButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {


                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    let quantity =
                        Number(
                            cart[index].quantity
                        ) || 1;


                    quantity++;


                    cart[index].quantity =
                        quantity;


                    saveCartAndReload(cart);

                }
            );

        }
    );

}


// =====================================================
// REMOVE BUTTONS
// =====================================================

function setupRemoveButtons(cart) {


    const removeButtons =
        document.querySelectorAll(
            ".remove-cart-button"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {


                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    const productName =
                        cart[index].name;


                    const confirmRemove =
                        confirm(
                            "Remove " +
                            productName +
                            " from your cart?"
                        );


                    if (!confirmRemove) {

                        return;

                    }


                    cart.splice(
                        index,
                        1
                    );


                    saveCartAndReload(cart);

                }
            );

        }
    );

}


// =====================================================
// SAVE CART AND RELOAD
// =====================================================

function saveCartAndReload(cart) {

    localStorage.setItem(
        "sulaihaCart",
        JSON.stringify(cart)
    );


    loadCart();

}


// =====================================================
// CHECKOUT
// =====================================================

function setupCheckoutButton() {


    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (!checkoutButton) {

        return;

    }


    checkoutButton.addEventListener(
        "click",
        function () {


            const cart =
                JSON.parse(
                    localStorage.getItem(
                        "sulaihaCart"
                    )
                ) || [];


            // Check empty cart

            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add a product first."
                );

                return;

            }


            // Open checkout page

            window.location.href =
                "/checkout";

        }
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

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 0,

            maximumFractionDigits: 2
        }
    );

}


// =====================================================
// PAGE LOADED
// =====================================================

console.log(
    "Sulaiha Cart JavaScript Loaded Successfully"
);
