// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// ADMIN ORDER MANAGEMENT JAVASCRIPT
// FINAL VERSION
// =====================================================


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let allOrders = [];
let selectedOrderId = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Order Management JS Loaded");

    loadOrders();

    setupSearch();

    setupFilter();

    setupUpdateForm();

    setupCancelButton();

    setupModalClose();

    setupAdminLogoutConfirm();

});


// =====================================================
// LOAD ORDERS
// =====================================================

async function loadOrders() {

    try {

        const response =
            await fetch("/api/admin/orders");


        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );

        }


        allOrders =
            await response.json();


        console.log(
            "Orders loaded:",
            allOrders
        );


        updateSummary();
         

        displayOrders( allOrders);

    }

    catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        allOrders = [];

        updateSummary();

        showEmptyState();

    }

}


// =====================================================
// UPDATE SUMMARY CARDS
// =====================================================

function updateSummary() {

    const total =
        allOrders.length;


    const pending =
        allOrders.filter(function (order) {

            return normalizeStatus(
                order.orderStatus
            ) === "PENDING";

        }).length;


    const completed =
        allOrders.filter(function (order) {

            return normalizeStatus(
                order.orderStatus
            ) === "DELIVERED";

        }).length;


    const cancelled =
        allOrders.filter(function (order) {

            return normalizeStatus(
                order.orderStatus
            ) === "CANCELLED";

        }).length;


    const totalElement =
        document.getElementById(
            "totalOrders"
        );


    const pendingElement =
        document.getElementById(
            "pendingOrders"
        );


    const completedElement =
        document.getElementById(
            "completedOrders"
        );


    const cancelledElement =
        document.getElementById(
            "cancelledOrders"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (cancelledElement) {

        cancelledElement.textContent =
            cancelled;

    }

}


// =====================================================
// DISPLAY ORDERS
// =====================================================

function displayOrders(orders) {

    const tableBody =
        document.getElementById(
            "orderTableBody"
        );


    const emptyState =
        document.getElementById(
            "orderEmptyState"
        );


    if (!tableBody) {

        console.error(
            "Order table body not found."
        );

        return;

    }


    tableBody.innerHTML = "";


    if (
        !orders ||
        orders.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    orders.forEach(function (
        order,
        index
    ) {

        const row =
            document.createElement("tr");


        const orderStatus =
            normalizeStatus(
                order.orderStatus ||
                "PENDING"
            );


        const paymentStatus =
            normalizeStatus(
                order.paymentStatus ||
                "PENDING"
            );


        const serialNumber =
            index + 1;


        row.innerHTML = `

            <td class="order-serial">
                ${serialNumber}
            </td>

            <td>
                <strong class="order-id">
                    ${escapeHtml(
                        order.orderId || "-"
                    )}
                </strong>
            </td>

            <td>
                <span class="order-customer">
                    ${escapeHtml(
                        order.customerName || "-"
                    )}
                </span>
            </td>

            <td>
                ${formatDate(
                    order.orderDate
                )}
            </td>

            <td>
                <span class="order-amount">
                    ₹${formatAmount(
                        order.totalAmount
                    )}
                </span>
            </td>

            <td>

                <span class="
                    payment-status
                    ${paymentStatus.toLowerCase()}
                ">

                    ${escapeHtml(
                        order.paymentStatus ||
                        "PENDING"
                    )}

                </span>

            </td>

            <td>

                <span class="
                    order-status
                    ${orderStatus.toLowerCase()}
                ">

                    ${escapeHtml(
                        order.orderStatus ||
                        "PENDING"
                    )}

                </span>

            </td>

            <td>

                <div class="order-actions">

                    <button
                        type="button"
                        class="
                            order-action-button
                            view-order-button
                        "
                        onclick="viewOrder(${order.id})">

                        View

                    </button>


                    <button
                        type="button"
                        class="
                            order-action-button
                            update-order-button
                        "
                        onclick="openUpdateModal(${order.id})">

                        Update

                    </button>


                    <button
                        type="button"
                        class="
                            order-action-button
                            delete-order-button
                        "
                        onclick="openCancelModal(${order.id})">

                        Cancel

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// =====================================================
// VIEW ORDER
// =====================================================

async function viewOrder(id) {

    try {

        const response =
            await fetch(
                "/api/admin/orders/" + id
            );


        if (!response.ok) {

            throw new Error(
                "Order not found"
            );

        }


        const order =
            await response.json();


        const details =
            document.getElementById(
                "orderDetails"
            );


        if (!details) {

            return;

        }


        details.innerHTML = `

            <div class="order-detail-item">

                <strong>Order ID:</strong>

                <span>
                    ${escapeHtml(
                        order.orderId || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Customer:</strong>

                <span>
                    ${escapeHtml(
                        order.customerName || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Mobile:</strong>

                <span>
                    ${escapeHtml(
                        order.mobileNumber || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Email:</strong>

                <span>
                    ${escapeHtml(
                        order.email || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Address:</strong>

                <span>
                    ${escapeHtml(
                        order.deliveryAddress || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>City:</strong>

                <span>
                    ${escapeHtml(
                        order.city || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Pincode:</strong>

                <span>
                    ${escapeHtml(
                        order.pincode || "-"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Date:</strong>

                <span>
                    ${formatDate(
                        order.orderDate
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Total:</strong>

                <span>
                    ₹${formatAmount(
                        order.totalAmount
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Payment:</strong>

                <span>
                    ${escapeHtml(
                        order.paymentStatus ||
                        "PENDING"
                    )}
                </span>

            </div>


            <div class="order-detail-item">

                <strong>Status:</strong>

                <span>
                    ${escapeHtml(
                        order.orderStatus ||
                        "PENDING"
                    )}
                </span>

            </div>

        `;


        openOrderModal(
            "viewOrderModal"
        );

    }

    catch (error) {

        console.error(
            "Error loading order details:",
            error
        );


        alert(
            "Unable to load order details."
        );

    }

}


// =====================================================
// OPEN UPDATE MODAL
// =====================================================

function openUpdateModal(id) {

    const order =
        allOrders.find(function (item) {

            return Number(item.id) ===
                Number(id);

        });


    if (!order) {

        alert(
            "Order not found."
        );

        return;

    }


    selectedOrderId = id;


    const updateOrderId =
        document.getElementById(
            "updateOrderId"
        );


    const updateOrderStatus =
        document.getElementById(
            "updateOrderStatus"
        );


    const updatePaymentStatus =
        document.getElementById(
            "updatePaymentStatus"
        );


    if (updateOrderId) {

        updateOrderId.value =
            id;

    }


    if (updateOrderStatus) {

        updateOrderStatus.value =
            normalizeStatus(
                order.orderStatus ||
                "PENDING"
            );

    }


    if (updatePaymentStatus) {

        updatePaymentStatus.value =
            normalizeStatus(
                order.paymentStatus ||
                "PENDING"
            );

    }


    openOrderModal(
        "updateOrderModal"
    );

}


// =====================================================
// SETUP UPDATE FORM
// =====================================================

function setupUpdateForm() {

    const form =
        document.getElementById(
            "updateOrderForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "updateOrderId"
                ).value;


            const orderStatus =
                document.getElementById(
                    "updateOrderStatus"
                ).value;


            const paymentStatus =
                document.getElementById(
                    "updatePaymentStatus"
                ).value;


            if (!id) {

                alert(
                    "Order ID is missing."
                );

                return;

            }


            try {

                // -----------------------------------------
                // UPDATE ORDER STATUS
                // -----------------------------------------

                const orderResponse =
                    await fetch(
                        "/api/admin/orders/" +
                        id +
                        "/status?status=" +
                        encodeURIComponent(
                            orderStatus
                        ),
                        {
                            method: "PUT"
                        }
                    );


                if (!orderResponse.ok) {

                    const errorText =
                        await orderResponse.text();


                    console.error(
                        "Order status update failed:",
                        errorText
                    );


                    throw new Error(
                        "Order status update failed"
                    );

                }


                // -----------------------------------------
                // UPDATE PAYMENT STATUS
                // -----------------------------------------

                const paymentResponse =
                    await fetch(
                        "/api/admin/orders/" +
                        id +
                        "/payment-status?status=" +
                        encodeURIComponent(
                            paymentStatus
                        ),
                        {
                            method: "PUT"
                        }
                    );


                if (!paymentResponse.ok) {

                    const errorText =
                        await paymentResponse.text();


                    console.error(
                        "Payment status update failed:",
                        errorText
                    );


                    throw new Error(
                        "Payment status update failed"
                    );

                }


                closeOrderModal(
                    "updateOrderModal"
                );


                selectedOrderId = null;


                await loadOrders();


                alert(
                    "Order and payment status updated successfully."
                );

            }

            catch (error) {

                console.error(
                    "Error updating order:",
                    error
                );


                alert(
                    "Unable to update order or payment status."
                );

            }

        }
    );

}


// =====================================================
// OPEN CANCEL MODAL
// =====================================================

function openCancelModal(id) {

    selectedOrderId = id;


    const order =
        allOrders.find(function (item) {

            return Number(item.id) ===
                Number(id);

        });


    const message =
        document.getElementById(
            "deleteOrderMessage"
        );


    if (message) {

        if (
            order &&
            order.orderId
        ) {

            message.textContent =
                "Are you sure you want to cancel order " +
                order.orderId +
                "?";

        }

        else {

            message.textContent =
                "Are you sure you want to cancel this order?";

        }

    }


    openOrderModal(
        "deleteOrderModal"
    );

}


// =====================================================
// SETUP CANCEL BUTTON
// =====================================================

function setupCancelButton() {

    const button =
        document.getElementById(
            "confirmDeleteOrder"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async function () {

            if (!selectedOrderId) {

                alert(
                    "Order not selected."
                );

                return;

            }


            const orderId =
                selectedOrderId;


            try {

                button.disabled = true;

                button.textContent =
                    "Cancelling...";


                const response =
                    await fetch(
                        "/api/admin/orders/" +
                        orderId,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Cancel failed:",
                        response.status,
                        errorText
                    );


                    throw new Error(
                        "Unable to cancel order"
                    );

                }


                closeOrderModal(
                    "deleteOrderModal"
                );


                selectedOrderId = null;


                await loadOrders();


                alert(
                    "Order cancelled successfully."
                );

            }

            catch (error) {

                console.error(
                    "Error cancelling order:",
                    error
                );


                alert(
                    "Unable to cancel order."
                );

            }

            finally {

                button.disabled = false;

                button.textContent =
                    "Yes, Cancel";

            }

        }
    );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const search =
        document.getElementById(
            "orderSearch"
        );


    if (!search) {

        return;

    }


    search.addEventListener(
        "input",
        function () {

            applyFilters();

        }
    );

}


// =====================================================
// STATUS FILTER
// =====================================================

function setupFilter() {

    const filter =
        document.getElementById(
            "orderStatusFilter"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}


// =====================================================
// APPLY SEARCH + FILTER
// =====================================================

function applyFilters() {

    const searchElement =
        document.getElementById(
            "orderSearch"
        );


    const filterElement =
        document.getElementById(
            "orderStatusFilter"
        );


    const searchValue =
        searchElement
            ? searchElement.value
                .toLowerCase()
                .trim()
            : "";


    const filterValue =
        filterElement
            ? filterElement.value
            : "ALL";


    const filtered =
        allOrders.filter(
            function (order) {

                const orderId =
                    String(
                        order.orderId || ""
                    ).toLowerCase();


                const customer =
                    String(
                        order.customerName || ""
                    ).toLowerCase();


                const matchesSearch =
                    orderId.includes(
                        searchValue
                    ) ||
                    customer.includes(
                        searchValue
                    );


                const status =
                    normalizeStatus(
                        order.orderStatus
                    );


                const matchesFilter =
                    filterValue === "ALL" ||
                    status === filterValue;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    displayOrders(filtered);

}


// =====================================================
// OPEN MODAL
// =====================================================

function openOrderModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.add("show");


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeOrderModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


// =====================================================
// MODAL CLOSE SETUP
// =====================================================

function setupModalClose() {

    // -------------------------------------------------
    // ESCAPE KEY
    // -------------------------------------------------

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            const modals =
                document.querySelectorAll(
                    ".order-modal.show"
                );


            modals.forEach(
                function (modal) {

                    modal.classList.remove(
                        "show"
                    );


                    modal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }
            );


            selectedOrderId = null;

        }
    );


    // -------------------------------------------------
    // OUTSIDE CLICK
    // -------------------------------------------------

    document.querySelectorAll(
        ".order-modal"
    ).forEach(
        function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeOrderModal(
                            modal.id
                        );


                        selectedOrderId =
                            null;

                    }

                }
            );

        }
    );

}


// =====================================================
// EMPTY STATE
// =====================================================

function showEmptyState() {

    const tableBody =
        document.getElementById(
            "orderTableBody"
        );


    const emptyState =
        document.getElementById(
            "orderEmptyState"
        );


    if (tableBody) {

        tableBody.innerHTML = "";

    }


    if (emptyState) {

        emptyState.style.display =
            "block";

    }

}


// =====================================================
// NORMALIZE STATUS
// =====================================================

function normalizeStatus(status) {

    if (
       
         status === null ||
     status === undefined ||
        status === ""
         )
    

   {  return "PENDING";

       }


    return String(status)
        .trim()
       .toUpperCase();

}


// =====================================================
// ADMIN LOGOUT
// =====================================================

function setupAdminLogoutConfirm() {

    /*
     * FIX:
     *
     * The previous code called:
     *
     * getAdminLogoutElement()
     *
     * but that function does not exist.
     *
     * We directly search for the logout
     * confirmation button instead.
     */

    const confirmButton =
        document.getElementById(
            "adminLogoutConfirmButton"
        );


    if (!confirmButton) {

        return;

    }


    confirmButton.addEventListener(
        "click",
        function () {

            if (
                typeof hideAdminLogoutMessage ===
                "function"
            ) {

                hideAdminLogoutMessage();

            }


            if (
                typeof showAdminLogoutMessage ===
                "function"
            ) {

                showAdminLogoutMessage(
                    "Logging out..."
                );

            }


            confirmButton.disabled =
                true;


            /*
             * Spring Security logout
             *
             * Logout is sent using POST.
             */

            const logoutForm =
                document.createElement(
                    "form"
                );


            logoutForm.method =
                "POST";


            logoutForm.action =
                "/logout";


            logoutForm.style.display =
                "none";


            document.body.appendChild(
                logoutForm
            );


            logoutForm.submit();

        }
    );

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

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


// =====================================================
// FORMAT AMOUNT
// =====================================================

function formatAmount(amount) {

    const number =
        Number(amount || 0);


    return number.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

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
// END OF ORDER MANAGEMENT JAVASCRIPT
// =====================================================