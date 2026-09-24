// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// ADMIN DASHBOARD JAVASCRIPT
// =====================================================


document.addEventListener("DOMContentLoaded", function () {

    console.log("Sulaiha Admin Dashboard Loaded");


    // =================================================
    // SIDEBAR TOGGLE
    // =================================================

    const sidebar =
        document.getElementById("adminSidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");


    if (sidebarToggle && sidebar) {

        sidebarToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "sidebar-open"
                );

            }
        );

    }


    // =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "adminLogoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            // -------------------------------------------------
            // SPRING SECURITY LOGOUT
            // -------------------------------------------------

            const logoutForm =
                document.createElement("form");


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


setupLogout();


    // =================================================
    // LOAD DASHBOARD
    // =================================================

    loadDashboardData();

});



// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboardData() {

    try {

        const response =
            await fetch(
                "/api/admin/dashboard"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load dashboard data"
            );

        }


        const data =
            await response.json();


        console.log(
            "Dashboard data loaded:",
            data
        );


        // =================================================
        // KPI DATA
        // =================================================

        updateElement(
            "totalCustomers",
            data.totalCustomers
        );


        updateElement(
            "totalProducts",
            data.totalProducts
        );


        updateElement(
            "totalOrders",
            data.totalOrders
        );


        updateSales(
            data.totalSales
        );


        // =================================================
        // RECENT ORDERS
        // =================================================

        displayRecentOrders(
            data.recentOrders || []
        );


        // =================================================
        // LOW STOCK PRODUCTS
        // =================================================

        displayLowStockProducts(
            data.lowStockProducts || []
        );


        // =================================================
        // DASHBOARD CHARTS
        // =================================================

        displayDashboardCharts(data);

    }


    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        showDashboardError();

    }

}



// =====================================================
// UPDATE ELEMENT
// =====================================================

function updateElement(
        elementId,
        value) {


    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ?? 0;

}



// =====================================================
// UPDATE SALES
// =====================================================

function updateSales(totalSales) {


    const element =
        document.getElementById(
            "totalSales"
        );


    if (!element) {

        return;

    }


    const amount =
        Number(
            totalSales || 0
        );


    element.textContent =
        "₹" +
        amount.toLocaleString("en-IN");

}



// =====================================================
// RECENT ORDERS
// =====================================================

function displayRecentOrders(orders) {


    const tableBody =
        document.getElementById(
            "recentOrdersBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    if (
        !orders ||
        orders.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-table"
                >
                    No orders available
                </td>

            </tr>

        `;

        return;

    }


    // Backend already provides
    // the latest orders.

    orders.forEach(function (order) {


        const row =
            document.createElement("tr");


        const orderId =
            order.orderId || "-";


        const customer =
            order.customerName || "-";


        const amount =
            Number(
                order.totalAmount || 0
            );


        const status =
            order.orderStatus ||
            "PENDING";


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHtml(orderId)}
                </strong>
            </td>

            <td>
                ${escapeHtml(customer)}
            </td>

            <td>
                ₹${amount.toLocaleString("en-IN")}
            </td>

            <td>
                <span class="order-status">
                    ${escapeHtml(status)}
                </span>
            </td>

        `;


        tableBody.appendChild(row);

    });

}



// =====================================================
// LOW STOCK PRODUCTS
// =====================================================

function displayLowStockProducts(products) {


    const stockList =
        document.getElementById(
            "lowStockList"
        );


    if (!stockList) {

        return;

    }


    stockList.innerHTML = "";


    if (
        !products ||
        products.length === 0
    ) {

        stockList.innerHTML = `

            <div class="admin-empty-box">

                <span>
                    📦
                </span>

                <p>
                    No low stock products
                </p>

            </div>

        `;

        return;

    }


    // Backend / Service decides
    // which products are low stock.

    products.forEach(function (product) {


        const item =
            document.createElement("div");


        item.className =
            "admin-stock-item";


        const productName =
            product.name ||
            product.productName ||
            "Product";


        const quantity =
            product.quantity ??
            product.stock ??
            0;


        item.innerHTML = `

            <div>

                <strong>
                    ${escapeHtml(productName)}
                </strong>

                <span>
                    Only ${quantity} item(s) left
                </span>

            </div>

        `;


        stockList.appendChild(item);

    });

}



// =====================================================
// DASHBOARD CHARTS
// =====================================================

function displayDashboardCharts(data) {


    // =================================================
    // SALES OVERVIEW
    // =================================================

    const salesCanvas =
        document.getElementById(
            "salesOverviewChart"
        );


    if (salesCanvas) {

        renderSalesOverviewChart(
            salesCanvas,
            data.salesOverview
        );

    }


    // =================================================
    // ORDER STATUS
    // =================================================

    const orderStatusCanvas =
        document.getElementById(
            "orderStatusChart"
        );


    if (orderStatusCanvas) {

        renderOrderStatusChart(
            orderStatusCanvas,
            data.orderStatus
        );

    }

}



// =====================================================
// SALES OVERVIEW CHART
// =====================================================

function renderSalesOverviewChart(
        canvas,
        salesOverview) {


    // -------------------------------------------------
    // Check Chart.js
    // -------------------------------------------------

    if (
        typeof Chart === "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    // -------------------------------------------------
    // Check backend data
    // -------------------------------------------------

    if (
        !salesOverview ||
        Object.keys(salesOverview).length === 0
    ) {

        console.warn(
            "Sales overview data is empty."
        );

        return;

    }


    // -------------------------------------------------
    // Destroy existing chart
    // -------------------------------------------------

    const existingChart =
        Chart.getChart(canvas);


    if (existingChart) {

        existingChart.destroy();

    }


    // -------------------------------------------------
    // Backend data → Chart data
    // -------------------------------------------------

    const labels =
        Object.keys(
            salesOverview
        );


    const values =
        Object.values(
            salesOverview
        );


    // -------------------------------------------------
    // Create Sales Overview Chart
    // -------------------------------------------------

    new Chart(canvas, {

        type: "line",


        data: {

            labels: labels,


            datasets: [

                {

                    label: "Sales",

                    data: values,

                    fill: true,

                    tension: 0.3

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            scales: {

                y: {

                    beginAtZero: true

                }

            },


            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}



// =====================================================
// ORDER STATUS CHART
// =====================================================

function renderOrderStatusChart(
        canvas,
        orderStatus) {


    // -------------------------------------------------
    // Check Chart.js
    // -------------------------------------------------

    if (
        typeof Chart === "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    // -------------------------------------------------
    // Check backend data
    // -------------------------------------------------

    if (
        !orderStatus ||
        Object.keys(orderStatus).length === 0
    ) {

        console.warn(
            "Order status data is empty."
        );

        return;

    }


    // -------------------------------------------------
    // Destroy existing chart
    // -------------------------------------------------

    const existingChart =
        Chart.getChart(canvas);


    if (existingChart) {

        existingChart.destroy();

    }


    // -------------------------------------------------
    // Backend data → Chart data
    // -------------------------------------------------

    const labels =
        Object.keys(
            orderStatus
        );


    const values =
        Object.values(
            orderStatus
        );


    // -------------------------------------------------
    // Create Order Status Chart
    // -------------------------------------------------

    new Chart(canvas, {

        type: "doughnut",


        data: {

            labels: labels,


            datasets: [

                {

                    label: "Orders",

                    data: values

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            plugins: {

                legend: {

                    display: true,

                    position: "bottom"

                }

            }

        }

    });

}



// =====================================================
// DASHBOARD ERROR
// =====================================================

function showDashboardError() {


    const customerElement =
        document.getElementById(
            "totalCustomers"
        );


    const productElement =
        document.getElementById(
            "totalProducts"
        );


    const orderElement =
        document.getElementById(
            "totalOrders"
        );


    const salesElement =
        document.getElementById(
            "totalSales"
        );


    if (customerElement) {

        customerElement.textContent =
            "-";

    }


    if (productElement) {

        productElement.textContent =
            "-";

    }


    if (orderElement) {

        orderElement.textContent =
            "-";

    }


    if (salesElement) {

        salesElement.textContent =
            "₹-";

    }


    const tableBody =
        document.getElementById(
            "recentOrdersBody"
        );


    if (tableBody) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-table"
                >
                    Unable to load dashboard data
                </td>

            </tr>

        `;

    }


    const stockList =
        document.getElementById(
            "lowStockList"
        );


    if (stockList) {

        stockList.innerHTML = `

            <div class="admin-empty-box">

                <span>
                    ⚠️
                </span>

                <p>
                    Unable to load stock data
                </p>

            </div>

        `;

    }

}



// =====================================================
// HTML SAFETY
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}