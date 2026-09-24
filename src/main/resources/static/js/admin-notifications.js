/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   ADMIN NOTIFICATIONS
   FINAL JAVASCRIPT
   ===================================================== */


/* =====================================================
   SAMPLE UI DATA
   Backend connect செய்யும் வரை மட்டும்.
   Later this data can come from REST API.
   ===================================================== */

const adminNotifications = [

    {
        id: 1,
        type: "order",
        icon: "🛒",
        title: "New Order Received",
        message: "A new customer order has been placed.",
        time: "10 minutes ago",
        unread: true
    },

    {
        id: 2,
        type: "payment",
        icon: "💳",
        title: "Payment Received",
        message: "A payment has been successfully received.",
        time: "25 minutes ago",
        unread: true
    },

    {
        id: 3,
        type: "inventory",
        icon: "📦",
        title: "Low Stock Alert",
        message: "Some products have reached their low stock level.",
        time: "1 hour ago",
        unread: true
    },

    {
        id: 4,
        type: "customer",
        icon: "👥",
        title: "New Customer Registered",
        message: "A new customer has registered in the system.",
        time: "2 hours ago",
        unread: false
    },

    {
        id: 5,
        type: "order",
        icon: "🛒",
        title: "Order Status Updated",
        message: "An order status has been updated.",
        time: "3 hours ago",
        unread: false
    }

];


/* =====================================================
   ELEMENT HELPER
   ===================================================== */

function getNotificationElement(id) {

    return document.getElementById(id);

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeNotificationText(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =====================================================
   GET FILTERED NOTIFICATIONS
   ===================================================== */

function getFilteredNotifications() {

    const searchInput =
        getNotificationElement("notificationSearch");

    const filterSelect =
        getNotificationElement("notificationFilter");


    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const filterValue =
        filterSelect
            ? filterSelect.value
            : "all";


    return adminNotifications.filter(function (notification) {


        const matchesSearch =

            notification.title
                .toLowerCase()
                .includes(searchText)

            ||

            notification.message
                .toLowerCase()
                .includes(searchText);


        const matchesFilter =

            filterValue === "all"

            ||

            notification.type === filterValue

            ||

            (
                filterValue === "unread"
                &&
                notification.unread
            );


        return matchesSearch && matchesFilter;

    });

}


/* =====================================================
   RENDER NOTIFICATIONS
   ===================================================== */

function renderNotifications() {

    const notificationList =
        getNotificationElement("notificationList");

    const emptyState =
        getNotificationElement("notificationEmptyState");


    if (!notificationList ||
        !emptyState) {

        return;

    }


    const filteredNotifications =
        getFilteredNotifications();


    notificationList.innerHTML = "";


    if (filteredNotifications.length === 0) {

        emptyState.classList.add("show");

        updateNotificationCount(0);

        return;

    }


    emptyState.classList.remove("show");


    filteredNotifications.forEach(function (notification) {

        const item =
            document.createElement("article");


        item.className =
            "notification-item"
            +
            (
                notification.unread
                    ? " unread"
                    : ""
            );


        item.dataset.notificationId =
            notification.id;


        item.innerHTML = `

            <div class="notification-item-icon">
                ${escapeNotificationText(notification.icon)}
            </div>

            <div class="notification-item-content">

                <div class="notification-item-title">

                    <strong>
                        ${escapeNotificationText(notification.title)}
                    </strong>

                    ${
                        notification.unread
                            ? '<span class="notification-unread-dot"></span>'
                            : ''
                    }

                </div>

                <p class="notification-item-message">
                    ${escapeNotificationText(notification.message)}
                </p>

                <span class="notification-item-time">
                    ${escapeNotificationText(notification.time)}
                </span>

            </div>

            <div class="notification-item-action">

                ${
                    notification.unread
                        ?
                        `
                        <button
                            type="button"
                            class="notification-read-button"
                            data-action="read"
                            data-id="${notification.id}">
                            Mark Read
                        </button>
                        `
                        :
                        `
                        <button
                            type="button"
                            class="notification-read-button"
                            data-action="read"
                            data-id="${notification.id}">
                            Read
                        </button>
                        `
                }

            </div>

        `;


        notificationList.appendChild(item);

    });


    updateNotificationCount(
        filteredNotifications.length
    );

}


/* =====================================================
   UPDATE SUMMARY CARDS
   ===================================================== */

function updateNotificationSummary() {

    const totalNotifications =
        getNotificationElement(
            "totalNotifications"
        );

    const unreadNotifications =
        getNotificationElement(
            "unreadNotifications"
        );

    const orderNotificationsCount =
        getNotificationElement(
            "orderNotificationsCount"
        );

    const inventoryNotificationsCount =
        getNotificationElement(
            "inventoryNotificationsCount"
        );


    const total =
        adminNotifications.length;


    const unread =
        adminNotifications.filter(function (notification) {

            return notification.unread;

        }).length;


    const orders =
        adminNotifications.filter(function (notification) {

            return notification.type === "order";

        }).length;


    const inventory =
        adminNotifications.filter(function (notification) {

            return notification.type === "inventory";

        }).length;


    if (totalNotifications) {

        totalNotifications.textContent =
            total;

    }


    if (unreadNotifications) {

        unreadNotifications.textContent =
            unread;

    }


    if (orderNotificationsCount) {

        orderNotificationsCount.textContent =
            orders;

    }


    if (inventoryNotificationsCount) {

        inventoryNotificationsCount.textContent =
            inventory;

    }

}


/* =====================================================
   UPDATE COUNT LABEL
   ===================================================== */

function updateNotificationCount(count) {

    const countLabel =
        getNotificationElement(
            "notificationCountLabel"
        );


    if (!countLabel) {
        return;
    }


    countLabel.textContent =
        count === 1
            ? "1 notification"
            : count + " notifications";

}


/* =====================================================
   MARK ONE AS READ
   ===================================================== */

function markNotificationAsRead(notificationId) {

    const notification =
        adminNotifications.find(function (item) {

            return item.id === notificationId;

        });


    if (!notification) {
        return;
    }


    notification.unread = false;


    renderNotifications();

    updateNotificationSummary();


    showNotificationMessage(
        "Notification marked as read.",
        "success"
    );

}


/* =====================================================
   MARK ALL AS READ
   ===================================================== */

function markAllNotificationsAsRead() {

    let unreadFound = false;


    adminNotifications.forEach(function (notification) {

        if (notification.unread) {

            notification.unread = false;

            unreadFound = true;

        }

    });


    renderNotifications();

    updateNotificationSummary();


    if (unreadFound) {

        showNotificationMessage(
            "All notifications marked as read.",
            "success"
        );

    } else {

        showNotificationMessage(
            "There are no unread notifications.",
            "success"
        );

    }

}


/* =====================================================
   MESSAGE
   ===================================================== */

function showNotificationMessage(message, type) {

    const messageBox =
        getNotificationElement(
            "notificationMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "notification-message show "
        +
        type;


    window.setTimeout(function () {

        messageBox.className =
            "notification-message";

        messageBox.textContent =
            "";

    }, 2500);

}


/* =====================================================
   SEARCH
   ===================================================== */

function setupNotificationSearch() {

    const searchInput =
        getNotificationElement(
            "notificationSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            renderNotifications();

        }
    );

}


/* =====================================================
   FILTER
   ===================================================== */

function setupNotificationFilter() {

    const filterSelect =
        getNotificationElement(
            "notificationFilter"
        );


    if (!filterSelect) {
        return;
    }


    filterSelect.addEventListener(
        "change",
        function () {

            renderNotifications();

        }
    );

}


/* =====================================================
   NOTIFICATION ACTIONS
   ===================================================== */

function setupNotificationActions() {

    const notificationList =
        getNotificationElement(
            "notificationList"
        );


    if (!notificationList) {
        return;
    }


    notificationList.addEventListener(
        "click",
        function (event) {


            const button =
                event.target.closest(
                    ".notification-read-button"
                );


            if (!button) {
                return;
            }


            const notificationId =
                Number(
                    button.dataset.id
                );


            if (
                button.dataset.action === "read"
                &&
                !Number.isNaN(notificationId)
            ) {

                markNotificationAsRead(
                    notificationId
                );

            }

        }
    );

}


/* =====================================================
   MARK ALL BUTTON
   ===================================================== */

function setupMarkAllRead() {

    const markAllButton =
        getNotificationElement(
            "markAllReadButton"
        );


    if (!markAllButton) {
        return;
    }


    markAllButton.addEventListener(
        "click",
        function () {

            markAllNotificationsAsRead();

        }
    );

}


/* =====================================================
   SIDEBAR TOGGLE
   ===================================================== */

function setupSidebarToggle() {

    const sidebarToggle =
        getNotificationElement(
            "sidebarToggle"
        );

    const adminSidebar =
        getNotificationElement(
            "adminSidebar"
        );


    if (!sidebarToggle ||
        !adminSidebar) {

        return;

    }


    sidebarToggle.addEventListener(
        "click",
        function () {

            adminSidebar.classList.toggle(
                "sidebar-open"
            );

        }
    );

}


/* =====================================================
   SIDEBAR LINKS
   ===================================================== */

function setupSidebarLinks() {

    const adminSidebar =
        getNotificationElement(
            "adminSidebar"
        );


    if (!adminSidebar) {
        return;
    }


    const sidebarLinks =
        adminSidebar.querySelectorAll(
            ".admin-nav-item"
        );


    sidebarLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (window.innerWidth <= 768) {

                    adminSidebar.classList.remove(
                        "sidebar-open"
                    );

                }

            }
        );

    });

}


/* =====================================================
   CONFIRM LOGOUT
   ===================================================== */

function setupAdminLogoutConfirm() {

    const confirmButton =
        getAdminLogoutElement(
            "adminLogoutConfirmButton"
        );

    if (!confirmButton) {
        return;
    }

    confirmButton.addEventListener(
        "click",
        function () {

            hideAdminLogoutMessage();

            showAdminLogoutMessage(
                "Logging out..."
            );

            confirmButton.disabled = true;

            /*
             * Spring Security logout
             *
             * Logout must be sent using POST.
             * GET /logout causes 404.
             */

            const logoutForm =
                document.createElement("form");

            logoutForm.method = "POST";

            logoutForm.action = "/logout";

            logoutForm.style.display = "none";

            document.body.appendChild(
                logoutForm
            );

            logoutForm.submit();

        }
    );

}

/* =====================================================
   INITIALIZE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderNotifications();

        updateNotificationSummary();

        setupNotificationSearch();

        setupNotificationFilter();

        setupNotificationActions();

        setupMarkAllRead();

        setupSidebarToggle();

        setupSidebarLinks();

        setupAdminLogoutConfirm()

    }
);