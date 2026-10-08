document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            navLinks.classList.toggle("show");

            const isOpen = navLinks.classList.contains("show");

            menuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("show");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

        document.addEventListener("click", function (event) {

            if (
                navLinks.classList.contains("show") &&
                !navLinks.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {

                navLinks.classList.remove("show");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });

        navLinks.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }


    /* =========================
       QR CODE GENERATOR
    ========================= */

    const qrForm = document.getElementById("qrForm");

    if (qrForm) {

        qrForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const vendorNameInput =
                document.getElementById("vendorName");

            const upiIdInput =
                document.getElementById("upiId");

            const amountInput =
                document.getElementById("amount");

            const qrContainer =
                document.getElementById("qrcode");

            const qrResult =
                document.getElementById("qrResult");

            const qrVendor =
                document.getElementById("qrVendor");

            const qrUpi =
                document.getElementById("qrUpi");

            const qrAmount =
                document.getElementById("qrAmount");


            if (
                !vendorNameInput ||
                !upiIdInput ||
                !qrContainer
            ) {
                return;
            }


            const vendorName =
                vendorNameInput.value.trim();

            const upiId =
                upiIdInput.value.trim();

            const amount =
                amountInput
                    ? amountInput.value.trim()
                    : "";


            if (!vendorName || !upiId) {

                alert(
                    "Please enter Vendor / Business Name and UPI ID."
                );

                return;
            }


            if (typeof QRCode === "undefined") {

                alert(
                    "QR Code library could not be loaded. Please check your internet connection and try again."
                );

                return;
            }


            /* Clear previous QR */

            qrContainer.innerHTML = "";


            /* Create UPI payment link */

            let upiLink =
                "upi://pay?pa=" +
                encodeURIComponent(upiId) +
                "&pn=" +
                encodeURIComponent(vendorName);


            if (amount) {

                upiLink +=
                    "&am=" +
                    encodeURIComponent(amount) +
                    "&cu=INR";

            }


            /* Generate QR */

            new QRCode(qrContainer, {

                text: upiLink,

                width: 220,

                height: 220,

                correctLevel: QRCode.CorrectLevel.H

            });


            /* Update information */

            if (qrVendor) {

                qrVendor.textContent =
                    vendorName;

            }


            if (qrUpi) {

                qrUpi.textContent =
                    upiId;

            }


            if (qrAmount) {

                qrAmount.textContent =
                    amount
                        ? "Amount: ₹" + amount
                        : "Amount: Entered by customer";

            }


            /* Show the outer section */

            if (qrResult) {

                qrResult.style.display = "block";


                /*
                 * IMPORTANT:
                 * The inner .qr-result is hidden
                 * by CSS, so explicitly show it.
                 */

                const qrCard =
                    qrResult.querySelector(".qr-result");

                if (qrCard) {
                    qrCard.style.display = "block";
                }


                setTimeout(function () {

                    qrResult.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 100);

            }

        });
    }


    /* =========================
       DOWNLOAD QR
    ========================= */

    const downloadQR =
        document.getElementById("downloadQR");

    if (downloadQR) {

        downloadQR.addEventListener("click", function () {

            const qrContainer =
                document.getElementById("qrcode");

            if (!qrContainer) {
                return;
            }


            const canvas =
                qrContainer.querySelector("canvas");

            const image =
                qrContainer.querySelector("img");


            let downloadURL = "";


            if (canvas) {

                downloadURL =
                    canvas.toDataURL("image/png");

            } else if (image) {

                downloadURL =
                    image.src;

            }


            if (!downloadURL) {

                alert(
                    "Please generate the QR code first."
                );

                return;
            }


            const link =
                document.createElement("a");

            link.href = downloadURL;

            link.download =
                "DigiVendor-QR.png";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        });
    }


    /* =========================
       DASHBOARD
    ========================= */

    const STORAGE_KEY =
        "digivendorTransactions";

    let transactions = [];

    try {

        transactions =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

    } catch (error) {

        transactions = [];

    }


    function saveTransactions() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions)
        );

    }


    function formatCurrency(amount) {

        return "₹" +
            Number(amount).toLocaleString("en-IN");

    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    function updateDashboard() {

        const totalSalesElement =
            document.getElementById("totalSales");

        const totalExpensesElement =
            document.getElementById("totalExpenses");

        const netProfitElement =
            document.getElementById("netProfit");

        const transactionCountElement =
            document.getElementById("transactionCount");

        const transactionHistory =
            document.getElementById("transactionHistory");


        let totalSales = 0;
        let totalExpenses = 0;


        transactions.forEach(function (transaction) {

            if (transaction.type === "sale") {

                totalSales +=
                    Number(transaction.amount);

            }

            if (transaction.type === "expense") {

                totalExpenses +=
                    Number(transaction.amount);

            }

        });


        const netProfit =
            totalSales - totalExpenses;


        if (totalSalesElement) {

            totalSalesElement.textContent =
                formatCurrency(totalSales);

        }


        if (totalExpensesElement) {

            totalExpensesElement.textContent =
                formatCurrency(totalExpenses);

        }


        if (netProfitElement) {

            netProfitElement.textContent =
                formatCurrency(netProfit);

        }


        if (transactionCountElement) {

            transactionCountElement.textContent =
                transactions.length;

        }


        if (transactionHistory) {

            if (transactions.length === 0) {

                transactionHistory.innerHTML =
                    '<p class="empty-state">No transactions yet.</p>';

            } else {

                transactionHistory.innerHTML =
                    transactions
                        .slice()
                        .reverse()
                        .map(function (transaction) {

                            const typeLabel =
                                transaction.type === "sale"
                                    ? "Sale"
                                    : "Expense";

                            const typeClass =
                                transaction.type === "sale"
                                    ? "sale"
                                    : "expense";


                            return `
                                <div class="transaction-item">

                                    <div>
                                        <strong>
                                            ${escapeHTML(transaction.description)}
                                        </strong>

                                        <small>
                                            ${escapeHTML(transaction.date)}
                                        </small>
                                    </div>

                                    <div class="${typeClass}">
                                        ${typeLabel}:
                                        ${formatCurrency(transaction.amount)}
                                    </div>

                                    <button
                                        class="delete-transaction"
                                        data-id="${transaction.id}">
                                        Delete
                                    </button>

                                </div>
                            `;

                        })
                        .join("");

            }

        }

    }


    const addSaleButton =
        document.getElementById("addSale");

    const addExpenseButton =
        document.getElementById("addExpense");


    function addTransaction(type) {

        const descriptionInput =
            document.getElementById(
                "transactionDescription"
            );

        const amountInput =
            document.getElementById(
                "transactionAmount"
            );


        if (!descriptionInput || !amountInput) {
            return;
        }


        const description =
            descriptionInput.value.trim();

        const amount =
            amountInput.value.trim();


        if (!description || !amount) {

            alert(
                "Please enter description and amount."
            );

            return;
        }


        if (Number(amount) <= 0) {

            alert(
                "Please enter a valid amount."
            );

            return;
        }


        transactions.push({

            id: Date.now(),

            type: type,

            description: description,

            amount: Number(amount),

            date: new Date().toLocaleString("en-IN")

        });


        saveTransactions();

        updateDashboard();


        descriptionInput.value = "";

        amountInput.value = "";

    }


    if (addSaleButton) {

        addSaleButton.addEventListener(
            "click",
            function () {
                addTransaction("sale");
            }
        );

    }


    if (addExpenseButton) {

        addExpenseButton.addEventListener(
            "click",
            function () {
                addTransaction("expense");
            }
        );

    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList &&
                event.target.classList.contains(
                    "delete-transaction"
                )
            ) {

                const id =
                    Number(
                        event.target.dataset.id
                    );


                transactions =
                    transactions.filter(
                        function (transaction) {

                            return transaction.id !== id;

                        }
                    );


                saveTransactions();

                updateDashboard();

            }

        }
    );


    const clearTransactions =
        document.getElementById(
            "clearTransactions"
        );


    if (clearTransactions) {

        clearTransactions.addEventListener(
            "click",
            function () {

                if (transactions.length === 0) {
                    return;
                }


                const confirmClear =
                    confirm(
                        "Clear all transactions?"
                    );


                if (!confirmClear) {
                    return;
                }


                transactions = [];

                saveTransactions();

                updateDashboard();

            }
        );

    }


    updateDashboard();

});