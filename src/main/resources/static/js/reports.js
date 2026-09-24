/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   REPORTS & ANALYTICS
   reports.js
   FINAL VERSION
   PART 1
   ===================================================== */


/* =====================================================
   GLOBAL VARIABLES
   ===================================================== */

let reportRecords = [];

let expenseRecords = [];

let totalProductCount = 0;

let salesBarChart = null;

let salesLineChart = null;

let profitLossChart = null;


/* =====================================================
   API URLS
   ===================================================== */

const REPORT_API_URL =
    "/api/admin/reports";

const EXPENSE_API_URL =
    "/api/admin/expenses";


/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeReportsPage();

    }
);


/* =====================================================
   INITIALIZE REPORTS PAGE
   ===================================================== */

function initializeReportsPage() {

    setupFilterEvents();

    setupRetryButton();

    loadReports();

}


/* =====================================================
   LOAD REPORTS
   ===================================================== */

async function loadReports() {

    showLoading(true);

    hideError();


    try {

        /*
         * Load report/order data
         */

        const reportResponse =
            await fetch(
                REPORT_API_URL,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!reportResponse.ok) {

            throw new Error(
                "Unable to load report data."
            );

        }


        const reportData =
            await reportResponse.json();


        /*
         * Extract orders
         */

        reportRecords =
            extractReportRecords(
                reportData
            );


        /*
         * Total products
         */

        totalProductCount =
            Number(
                reportData?.totalProducts ?? 0
            );


        /*
         * Load real expenses
         */

        const expenseResponse =
            await fetch(
                EXPENSE_API_URL,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!expenseResponse.ok) {

            throw new Error(
                "Unable to load expense data."
            );

        }


        const expenseData =
            await expenseResponse.json();


        expenseRecords =
            Array.isArray(expenseData)
                ? expenseData
                : [];


        /*
         * Initial values
         */

        setElementText(
            "totalProducts",
            totalProductCount
        );


        /*
         * Render everything
         */

        renderReports(
            reportRecords,
            expenseRecords
        );


    } catch (error) {

        console.error(
            "Reports loading error:",
            error
        );


        showError(
            error.message ||
            "Unable to load reports."
        );


    } finally {

        showLoading(false);

    }

}


/* =====================================================
   EXTRACT REPORT RECORDS
   ===================================================== */

function extractReportRecords(data) {

    if (Array.isArray(data)) {

        return data;

    }


    if (
        !data ||
        typeof data !== "object"
    ) {

        return [];

    }


    const possibleKeys = [
        "records",
        "reports",
        "orders",
        "data",
        "content"
    ];


    for (
        const key of possibleKeys
    ) {

        if (
            Array.isArray(
                data[key]
            )
        ) {

            return data[key];

        }

    }


    if (
        data.id !== undefined ||
        data.orderId !== undefined
    ) {

        return [data];

    }


    return [];

}
/* =====================================================
   REPORTS.JS
   PART 2
   RENDERING + SUMMARY + HELPERS
   ===================================================== */


/* =====================================================
   RENDER REPORTS
   ===================================================== */

function renderReports(
    records,
    expenses
) {

    updateSummaryCards(
        records
    );


    renderSalesBarChart(
        records
    );


    renderSalesLineChart(
        records
    );


    renderProfitLossChart(
        records,
        expenses
    );


    updateBusinessInsights(
        records,
        expenses
    );

}


/* =====================================================
   UPDATE SUMMARY CARDS
   ===================================================== */

function updateSummaryCards(
    records
) {

    const totalOrders =
        records.length;


    let totalSales = 0;

    let paidAmount = 0;

    let pendingAmount = 0;


    const uniqueCustomers =
        new Set();


    const uniqueProducts =
        new Set();


    records.forEach(
        function (record) {

            const amount =
                getAmount(
                    record
                );


            totalSales += amount;


            const paymentStatus =
                getPaymentStatus(
                    record
                );


            if (
                paymentStatus ===
                "PAID"
            ) {

                paidAmount += amount;

            }


            if (
                paymentStatus ===
                "PENDING"
            ) {

                pendingAmount += amount;

            }


            const customer =
                getCustomerIdentifier(
                    record
                );


            if (customer) {

                uniqueCustomers.add(
                    customer
                );

            }


            const product =
                getProductIdentifier(
                    record
                );


            if (product) {

                uniqueProducts.add(
                    product
                );

            }

        }
    );


    setElementText(
        "totalSales",
        formatCurrency(
            totalSales
        )
    );


    setElementText(
        "totalOrders",
        totalOrders
    );


    setElementText(
        "totalCustomers",
        uniqueCustomers.size
    );


    setElementText(
        "totalProducts",
        totalProductCount
    );


    setElementText(
        "totalPaidAmount",
        formatCurrency(
            paidAmount
        )
    );


    setElementText(
        "totalPendingAmount",
        formatCurrency(
            pendingAmount
        )
    );

}


/* =====================================================
   GET ORDER AMOUNT
   ===================================================== */

function getAmount(record) {

    const value =
        record?.totalAmount ??
        record?.amount ??
        record?.total ??
        0;


    const amount =
        Number(value);


    return Number.isFinite(
        amount
    )
        ? amount
        : 0;

}


/* =====================================================
   GET EXPENSE AMOUNT
   ===================================================== */

function getExpenseAmount(
    expense
) {

    const value =
        expense?.amount ??
        0;


    const amount =
        Number(value);


    return Number.isFinite(
        amount
    )
        ? amount
        : 0;

}


/* =====================================================
   GET PAYMENT STATUS
   ===================================================== */

function getPaymentStatus(
    record
) {

    const status =
        record?.paymentStatus ??
        record?.status ??
        "";


    return String(status)
        .trim()
        .toUpperCase();

}


/* =====================================================
   GET RECORD DATE
   ===================================================== */

function getRecordDate(
    record
) {

    return (
        record?.orderDate ??
        record?.billingDate ??
        record?.invoiceDate ??
        record?.createdAt ??
        record?.date ??
        null
    );

}


/* =====================================================
   GET EXPENSE DATE
   ===================================================== */

function getExpenseDate(
    expense
) {

    return (
        expense?.expenseDate ??
        expense?.createdAt ??
        expense?.date ??
        null
    );

}


/* =====================================================
   GET CUSTOMER IDENTIFIER
   ===================================================== */

function getCustomerIdentifier(
    record
) {

    return (
        record?.customerId ??
        record?.customerEmail ??
        record?.email ??
        record?.customerName ??
        null
    );

}


/* =====================================================
   GET PRODUCT IDENTIFIER
   ===================================================== */

function getProductIdentifier(
    record
) {

    if (
        record?.productId !==
            undefined &&
        record?.productId !==
            null
    ) {

        return String(
            record.productId
        );

    }


    if (
        record?.productName !==
            undefined &&
        record?.productName !==
            null
    ) {

        return String(
            record.productName
        );

    }


    return null;

}


/* =====================================================
   FORMAT CURRENCY
   ===================================================== */

function formatCurrency(
    amount
) {

    const numericAmount =
        Number(amount);


    const safeAmount =
        Number.isFinite(
            numericAmount
        )
            ? numericAmount
            : 0;


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",

            currency: "INR",

            minimumFractionDigits: 2,

            maximumFractionDigits: 2
        }
    ).format(
        safeAmount
    );

}


/* =====================================================
   SET ELEMENT TEXT
   ===================================================== */

function setElementText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}
/* =====================================================
   REPORTS.JS
   PART 3
   SALES CHARTS
   ===================================================== */


/* =====================================================
   SALES BAR CHART
   ===================================================== */

function renderSalesBarChart(
    records
) {

    const canvas =
        document.getElementById(
            "salesBarChart"
        );


    const emptyState =
        document.getElementById(
            "salesBarChartEmpty"
        );


    if (!canvas) {

        return;

    }


    const groupedSales =
        groupSalesByDate(
            records
        );


    const labels =
        Object.keys(
            groupedSales
        );


    const values =
        Object.values(
            groupedSales
        );


    if (salesBarChart) {

        salesBarChart.destroy();

        salesBarChart = null;

    }


    if (labels.length === 0) {

        canvas.style.display =
            "none";

        showChartEmpty(
            emptyState
        );

        return;

    }


    canvas.style.display =
        "block";

    hideChartEmpty(
        emptyState
    );


    salesBarChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label:
                                "Sales",

                            data:
                                values,

                            borderWidth:
                                1
                        }
                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                true

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            "Sales: " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                maxRotation:
                                    45,

                                minRotation:
                                    0

                            }

                        },

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return formatCurrency(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =====================================================
   SALES LINE GRAPH
   ===================================================== */

function renderSalesLineChart(
    records
) {

    const canvas =
        document.getElementById(
            "salesLineChart"
        );


    const emptyState =
        document.getElementById(
            "salesLineChartEmpty"
        );


    if (!canvas) {

        return;

    }


    const groupedSales =
        groupSalesByDate(
            records
        );


    const labels =
        Object.keys(
            groupedSales
        );


    const values =
        Object.values(
            groupedSales
        );


    if (salesLineChart) {

        salesLineChart.destroy();

        salesLineChart = null;

    }


    if (labels.length === 0) {

        canvas.style.display =
            "none";

        showChartEmpty(
            emptyState
        );

        return;

    }


    canvas.style.display =
        "block";

    hideChartEmpty(
        emptyState
    );


    salesLineChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label:
                                "Sales",

                            data:
                                values,

                            fill:
                                false,

                            tension:
                                0.3,

                            borderWidth:
                                2,

                            pointRadius:
                                4,

                            pointHoverRadius:
                                6
                        }
                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                true

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            "Sales: " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return formatCurrency(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =====================================================
   GROUP SALES BY DATE
   ===================================================== */

function groupSalesByDate(
    records
) {

    const result = {};


    records.forEach(
        function (record) {

            const date =
                getRecordDate(
                    record
                );


            if (!date) {

                return;

            }


            const formattedDate =
                formatDateForChart(
                    date
                );


            const amount =
                getAmount(
                    record
                );


            if (
                !result[formattedDate]
            ) {

                result[formattedDate] =
                    0;

            }


            result[formattedDate] +=
                amount;

        }
    );


    return result;

}


/* =====================================================
   FORMAT DATE FOR CHART
   ===================================================== */

function formatDateForChart(
    value
) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric"
        }
    );

}
/* =====================================================
   REPORTS.JS
   PART 4
   PROFIT & LOSS GRAPH
   ===================================================== */


/* =====================================================
   RENDER PROFIT & LOSS CHART
   ===================================================== */

function renderProfitLossChart(
    records,
    expenses
) {

    const canvas =
        document.getElementById(
            "profitLossChart"
        );


    const emptyState =
        document.getElementById(
            "profitLossChartEmpty"
        );


    if (!canvas) {

        return;

    }


    /*
     * Group sales
     */

    const salesByDate =
        groupAmountByDate(
            records,
            getRecordDate,
            getAmount
        );


    /*
     * Group expenses
     */

    const expensesByDate =
        groupAmountByDate(
            expenses,
            getExpenseDate,
            getExpenseAmount
        );


    /*
     * Get all dates
     */

    const allDates =
        new Set([
            ...Object.keys(
                salesByDate
            ),

            ...Object.keys(
                expensesByDate
            )
        ]);


    const sortedDates =
        Array.from(
            allDates
        ).sort(
            function (a, b) {

                return (
                    new Date(a) -
                    new Date(b)
                );

            }
        );


    /*
     * Destroy old chart
     */

    if (profitLossChart) {

        profitLossChart.destroy();

        profitLossChart = null;

    }


    /*
     * No data
     */

    if (
        sortedDates.length === 0
    ) {

        canvas.style.display =
            "none";

        showChartEmpty(
            emptyState
        );


        updateProfitLossSummary(
            0,
            0,
            0
        );


        return;

    }


    canvas.style.display =
        "block";

    hideChartEmpty(
        emptyState
    );


    /*
     * Chart labels
     */

    const labels =
        sortedDates.map(
            function (date) {

                return formatDateForChart(
                    date
                );

            }
        );


    /*
     * Sales values
     */

    const salesValues =
        sortedDates.map(
            function (date) {

                return (
                    salesByDate[date] ||
                    0
                );

            }
        );


    /*
     * Expense values
     */

    const expenseValues =
        sortedDates.map(
            function (date) {

                return (
                    expensesByDate[date] ||
                    0
                );

            }
        );


    /*
     * Profit / Loss values
     */

    const profitLossValues =
        sortedDates.map(
            function (date) {

                const sales =
                    salesByDate[date] ||
                    0;


                const expensesAmount =
                    expensesByDate[date] ||
                    0;


                return (
                    sales -
                    expensesAmount
                );

            }
        );


    /*
     * Calculate totals
     */

    const totalSales =
        salesValues.reduce(
            function (sum, value) {

                return sum + value;

            },
            0
        );


    const totalExpenses =
        expenseValues.reduce(
            function (sum, value) {

                return sum + value;

            },
            0
        );


    const netProfit =
        totalSales -
        totalExpenses;


    /*
     * Update summary
     */

    updateProfitLossSummary(
        totalSales,
        totalExpenses,
        netProfit
    );


    /*
     * Create graph
     */

    profitLossChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label:
                                "Sales",

                            data:
                                salesValues,

                            fill:
                                false,

                            tension:
                                0.3,

                            borderWidth:
                                2,

                            pointRadius:
                                4

                        },

                        {
                            label:
                                "Expenses",

                            data:
                                expenseValues,

                            fill:
                                false,

                            tension:
                                0.3,

                            borderWidth:
                                2,

                            pointRadius:
                                4

                        },

                        {
                            label:
                                "Profit / Loss",

                            data:
                                profitLossValues,

                            fill:
                                false,

                            tension:
                                0.3,

                            borderWidth:
                                3,

                            pointRadius:
                                5,

                            pointHoverRadius:
                                7

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },

                    plugins: {

                        legend: {

                            display:
                                true,

                            position:
                                "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                maxRotation:
                                    45,

                                minRotation:
                                    0

                            }

                        },

                        y: {

                            beginAtZero:
                                false,

                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return formatCurrency(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =====================================================
   GROUP AMOUNT BY DATE
   ===================================================== */

function groupAmountByDate(
    records,
    dateGetter,
    amountGetter
) {

    const result = {};


    if (
        !Array.isArray(records)
    ) {

        return result;

    }


    records.forEach(
        function (record) {

            const dateValue =
                dateGetter(
                    record
                );


            if (!dateValue) {

                return;

            }


            const date =
                getDateOnly(
                    dateValue
                );


            if (!date) {

                return;

            }


            const amount =
                amountGetter(
                    record
                );


            if (
                !result[date]
            ) {

                result[date] =
                    0;

            }


            result[date] +=
                amount;

        }
    );


    return result;

}


/* =====================================================
   PROFIT & LOSS SUMMARY
   ===================================================== */

function updateProfitLossSummary(
    totalSales,
    totalExpenses,
    netProfit
) {

    /*
     * Optional summary elements.
     * They will update only if
     * those IDs exist in HTML.
     */

    setElementText(
        "profitLossSales",
        formatCurrency(
            totalSales
        )
    );


    setElementText(
        "profitLossExpenses",
        formatCurrency(
            totalExpenses
        )
    );


    setElementText(
        "totalProfit",
        formatCurrency(
            Math.max(
                netProfit,
                0
            )
        )
    );


    setElementText(
        "totalLoss",
        formatCurrency(
            Math.max(
                -netProfit,
                0
            )
        )
    );


    setElementText(
        "netProfitLoss",
        formatCurrency(
            netProfit
        )
    );

}
/* =====================================================
   REPORTS.JS
   PART 5
   FILTERS
   ===================================================== */


/* =====================================================
   FILTER EVENTS
   ===================================================== */

function setupFilterEvents() {

    const applyButton =
        document.getElementById(
            "applyReportFilter"
        );


    const resetButton =
        document.getElementById(
            "resetReportFilter"
        );


    const periodFilter =
        document.getElementById(
            "reportPeriodFilter"
        );


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            applyReportFilter
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetReportFilter
        );

    }


    if (periodFilter) {

        periodFilter.addEventListener(
            "change",
            function () {

                if (
                    periodFilter.value !==
                    "ALL"
                ) {

                    applyReportFilter();

                }

            }
        );

    }

}


/* =====================================================
   APPLY REPORT FILTER
   ===================================================== */

function applyReportFilter() {

    const fromDate =
        document.getElementById(
            "reportDateFrom"
        )?.value;


    const toDate =
        document.getElementById(
            "reportDateTo"
        )?.value;


    const period =
        document.getElementById(
            "reportPeriodFilter"
        )?.value ||
        "ALL";


    let filteredOrders =
        [...reportRecords];


    let filteredExpenses =
        [...expenseRecords];


    /*
     * CUSTOM DATE FILTER
     */

    if (
        fromDate ||
        toDate
    ) {

        filteredOrders =
            filteredOrders.filter(
                function (record) {

                    return isDateInRange(
                        getRecordDate(
                            record
                        ),
                        fromDate,
                        toDate
                    );

                }
            );


        filteredExpenses =
            filteredExpenses.filter(
                function (expense) {

                    return isDateInRange(
                        getExpenseDate(
                            expense
                        ),
                        fromDate,
                        toDate
                    );

                }
            );

    }


    /*
     * PERIOD FILTER
     */

    else if (
        period !== "ALL"
    ) {

        filteredOrders =
            filterByPeriod(
                reportRecords,
                period,
                getRecordDate
            );


        filteredExpenses =
            filterByPeriod(
                expenseRecords,
                period,
                getExpenseDate
            );

    }


    /*
     * Render filtered data
     */

    renderReports(
        filteredOrders,
        filteredExpenses
    );

}


/* =====================================================
   DATE RANGE CHECK
   ===================================================== */

function isDateInRange(
    value,
    fromDate,
    toDate
) {

    const recordDate =
        getDateOnly(
            value
        );


    if (!recordDate) {

        return false;

    }


    if (
        fromDate &&
        recordDate < fromDate
    ) {

        return false;

    }


    if (
        toDate &&
        recordDate > toDate
    ) {

        return false;

    }


    return true;

}


/* =====================================================
   RESET FILTER
   ===================================================== */

function resetReportFilter() {

    const fromDate =
        document.getElementById(
            "reportDateFrom"
        );


    const toDate =
        document.getElementById(
            "reportDateTo"
        );


    const period =
        document.getElementById(
            "reportPeriodFilter"
        );


    if (fromDate) {

        fromDate.value = "";

    }


    if (toDate) {

        toDate.value = "";

    }


    if (period) {

        period.value =
            "ALL";

    }


    renderReports(
        reportRecords,
        expenseRecords
    );

}


/* =====================================================
   FILTER BY PERIOD
   ===================================================== */

function filterByPeriod(
    records,
    period,
    dateGetter
) {

    const now =
        new Date();


    const today =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


    return records.filter(
        function (record) {

            const dateValue =
                dateGetter(
                    record
                );


            if (!dateValue) {

                return false;

            }


            const recordDate =
                new Date(
                    dateValue
                );


            if (
                Number.isNaN(
                    recordDate.getTime()
                )
            ) {

                return false;

            }


            const normalizedDate =
                new Date(
                    recordDate.getFullYear(),
                    recordDate.getMonth(),
                    recordDate.getDate()
                );


            if (
                period ===
                "TODAY"
            ) {

                return (
                    normalizedDate.getTime() ===
                    today.getTime()
                );

            }


            if (
                period ===
                "WEEK"
            ) {

                const day =
                    today.getDay();


                const difference =
                    day === 0
                        ? 6
                        : day - 1;


                const startOfWeek =
                    new Date(
                        today
                    );


                startOfWeek.setDate(
                    today.getDate() -
                    difference
                );


                return (
                    normalizedDate >=
                    startOfWeek &&
                    normalizedDate <=
                    today
                );

            }


            if (
                period ===
                "MONTH"
            ) {

                return (
                    normalizedDate.getFullYear() ===
                    today.getFullYear() &&

                    normalizedDate.getMonth() ===
                    today.getMonth()
                );

            }


            if (
                period ===
                "YEAR"
            ) {

                return (
                    normalizedDate.getFullYear() ===
                    today.getFullYear()
                );

            }


            return true;

        }
    );

}


/* =====================================================
   GET DATE ONLY
   ===================================================== */

function getDateOnly(
    value
) {

    if (!value) {

        return null;

    }


    const text =
        String(value);


    /*
     * Handle ISO date directly.
     */

    const isoMatch =
        text.match(
            /^(\d{4}-\d{2}-\d{2})/
        );


    if (isoMatch) {

        return isoMatch[1];

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}
/* =====================================================
   REPORTS.JS
   PART 6
   INSIGHTS + UI HELPERS
   ===================================================== */


/* =====================================================
   BUSINESS INSIGHTS
   ===================================================== */

function updateBusinessInsights(
    records,
    expenses
) {

    const totalSales =
        records.reduce(
            function (
                sum,
                record
            ) {

                return (
                    sum +
                    getAmount(
                        record
                    )
                );

            },
            0
        );


    const totalExpenses =
        expenses.reduce(
            function (
                sum,
                expense
            ) {

                return (
                    sum +
                    getExpenseAmount(
                        expense
                    )
                );

            },
            0
        );


    const netProfit =
        totalSales -
        totalExpenses;


    const totalOrders =
        records.length;


    const paidOrders =
        records.filter(
            function (record) {

                return (
                    getPaymentStatus(
                        record
                    ) ===
                    "PAID"
                );

            }
        ).length;


    const pendingOrders =
        records.filter(
            function (record) {

                return (
                    getPaymentStatus(
                        record
                    ) ===
                    "PENDING"
                );

            }
        ).length;


    const pendingAmount =
        records.reduce(
            function (
                sum,
                record
            ) {

                if (
                    getPaymentStatus(
                        record
                    ) ===
                    "PENDING"
                ) {

                    return (
                        sum +
                        getAmount(
                            record
                        )
                    );

                }


                return sum;

            },
            0
        );


    setElementText(
        "salesPerformanceInsight",
        totalOrders > 0
            ? formatCurrency(
                totalSales
            )
            : "--"
    );


    setElementText(
        "orderPerformanceInsight",
        totalOrders > 0
            ? totalOrders +
              " Orders"
            : "--"
    );


    setElementText(
        "paymentPerformanceInsight",
        totalOrders > 0
            ? paidOrders +
              " Paid / " +
              pendingOrders +
              " Pending"
            : "--"
    );


    setElementText(
        "pendingAmountInsight",
        formatCurrency(
            pendingAmount
        )
    );


    /*
     * Optional profit insight
     */

    setElementText(
        "profitPerformanceInsight",
        formatCurrency(
            netProfit
        )
    );

}


/* =====================================================
   CHART EMPTY STATE
   ===================================================== */

function showChartEmpty(
    element
) {

    if (!element) {

        return;

    }


    element.classList.add(
        "active"
    );

}


/* =====================================================
   HIDE CHART EMPTY STATE
   ===================================================== */

function hideChartEmpty(
    element
) {

    if (!element) {

        return;

    }


    element.classList.remove(
        "active"
    );

}


/* =====================================================
   LOADING STATE
   ===================================================== */

function showLoading(
    show
) {

    const loading =
        document.getElementById(
            "reportsLoading"
        );


    if (!loading) {

        return;

    }


    loading.style.display =
        show
            ? "flex"
            : "none";

}


/* =====================================================
   ERROR STATE
   ===================================================== */

function showError(
    message
) {

    const errorBox =
        document.getElementById(
            "reportsError"
        );


    const errorMessage =
        document.getElementById(
            "reportsErrorMessage"
        );


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }


    if (errorBox) {

        errorBox.hidden =
            false;

    }

}


/* =====================================================
   HIDE ERROR
   ===================================================== */

function hideError() {

    const errorBox =
        document.getElementById(
            "reportsError"
        );


    if (errorBox) {

        errorBox.hidden =
            true;

    }

}


/* =====================================================
   RETRY BUTTON
   ===================================================== */

function setupRetryButton() {

    const retryButton =
        document.getElementById(
            "retryReportsButton"
        );


    if (!retryButton) {

        return;

    }


    retryButton.addEventListener(
        "click",
        function () {

            loadReports();

        }
    );

}


/* =====================================================
   WINDOW RESIZE
   ===================================================== */

window.addEventListener(
    "resize",
    function () {

        if (salesBarChart) {

            salesBarChart.resize();

        }


        if (salesLineChart) {

            salesLineChart.resize();

        }


        if (profitLossChart) {

            profitLossChart.resize();

        }

    }
);


/* =====================================================
   REPORTS.JS COMPLETE
   ===================================================== */