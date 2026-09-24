
// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// SETTINGS PAGE JAVASCRIPT
// FRONTEND VERSION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Settings JS Loaded Successfully");


    // =================================================
    // SETTINGS TAB NAVIGATION
    // =================================================

    const settingsTabs =
        document.querySelectorAll(".settings-tab");

    const settingsSections =
        document.querySelectorAll(".settings-section");


    settingsTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const sectionName =
                tab.getAttribute("data-section");


            // Remove active from all tabs

            settingsTabs.forEach(function (item) {

                item.classList.remove("active");

            });


            // Remove active from all sections

            settingsSections.forEach(function (section) {

                section.classList.remove("active");

            });


            // Activate clicked tab

            tab.classList.add("active");


            // Find corresponding section

            const selectedSection =
                document.getElementById(
                    sectionName + "Section"
                );


            if (selectedSection) {

                selectedSection.classList.add("active");

            }

        });

    });


    // =================================================
    // ACCOUNT INFORMATION
    // =================================================

    const accountForm =
        document.getElementById(
            "accountSettingsForm"
        );


    const fullNameInput =
        document.getElementById("fullName");


    const emailInput =
        document.getElementById("email");


    const mobileInput =
        document.getElementById(
            "mobileNumber"
        );


    // =================================================
    // ADDRESS INFORMATION
    // =================================================

    const addressForm =
        document.getElementById(
            "addressSettingsForm"
        );


    const deliveryAddressInput =
        document.getElementById(
            "deliveryAddress"
        );


    const cityInput =
        document.getElementById("city");


    const pincodeInput =
        document.getElementById("pincode");


    // =================================================
    // NOTIFICATION SETTINGS
    // =================================================

    const orderNotifications =
        document.getElementById(
            "orderNotifications"
        );


    const paymentNotifications =
        document.getElementById(
            "paymentNotifications"
        );


    const promotionNotifications =
        document.getElementById(
            "promotionNotifications"
        );


    // =================================================
    // SECURITY
    // =================================================

    const securityForm =
        document.getElementById(
            "securitySettingsForm"
        );


    const currentPasswordInput =
        document.getElementById(
            "currentPassword"
        );


    const newPasswordInput =
        document.getElementById(
            "newPassword"
        );


    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword"
        );


    // =================================================
    // LOGOUT
    // =================================================

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    // =================================================
    // LOAD SAVED SETTINGS
    // =================================================

    function loadSettings() {

        const savedSettings =
            JSON.parse(
                localStorage.getItem(
                    "sulaihaSettings"
                )
            ) || {};


        // ACCOUNT

        if (fullNameInput) {

            fullNameInput.value =
                savedSettings.fullName || "";

        }


        if (emailInput) {

            emailInput.value =
                savedSettings.email || "";

        }


        if (mobileInput) {

            mobileInput.value =
                savedSettings.mobileNumber || "";

        }


        // ADDRESS

        if (deliveryAddressInput) {

            deliveryAddressInput.value =
                savedSettings.deliveryAddress || "";

        }


        if (cityInput) {

            cityInput.value =
                savedSettings.city || "";

        }


        if (pincodeInput) {

            pincodeInput.value =
                savedSettings.pincode || "";

        }


        // NOTIFICATIONS

        if (orderNotifications) {

            orderNotifications.checked =
                savedSettings.orderNotifications !== false;

        }


        if (paymentNotifications) {

            paymentNotifications.checked =
                savedSettings.paymentNotifications !== false;

        }


        if (promotionNotifications) {

            promotionNotifications.checked =
                savedSettings.promotionNotifications === true;

        }

    }


    // =================================================
    // SAVE ACCOUNT INFORMATION
    // =================================================

    if (accountForm) {

        accountForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const savedSettings =
                    JSON.parse(
                        localStorage.getItem(
                            "sulaihaSettings"
                        )
                    ) || {};


                savedSettings.fullName =
                    fullNameInput.value.trim();


                savedSettings.email =
                    emailInput.value.trim();


                savedSettings.mobileNumber =
                    mobileInput.value.trim();


                localStorage.setItem(
                    "sulaihaSettings",
                    JSON.stringify(savedSettings)
                );


                alert(
                    "Account information saved successfully!"
                );

            }
        );

    }


    // =================================================
    // SAVE ADDRESS
    // =================================================

    if (addressForm) {

        addressForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const pincode =
                    pincodeInput.value.trim();


                if (!/^[0-9]{6}$/.test(pincode)) {

                    alert(
                        "Please enter a valid 6-digit pincode."
                    );

                    pincodeInput.focus();

                    return;

                }


                const savedSettings =
                    JSON.parse(
                        localStorage.getItem(
                            "sulaihaSettings"
                        )
                    ) || {};


                savedSettings.deliveryAddress =
                    deliveryAddressInput.value.trim();


                savedSettings.city =
                    cityInput.value.trim();


                savedSettings.pincode =
                    pincode;


                localStorage.setItem(
                    "sulaihaSettings",
                    JSON.stringify(savedSettings)
                );


                alert(
                    "Delivery address saved successfully!"
                );

            }
        );

    }


    // =================================================
    // NOTIFICATION SETTINGS
    // =================================================

    function saveNotificationSettings() {

        const savedSettings =
            JSON.parse(
                localStorage.getItem(
                    "sulaihaSettings"
                )
            ) || {};


        savedSettings.orderNotifications =
            orderNotifications
                ? orderNotifications.checked
                : true;


        savedSettings.paymentNotifications =
            paymentNotifications
                ? paymentNotifications.checked
                : true;


        savedSettings.promotionNotifications =
            promotionNotifications
                ? promotionNotifications.checked
                : false;


        localStorage.setItem(
            "sulaihaSettings",
            JSON.stringify(savedSettings)
        );


        console.log(
            "Notification settings saved."
        );

    }


    if (orderNotifications) {

        orderNotifications.addEventListener(
            "change",
            saveNotificationSettings
        );

    }


    if (paymentNotifications) {

        paymentNotifications.addEventListener(
            "change",
            saveNotificationSettings
        );

    }


    if (promotionNotifications) {

        promotionNotifications.addEventListener(
            "change",
            saveNotificationSettings
        );

    }


    // =================================================
    // SECURITY / CHANGE PASSWORD
    // =================================================

    if (securityForm) {

        securityForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const currentPassword =
                    currentPasswordInput.value.trim();


                const newPassword =
                    newPasswordInput.value.trim();


                const confirmPassword =
                    confirmPasswordInput.value.trim();


                // Check current password

                if (!currentPassword) {

                    alert(
                        "Please enter your current password."
                    );

                    currentPasswordInput.focus();

                    return;

                }


                // Check new password length

                if (newPassword.length < 6) {

                    alert(
                        "New password must contain at least 6 characters."
                    );

                    newPasswordInput.focus();

                    return;

                }


                // Check password match

                if (
                    newPassword !==
                    confirmPassword
                ) {

                    alert(
                        "New password and confirm password do not match."
                    );

                    confirmPasswordInput.focus();

                    return;

                }


                // Frontend demo only

                alert(
                    "Password changed successfully!"
                );


                // Clear password fields

                currentPasswordInput.value = "";

                newPasswordInput.value = "";

                confirmPasswordInput.value = "";

            }
        );

    }


    // =================================================
    // LOGOUT
    // =================================================

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {

                    return;

                }


                // Clear temporary session data

                sessionStorage.removeItem(
                    "pendingOrder"
                );


                sessionStorage.removeItem(
                    "sulaihaOrderId"
                );


                // Frontend logout

                alert(
                    "You have been logged out successfully."
                );


                // Go to login page

                window.location.href =
                    "/login";

            }
        );

    }


    // =================================================
    // INITIAL LOAD
    // =================================================

    loadSettings();


    console.log(
        "All Settings Features Loaded Successfully"
    );

});

