/* =====================================================
SULAIHA SMART MANAGEMENT SYSTEM
PROFILE PAGE JAVASCRIPT
FRONTEND VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


console.log("Sulaiha Profile JavaScript Loaded Successfully");


// =================================================
// GET PROFILE ELEMENTS
// =================================================

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const infoFullName =
    document.getElementById("infoFullName");

const infoEmail =
    document.getElementById("infoEmail");

const infoMobile =
    document.getElementById("infoMobile");

const profileAddress =
    document.getElementById("profileAddress");

const profileCity =
    document.getElementById("profileCity");

const profilePincode =
    document.getElementById("profilePincode");


// =================================================
// LOAD PROFILE DATA
// =================================================

function loadProfileData() {

    let settings = {};

    try {

        settings =
            JSON.parse(
                localStorage.getItem("sulaihaSettings")
            ) || {};

    } catch (error) {

        console.error(
            "Unable to read saved settings:",
            error
        );

        settings = {};

    }


    // =================================================
    // CUSTOMER INFORMATION
    // =================================================

    const fullName =
        settings.fullName || "User";

    const email =
        settings.email || "Not provided";

    const mobile =
        settings.mobileNumber || "Not provided";

    const address =
        settings.deliveryAddress || "Not provided";

    const city =
        settings.city || "Not provided";

    const pincode =
        settings.pincode || "Not provided";


    // =================================================
    // DISPLAY PROFILE HEADER
    // =================================================

    if (profileName) {

        profileName.textContent =
            fullName;

    }


    if (profileEmail) {

        profileEmail.textContent =
            email;

    }


    // =================================================
    // DISPLAY ACCOUNT INFORMATION
    // =================================================

    if (infoFullName) {

        infoFullName.textContent =
            fullName;

    }


    if (infoEmail) {

        infoEmail.textContent =
            email;

    }


    if (infoMobile) {

        infoMobile.textContent =
            mobile;

    }


    // =================================================
    // DISPLAY DELIVERY ADDRESS
    // =================================================

    if (profileAddress) {

        profileAddress.textContent =
            address;

    }


    if (profileCity) {

        profileCity.textContent =
            city;

    }


    if (profilePincode) {

        profilePincode.textContent =
            pincode;

    }


    console.log(
        "Profile data:",
        settings
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
// LOAD DATA
// =================================================

loadProfileData();


});
