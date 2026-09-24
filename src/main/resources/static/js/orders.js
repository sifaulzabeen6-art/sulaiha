// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// MY ORDERS JAVASCRIPT
// FRONTEND VERSION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Sulaiha Orders JavaScript Loaded Successfully");

    // =================================================
    // GET HTML ELEMENTS
    // =================================================

    const ordersContainer =
        document.getElementById("ordersList");

    const emptyOrdersMessage =
        document.getElementById("emptyOrdersMessage");

    const orderCount =
        document.getElementById("orderCount");


    // =================================================
    // CHECK ORDERS CONTAINER
    // =================================================

    if (!ordersContainer) {

        console.error("ordersList not found.");

        return;
    }


    // =================================================
    // LOAD ORDERS
    // =================================================

    let orders =
        JSON.parse(
            localStorage.getItem("sulaihaOrders")
        ) || [];


    console.log("Orders loaded:", orders);


    // =================================================
    // DISPLAY ORDERS
    // =================================================

    displayOrders(orders);


    // =================================================
    // DISPLAY ORDERS
    // =================================================

    function displayOrders(orderList) {

        ordersContainer.innerHTML = "";


        // Empty orders

        if (orderList.length === 0) {

            if (emptyOrdersMessage) {

                emptyOrdersMessage.style.display = "block";

            }

            if (orderCount) {

                orderCount.textContent = "0 Orders";

            }

            return;
        }


        // Hide empty message

        if (emptyOrdersMessage) {

            emptyOrdersMessage.style.display = "none";

        }


        // Update order count

        if (orderCount) {

            orderCount.textContent =
                orderList.length +
                (orderList.length === 1
                    ? " Order"
                    : " Orders");

        }


        // =================================================
        // CREATE ORDER CARDS
        // =================================================

        orderList.forEach(function (order) {

            const orderCard =
                document.createElement("div");

            orderCard.className = "order-card";


            // Order ID

            const orderId =
                order.orderId || "-";


            // Order date

            const orderDate =
                formatDate(order.orderDate);


            // Order status

            const status =
                order.status || "Confirmed";


            // Payment status

            const paymentStatus =
                order.paymentStatus || "Pending";


            // Products

            const items =
                Array.isArray(order.items)
                    ? order.items
                    : [];


            // Total quantity

            let totalItems = 0;


            items.forEach(function (item) {

                totalItems +=
                    Number(item.quantity) || 1;

            });


            // Total amount

            const total =
                Number(order.total) || 0;


            // =================================================
            // ORDER CARD
            // =================================================

            orderCard.innerHTML = `

                <div class="order-card-header">

                    <div>

                        <span class="order-label">
                            Order ID
                        </span>

                        <strong>
                            ${orderId}
                        </strong>

                    </div>


                    <div>

                        <span class="order-label">
                            Order Date
                        </span>

                        <strong>
                            ${orderDate}
                        </strong>

                    </div>

                </div>


                <div class="order-card-body">

                    <div class="order-status-row">

                        <span class="order-status">
                            ${status}
                        </span>

                        <span class="payment-status">
                            Payment: ${paymentStatus}
                        </span>

                    </div>


                    <div class="order-products">

                        ${createProducts(items)}

                    </div>


                    <div class="order-card-footer">

                        <div>

                            <span>
                                Items
                            </span>

                            <strong>
                                ${totalItems}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹${total.toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <button
                            type="button"
                            class="view-order-button">

                            View Details

                        </button>

                    </div>

                </div>

            `;


            ordersContainer.appendChild(orderCard);


            // =================================================
            // VIEW DETAILS
            // =================================================

            const viewButton =
                orderCard.querySelector(
                    ".view-order-button"
                );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function () {

                        showOrderDetails(order);

                    }
                );

            }

        });

    }


    // =================================================
    // CREATE PRODUCTS
    // =================================================

    function createProducts(items) {

        if (items.length === 0) {

            return `
                <p>
                    No product information available.
                </p>
            `;

        }


        let productHTML = "";


        items.forEach(function (item) {

            const name =
                item.name || "Product";


            const quantity =
                Number(item.quantity) || 1;


            const price =
                Number(item.price) || 0;


            const image =
                item.image ||
                "/images/default-product.jpg";


            const itemTotal =
                price * quantity;


            productHTML += `

                <div class="order-product">

                    <div class="order-product-image">

                        <img
                            src="${image}"
                            alt="${name}">

                    </div>


                    <div class="order-product-info">

                        <h4>
                            ${name}
                        </h4>

                        <p>
                            Quantity: ${quantity}
                        </p>

                    </div>


                    <strong>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>

                </div>

            `;

        });


        return productHTML;

    }


    // =================================================
    // FORMAT DATE
    // =================================================

    function formatDate(dateValue) {

        if (!dateValue) {

            return "-";

        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

            return "-";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // =================================================
    // VIEW ORDER DETAILS
    // =================================================

    function showOrderDetails(order) {

        const customer =
            order.customer || {};


        alert(

            "Order ID: " +
            (order.orderId || "-") +

            "\n\nOrder Status: " +
            (order.status || "Confirmed") +

            "\nPayment Status: " +
            (order.paymentStatus || "Pending") +

            "\n\nCustomer: " +
            (customer.fullName || "-") +

            "\nMobile: " +
            (customer.mobileNumber || "-") +

            "\nAddress: " +
            (customer.deliveryAddress || "-") +

            "\nCity: " +
            (customer.city || "-") +

            "\nPincode: " +
            (customer.pincode || "-") +

            "\n\nTotal: ₹" +
            (
                Number(order.total) || 0
            ).toLocaleString("en-IN")

        );

    }


    // =================================================
    // FILTER BUTTONS
    // =================================================

    const filterButtons =
        document.querySelectorAll(
            "[data-filter]"
        );


    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const filter =
                    button
                        .getAttribute("data-filter")
                        .toLowerCase();


                // Remove active class

                filterButtons.forEach(
                    function (item) {

                        item.classList.remove("active");

                    }
                );


                // Add active class

                button.classList.add("active");


                // =================================================
                // ALL ORDERS
                // =================================================

                if (filter === "all") {

                    displayOrders(orders);

                    return;

                }


                // =================================================
                // FILTER ORDERS
                // =================================================

                const filteredOrders =
                    orders.filter(
                        function (order) {

                            const status =
                                (
                                    order.status || ""
                                ).toLowerCase();


                            return status === filter;

                        }
                    );


                displayOrders(filteredOrders);

            }
        );

    });

});