// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// ADMIN - PAYMENT MANAGEMENT
// FINAL CORRECTED JAVASCRIPT
// =====================================================

let allPayments = [];
let selectedPaymentId = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Sulaiha Payment Management JavaScript Loaded Successfully"
    );

    setupSidebar();
    setupSearch();
    setupFilters();
    setupClearFilters();
    setupEditForm();
    setupModalEvents();
    setupAdminLogoutConfirm();

    loadPayments();

});


// =====================================================
// LOAD PAYMENTS
// =====================================================

async function loadPayments() {

    try {

        const response =
            await fetch("/api/admin/payments", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });


        if (!response.ok) {

            throw new Error(
                "Failed to load payment records. HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid payment data received from server."
            );

        }


        // Backend returns Order entities.
        // Store them directly.

        allPayments = data;


        console.log(
            "Payment records loaded:",
            allPayments
        );


        updatePaymentSummary();

        applyPaymentFilters();


    } catch (error) {

        console.error(
            "Payment loading error:",
            error
        );


        allPayments = [];

        updatePaymentSummary();

        showEmptyState();

    }

}


// =====================================================
// GET PAYMENT STATUS
// =====================================================

function getPaymentStatus(payment) {

    const status =
        String(
            payment?.paymentStatus || "PENDING"
        )
        .trim()
        .toUpperCase();


    if (
        status === "PAID" ||
        status === "COMPLETED"
    ) {

        return "COMPLETED";

    }


    if (status === "FAILED") {

        return "FAILED";

    }


    return "PENDING";

}


// =====================================================
// GET ORDER STATUS
// =====================================================

function getOrderStatus(payment) {

    return String(
        payment?.orderStatus || "PENDING"
    )
    .trim()
    .toUpperCase();

}


// =====================================================
// GET PAYMENT AMOUNT
// =====================================================

function getPaymentAmount(payment) {

    const amount =
        Number(payment?.totalAmount);


    return Number.isFinite(amount)
        ? amount
        : 0;

}


// =====================================================
// GET CUSTOMER NAME
// =====================================================

function getCustomerName(payment) {

    return (
        payment?.customerName ||
        payment?.fullName ||
        "-"
    );

}


// =====================================================
// SUMMARY
// =====================================================

function updatePaymentSummary() {

    const completed =
        allPayments.filter(
            payment =>
                getPaymentStatus(payment) === "COMPLETED"
        ).length;


    const pending =
        allPayments.filter(
            payment =>
                getPaymentStatus(payment) === "PENDING"
        ).length;


    const failed =
        allPayments.filter(
            payment =>
                getPaymentStatus(payment) === "FAILED"
        ).length;


    setText(
        "totalPayments",
        allPayments.length
    );


    setText(
        "completedPayments",
        completed
    );


    setText(
        "pendingPayments",
        pending
    );


    setText(
        "failedPayments",
        failed
    );

}


// =====================================================
// DISPLAY PAYMENTS
// =====================================================

function displayPayments(payments) {

    const tableBody =
        document.getElementById(
            "paymentTableBody"
        );


    const emptyState =
        document.getElementById(
            "paymentEmptyState"
        );


    if (!tableBody) {

        console.error(
            "paymentTableBody element not found."
        );

        return;

    }


    tableBody.innerHTML = "";


    if (
        !Array.isArray(payments) ||
        payments.length === 0
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


    payments.forEach(
        (payment, index) => {

            const status =
                getPaymentStatus(payment);


            const amount =
                getPaymentAmount(payment);


            const row =
                document.createElement("tr");


            row.className =
                "payment-data-row";


            row.dataset.paymentId =
                payment.id ?? "";


            row.dataset.status =
                status;


            row.innerHTML = `

                <td>
                    <strong>
                        ${index + 1}
                    </strong>
                </td>


                <td>
                    <strong>
                        ${escapeHtml(
                            payment.orderId || "-"
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(
                        getCustomerName(payment)
                    )}
                </td>


                <td>
                    <strong>
                        ₹${amount.toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                    </strong>
                </td>


                <td>
                    <span class="payment-method">
                        ${formatPaymentMethod(
                            payment.paymentMethod
                        )}
                    </span>
                </td>


                <td>
                    <span
                        class="payment-status ${status.toLowerCase()}"
                    >
                        ${formatPaymentStatus(status)}
                    </span>
                </td>


                <td>
                    ${formatDate(
                        payment.orderDate
                    )}
                </td>


                <td>

                    <div class="payment-actions">

                        <button
                            type="button"
                            class="payment-action-button payment-view-button"
                            onclick="viewPayment(${payment.id})"
                        >
                            View
                        </button>


                        <button
                            type="button"
                            class="payment-action-button payment-edit-button"
                            onclick="editPayment(${payment.id})"
                        >
                            Update
                        </button>


                        <button
                            type="button"
                            class="payment-action-button payment-delete-button"
                            onclick="deletePayment(${payment.id})"
                        >
                            Cancel
                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// =====================================================
// VIEW PAYMENT
// =====================================================

function viewPayment(id) {

    const payment =
        findPaymentById(id);


    const details =
        document.getElementById(
            "paymentDetails"
        );


    if (!payment) {

        alert(
            "Payment record not found."
        );

        return;

    }


    if (!details) {

        console.error(
            "paymentDetails element not found."
        );

        return;

    }


    const status =
        getPaymentStatus(payment);


    const amount =
        getPaymentAmount(payment);


    details.innerHTML = `

        <div class="payment-detail-row">

            <span>
                Payment ID
            </span>

            <strong>
                ${escapeHtml(
                    payment.id
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Order ID
            </span>

            <strong>
                ${escapeHtml(
                    payment.orderId || "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Customer Name
            </span>

            <strong>
                ${escapeHtml(
                    getCustomerName(payment)
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Amount
            </span>

            <strong>
                ₹${amount.toLocaleString(
                    "en-IN",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Payment Method
            </span>

            <strong>
                ${formatPaymentMethod(
                    payment.paymentMethod
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Payment Status
            </span>

            <strong>
                ${formatPaymentStatus(
                    status
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Order Status
            </span>

            <strong>
                ${formatOrderStatus(
                    payment.orderStatus
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Payment Date
            </span>

            <strong>
                ${formatDate(
                    payment.orderDate
                )}
            </strong>

        </div>

    `;


    openPaymentModal(
        "viewPaymentModal"
    );

}


// =====================================================
// EDIT PAYMENT
// =====================================================

function editPayment(id) {

    const payment =
        findPaymentById(id);


    if (!payment) {

        alert(
            "Payment record not found."
        );

        return;

    }


    selectedPaymentId =
        Number(payment.id);


    const idInput =
        document.getElementById(
            "editPaymentId"
        );


    const statusInput =
        document.getElementById(
            "editPaymentStatus"
        );


    if (idInput) {

        idInput.value =
            payment.id;

    }


    if (statusInput) {

        statusInput.value =
            getPaymentStatus(payment);

    }


    openPaymentModal(
        "editPaymentModal"
    );

}


// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

function setupEditForm() {

    const form =
        document.getElementById(
            "editPaymentForm"
        );


    if (!form) {

        console.warn(
            "editPaymentForm not found."
        );

        return;

    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (
                selectedPaymentId === null
            ) {

                alert(
                    "Please select a payment."
                );

                return;

            }


            const statusInput =
                document.getElementById(
                    "editPaymentStatus"
                );


            const status =
                statusInput?.value
                    ?.trim()
                    .toUpperCase();


            if (
                ![
                    "COMPLETED",
                    "PENDING",
                    "FAILED"
                ].includes(status)
            ) {

                alert(
                    "Invalid payment status."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `/api/admin/payments/${selectedPaymentId}/status?status=${encodeURIComponent(status)}`,
                        {
                            method: "PUT",
                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText ||
                        "Payment status update failed."
                    );

                }


                const updatedPayment =
                    await response.json();


                console.log(
                    "Payment updated:",
                    updatedPayment
                );


                closePaymentModal(
                    "editPaymentModal"
                );


                selectedPaymentId =
                    null;


                await loadPayments();


                alert(
                    "Payment status updated successfully."
                );


            } catch (error) {

                console.error(
                    "Payment update error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to update payment status."
                );

            }

        }
    );

}


// =====================================================
// CANCEL PAYMENT / ORDER
// =====================================================

async function deletePayment(id) {

    const payment =
        findPaymentById(id);


    if (!payment) {

        alert(
            "Payment record not found."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to cancel this payment/order?\n\n" +
            "Order ID: " +
            (payment.orderId || "-") +
            "\nCustomer: " +
            getCustomerName(payment)
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/admin/payments/${payment.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Cancellation failed."
            );

        }


        await loadPayments();


        alert(
            "Payment/order cancelled successfully."
        );


    } catch (error) {

        console.error(
            "Payment cancellation error:",
            error
        );


        alert(
            error.message ||
            "Unable to cancel payment."
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const input =
        document.getElementById(
            "paymentSearch"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        applyPaymentFilters
    );

}


// =====================================================
// STATUS FILTER
// =====================================================

function setupFilters() {

    const filter =
        document.getElementById(
            "paymentStatusFilter"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        applyPaymentFilters
    );

}


// =====================================================
// CLEAR FILTERS
// =====================================================

function setupClearFilters() {

    const button =
        document.getElementById(
            "clearPaymentFilters"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const search =
                document.getElementById(
                    "paymentSearch"
                );


            const filter =
                document.getElementById(
                    "paymentStatusFilter"
                );


            if (search) {

                search.value = "";

            }


            if (filter) {

                filter.value = "ALL";

            }


            applyPaymentFilters();

        }
    );

}


// =====================================================
// APPLY FILTERS
// =====================================================

function applyPaymentFilters() {

    const search =
        document.getElementById(
            "paymentSearch"
        )
        ?.value
        ?.toLowerCase()
        ?.trim() || "";


    const selectedStatus =
        document.getElementById(
            "paymentStatusFilter"
        )
        ?.value || "ALL";


    const filtered =
        allPayments.filter(
            payment => {

                const values = [

                    payment.id,

                    payment.orderId,

                    payment.customerName,

                    payment.mobileNumber,

                    payment.email,

                    payment.totalAmount,

                    payment.paymentMethod,

                    payment.paymentStatus,

                    payment.orderStatus

                ];


                const matchesSearch =
                    !search ||
                    values.some(
                        value =>
                            String(
                                value ?? ""
                            )
                            .toLowerCase()
                            .includes(search)
                    );


                const matchesStatus =
                    selectedStatus === "ALL" ||
                    getPaymentStatus(payment) ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    displayPayments(
        filtered
    );

}


// =====================================================
// FIND PAYMENT
// =====================================================

function findPaymentById(id) {

    return allPayments.find(
        payment =>
            Number(payment.id) ===
            Number(id)
    );

}


// =====================================================
// MODAL EVENTS
// =====================================================

function setupModalEvents() {

    document
        .querySelectorAll(
            ".payment-modal"
        )
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        closePaymentModal(
                            modal.id
                        );

                    }

                }
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".payment-modal.show"
                    )
                    .forEach(modal => {

                        closePaymentModal(
                            modal.id
                        );

                    });

            }

        }
    );

}


// =====================================================
// OPEN PAYMENT MODAL
// =====================================================

function openPaymentModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        console.error(
            "Payment modal not found:",
            id
        );

        return;

    }


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


// =====================================================
// CLOSE PAYMENT MODAL
// =====================================================

function closePaymentModal(id) {

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


    if (
        !document.querySelector(
            ".payment-modal.show"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


// =====================================================
// SIDEBAR
// =====================================================

function setupSidebar() {

    const toggle =
        document.getElementById(
            "sidebarToggle"
        );


    const sidebar =
        document.getElementById(
            "adminSidebar"
        );


    if (
        toggle &&
        sidebar
    ) {

        toggle.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "sidebar-open"
                );

            }
        );

    }

}


// =====================================================
// ADMIN LOGOUT
// =====================================================

function setupAdminLogoutConfirm() {

    const button =
        document.getElementById(
            "adminLogoutConfirmButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            button.disabled =
                true;


            const form =
                document.createElement(
                    "form"
                );


            form.method =
                "POST";


            form.action =
                "/logout";


            form.style.display =
                "none";


            document.body.appendChild(
                form
            );


            form.submit();

        }
    );

}


// =====================================================
// EMPTY STATE
// =====================================================

function showEmptyState() {

    const tableBody =
        document.getElementById(
            "paymentTableBody"
        );


    const emptyState =
        document.getElementById(
            "paymentEmptyState"
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


    if (
        value === "FAILED"
    ) {

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


    if (
        value === "CONFIRMED"
    ) {

        return "Confirmed";

    }


    if (
        value === "PROCESSING"
    ) {

        return "Processing";

    }


    if (
        value === "SHIPPED"
    ) {

        return "Shipped";

    }


    if (
        value === "DELIVERED"
    ) {

        return "Delivered";

    }


    if (
        value === "CANCELLED"
    ) {

        return "Cancelled";

    }


    if (
        value === "COMPLETED"
    ) {

        return "Completed";

    }


    return "Pending";

}


// =====================================================
// PAYMENT METHOD FORMAT
// =====================================================

function formatPaymentMethod(method) {

    const value =
        String(
            method || ""
        )
        .trim()
        .toUpperCase();


    if (!value) {

        return "-";

    }


    if (
        [
            "QR",
            "QR_CODE",
            "QR CODE"
        ].includes(value)
    ) {

        return "QR Code Scanner";

    }


    if (
        [
            "CARD",
            "DEBIT_CARD",
            "CREDIT_CARD",
            "DEBIT / CREDIT CARD"
        ].includes(value)
    ) {

        return "Debit / Credit Card";

    }


    if (
        [
            "ONLINE",
            "ONLINE_PAYMENT",
            "ONLINE PAYMENT"
        ].includes(value)
    ) {

        return "Online Payment";

    }


    if (
        [
            "NETBANKING",
            "NET_BANKING",
            "NET BANKING"
        ].includes(value)
    ) {

        return "Net Banking";

    }


    return escapeHtml(
        method
    );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(value) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


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
// SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value == null ||
            value === ""
                ? "0"
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
// NAVIGATION
// =====================================================

window.openNotifications =
    function () {

        window.location.href =
            "/admin/notifications";

    };


window.openAdminProfile =
    function () {

        window.location.href =
            "/admin/profile";

    };