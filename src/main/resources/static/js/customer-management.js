// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// ADMIN - CUSTOMER MANAGEMENT
// FINAL BACKEND CONNECTED JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Sulaiha Customer Management Loaded");

    // =================================================
    // ELEMENTS
    // =================================================

    const tableBody = document.getElementById("customerTableBody");
    const emptyState = document.getElementById("customerEmptyState");
    const searchInput = document.getElementById("customerSearch");

    const totalCustomers = document.getElementById("totalCustomers");
    const activeCustomers = document.getElementById("activeCustomers");
    const newCustomers = document.getElementById("newCustomers");

    let customers = [];


    // =================================================
    // LOAD CUSTOMERS
    // =================================================

    async function loadCustomers() {

        try {

            const response = await fetch("/api/admin/customers");

            if (!response.ok) {
                throw new Error("Unable to load customers.");
            }

            const data = await response.json();

            customers = Array.isArray(data) ? data : [];

            displayCustomers(data);
            // allCustomers=data;
            // const inactiveCustomers=data.filter(function(customer){
            //     return customer.status==="INACTIVE"
            // })
            // displayCustomers(inactiveCustomers);

        } catch (error) {

            console.error("Customer loading error:", error);

            customers = [];

            if (tableBody) tableBody.innerHTML = "";

            updateSummary([]);

            showEmptyState(
                "Unable to Load Customers",
                "Unable to load customer information. Please try again."
            );
        }

    }


    // =================================================
    // DISPLAY CUSTOMERS
    // =================================================

    function displayCustomers(list) {

        if (!tableBody) return;

        tableBody.innerHTML = "";

        if (!list.length) {

            showEmptyState(
                "No Customers Available",
                "Customer information will appear here when it is available from the backend."
            );

            updateSummary(list);
            return;
        }

        if (emptyState) {
            emptyState.style.display = "none";
        }

        list.forEach((customer, index) => {

            const row = document.createElement("tr");

            const id = customer.id ?? "-";
            const name = customer.name || "-";
            const email = customer.email || "-";
            const mobile = customer.mobile || "-";
            const customerStatus = customer.status || "Active";
            const status = String(customerStatus).toLowerCase();

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <span class="customer-name">
                        ${escapeHtml(name)}
                    </span>
                </td>

                <td>
                    <span class="customer-email">
                        ${escapeHtml(email)}
                    </span>
                </td>

                <td>${escapeHtml(mobile)}</td>

                <td>
                    <span class="customer-status ${escapeHtml(status)}">
                        ${escapeHtml(customerStatus)}
                    </span>
                </td>

                <td>
                    <div class="customer-actions">

                        <button
                            type="button"
                            class="customer-action-button view-button"
                            data-id="${escapeHtml(id)}">
                            View
                        </button>

                        <button
                            type="button"
                            class="customer-action-button edit-button"
                            data-id="${escapeHtml(id)}">
                            Edit
                        </button>

                        ${
                            status === "active"
                                ? `
                                    <button
                                        type="button"
                                        class="customer-action-button remove-button"
                                        data-id="${escapeHtml(id)}">
                                        Remove
                                    </button>
                                  `
                                : ""
                        }

                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        addActionEvents();
        updateSummary(list);
    }


    // =================================================
    // EMPTY STATE
    // =================================================

    function showEmptyState(title, message) {

        if (!emptyState) return;

        emptyState.style.display = "block";

        const heading = emptyState.querySelector("h3");
        const text = emptyState.querySelector("p");

        if (heading) heading.textContent = title;
        if (text) text.textContent = message;
    }


    // =================================================
    // VIEW CUSTOMER
    // =================================================

    async function viewCustomer(id) {

        try {

            const response = await fetch(
                `/api/admin/customers/${encodeURIComponent(id)}`
            );

            if (!response.ok) {
                throw new Error("Unable to load customer.");
            }

            const customer = await response.json();

            const details = document.getElementById(
                "customerDetails"
            );

            if (!details) return;

            details.innerHTML = `
                ${detailRow("Customer ID", customer.id)}
                ${detailRow("Full Name", customer.name)}
                ${detailRow("Email", customer.email)}
                ${detailRow("Mobile Number", customer.mobile)}
                ${detailRow("Address", customer.address)}
                ${detailRow("Status", customer.status)}
                ${detailRow(
                    "Registered On",
                    formatDate(customer.createdAt)
                )}
            `;

            openCustomerModal("viewCustomerModal");

        } catch (error) {

            console.error("View customer error:", error);

            alert("Unable to load customer details.");
        }
    }


    function detailRow(label, value) {

        return `
            <div class="customer-detail-row">
                <span>${label}</span>
                <strong>${escapeHtml(value ?? "-")}</strong>
            </div>
        `;
    }


    // =================================================
    // EDIT CUSTOMER
    // =================================================

    function editCustomer(id) {

        const customer = customers.find(
            item => String(item.id) === String(id)
        );

        if (!customer) {
            alert("Customer data is not available.");
            return;
        }

        const fields = {
            editCustomerId: customer.id ?? "",
            editCustomerName: customer.name ?? "",
            editCustomerEmail: customer.email ?? "",
            editCustomerMobile: customer.mobile ?? "",
            editCustomerStatus: customer.status || "ACTIVE"
        };

        Object.entries(fields).forEach(([elementId, value]) => {

            const element = document.getElementById(elementId);

            if (element) {
                element.value = value;
            }
        });

        openCustomerModal("editCustomerModal");
    }


    // =================================================
    // UPDATE CUSTOMER
    // =================================================

    const editForm = document.getElementById("editCustomerForm");

    if (editForm) {

        editForm.addEventListener("submit", async event => {

            event.preventDefault();

            const customerId =
                document.getElementById("editCustomerId")?.value;

            const name =
                document.getElementById("editCustomerName")?.value.trim();

            const email =
                document.getElementById("editCustomerEmail")?.value.trim();

            const mobile =
                document.getElementById("editCustomerMobile")?.value.trim();

            const status =
                document.getElementById("editCustomerStatus")?.value;

            if (!customerId || !name || !email || !mobile || !status) {
                alert("Please fill all customer details.");
                return;
            }

            try {

                const response = await fetch(
                    `/api/admin/customers/${encodeURIComponent(customerId)}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            mobile,
                            status
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Customer update failed.");
                }

                alert("Customer updated successfully.");

                closeCustomerModal("editCustomerModal");

                await loadCustomers();

            } catch (error) {

                console.error("Update customer error:", error);

                alert(
                    "Unable to update customer. Please try again."
                );
            }
        });
    }


    // =================================================
    // REMOVE CUSTOMER
    // =================================================

    async function removeCustomer(id) {

        const customer = customers.find(
            item => String(item.id) === String(id)
        );

        if (!customer) {
            alert("Customer data is not available.");
            return;
        }

        if (
            !confirm(
                `Are you sure you want to remove ${customer.name || "this customer"}?`
            )
        ) {
            return;
        }

        try {

            const response = await fetch(
                `/api/admin/customers/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Customer could not be removed.");
            }

            alert("Customer removed successfully.");

            await loadCustomers();

        } catch (error) {

            console.error("Remove customer error:", error);

            alert(
                "Unable to remove customer. Please try again."
            );
        }
    }


    // =================================================
    // ACTION EVENTS
    // =================================================

    function addActionEvents() {

        document.querySelectorAll(".view-button").forEach(button => {
            button.addEventListener("click", () => {
                viewCustomer(button.dataset.id);
            });
        });

        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", () => {
                editCustomer(button.dataset.id);
            });
        });

        document.querySelectorAll(".remove-button").forEach(button => {
            button.addEventListener("click", () => {
                removeCustomer(button.dataset.id);
            });
        });
    }


    // =================================================
    // SEARCH
    // =================================================

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const text = searchInput.value
                .trim()
                .toLowerCase();

            const filtered = customers.filter(customer => {

                return [
                    customer.name,
                    customer.email,
                    customer.mobile
                ].some(value =>
                    String(value || "")
                        .toLowerCase()
                        .includes(text)
                );
            });

            displayCustomers(filtered);
        });
    }


    // =================================================
    // SUMMARY
    // =================================================

    function updateSummary(list) {

        const data = Array.isArray(list) ? list : [];

        if (totalCustomers) {
            totalCustomers.textContent = data.length;
        }

        if (activeCustomers) {

            activeCustomers.textContent = data.filter(
                customer =>
                    String(customer.status || "")
                        .toUpperCase() === "ACTIVE"
            ).length;
        }

        if (newCustomers) {

            const now = new Date();

            newCustomers.textContent = data.filter(customer => {

                if (!customer.createdAt) return false;

                const date = new Date(customer.createdAt);

                return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                );

            }).length;
        }
    }


    // =================================================
    // MODAL
    // =================================================

    window.openCustomerModal = function (modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    };


    window.closeCustomerModal = function (modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
    };


    document.querySelectorAll(".customer-modal").forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeCustomerModal(modal.id);
            }
        });
    });


    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        document
            .querySelectorAll(".customer-modal.show")
            .forEach(modal => closeCustomerModal(modal.id));
    });


    // =================================================
    // NOTIFICATIONS
    // =================================================

    window.openNotifications = function () {
        window.location.href = "/admin/notifications";
    };


    // =================================================
    // ADMIN PROFILE
    // =================================================

    window.openAdminProfile = function () {
        window.location.href = "/admin/profile";
    };


    // =================================================
    // ADMIN LOGOUT
    // =================================================

    function setupAdminLogoutConfirm() {

        const confirmButton = document.getElementById(
            "adminLogoutConfirmButton"
        );

        if (!confirmButton) return;

        confirmButton.addEventListener("click", () => {

            confirmButton.disabled = true;

            const logoutForm = document.createElement("form");

            logoutForm.method = "POST";
            logoutForm.action = "/logout";
            logoutForm.style.display = "none";

            document.body.appendChild(logoutForm);

            logoutForm.submit();
        });
    }


    // =================================================
    // FORMAT DATE
    // =================================================

    function formatDate(value) {

        if (!value) return "-";

        const date = new Date(value);

        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    // =================================================
    // ESCAPE HTML
    // =================================================

    function escapeHtml(value) {

        const div = document.createElement("div");

        div.textContent = value == null ? "" : String(value);

        return div.innerHTML;
    }


    // =================================================
    // INITIALIZE
    // =================================================

    setupAdminLogoutConfirm();

    loadCustomers();

    console.log(
        "Customer Management Page Initialized Successfully"
    );

});