/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   HOME PAGE - JAVASCRIPT
   ===================================================== */


/* =====================================================
   NOTIFICATION BUTTON
   ===================================================== */

function showNotifications() {

    alert("You have no new notifications.");
}


/* =====================================================
   PROFILE BUTTON
   ===================================================== */

function openProfile() {

    // Open the profile page
    window.location.href = "/profile";
}


/* =====================================================
   CATEGORY CARD CLICK
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const categoryCards =
        document.querySelectorAll(".category-card");

    categoryCards.forEach(function (card) {

        card.addEventListener("click", function () {

            // The category link in the HTML
            // will automatically open the products page.
            console.log("Category selected");

        });

    });


    /* =================================================
       PRODUCT CARD BUTTON
       ================================================= */

    const productButtons =
        document.querySelectorAll(".view-button");

    productButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log("Opening product page");

        });

    });


    /* =================================================
       SMOOTH SCROLL FOR CATEGORY BUTTON
       ================================================= */

    const categoryButton =
        document.querySelector(".secondary-button");

    if (categoryButton) {

        categoryButton.addEventListener("click", function (event) {

            const categorySection =
                document.getElementById("categories");

            if (categorySection) {

                event.preventDefault();

                categorySection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    }


    /* =================================================
       MOBILE MENU CHECK
       ================================================= */

    console.log(
        "Sulaiha Smart Management System Home Page Loaded"
    );

});
/* =====================================================
   COMMON PAGE LOADED MESSAGE
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "Sulaiha Smart Management System Page Loaded"
    );

});
function openNotifications() {

    window.location.href = "/notifications";

}