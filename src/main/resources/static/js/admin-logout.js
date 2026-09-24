/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   ADMIN LOGOUT PAGE
   FINAL JAVASCRIPT
   ================================================= */


/* =====================================================
   GET ELEMENT
   ===================================================== */

function getAdminLogoutElement(id) {

    return document.getElementById(id);

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showAdminLogoutMessage(message) {

    const messageBox =
        getAdminLogoutElement(
            "adminLogoutMessage"
        );

    if (!messageBox) {
        return;
    }

    messageBox.textContent = message;

    messageBox.classList.add("show");

}


/* =====================================================
   HIDE MESSAGE
   ===================================================== */

function hideAdminLogoutMessage() {

    const messageBox =
        getAdminLogoutElement(
            "adminLogoutMessage"
        );

    if (!messageBox) {
        return;
    }

    messageBox.textContent = "";

    messageBox.classList.remove("show");

}


/* =====================================================
   CANCEL LOGOUT
   ===================================================== */

function setupAdminLogoutCancel() {

    const cancelButton =
        getAdminLogoutElement(
            "adminLogoutCancelButton"
        );

    if (!cancelButton) {
        return;
    }

    cancelButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "/admin/dashboard";

        }
    );

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

        setupAdminLogoutCancel();

        setupAdminLogoutConfirm();

    }
);