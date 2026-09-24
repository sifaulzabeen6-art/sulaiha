// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// ORDER CONFIRMATION JS - FINAL CORRECTED VERSION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    loadOrderConfirmation
);


// =====================================================
// LOAD ORDER
// =====================================================

function loadOrderConfirmation() {

    console.log(
        "Sulaiha Order Confirmation JavaScript Loaded Successfully"
    );

    const saved =
        sessionStorage.getItem("pendingOrder");


    // -------------------------------------------------
    // NO PENDING ORDER
    // -------------------------------------------------

    if (!saved) {

        showNoOrderMessage();

        return;
    }


    let order;


    // -------------------------------------------------
    // READ ORDER
    // -------------------------------------------------

    try {

        order = JSON.parse(saved);

    } catch (error) {

        console.error(
            "Unable to read pending order:",
            error
        );

        showNoOrderMessage();

        return;
    }


    if (!order || typeof order !== "object") {

        showNoOrderMessage();

        return;
    }


    console.log(
        "Order loaded for confirmation:",
        order
    );


    // -------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------
    //
    // DO NOT CREATE A NEW ORDER ID HERE.
    //
    // Backend Order.java is responsible for:
    // orderId
    // orderDate
    // orderStatus
    // paymentStatus
    //
    // The confirmation page only displays the
    // already-saved order.
    //
    // -------------------------------------------------


    displayOrderInformation(order);

    displayCustomerInformation(order);

    displayOrderedProducts(order);

    displayOrderSummary(order);

}


// =====================================================
// ORDER INFORMATION
// =====================================================

function displayOrderInformation(order) {

    const set = (id, value) => {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value == null ||
                value === ""
                    ? "-"
                    : value;

        }

    };


    // -------------------------------------------------
    // ORDER ID
    // -------------------------------------------------

    set(
        "orderId",
        order.orderId
    );


    // -------------------------------------------------
    // ORDER DATE
    // -------------------------------------------------

    let formattedDate = "-";


    if (order.orderDate) {

        const date =
            new Date(order.orderDate);


        if (!isNaN(date.getTime())) {

            formattedDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }

    }


    set(
        "orderDate",
        formattedDate
    );


    // -------------------------------------------------
    // PAYMENT STATUS
    // -------------------------------------------------

    set(
        "paymentStatus",
        formatPaymentStatus(
            order.paymentStatus
        )
    );


    // -------------------------------------------------
    // ORDER STATUS
    // -------------------------------------------------

    set(
        "orderStatus",
        formatOrderStatus(
            order.orderStatus
        )
    );

}


// =====================================================
// CUSTOMER INFORMATION
// =====================================================

function displayCustomerInformation(order) {

    const fields = {

        customerName:
            order.customerName || "-",

        customerMobile:
            order.mobileNumber || "-",

        customerEmail:
            order.email || "-",

        customerAddress:
            order.deliveryAddress || "-",

        customerCity:
            order.city || "-",

        customerPincode:
            order.pincode || "-"

    };


    Object.entries(fields).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);


            if (element) {

                element.textContent =
                    value == null ||
                    value === ""
                        ? "-"
                        : value;

            }

        }
    );

}


// =====================================================
// ORDERED PRODUCTS
// =====================================================

function displayOrderedProducts(order) {

    const container =
        document.getElementById(
            "confirmedOrderItems"
        );


    if (!container) {

        console.warn(
            "confirmedOrderItems element not found."
        );

        return;
    }


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    // -------------------------------------------------
    // NO ITEMS
    // -------------------------------------------------

    if (!items.length) {

        container.innerHTML = `

            <div class="empty-confirmation">

                <p>
                    No product details available
                    for this order.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    // -------------------------------------------------
    // DISPLAY EACH PRODUCT
    // -------------------------------------------------

    items.forEach(item => {

        const quantity =
            Number(item.quantity) || 1;


        const price =
            Number(item.price) || 0;


        const itemTotal =
            price * quantity;


        const productName =
            item.name ||
            item.productName ||
            "Product";


        const unit =
            item.unit ||
            "unit";


        const image =
            item.image ||
            "";


        const element =
            document.createElement("div");


        element.className =
            "confirmation-item";


        // -------------------------------------------------
        // IMAGE
        // -------------------------------------------------

        const imageHTML =
            image
                ? `
                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(productName)}"
                    >
                  `
                : "";


        element.innerHTML = `

            <div class="confirmation-item-image">

                ${imageHTML}

            </div>


            <div class="confirmation-item-info">

                <h4>
                    ${escapeHtml(productName)}
                </h4>


                <p>
                    ₹${price.toLocaleString(
                        "en-IN"
                    )}
                    /
                    ${escapeHtml(unit)}
                </p>


                <span>
                    Quantity: ${quantity}
                </span>

            </div>


            <strong
                class="confirmation-item-total"
            >

                ₹${itemTotal.toLocaleString(
                    "en-IN"
                )}

            </strong>

        `;


        container.appendChild(element);

    });

}


// =====================================================
// ORDER SUMMARY
// =====================================================

function displayOrderSummary(order) {

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    // -------------------------------------------------
    // ITEM COUNT
    // -------------------------------------------------

    const itemCount =
        items.reduce(
            (total, item) => {

                return total +
                    (
                        Number(
                            item.quantity
                        ) || 1
                    );

            },
            0
        );


    // -------------------------------------------------
    // BACKEND TOTAL
    // -------------------------------------------------
    //
    // Order.java contains:
    //
    // private Double totalAmount;
    //
    // Therefore totalAmount is the authoritative
    // order total.
    //
    // -------------------------------------------------

    const totalAmount =
        Number(
            order.totalAmount
        );


    const safeTotal =
        Number.isFinite(totalAmount)
            ? totalAmount
            : 0;


    // -------------------------------------------------
    // DELIVERY
    // -------------------------------------------------
    //
    // Current checkout business rule:
    // Delivery = FREE
    //
    // -------------------------------------------------

    const deliveryCharge = 0;


    // -------------------------------------------------
    // SUBTOTAL
    // -------------------------------------------------
    //
    // Since Order.java only stores totalAmount and
    // delivery is currently FREE:
    //
    // subtotal = totalAmount
    //
    // -------------------------------------------------

    const subtotal =
        safeTotal;


    // -------------------------------------------------
    // DISPLAY ITEM COUNT
    // -------------------------------------------------

    setText(
        "confirmedItemCount",
        itemCount
    );


    // -------------------------------------------------
    // DISPLAY SUBTOTAL
    // -------------------------------------------------

    setText(
        "confirmedSubtotal",
        "₹" +
        subtotal.toLocaleString(
            "en-IN"
        )
    );


    // -------------------------------------------------
    // DISPLAY DELIVERY
    // -------------------------------------------------

    setText(
        "confirmedDelivery",
        deliveryCharge === 0
            ? "FREE"
            : "₹" +
              deliveryCharge.toLocaleString(
                  "en-IN"
              )
    );


    // -------------------------------------------------
    // DISPLAY TOTAL
    // -------------------------------------------------

    setText(
        "confirmedTotal",
        "₹" +
        safeTotal.toLocaleString(
            "en-IN"
        )
    );

}


// =====================================================
// PAYMENT STATUS FORMAT
// =====================================================

function formatPaymentStatus(status) {

    const value =
        String(
            status || "PENDING"
        )
        .trim()
        .toUpperCase();


    if (
        value === "PAID" ||
        value === "COMPLETED"
    ) {

        return "Completed";

    }


    if (value === "FAILED") {

        return "Failed";

    }


    return "Pending";

}


// =====================================================
// ORDER STATUS FORMAT
// =====================================================

function formatOrderStatus(status) {

    const value =
        String(
            status || "PENDING"
        )
        .trim()
        .toUpperCase();


    if (value === "CONFIRMED") {

        return "Confirmed";

    }


    if (value === "PROCESSING") {

        return "Processing";

    }


    if (value === "SHIPPED") {

        return "Shipped";

    }


    if (value === "DELIVERED") {

        return "Delivered";

    }


    if (value === "CANCELLED") {

        return "Cancelled";

    }


    if (value === "COMPLETED") {

        return "Completed";

    }


    return "Pending";

}


// =====================================================
// SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value == null ||
            value === ""
                ? "-"
                : value;

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    if (value == null) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// NO ORDER MESSAGE
// =====================================================

function showNoOrderMessage() {

    const container =
        document.getElementById(
            "confirmedOrderItems"
        );


    if (container) {

        container.innerHTML = `

            <div class="empty-confirmation">

                <h3>
                    No Order Found
                </h3>


                <p>
                    Please complete checkout
                    before opening the order
                    confirmation page.
                </p>


                <a
                    href="/products"
                    class="continue-shopping-button"
                >
                    Continue Shopping
                </a>

            </div>

        `;

    }


    setText(
        "orderId",
        "-"
    );


    setText(
        "orderDate",
        "-"
    );


    setText(
        "paymentStatus",
        "-"
    );


    setText(
        "orderStatus",
        "-"
    );


    setText(
        "customerName",
        "-"
    );


    setText(
        "customerMobile",
        "-"
    );


    setText(
        "customerEmail",
        "-"
    );


    setText(
        "customerAddress",
        "-"
    );


    setText(
        "customerCity",
        "-"
    );


    setText(
        "customerPincode",
        "-"
    );


    setText(
        "confirmedItemCount",
        "0"
    );


    setText(
        "confirmedSubtotal",
        "₹0"
    );


    setText(
        "confirmedDelivery",
        "FREE"
    );


    setText(
        "confirmedTotal",
        "₹0"
    );


    console.log(
        "No pending order available."
    );

}