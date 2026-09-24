/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   ADMIN PROFILE
   FINAL JAVASCRIPT
   ===================================================== */


/* =====================================================
   GET ELEMENT
   ===================================================== */

function getAdminProfileElement(id) {

    return document.getElementById(id);

}


/* =====================================================
   DEFAULT PROFILE DATA
   UI STAGE ONLY
   ===================================================== */

const defaultAdminProfile = {

    name: "Admin",

    email: "admin@sulaiha.com",

    phone: "+91 98765 43210",

    role: "Administrator"

};


/* =====================================================
   LOAD PROFILE
   ===================================================== */

function loadAdminProfile() {

    const nameInput =
        getAdminProfileElement("adminProfileName");

    const emailInput =
        getAdminProfileElement("adminProfileEmail");

    const phoneInput =
        getAdminProfileElement("adminProfilePhone");

    const roleInput =
        getAdminProfileElement("adminProfileRole");

    const displayName =
        getAdminProfileElement("profileDisplayName");

    const displayRole =
        getAdminProfileElement("profileDisplayRole");


    if (nameInput) {

        nameInput.value =
            defaultAdminProfile.name;

    }


    if (emailInput) {

        emailInput.value =
            defaultAdminProfile.email;

    }


    if (phoneInput) {

        phoneInput.value =
            defaultAdminProfile.phone;

    }


    if (roleInput) {

        roleInput.value =
            defaultAdminProfile.role;

    }


    if (displayName) {

        displayName.textContent =
            defaultAdminProfile.name;

    }


    if (displayRole) {

        displayRole.textContent =
            defaultAdminProfile.role;

    }

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showAdminProfileMessage(
    message,
    type = "success"
) {

    const messageBox =
        getAdminProfileElement(
            "adminProfileMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "admin-profile-message show "
        +
        type;


    window.setTimeout(function () {

        messageBox.className =
            "admin-profile-message";

        messageBox.textContent =
            "";

    }, 2500);

}


/* =====================================================
   UPDATE DISPLAY NAME
   ===================================================== */

function updateProfileDisplay() {

    const nameInput =
        getAdminProfileElement(
            "adminProfileName"
        );

    const displayName =
        getAdminProfileElement(
            "profileDisplayName"
        );


    if (!nameInput ||
        !displayName) {

        return;

    }


    const name =
        nameInput.value.trim();


    if (name.length > 0) {

        displayName.textContent =
            name;

    }

}


/* =====================================================
   PROFILE FORM SUBMIT
   ===================================================== */

function setupAdminProfileForm() {

    const profileForm =
        getAdminProfileElement(
            "adminProfileForm"
        );


    if (!profileForm) {
        return;
    }


    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nameInput =
                getAdminProfileElement(
                    "adminProfileName"
                );

            const emailInput =
                getAdminProfileElement(
                    "adminProfileEmail"
                );

            const phoneInput =
                getAdminProfileElement(
                    "adminProfilePhone"
                );


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            if (name === "") {

                showAdminProfileMessage(
                    "Please enter your name.",
                    "error"
                );

                return;

            }


            if (email === "") {

                showAdminProfileMessage(
                    "Please enter your email address.",
                    "error"
                );

                return;

            }


            /*
             * UI stage only.
             * Later this data can be sent
             * to Spring Boot REST API.
             */

            defaultAdminProfile.name =
                name;

            defaultAdminProfile.email =
                email;

            defaultAdminProfile.phone =
                phone;


            updateProfileDisplay();


            showAdminProfileMessage(
                "Profile updated successfully.",
                "success"
            );

        }
    );

}


/* =====================================================
   RESET PROFILE
   ===================================================== */

function setupAdminProfileReset() {

    const resetButton =
        getAdminProfileElement(
            "adminProfileResetButton"
        );


    if (!resetButton) {
        return;
    }


    resetButton.addEventListener(
        "click",
        function () {

            loadAdminProfile();

            showAdminProfileMessage(
                "Profile details reset.",
                "success"
            );

        }
    );

}


/* =====================================================
   CHANGE PASSWORD
   ===================================================== */

function setupChangePassword() {

    const changePasswordButton =
        getAdminProfileElement(
            "changePasswordButton"
        );


    if (!changePasswordButton) {
        return;
    }


    changePasswordButton.addEventListener(
        "click",
        function () {

            window.alert(
                "Change Password feature will be connected to the backend later."
            );

        }
    );

}


/* =====================================================
   SIDEBAR TOGGLE
   ===================================================== */

function setupAdminProfileSidebar() {

    const sidebarToggle =
        getAdminProfileElement(
            "sidebarToggle"
        );

    const adminSidebar =
        getAdminProfileElement(
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

function setupAdminProfileSidebarLinks() {

    const adminSidebar =
        getAdminProfileElement(
            "adminSidebar"
        );


    if (!adminSidebar) {
        return;
    }


    const links =
        adminSidebar.querySelectorAll(
            ".admin-nav-item"
        );


    links.forEach(function (link) {

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

        loadAdminProfile();

        setupAdminProfileForm();

        setupAdminProfileReset();

        setupChangePassword();

        setupAdminProfileSidebar();

        setupAdminProfileSidebarLinks();

        setupAdminLogoutConfirm() 

    }
);