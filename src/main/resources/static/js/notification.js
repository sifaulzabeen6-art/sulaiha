/* =====================================================
SULAIHA SMART MANAGEMENT SYSTEM
NOTIFICATION PAGE JAVASCRIPT
FRONTEND VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


console.log(
    "Sulaiha Notification JavaScript Loaded Successfully"
);


// =================================================
// GET ELEMENTS
// =================================================

const notificationList =
    document.getElementById("notificationList");

const emptyMessage =
    document.getElementById(
        "emptyNotificationMessage"
    );

const totalNotifications =
    document.getElementById(
        "totalNotifications"
    );

const unreadNotifications =
    document.getElementById(
        "unreadNotifications"
    );

const markAllReadButton =
    document.getElementById(
        "markAllReadButton"
    );


// =================================================
// LOAD NOTIFICATIONS
// =================================================

let notifications =
    JSON.parse(
        localStorage.getItem(
            "sulaihaNotifications"
        )
    ) || [];


// =================================================
// CREATE DEFAULT NOTIFICATIONS
// =================================================

if (notifications.length === 0) {

    notifications = [

        {
            id: 1,
            title: "Welcome to Sulaiha",
            message:
                "Your Sulaiha account is ready to use.",
            type: "account",
            date: new Date().toISOString(),
            read: false
        },

        {
            id: 2,
            title: "Order Updates",
            message:
                "You will receive notifications when your order status changes.",
            type: "order",
            date: new Date().toISOString(),
            read: false
        },

        {
            id: 3,
            title: "Payment Updates",
            message:
                "Payment information will be shown here when available.",
            type: "payment",
            date: new Date().toISOString(),
            read: true
        }

    ];


    localStorage.setItem(
        "sulaihaNotifications",
        JSON.stringify(notifications)
    );

}


// =================================================
// DISPLAY NOTIFICATIONS
// =================================================

function displayNotifications() {

    if (!notificationList) {
        return;
    }


    notificationList.innerHTML = "";


    // Empty check

    if (notifications.length === 0) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        updateNotificationCount();

        return;
    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    // Create notification cards

    notifications.forEach(
        function (notification) {

            const notificationItem =
                document.createElement("div");


            notificationItem.className =
                "notification-item";


            if (!notification.read) {

                notificationItem.classList.add(
                    "unread"
                );

            }


            notificationItem.innerHTML = `

                <div class="notification-icon-box">

                    ${getNotificationIcon(
                        notification.type
                    )}

                </div>


                <div class="notification-content">

                    <h4>
                        ${notification.title}
                    </h4>

                    <p>
                        ${notification.message}
                    </p>

                    <span class="notification-date">

                        ${formatDate(
                            notification.date
                        )}

                    </span>

                </div>


                ${
                    !notification.read
                    ? `
                        <button
                            type="button"
                            class="read-button">

                            Mark Read

                        </button>
                    `
                    : `
                        <span class="read-label">
                            Read
                        </span>
                    `
                }

            `;


            // =================================================
            // MARK SINGLE NOTIFICATION AS READ
            // =================================================

            const readButton =
                notificationItem.querySelector(
                    ".read-button"
                );


            if (readButton) {

                readButton.addEventListener(
                    "click",
                    function () {

                        notification.read =
                            true;


                        saveNotifications();

                        displayNotifications();

                    }
                );

            }


            notificationList.appendChild(
                notificationItem
            );

        }
    );


    updateNotificationCount();

}


// =================================================
// GET NOTIFICATION ICON
// =================================================

function getNotificationIcon(type) {

    if (type === "order") {

        return "📦";

    }

    if (type === "payment") {

        return "💳";

    }

    if (type === "account") {

        return "👤";

    }

    return "🔔";

}


// =================================================
// FORMAT DATE
// =================================================

function formatDate(dateValue) {

    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return "Recently";

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
// UPDATE NOTIFICATION COUNT
// =================================================

function updateNotificationCount() {

    if (totalNotifications) {

        totalNotifications.textContent =
            notifications.length;

    }


    const unreadCount =
        notifications.filter(
            function (notification) {

                return !notification.read;

            }
        ).length;


    if (unreadNotifications) {

        unreadNotifications.textContent =
            unreadCount;

    }

}


// =================================================
// SAVE NOTIFICATIONS
// =================================================

function saveNotifications() {

    localStorage.setItem(
        "sulaihaNotifications",
        JSON.stringify(notifications)
    );

}


// =================================================
// MARK ALL AS READ
// =================================================

if (markAllReadButton) {

    markAllReadButton.addEventListener(
        "click",
        function () {

            notifications.forEach(
                function (notification) {

                    notification.read =
                        true;

                }
            );


            saveNotifications();

            displayNotifications();

            alert(
                "All notifications marked as read."
            );

        }
    );

}


// =================================================
// OPEN PROFILE
// =================================================

window.openProfile = function () {

    window.location.href =
        "/profile";

};


// =================================================
// INITIAL LOAD
// =================================================

displayNotifications();


});
