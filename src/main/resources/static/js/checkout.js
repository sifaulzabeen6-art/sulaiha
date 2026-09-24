// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// CHECKOUT.JS - FINAL
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);

    const checkoutForm = $("checkoutForm");

    if (!checkoutForm) {
        console.error("Checkout form not found.");
        return;
    }


    // =================================================
    // FORM ELEMENTS
    // =================================================

    const fullName = $("fullName");
    const mobile = $("mobileNumber");
    const email = $("email");
    const address = $("deliveryAddress");
    const city = $("city");
    const pincode = $("pincode");

    const checkoutItems = $("checkoutItems");
    const itemCount = $("checkoutItemCount");

    const totalAreaEl = $("checkoutTotalArea");
    const subtotalEl = $("checkoutSubtotal");
    const deliveryEl = $("checkoutDelivery");
    const totalEl = $("checkoutTotal");

    const placeOrderBtn = $("placeOrderButton");


    // =================================================
    // LOAD CART
    // =================================================

    let cart = [];

    try {

        cart = JSON.parse(
            localStorage.getItem("sulaihaCart")
        ) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        cart = [];
    }


    // =================================================
    // PAYMENT STATE
    // =================================================

    let selectedPaymentMethod = "";
    let paymentCompleted = false;


    const paymentNames = {

        QR: "QR Code Scanner",

        CARD: "Debit / Credit Card",

        ONLINE: "Online Payment",

        NETBANKING: "Net Banking"

    };


    // =================================================
    // CALCULATE CART PRODUCT
    // =================================================

    function calculateCartProduct(item) {

        const quantity =
            Number(item.quantity) || 1;

        const price =
            Number(item.price) || 0;

        const pricingType =
            String(
                item.pricingType || ""
            ).toUpperCase();


        // =============================================
        // DIMENSION PRODUCT
        // =============================================

        if (
            pricingType === "DIMENSION" &&
            Number(item.length) > 0 &&
            Number(item.width) > 0
        ) {

            const length =
                Number(item.length);

            const width =
                Number(item.width);

            const dimensionUnit =
                String(
                    item.dimensionUnit || "ft"
                ).toLowerCase();


            let areaPerUnit = 0;


            // Feet

            if (
                dimensionUnit === "ft" ||
                dimensionUnit === "feet"
            ) {

                areaPerUnit =
                    length * width;

            }


            // Inches

            else if (
                dimensionUnit === "in" ||
                dimensionUnit === "inch" ||
                dimensionUnit === "inches"
            ) {

                areaPerUnit =
                    (length * width) / 144;

            }


            // Fallback

            else {

                areaPerUnit =
                    length * width;

            }


            const totalArea =
                areaPerUnit * quantity;


            const itemTotal =
                totalArea * price;


            return {

                quantity: quantity,

                price: price,

                areaPerUnit: areaPerUnit,

                totalArea: totalArea,

                itemTotal: itemTotal

            };

        }


        // =============================================
        // NORMAL PRODUCT
        // =============================================

        const itemTotal =
            price * quantity;


        return {

            quantity: quantity,

            price: price,

            areaPerUnit: 0,

            totalArea: 0,

            itemTotal: itemTotal

        };

    }


    // =================================================
    // DISPLAY CART
    // =================================================

    function displayCart() {

        if (!checkoutItems) {
            return 0;
        }


        checkoutItems.innerHTML = "";


        let count = 0;

        let subtotal = 0;

        let totalArea = 0;


        // =============================================
        // DISPLAY EACH PRODUCT
        // =============================================

        cart.forEach(item => {

            const calculation =
                calculateCartProduct(item);


            const quantity =
                calculation.quantity;

            const price =
                calculation.price;

            const areaPerUnit =
                calculation.areaPerUnit;

            const itemTotal =
                calculation.itemTotal;

            const itemArea =
                calculation.totalArea;


            count += quantity;

            subtotal += itemTotal;

            totalArea += itemArea;


            const product =
                document.createElement("div");

            product.className =
                "checkout-product-item";


            // =========================================
            // SIZE
            // =========================================

            let sizeHTML = "";

            const pricingType =
                String(
                    item.pricingType || ""
                ).toUpperCase();


            if (
                pricingType === "DIMENSION" &&
                Number(item.length) > 0 &&
                Number(item.width) > 0
            ) {

                sizeHTML = `
                    <span>
                        Size:
                        ${formatNumber(item.length)}
                        ×
                        ${formatNumber(item.width)}
                        ${escapeHTML(
                            item.dimensionUnit || "ft"
                        )}
                    </span>
                `;

            }


            // =========================================
            // AREA PER UNIT
            // =========================================

            let areaHTML = "";

            if (areaPerUnit > 0) {

                areaHTML = `
                    <span>
                        Area per Unit:
                        ${formatNumber(areaPerUnit)}
                        sq.ft
                    </span>
                `;

            }


            // =========================================
            // TOTAL AREA
            // =========================================

            let totalAreaHTML = "";

            if (itemArea > 0) {

                totalAreaHTML = `
                    <span>
                        Total Area:
                        ${formatNumber(itemArea)}
                        sq.ft
                    </span>
                `;

            }


            // =========================================
            // PRODUCT HTML
            // =========================================

            product.innerHTML = `

                <div class="checkout-product-image">

                    <img
                        src="${escapeHTML(
                            item.image ||
                            "/images/product-placeholder.jpg"
                        )}"
                        alt="${escapeHTML(
                            item.name || "Product"
                        )}"
                    >

                </div>


                <div class="checkout-product-info">

                    <h4>
                        ${escapeHTML(
                            item.name || "Product"
                        )}
                    </h4>


                    <p>
                        ${formatCurrency(price)}
                        /
                        ${escapeHTML(
                            pricingType === "DIMENSION"
                                ? "sq.ft"
                                : item.unit || "unit"
                        )}
                    </p>


                    ${sizeHTML}


                    ${areaHTML}


                    <span>
                        Quantity:
                        ${quantity}
                    </span>


                    ${totalAreaHTML}

                </div>


                <strong class="checkout-item-total">

                    ${formatCurrency(itemTotal)}

                </strong>

            `;


            checkoutItems.appendChild(product);

        });


        // =================================================
        // ITEM COUNT
        // =================================================

        if (itemCount) {

            itemCount.textContent =
                `${count} ${count === 1 ? "item" : "items"}`;

        }


        // =================================================
        // TOTAL AREA
        // =================================================

        if (totalAreaEl) {

            totalAreaEl.textContent =
                `${formatNumber(totalArea)} sq.ft`;

        }


        // =================================================
        // SUBTOTAL
        // =================================================

        if (subtotalEl) {

            subtotalEl.textContent =
                formatCurrency(subtotal);

        }


        // =================================================
        // DELIVERY
        // =================================================

        if (deliveryEl) {

            deliveryEl.textContent =
                "FREE";

        }


        // =================================================
        // FINAL TOTAL
        // =================================================

        if (totalEl) {

            totalEl.textContent =
                formatCurrency(subtotal);

        }


        return subtotal;

    }


    // =================================================
    // CALCULATE FINAL TOTAL
    // =================================================

    function calculateTotal() {

        let subtotal = 0;


        cart.forEach(item => {

            const calculation =
                calculateCartProduct(item);

            subtotal +=
                calculation.itemTotal;

        });


        const deliveryCharge = 0;


        return subtotal + deliveryCharge;

    }


    // =================================================
    // EMPTY CART
    // =================================================

    if (!cart.length) {

        if (checkoutItems) {

            checkoutItems.innerHTML = `

                <div class="empty-checkout">

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Please add products before checkout.
                    </p>

                    <a href="/products">
                        Continue Shopping
                    </a>

                </div>

            `;

        }


        if (totalAreaEl) {
            totalAreaEl.textContent =
                "0 sq.ft";
        }


        if (subtotalEl) {
            subtotalEl.textContent =
                "₹0";
        }


        if (totalEl) {
            totalEl.textContent =
                "₹0";
        }


        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
        }


        return;

    }


    // =================================================
    // PINCODE → CITY
    // =================================================

    if (pincode) {

        pincode.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 6);


                if (city) {

                    city.value = "";

                    city.placeholder =
                        "Enter 6-digit pincode";

                }


                if (this.value.length === 6) {

                    fetchCity(this.value);

                }

            }
        );

    }


    // =================================================
    // FETCH CITY
    // =================================================

    async function fetchCity(pin) {

        if (!city) {
            return;
        }


        city.value = "";

        city.placeholder =
            "Checking pincode...";


        try {

            const response =
                await fetch(
                    `https://api.postalpincode.in/pincode/${encodeURIComponent(pin)}`
                );


            if (!response.ok) {

                throw new Error(
                    "Pincode API request failed."
                );

            }


            const data =
                await response.json();


            const postOffice =
                data?.[0]?.PostOffice?.[0];


            if (
                data?.[0]?.Status !== "Success" ||
                !postOffice
            ) {

                city.value = "";

                city.placeholder =
                    "Invalid pincode";

                return;

            }


            city.value =
                postOffice.District ||
                postOffice.Block ||
                postOffice.Name ||
                "";


            city.placeholder =
                "City";

        } catch (error) {

            console.error(
                "Pincode lookup error:",
                error
            );


            city.value = "";

            city.placeholder =
                "Unable to verify pincode";

        }

    }


    // =================================================
    // MOBILE FORMATTING
    // =================================================

    [
        mobile,
        $("onlinePaymentMobile")
    ].forEach(input => {

        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 10);

            }
        );

    });


    // =================================================
    // PAYMENT MODAL ELEMENTS
    // =================================================

    const paymentModal =
        $("paymentModal");

    const paymentOverlay =
        $("paymentModalOverlay");

    const closePaymentButton =
        $("closePaymentModal");


    const panels = [

        $("paymentInitialState"),

        $("qrPaymentForm"),

        $("cardPaymentForm"),

        $("onlinePaymentForm"),

        $("netBankingPaymentForm"),

        $("paymentSuccessState")

    ];


    // =================================================
    // HIDE PAYMENT PANELS
    // =================================================

    function hidePaymentPanels() {

        panels.forEach(panel => {

            if (panel) {
                panel.hidden = true;
            }

        });

    }


    // =================================================
    // OPEN PAYMENT MODAL
    // =================================================

    function openPaymentModal(method) {

        if (!paymentModal) {
            return;
        }


        hidePaymentPanels();


        const panelMap = {

            QR:
                $("qrPaymentForm"),

            CARD:
                $("cardPaymentForm"),

            ONLINE:
                $("onlinePaymentForm"),

            NETBANKING:
                $("netBankingPaymentForm")

        };


        const panel =
            panelMap[method];


        if (panel) {

            panel.hidden = false;

        } else {

            const initial =
                $("paymentInitialState");

            if (initial) {
                initial.hidden = false;
            }

        }


        paymentModal.classList.add("show");

        paymentModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    // =================================================
    // CLOSE PAYMENT MODAL
    // =================================================

    function closePaymentModal() {

        if (!paymentModal) {
            return;
        }


        paymentModal.classList.remove("show");

        paymentModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    // =================================================
    // CLOSE BUTTON
    // =================================================

    if (closePaymentButton) {

        closePaymentButton.addEventListener(
            "click",
            closePaymentModal
        );

    }


    // =================================================
    // OVERLAY CLICK
    // =================================================

    if (paymentOverlay) {

        paymentOverlay.addEventListener(
            "click",
            closePaymentModal
        );

    }


    // =================================================
    // PAYMENT METHOD SELECTION
    // =================================================

    document
        .querySelectorAll(
            'input[name="paymentMethod"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                function () {

                    selectedPaymentMethod =
                        this.value
                            .trim()
                            .toUpperCase();


                    paymentCompleted =
                        false;


                    updatePaymentDisplay();


                    openPaymentModal(
                        selectedPaymentMethod
                    );

                }
            );

        });


    // =================================================
    // COMPLETE PAYMENT
    // =================================================

    function completePayment(method) {

        selectedPaymentMethod =
            method
                .trim()
                .toUpperCase();


        paymentCompleted =
            true;


        hidePaymentPanels();


        const success =
            $("paymentSuccessState");


        if (success) {
            success.hidden = false;
        }


        const successText =
            $("successfulPaymentMethod");


        if (successText) {

            successText.textContent =
                paymentNames[
                    selectedPaymentMethod
                ] ||
                selectedPaymentMethod;

        }


        updatePaymentDisplay();

    }


    // =================================================
    // PAYMENT DISPLAY
    // =================================================

    function updatePaymentDisplay() {

        const display =
            $("selectedPaymentDisplay");


        if (!display) {
            return;
        }


        if (!selectedPaymentMethod) {

            display.innerHTML =
                "<span>No payment method selected</span>";

            return;

        }


        const name =
            paymentNames[
                selectedPaymentMethod
            ] ||
            selectedPaymentMethod;


        if (paymentCompleted) {

            display.innerHTML = `

                <span>

                    ✓
                    ${escapeHTML(name)}
                    completed successfully

                </span>

            `;

        } else {

            display.innerHTML = `

                <span>

                    Selected:

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                </span>

            `;

        }

    }


    // =================================================
    // QR PAYMENT
    // =================================================

    const qrButton =
        $("qrPaymentButton");


    if (qrButton) {

        qrButton.addEventListener(
            "click",
            () => {

                const upi =
                    $("qrUpiId");


                if (!upi?.value.trim()) {

                    alert(
                        "Please enter your UPI ID."
                    );

                    upi?.focus();

                    return;

                }


                completePayment("QR");

            }
        );

    }


    // =================================================
    // CARD PAYMENT
    // =================================================

    const cardButton =
        $("cardPaymentButton");


    if (cardButton) {

        cardButton.addEventListener(
            "click",
            () => {

                const holder =
                    $("cardHolderName");

                const number =
                    $("cardNumber");

                const expiry =
                    $("cardExpiry");

                const cvv =
                    $("cardCvv");


                if (!holder?.value.trim()) {

                    alert(
                        "Please enter card holder name."
                    );

                    holder?.focus();

                    return;

                }


                const card =
                    number?.value
                        .replace(/\s/g, "") ||
                    "";


                if (!/^\d{16}$/.test(card)) {

                    alert(
                        "Please enter a valid 16-digit card number."
                    );

                    number?.focus();

                    return;

                }


                if (
                    !expiry ||
                    !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
                        expiry.value.trim()
                    )
                ) {

                    alert(
                        "Please enter expiry date as MM/YY."
                    );

                    expiry?.focus();

                    return;

                }


                if (
                    !cvv ||
                    !/^\d{3}$/.test(
                        cvv.value.trim()
                    )
                ) {

                    alert(
                        "Please enter a valid 3-digit CVV."
                    );

                    cvv?.focus();

                    return;

                }


                completePayment("CARD");

            }
        );

    }


    // =================================================
    // ONLINE PAYMENT
    // =================================================

    const onlineButton =
        $("onlinePaymentButton");


    if (onlineButton) {

        onlineButton.addEventListener(
            "click",
            () => {

                const paymentId =
                    $("onlinePaymentId");

                const onlineMobile =
                    $("onlinePaymentMobile");


                if (!paymentId?.value.trim()) {

                    alert(
                        "Please enter your Payment ID / UPI ID."
                    );

                    paymentId?.focus();

                    return;

                }


                if (
                    !onlineMobile ||
                    !/^\d{10}$/.test(
                        onlineMobile.value.trim()
                    )
                ) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                    onlineMobile?.focus();

                    return;

                }


                completePayment("ONLINE");

            }
        );

    }


    // =================================================
    // NET BANKING
    // =================================================

    const netBankingButton =
        $("netBankingPaymentButton");


    if (netBankingButton) {

        netBankingButton.addEventListener(
            "click",
            () => {

                const bank =
                    $("bankName");

                const accountName =
                    $("bankAccountName");


                if (!bank?.value.trim()) {

                    alert(
                        "Please select your bank."
                    );

                    bank?.focus();

                    return;

                }


                if (!accountName?.value.trim()) {

                    alert(
                        "Please enter account holder name."
                    );

                    accountName?.focus();

                    return;

                }


                // Do not store banking credentials.

                completePayment(
                    "NETBANKING"
                );

            }
        );

    }


    // =================================================
    // CARD NUMBER FORMATTING
    // =================================================

    const cardNumber =
        $("cardNumber");


    if (cardNumber) {

        cardNumber.addEventListener(
            "input",
            function () {

                const value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 16);


                this.value =
                    value
                        .replace(
                            /(.{4})/g,
                            "$1 "
                        )
                        .trim();

            }
        );

    }


    // =================================================
    // EXPIRY FORMATTING
    // =================================================

    const expiry =
        $("cardExpiry");


    if (expiry) {

        expiry.addEventListener(
            "input",
            function () {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 4);


                if (value.length > 2) {

                    value =
                        value.substring(0, 2) +
                        "/" +
                        value.substring(2);

                }


                this.value =
                    value;

            }
        );

    }


    // =================================================
    // CVV FORMATTING
    // =================================================

    const cvv =
        $("cardCvv");


    if (cvv) {

        cvv.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 3);

            }
        );

    }


    // =================================================
    // PAYMENT SUCCESS - DONE
    // =================================================

    const paymentDone =
        $("paymentSuccessDone");


    if (paymentDone) {

        paymentDone.addEventListener(
            "click",
            () => {

                closePaymentModal();

                updatePaymentDisplay();

            }
        );

    }


    // =================================================
    // PLACE ORDER
    // =================================================

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =============================================
            // CUSTOMER DATA
            // =============================================

            const customerName =
                fullName?.value.trim() || "";


            const mobileNumber =
                mobile?.value.trim() || "";


            const customerEmail =
                email?.value.trim() || "";


            const deliveryAddress =
                address?.value.trim() || "";


            const customerCity =
                city?.value.trim() || "";


            const customerPincode =
                pincode?.value.trim() || "";


            // =============================================
            // CUSTOMER VALIDATION
            // =============================================

            if (!customerName) {

                alert(
                    "Please enter your full name."
                );

                fullName?.focus();

                return;

            }


            if (!/^\d{10}$/.test(mobileNumber)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                mobile?.focus();

                return;

            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    customerEmail
                )
            ) {

                alert(
                    "Please enter a valid email address."
                );

                email?.focus();

                return;

            }


            if (!deliveryAddress) {

                alert(
                    "Please enter your delivery address."
                );

                address?.focus();

                return;

            }


            // =============================================
            // PINCODE VALIDATION
            // =============================================

            if (!/^\d{6}$/.test(customerPincode)) {

                alert(
                    "Please enter a valid 6-digit pincode."
                );

                pincode?.focus();

                return;

            }


            // =============================================
            // CITY VALIDATION
            // =============================================

            if (
                !customerCity ||
                customerCity === "Invalid pincode" ||
                customerCity === "Unable to verify pincode"
            ) {

                alert(
                    "Please enter a valid pincode and wait for the city to be verified."
                );

                pincode?.focus();

                return;

            }


            // =============================================
            // PAYMENT VALIDATION
            // =============================================

            if (!selectedPaymentMethod) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            if (!paymentCompleted) {

                alert(
                    "Please complete your payment first."
                );

                return;

            }


            // =============================================
            // FINAL TOTAL
            // =============================================

            const totalAmount =
                calculateTotal();


            if (
                !Number.isFinite(totalAmount) ||
                totalAmount <= 0
            ) {

                alert(
                    "Unable to calculate order total."
                );

                return;

            }


            // =============================================
            // ORDER ITEMS
            // =============================================

            const orderItems =
                cart.map(item => ({

                    productId:
                        item.productId ??
                        item.id ??
                        null,

                    name:
                        item.name ||
                        "Product",

                    quantity:
                        Number(item.quantity) || 1,

                    price:
                        Number(item.price) || 0,

                    unit:
                        item.unit ||
                        "unit",

                    image:
                        item.image ||
                        "",

                    pricingType:
                        item.pricingType ||
                        "",

                    length:
                        Number(item.length) || 0,

                    width:
                        Number(item.width) || 0,

                    dimensionUnit:
                        item.dimensionUnit ||
                        "",

                    areaPerUnit:
                        calculateCartProduct(item)
                            .areaPerUnit,

                    totalArea:
                        calculateCartProduct(item)
                            .totalArea,

                    itemTotal:
                        calculateCartProduct(item)
                            .itemTotal

                }));


            // =============================================
            // BACKEND ORDER DATA
            // =============================================

            const orderData = {

                customerName:
                    customerName,

                mobileNumber:
                    mobileNumber,

                email:
                    customerEmail,

                deliveryAddress:
                    deliveryAddress,

                city:
                    customerCity,

                pincode:
                    customerPincode,

                totalAmount:
                    totalAmount,

                orderStatus:
                    "PENDING",

                paymentStatus:
                    "COMPLETED",

                paymentMethod:
                    selectedPaymentMethod

            };


            console.log(
                "Order data being sent to backend:",
                orderData
            );


            console.log(
                "Checkout calculation:",
                {
                    items: orderItems,
                    totalAmount: totalAmount
                }
            );


            // =============================================
            // DISABLE BUTTON
            // =============================================

            if (placeOrderBtn) {

                placeOrderBtn.disabled =
                    true;

                placeOrderBtn.textContent =
                    "Placing Order...";

            }


            // =============================================
            // SEND ORDER TO BACKEND
            // =============================================

            try {

                const response =
                    await fetch(
                        "/api/orders",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )
                        }
                    );


                // =========================================
                // HANDLE BACKEND ERROR
                // =========================================

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Place order failed:",
                        response.status,
                        errorText
                    );


                    alert(
                        errorText ||
                        "Unable to place the order."
                    );


                    if (placeOrderBtn) {

                        placeOrderBtn.disabled =
                            false;

                        placeOrderBtn.textContent =
                            "Place Order";

                    }


                    return;

                }


                // =========================================
                // READ SAVED ORDER
                // =========================================

                const savedOrder =
                    await response.json();


                console.log(
                    "Order saved successfully:",
                    savedOrder
                );


                // =========================================
                // CONFIRMATION DATA
                // =========================================

                const confirmationOrder = {

                    ...savedOrder,

                    customerName:
                        savedOrder.customerName ||
                        customerName,

                    mobileNumber:
                        savedOrder.mobileNumber ||
                        mobileNumber,

                    email:
                        savedOrder.email ||
                        customerEmail,

                    deliveryAddress:
                        savedOrder.deliveryAddress ||
                        deliveryAddress,

                    city:
                        savedOrder.city ||
                        customerCity,

                    pincode:
                        savedOrder.pincode ||
                        customerPincode,

                    totalAmount:
                        savedOrder.totalAmount ??
                        totalAmount,

                    paymentMethod:
                        savedOrder.paymentMethod ||
                        selectedPaymentMethod,

                    orderStatus:
                        savedOrder.orderStatus ||
                        "PENDING",

                    paymentStatus:
                        savedOrder.paymentStatus ||
                        "COMPLETED",

                    orderDate:
                        savedOrder.orderDate ||
                        new Date().toISOString(),

                    items:
                        orderItems

                };


                // =========================================
                // SAVE FOR CONFIRMATION PAGE
                // =========================================

                sessionStorage.setItem(
                    "pendingOrder",
                    JSON.stringify(
                        confirmationOrder
                    )
                );


                // =========================================
                // SAVE TO LOCAL MY ORDERS
                // =========================================

                let existingOrders = [];


                try {

                    existingOrders =
                        JSON.parse(
                            localStorage.getItem(
                                "sulaihaOrders"
                            )
                        ) || [];

                } catch (error) {

                    existingOrders = [];

                }


                if (Array.isArray(existingOrders)) {

                    existingOrders.push(
                        confirmationOrder
                    );


                    localStorage.setItem(
                        "sulaihaOrders",
                        JSON.stringify(
                            existingOrders
                        )
                    );

                }


                // =========================================
                // CLEAR CART
                // =========================================

                localStorage.removeItem(
                    "sulaihaCart"
                );


                // =========================================
                // REDIRECT
                // =========================================

                window.location.href =
                    "/order-confirmation";


            } catch (error) {

                console.error(
                    "Place Order Error:",
                    error
                );


                alert(
                    "Unable to place the order. Please try again."
                );


                if (placeOrderBtn) {

                    placeOrderBtn.disabled =
                        false;

                    placeOrderBtn.textContent =
                        "Place Order";

                }

            }

        }
    );


    // =================================================
    // INITIALIZE CHECKOUT
    // =================================================

    displayCart();

    updatePaymentDisplay();


    // =================================================
    // CLOSE PAYMENT WITH ESC
    // =================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closePaymentModal();

            }

        }
    );


    // =================================================
    // CLOSE PAYMENT BY OUTSIDE CLICK
    // =================================================

    if (paymentModal) {

        paymentModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    paymentModal
                ) {

                    closePaymentModal();

                }

            }
        );

    }


    // =================================================
    // FINAL MESSAGE
    // =================================================

    console.log(
        "Sulaiha Checkout JS Loaded Successfully"
    );

});


// =====================================================
// FORMAT CURRENCY
// =====================================================

function formatCurrency(value) {

    const amount =
        Number(value) || 0;

    return (
        "₹" +
        amount.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )
    );

}


// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(value) {

    const number =
        Number(value) || 0;


    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

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