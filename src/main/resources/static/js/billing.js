/* =====================================================
   SULAIHA - ADMIN BILLING MANAGEMENT
   ===================================================== */

let billingData = [];
let filteredBillingData = [];


/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
    setupAdminSidebar();
    setupAdminLogoutConfirm();
    setupBillingSearch();
    setupBillingFilters();
    setupEditBillingForm();
    setupDeleteBilling();
    setupModalEvents();
    loadBillingData();
});


/* ================= LOAD ================= */

async function loadBillingData() {
    try {
        const res = await fetch("/api/admin/billing");
        if (!res.ok) throw new Error("Unable to load billing records.");

        billingData = await res.json();
        if (!Array.isArray(billingData)) billingData = [];

        filteredBillingData = [...billingData];
        updateBillingSummary();
        renderBillingTable(filteredBillingData);

    } catch (error) {
        console.error("Billing loading error:", error);
        billingData = [];
        filteredBillingData = [];
        updateBillingSummary();
        renderBillingTable([]);
        showMessage("Unable to load billing information.", "error");
    }
}


/* ================= SUMMARY ================= */

function updateBillingSummary() {

    const total = billingData.length;

    const amount = billingData.reduce(
        (sum, b) => sum + Number(b.totalAmount || 0), 0
    );

    const paid = billingData
        .filter(b => getBillingStatus(b) === "PAID")
        .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

    const pending = billingData
        .filter(b => getBillingStatus(b) === "PENDING")
        .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

    updateElement("totalBills", total);
    updateElement("totalBillingAmount", "₹" + formatAmount(amount));
    updateElement("totalPaidAmount", "₹" + formatAmount(paid));
    updateElement("totalPendingAmount", "₹" + formatAmount(pending));
}


/* ================= STATUS ================= */

function getBillingStatus(billing) {
    return billing?.paymentStatus
        ? String(billing.paymentStatus).trim().toUpperCase()
        : "PENDING";
}


/* ================= TABLE ================= */

function renderBillingTable(data) {

    const body = document.getElementById("billingTableBody");
    const empty = document.getElementById("billingEmptyState");

    if (!body) return;

    body.innerHTML = "";

    if (!data.length) {
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";

    data.forEach(billing => {

        const id = billing.id;
        const status = getBillingStatus(billing);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML("BILL-" + id)}</td>
            <td>${escapeHTML(billing.orderId || "N/A")}</td>
            <td>${escapeHTML(billing.customerName || "N/A")}</td>
            <td>₹${formatAmount(billing.totalAmount)}</td>

            <td>
                <span class="billing-status ${getStatusClass(status)}">
                    ${escapeHTML(status)}
                </span>
            </td>

            <td>
                ${formatDate(
                    billing.orderDate ||
                    billing.billingDate ||
                    billing.createdAt
                )}
            </td>

            <td>
                <div class="billing-actions">
                    <button type="button"
                        class="billing-action-button view-billing-button"
                        onclick="viewBilling(${id})">
                        View
                    </button>

                    <button type="button"
                        class="billing-action-button edit-billing-button"
                        onclick="editBilling(${id})">
                        Edit
                    </button>

                    <button type="button"
                        class="billing-action-button delete-billing-button"
                        onclick="deleteBilling(${id})">
                        Delete
                    </button>
                </div>
            </td>
        `;

        body.appendChild(row);
    });
}


/* ================= SEARCH ================= */

function setupBillingSearch() {
    document.getElementById("billingSearch")
        ?.addEventListener("input", applyBillingFilters);
}


/* ================= FILTER ================= */

function setupBillingFilters() {

    document.getElementById("applyBillingFilter")
        ?.addEventListener("click", applyBillingFilters);

    document.getElementById("resetBillingFilter")
        ?.addEventListener("click", resetBillingFilters);
}


function applyBillingFilters() {

    const search = document.getElementById("billingSearch")
        ?.value.trim().toLowerCase() || "";

    const from = document.getElementById("billingDateFrom")?.value || "";
    const to = document.getElementById("billingDateTo")?.value || "";

    const selected =
        document.getElementById("billingStatusFilter")?.value || "ALL";

    filteredBillingData = billingData.filter(billing => {

        const text = [
            "BILL-" + (billing.id || ""),
            billing.orderId,
            billing.customerName,
            billing.email,
            billing.mobileNumber
        ].join(" ").toLowerCase();

        const status = getBillingStatus(billing);

        const rawDate =
            billing.orderDate ||
            billing.billingDate ||
            billing.createdAt ||
            "";

        const date = String(rawDate).substring(0, 10);

        return (
            (!search || text.includes(search)) &&
            (selected === "ALL" || status === selected) &&
            (!from || (date && date >= from)) &&
            (!to || (date && date <= to))
        );
    });

    renderBillingTable(filteredBillingData);
}


function resetBillingFilters() {

    ["billingSearch", "billingDateFrom", "billingDateTo"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

    const status = document.getElementById("billingStatusFilter");
    if (status) status.value = "ALL";

    filteredBillingData = [...billingData];
    renderBillingTable(filteredBillingData);
}


/* ================= VIEW ================= */

async function viewBilling(id) {

    try {

        const res =
            await fetch("/api/admin/billing/" + id);

        if (!res.ok)
            throw new Error("Unable to load billing details.");

        const billing = await res.json();
        const details =
            document.getElementById("billingDetails");

        if (!details) return;

        const status = getBillingStatus(billing);

        details.innerHTML = `
            <div class="billing-detail-row">
                <span>Bill ID</span>
                <strong>${escapeHTML("BILL-" + billing.id)}</strong>
            </div>

            <div class="billing-detail-row">
                <span>Order ID</span>
                <strong>${escapeHTML(billing.orderId || "N/A")}</strong>
            </div>

            <div class="billing-detail-row">
                <span>Customer Name</span>
                <strong>${escapeHTML(billing.customerName || "N/A")}</strong>
            </div>

            <div class="billing-detail-row">
                <span>Amount</span>
                <strong>₹${formatAmount(billing.totalAmount)}</strong>
            </div>

            <div class="billing-detail-row">
                <span>Payment Status</span>
                <strong class="billing-status ${getStatusClass(status)}">
                    ${escapeHTML(status)}
                </strong>
            </div>

            <div class="billing-detail-row">
                <span>Billing Date</span>
                <strong>
                    ${formatDate(
                        billing.orderDate ||
                        billing.billingDate ||
                        billing.createdAt
                    )}
                </strong>
            </div>
        `;

        openBillingModal("viewBillingModal");

    } catch (error) {
        console.error(error);
        showMessage("Unable to load billing details.", "error");
    }
}


/* ================= EDIT ================= */

async function editBilling(id) {

    try {

        const res =
            await fetch("/api/admin/billing/" + id);

        if (!res.ok)
            throw new Error("Unable to load billing record.");

        const b = await res.json();

        const values = {
            editBillingId: b.id || "",
            editBillingCustomer: b.customerName || "",
            editBillingOrderId: b.orderId || "",
            editBillingAmount: b.totalAmount || 0,
            editBillingStatus: getBillingStatus(b),
            editBillingDate: getInputDate(
                b.orderDate || b.billingDate || b.createdAt
            )
        };

        Object.entries(values).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        });

        openBillingModal("editBillingModal");

    } catch (error) {
        console.error(error);
        showMessage("Unable to load billing record.", "error");
    }
}


/* ================= EDIT FORM ================= */

function setupEditBillingForm() {

    document.getElementById("editBillingForm")
        ?.addEventListener("submit", async e => {

            e.preventDefault();

            const id =
                document.getElementById("editBillingId")?.value;

            const status =
                document.getElementById("editBillingStatus")?.value;

            if (!id)
                return showMessage("Billing ID is missing.", "error");

            if (!status)
                return showMessage(
                    "Please select a payment status.",
                    "error"
                );

            await updateBillingStatus(id, status);
        });
}


async function updateBillingStatus(id, status) {

    try {

        const res = await fetch(
            `/api/admin/billing/${id}/status?status=${encodeURIComponent(status)}`,
            { method: "PUT" }
        );

        if (!res.ok)
            throw new Error(await res.text() || "Update failed.");

        const updated = await res.json();

        const index = billingData.findIndex(
            b => Number(b.id) === Number(id)
        );

        if (index !== -1)
            billingData[index] = updated;

        filteredBillingData = [...billingData];

        updateBillingSummary();
        renderBillingTable(filteredBillingData);
        closeBillingModal("editBillingModal");

        showMessage(
            "Billing status updated successfully.",
            "success"
        );

    } catch (error) {

        console.error(error);

        showMessage(
            error.message || "Unable to update billing status.",
            "error"
        );
    }
}


/* ================= DELETE ================= */

function deleteBilling(id) {

    const input =
        document.getElementById("deleteBillingId");

    if (!input) return;

    input.value = id;
    openBillingModal("deleteBillingModal");
}


function setupDeleteBilling() {

    document.getElementById("confirmDeleteBillingButton")
        ?.addEventListener("click", async () => {

            const id =
                document.getElementById("deleteBillingId")?.value;

            if (!id)
                return showMessage(
                    "Billing ID is missing.",
                    "error"
                );

            await performDeleteBilling(id);
        });
}


async function performDeleteBilling(id) {

    const button =
        document.getElementById(
            "confirmDeleteBillingButton"
        );

    try {

        if (button) {
            button.disabled = true;
            button.textContent = "Deleting...";
        }

        const res =
            await fetch(
                "/api/admin/billing/" + id,
                { method: "DELETE" }
            );

        if (!res.ok)
            throw new Error(
                await res.text() ||
                "Unable to delete billing record."
            );

        billingData =
            billingData.filter(
                b => Number(b.id) !== Number(id)
            );

        filteredBillingData =
            filteredBillingData.filter(
                b => Number(b.id) !== Number(id)
            );

        updateBillingSummary();
        renderBillingTable(filteredBillingData);
        closeBillingModal("deleteBillingModal");

        showMessage(
            "Billing record deleted successfully.",
            "success"
        );

    } catch (error) {

        console.error(error);

        showMessage(
            error.message ||
            "Unable to delete billing record.",
            "error"
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = "Delete Billing";
        }
    }
}


/* ================= MODALS ================= */

function setupModalEvents() {

    document.querySelectorAll(".billing-modal")
        .forEach(modal => {

            modal.addEventListener("click", e => {

                if (e.target === modal)
                    closeBillingModal(modal.id);
            });
        });

    document.addEventListener("keydown", e => {

        if (e.key !== "Escape") return;

        document.querySelectorAll(".billing-modal")
            .forEach(modal => {

                if (modal.style.display === "flex")
                    closeBillingModal(modal.id);
            });
    });
}


function openBillingModal(id) {

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("billing-modal-open");
}


function closeBillingModal(id) {

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    updateModalBodyState();
}


/* ================= SIDEBAR ================= */

function setupAdminSidebar() {

    const sidebar =
        document.getElementById("adminSidebar");

    const toggle =
        document.getElementById("sidebarToggle");

    if (!sidebar || !toggle) return;

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}


/* ================= LOGOUT ================= */

function setupAdminLogoutConfirm() {

    const button =
        document.getElementById(
            "adminLogoutConfirmButton"
        );

    if (!button) return;

    button.addEventListener("click", () => {

        button.disabled = true;

        const form =
            document.createElement("form");

        form.method = "POST";
        form.action = "/logout";
        form.style.display = "none";

        document.body.appendChild(form);
        form.submit();
    });
}


/* ================= HELPERS ================= */

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}


function formatAmount(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function formatDate(value) {

    if (!value) return "-";

    const date = new Date(value);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


function getInputDate(value) {

    if (!value) return "";

    const date = new Date(value);

    if (isNaN(date.getTime()))
        return String(value).substring(0, 10);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}


function getStatusClass(status) {
    return String(status || "PENDING")
        .toLowerCase()
        .replace(/\s+/g, "-");
}


function escapeHTML(value) {

    if (value == null) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showMessage(message, type = "info") {

    console.log(
        `[${type.toUpperCase()}] ${message}`
    );

    if (type === "error")
        alert(message);
}


function updateModalBodyState() {

    const open =
        document.querySelector(
            ".billing-modal[aria-hidden='false']"
        );

    document.body.classList.toggle(
        "billing-modal-open",
        !!open
    );
}
