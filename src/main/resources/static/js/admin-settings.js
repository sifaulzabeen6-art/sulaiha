/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   ADMIN SETTINGS
   FINAL JAVASCRIPT
   ===================================================== */


/* =====================================================
   DEFAULT SETTINGS
   ===================================================== */

const defaultAdminSettings = {

    adminName: "Admin",

    adminEmail: "admin@sulaiha.com",

    orderNotifications: true,

    paymentNotifications: true,

    lowStockNotifications: true,

    adminLanguage: "en",

    adminTimezone: "IST"

};


/* =====================================================
   GET ELEMENT
   ===================================================== */

function getSettingsElement(id) {

    return document.getElementById(id);

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showSettingsMessage(message, type) {

    const messageBox =
        getSettingsElement("settingsMessage");


    if (!messageBox) {
        return;
    }


    messageBox.textContent = message;

    messageBox.className =
        "settings-message show " + type;


    window.setTimeout(function () {

        messageBox.className =
            "settings-message";

        messageBox.textContent = "";

    }, 3000);

}


/* =====================================================
   SAVE SETTINGS
   ===================================================== */

function saveAdminSettings() {

    const adminName =
        getSettingsElement("adminName");

    const adminEmail =
        getSettingsElement("adminEmail");

    const orderNotifications =
        getSettingsElement("orderNotifications");

    const paymentNotifications =
        getSettingsElement("paymentNotifications");

    const lowStockNotifications =
        getSettingsElement("lowStockNotifications");

    const adminLanguage =
        getSettingsElement("adminLanguage");

    const adminTimezone =
        getSettingsElement("adminTimezone");


    if (!adminName ||
        !adminEmail ||
        !orderNotifications ||
        !paymentNotifications ||
        !lowStockNotifications ||
        !adminLanguage ||
        !adminTimezone) {

        return;

    }


    const name =
        adminName.value.trim();

    const email =
        adminEmail.value.trim();


    if (name === "") {

        showSettingsMessage(
            "Please enter the admin name.",
            "error"
        );

        adminName.focus();

        return;

    }


    if (email === "") {

        showSettingsMessage(
            "Please enter the email address.",
            "error"
        );

        adminEmail.focus();

        return;

    }


    const settings = {

        adminName: name,

        adminEmail: email,

        orderNotifications:
            orderNotifications.checked,

        paymentNotifications:
            paymentNotifications.checked,

        lowStockNotifications:
            lowStockNotifications.checked,

        adminLanguage:
            adminLanguage.value,

        adminTimezone:
            adminTimezone.value

    };


    localStorage.setItem(
        "sulaihaAdminSettings",
        JSON.stringify(settings)
    );


    showSettingsMessage(
        "Settings saved successfully.",
        "success"
    );

}


/* =====================================================
   LOAD SETTINGS
   ===================================================== */

function loadAdminSettings() {

    const savedSettings =
        localStorage.getItem(
            "sulaihaAdminSettings"
        );


    if (!savedSettings) {

        applySettings(defaultAdminSettings);

        return;

    }


    try {

        const settings =
            JSON.parse(savedSettings);


        applySettings({
            ...defaultAdminSettings,
            ...settings
        });


    } catch (error) {

        console.error(
            "Unable to load admin settings:",
            error
        );


        applySettings(defaultAdminSettings);

    }

}


/* =====================================================
   APPLY SETTINGS
   ===================================================== */

function applySettings(settings) {

    const adminName =
        getSettingsElement("adminName");

    const adminEmail =
        getSettingsElement("adminEmail");

    const orderNotifications =
        getSettingsElement("orderNotifications");

    const paymentNotifications =
        getSettingsElement("paymentNotifications");

    const lowStockNotifications =
        getSettingsElement("lowStockNotifications");

    const adminLanguage =
        getSettingsElement("adminLanguage");

    const adminTimezone =
        getSettingsElement("adminTimezone");


    if (adminName) {

        adminName.value =
            settings.adminName;

    }


    if (adminEmail) {

        adminEmail.value =
            settings.adminEmail;

    }


    if (orderNotifications) {

        orderNotifications.checked =
            settings.orderNotifications;

    }


    if (paymentNotifications) {

        paymentNotifications.checked =
            settings.paymentNotifications;

    }


    if (lowStockNotifications) {

        lowStockNotifications.checked =
            settings.lowStockNotifications;

    }


    if (adminLanguage) {

        adminLanguage.value =
            settings.adminLanguage;

    }


    if (adminTimezone) {

        adminTimezone.value =
            settings.adminTimezone;

    }

}


/* =====================================================
   RESET SETTINGS
   ===================================================== */

function resetAdminSettings() {

    const confirmation =
        window.confirm(
            "Are you sure you want to reset the settings?"
        );


    if (!confirmation) {
        return;
    }


    localStorage.removeItem(
        "sulaihaAdminSettings"
    );


    applySettings(defaultAdminSettings);


    clearPasswordFields();


    showSettingsMessage(
        "Settings have been reset.",
        "success"
    );

}


/* =====================================================
   PASSWORD VALIDATION
   ===================================================== */

function validatePasswordSettings() {

    const currentPassword =
        getSettingsElement("currentPassword");

    const newPassword =
        getSettingsElement("newPassword");

    const confirmPassword =
        getSettingsElement("confirmPassword");


    if (!currentPassword ||
        !newPassword ||
        !confirmPassword) {

        return true;

    }


    const currentValue =
        currentPassword.value.trim();

    const newValue =
        newPassword.value.trim();

    const confirmValue =
        confirmPassword.value.trim();


    /*
     * If all password fields are empty,
     * password update is not requested.
     */

    if (
        currentValue === "" &&
        newValue === "" &&
        confirmValue === ""
    ) {

        return true;

    }


    if (currentValue === "") {

        showSettingsMessage(
            "Please enter your current password.",
            "error"
        );

        currentPassword.focus();

        return false;

    }


    if (newValue === "") {

        showSettingsMessage(
            "Please enter a new password.",
            "error"
        );

        newPassword.focus();

        return false;

    }


    if (newValue.length < 6) {

        showSettingsMessage(
            "New password must contain at least 6 characters.",
            "error"
        );

        newPassword.focus();

        return false;

    }


    if (confirmValue === "") {

        showSettingsMessage(
            "Please confirm your new password.",
            "error"
        );

        confirmPassword.focus();

        return false;

    }


    if (newValue !== confirmValue) {

        showSettingsMessage(
            "New password and confirmation password do not match.",
            "error"
        );

        confirmPassword.focus();

        return false;

    }


    return true;

}


/* =====================================================
   CLEAR PASSWORD FIELDS
   ===================================================== */

function clearPasswordFields() {

    const currentPassword =
        getSettingsElement("currentPassword");

    const newPassword =
        getSettingsElement("newPassword");

    const confirmPassword =
        getSettingsElement("confirmPassword");


    if (currentPassword) {

        currentPassword.value = "";

    }


    if (newPassword) {

        newPassword.value = "";

    }


    if (confirmPassword) {

        confirmPassword.value = "";

    }

}


/* =====================================================
   SAVE BUTTON EVENT
   ===================================================== */

function setupSaveSettings() {

    const saveButton =
        getSettingsElement("saveSettingsButton");


    if (!saveButton) {
        return;
    }


    saveButton.addEventListener(
        "click",
        function () {


            if (!validatePasswordSettings()) {

                return;

            }


            saveAdminSettings();


            /*
             * Password is not stored in localStorage.
             * It will later be handled securely
             * through the Spring Boot backend.
             */

            clearPasswordFields();

        }
    );

}


/* =====================================================
   RESET BUTTON EVENT
   ===================================================== */

function setupResetSettings() {

    const resetButton =
        getSettingsElement(
            "resetSettingsButton"
        );


    if (!resetButton) {
        return;
    }


    resetButton.addEventListener(
        "click",
        function () {

            resetAdminSettings();

        }
    );

}


/* =====================================================
   SIDEBAR TOGGLE
   ===================================================== */

function setupSidebarToggle() {

    const sidebarToggle =
        getSettingsElement("sidebarToggle");

    const adminSidebar =
        getSettingsElement("adminSidebar");


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
   CLOSE MOBILE SIDEBAR
   ===================================================== */

function setupSidebarLinks() {

    const adminSidebar =
        getSettingsElement("adminSidebar");


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

                if (
                    window.innerWidth <= 768
                ) {

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
   INITIALIZE SETTINGS PAGE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminSettings();

        setupSaveSettings();

        setupResetSettings();

        setupSidebarToggle();

        setupSidebarLinks();

        setupAdminLogoutConfirm()

    }
);