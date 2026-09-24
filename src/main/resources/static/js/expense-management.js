/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   ADMIN - EXPENSE MANAGEMENT
   FINAL SHORT VERSION
   ===================================================== */

let allExpenses = [];
let selectedExpenseId = null;


/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", async function () {

    console.log("Expense Management JS Loaded");

    setupAddExpense();
    setupAddExpenseForm();
    setupEditExpense();
    setupSidebar();
    setupAdminLogoutConfirm();
    setupSearch();
    setupModalEvents();

    await loadExpenses();

    loadExpenseCategories();
    updatePaymentStatusSummary();

});


/* =====================================================
   ADD EXPENSE BUTTON
   ===================================================== */

function setupAddExpense() {

    const button =
        document.getElementById("addExpenseButton");

    if (!button) return;

    button.addEventListener("click", () =>
        openExpenseModal("addExpenseModal")
    );
}


/* =====================================================
   SAVE NEW EXPENSE
   ===================================================== */

function setupAddExpenseForm() {

    const form =
        document.getElementById("addExpenseForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("expenseName");

        const category =
            document.getElementById("expenseCategory");

        const description =
            document.getElementById("expenseDescription");

        const amount =
            document.getElementById("expenseAmount");

        const status =
            document.getElementById("expensePaymentStatus");

        const date =
            document.getElementById("expenseDate");

        if (!name || !category || !amount || !status || !date) {

            alert("Some expense form fields are missing.");
            return;

        }

        const data = {

            expenseName: name.value.trim(),

            category: category.value.trim(),

            description:
                description ? description.value.trim() : "",

            amount:
                Number(amount.value),

            paymentStatus:
                status.value,

            expenseDate:
                date.value + "T00:00:00"

        };


        if (!data.expenseName) {

            alert("Please enter expense name.");
            name.focus();
            return;

        }

        if (!data.category) {

            alert("Please enter expense category.");
            category.focus();
            return;

        }

        if (
            !Number.isFinite(data.amount) ||
            data.amount <= 0
        ) {

            alert("Please enter a valid amount.");
            amount.focus();
            return;

        }

        if (!data.paymentStatus) {

            alert("Please select payment status.");
            status.focus();
            return;

        }

        if (!date.value) {

            alert("Please select expense date.");
            date.focus();
            return;

        }


        try {

            const response =
                await fetch(
                    "/api/admin/expenses",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            if (!response.ok) {

                const error =
                    await response.text();

                alert(
                    error ||
                    "Unable to save expense."
                );

                return;

            }


            await response.json();

            alert(
                "Expense added successfully."
            );

            closeExpenseModal(
                "addExpenseModal"
            );

            form.reset();

            await loadExpenses();


        } catch (error) {

            console.error(
                "Error saving expense:",
                error
            );

            alert(
                "Unable to save expense."
            );

        }

    });

}
/* =====================================================
   LOAD EXPENSES
   ===================================================== */

async function loadExpenses() {

    try {

        const response =
            await fetch("/api/admin/expenses");

        if (!response.ok)
            throw new Error("Failed to load expenses");

        const data =
            await response.json();

        allExpenses =
            Array.isArray(data) ? data : [];

        updateExpenseSummary();
        displayExpenses(allExpenses);
        loadExpenseCategories();
        updatePaymentStatusSummary();

        console.log(
            "Expenses loaded:",
            allExpenses
        );

    } catch (error) {

        console.error(
            "Error loading expenses:",
            error
        );

        allExpenses = [];

        updateExpenseSummary();
        updatePaymentStatusSummary();
        showEmptyState();

    }

}


/* =====================================================
   UPDATE EXPENSE SUMMARY
   ===================================================== */

function updateExpenseSummary() {

    const count = function (status) {

        return allExpenses.filter(
            function (expense) {

                return String(
                    expense.paymentStatus || ""
                ).toUpperCase() === status;

            }
        ).length;

    };


    setText(
        "totalExpenses",
        allExpenses.length
    );

    setText(
        "paidExpenses",
        count("PAID")
    );

    setText(
        "pendingExpenses",
        count("PENDING")
    );

    setText(
        "cancelledExpenses",
        count("CANCELLED")
    );

}


/* =====================================================
   PAYMENT STATUS SUMMARY
   ===================================================== */

function updatePaymentStatusSummary() {

    const count = function (status) {

        return allExpenses.filter(
            function (expense) {

                return String(
                    expense.paymentStatus || ""
                ).toUpperCase() === status;

            }
        ).length;

    };


    setText(
        "paidExpenses",
        count("PAID")
    );

    setText(
        "pendingExpenses",
        count("PENDING")
    );

    setText(
        "cancelledExpenses",
        count("CANCELLED")
    );

}


/* =====================================================
   UPDATE ELEMENT TEXT
   ===================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}
/* =====================================================
   DISPLAY EXPENSES
   ===================================================== */

function displayExpenses(expenses) {

    const body =
        document.getElementById("expenseTableBody");

    const empty =
        document.getElementById("expenseEmptyState");

    if (!body) return;

    body.innerHTML = "";

    if (!expenses || !expenses.length) {

        if (empty)
            empty.style.display = "block";

        return;
    }

    if (empty)
        empty.style.display = "none";


    expenses.forEach(function (expense, index) {

        const row =
            document.createElement("tr");

        row.dataset.expenseId = expense.id;

        row.innerHTML = `
            <td><strong>${index + 1}</strong></td>

            <td>${escapeHtml(
                expense.expenseName || "-"
            )}</td>

            <td>${escapeHtml(
                expense.category || "-"
            )}</td>

            <td>${escapeHtml(
                expense.description || "-"
            )}</td>

            <td>${formatCurrency(
                expense.amount
            )}</td>

            <td>${formatExpenseStatus(
                expense.paymentStatus
            )}</td>

            <td>${formatDate(
                expense.expenseDate
            )}</td>

            <td>
                <div class="expense-actions">

                    <button
                        type="button"
                        class="expense-action-button expense-view-button"
                        onclick="viewExpense(${expense.id})">
                        View
                    </button>

                    <button
                        type="button"
                        class="expense-action-button expense-edit-button"
                        onclick="editExpense(${expense.id})">
                        Update
                    </button>

                    <button
                        type="button"
                        class="expense-action-button expense-delete-button"
                        onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>

                </div>
            </td>
        `;

        body.appendChild(row);

    });

}


/* =====================================================
   VIEW EXPENSE
   ===================================================== */

function viewExpense(id) {

    const expense =
        allExpenses.find(
            item => Number(item.id) === Number(id)
        );

    if (!expense) {

        alert("Expense not found.");
        return;

    }


    const details =
        document.getElementById("expenseDetails");

    if (!details) return;


    details.innerHTML = `
        <div class="expense-detail-row">
            <span>Expense ID</span>
            <strong>${escapeHtml(expense.id)}</strong>
        </div>

        <div class="expense-detail-row">
            <span>Expense Name</span>
            <strong>${escapeHtml(
                expense.expenseName || "-"
            )}</strong>
        </div>

        <div class="expense-detail-row">
            <span>Category</span>
            <strong>${escapeHtml(
                expense.category || "-"
            )}</strong>
        </div>

        <div class="expense-detail-row">
            <span>Description</span>
            <strong>${escapeHtml(
                expense.description || "-"
            )}</strong>
        </div>

        <div class="expense-detail-row">
            <span>Amount</span>
            <strong>${formatCurrency(
                expense.amount
            )}</strong>
        </div>

        <div class="expense-detail-row">
            <span>Payment Status</span>
            <strong>${formatExpenseStatus(
                expense.paymentStatus
            )}</strong>
        </div>

        <div class="expense-detail-row">
            <span>Expense Date</span>
            <strong>${formatDate(
                expense.expenseDate
            )}</strong>
        </div>
    `;


    openExpenseModal("viewExpenseModal");

}


/* =====================================================
   FORMATTING
   ===================================================== */

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


function formatDate(value) {

    if (!value) return "-";

    const date = new Date(value);

    if (isNaN(date.getTime()))
        return "-";

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatExpenseStatus(status) {

    if (!status) return "-";

    return String(status)
        .toLowerCase()
        .replace(
            /\b\w/g,
            letter => letter.toUpperCase()
        );

}


/* =====================================================
   EMPTY STATE
   ===================================================== */

function showEmptyState() {

    const body =
        document.getElementById("expenseTableBody");

    const empty =
        document.getElementById("expenseEmptyState");

    if (body)
        body.innerHTML = "";

    if (empty)
        empty.style.display = "block";

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(value) {

    if (value == null) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
/* =====================================================
   EDIT EXPENSE
   ===================================================== */

function editExpense(id) {

    const expense =
        allExpenses.find(
            item => Number(item.id) === Number(id)
        );

    if (!expense) {

        alert("Expense not found.");
        return;

    }

    selectedExpenseId = expense.id;


    const fields = {

        editExpenseId:
            expense.id,

        editExpenseTitle:
            expense.expenseName || "",

        editExpenseCategory:
            expense.category || "",

        editExpenseDescription:
            expense.description || "",

        editExpenseAmount:
            expense.amount ?? "",

        editExpensePaymentStatus:
            expense.paymentStatus || "PENDING",

        editExpenseDate:
            convertDateForInput(
                expense.expenseDate
            )

    };


    Object.keys(fields).forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element)
            element.value = fields[id];

    });


    openExpenseModal(
        "editExpenseModal"
    );

}


/* =====================================================
   UPDATE EXPENSE
   ===================================================== */

function setupEditExpense() {

    const form =
        document.getElementById(
            "editExpenseForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (
                selectedExpenseId === null ||
                selectedExpenseId === undefined
            ) {

                alert("Please select an expense.");
                return;

            }


            const name =
                document.getElementById(
                    "editExpenseTitle"
                );

            const category =
                document.getElementById(
                    "editExpenseCategory"
                );

            const description =
                document.getElementById(
                    "editExpenseDescription"
                );

            const amount =
                document.getElementById(
                    "editExpenseAmount"
                );

            const status =
                document.getElementById(
                    "editExpensePaymentStatus"
                );

            const date =
                document.getElementById(
                    "editExpenseDate"
                );


            if (
                !name ||
                !category ||
                !amount ||
                !status ||
                !date
            ) {

                alert(
                    "Update form fields are missing."
                );

                return;

            }


            const data = {

                expenseName:
                    name.value.trim(),

                category:
                    category.value.trim(),

                description:
                    description
                        ? description.value.trim()
                        : "",

                amount:
                    Number(amount.value),

                paymentStatus:
                    status.value,

                expenseDate:
                    date.value + "T00:00:00"

            };


            if (!data.expenseName) {

                alert("Please enter expense title.");
                name.focus();
                return;

            }


            if (!data.category) {

                alert("Please enter category.");
                category.focus();
                return;

            }


            if (
                !Number.isFinite(data.amount) ||
                data.amount <= 0
            ) {

                alert("Please enter a valid amount.");
                amount.focus();
                return;

            }


            if (!data.paymentStatus) {

                alert("Please select payment status.");
                status.focus();
                return;

            }


            if (!date.value) {

                alert("Please select expense date.");
                date.focus();
                return;

            }


            try {

                const response =
                    await fetch(
                        "/api/admin/expenses/" +
                        selectedExpenseId,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.text();

                    alert(
                        error ||
                        "Unable to update expense."
                    );

                    return;

                }


                closeExpenseModal(
                    "editExpenseModal"
                );

                selectedExpenseId = null;

                await loadExpenses();

                alert(
                    "Expense updated successfully."
                );


            } catch (error) {

                console.error(
                    "Error updating expense:",
                    error
                );

                alert(
                    "Unable to update expense."
                );

            }

        }
    );

}


/* =====================================================
   DATE FOR HTML INPUT
   ===================================================== */

function convertDateForInput(value) {

    if (!value) return "";

    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

        return value;

    }


    const date = new Date(value);

    if (isNaN(date.getTime()))
        return "";


    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");

}
/* =====================================================
   DELETE EXPENSE
   ===================================================== */

async function deleteExpense(id) {

    const expense =
        allExpenses.find(
            item => Number(item.id) === Number(id)
        );

    if (!expense) {

        alert("Expense not found.");
        return;

    }


    if (!confirm(
        "Are you sure you want to delete this expense?"
    )) return;


    try {

        const response =
            await fetch(
                "/api/admin/expenses/" + id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to delete expense."
            );

            return;

        }


        await loadExpenses();

        alert(
            "Expense deleted successfully."
        );


    } catch (error) {

        console.error(
            "Error deleting expense:",
            error
        );

        alert(
            "Unable to delete expense."
        );

    }

}


/* =====================================================
   EXPENSE MODALS
   ===================================================== */

function openExpenseModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeExpenseModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =====================================================
   MODAL EVENTS
   ===================================================== */

function setupModalEvents() {

    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList &&
                event.target.classList.contains(
                    "expense-modal"
                )
            ) {

                closeExpenseModal(
                    event.target.id
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape")
                return;


            document
                .querySelectorAll(
                    ".expense-modal.show"
                )
                .forEach(function (modal) {

                    closeExpenseModal(
                        modal.id
                    );

                });

        }
    );

}


/* =====================================================
   SIDEBAR
   ===================================================== */

function setupSidebar() {

    const toggle =
        document.getElementById(
            "sidebarToggle"
        );

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );

    if (!toggle || !sidebar) return;


    toggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "sidebar-open"
            );

        }
    );

}


/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

function setupAdminLogoutConfirm() {

    const button =
        document.getElementById(
            "adminLogoutConfirmButton"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        function () {

            button.disabled = true;

            const form =
                document.createElement("form");

            form.method = "POST";

            form.action = "/logout";

            form.style.display = "none";

            document.body.appendChild(form);

            form.submit();

        }
    );

}
/* =====================================================
   SEARCH + FILTERS
   ===================================================== */

function setupSearch() {

    const search =
        document.getElementById("expenseSearch");

    const category =
        document.getElementById(
            "expenseCategoryFilter"
        );

    const status =
        document.getElementById(
            "expenseStatusFilter"
        );

    const clear =
        document.getElementById(
            "clearExpenseFilters"
        );


    if (search)
        search.addEventListener(
            "input",
            applyExpenseFilters
        );

    if (category)
        category.addEventListener(
            "change",
            applyExpenseFilters
        );

    if (status)
        status.addEventListener(
            "change",
            applyExpenseFilters
        );


    if (clear) {

        clear.addEventListener(
            "click",
            function () {

                if (search)
                    search.value = "";

                if (category)
                    category.value = "ALL";

                if (status)
                    status.value = "ALL";

                displayExpenses(allExpenses);

            }
        );

    }

}


/* =====================================================
   APPLY FILTERS
   ===================================================== */

function applyExpenseFilters() {

    const search =
        document.getElementById(
            "expenseSearch"
        );

    const category =
        document.getElementById(
            "expenseCategoryFilter"
        );

    const status =
        document.getElementById(
            "expenseStatusFilter"
        );


    const text =
        search
            ? search.value.trim().toLowerCase()
            : "";

    const selectedCategory =
        category ? category.value : "ALL";

    const selectedStatus =
        status ? status.value : "ALL";


    const filtered =
        allExpenses.filter(function (expense) {

            const name =
                String(
                    expense.expenseName || ""
                ).toLowerCase();

            const cat =
                String(
                    expense.category || ""
                ).toLowerCase();

            const description =
                String(
                    expense.description || ""
                ).toLowerCase();

            const expenseStatus =
                String(
                    expense.paymentStatus || ""
                ).toUpperCase();


            const matchesSearch =
                !text ||
                name.includes(text) ||
                cat.includes(text) ||
                description.includes(text);


            const matchesCategory =
                selectedCategory === "ALL" ||
                cat ===
                selectedCategory.toLowerCase();


            const matchesStatus =
                selectedStatus === "ALL" ||
                expenseStatus === selectedStatus;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        });


    displayExpenses(filtered);

}


/* =====================================================
   LOAD CATEGORY OPTIONS
   ===================================================== */

function loadExpenseCategories() {

    const select =
        document.getElementById(
            "expenseCategoryFilter"
        );

    if (!select) return;


    const categories =
        [...new Set(
            allExpenses
                .map(
                    expense =>
                        expense.category
                )
                .filter(
                    category =>
                        category &&
                        category.trim()
                )
        )];


    select.innerHTML =
        `<option value="ALL">
            All Categories
        </option>`;


    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);

    });

}


/* =====================================================
   FINAL
   ===================================================== */

console.log(
    "Expense Management JS loaded successfully."
);