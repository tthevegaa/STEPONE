const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const employeeName = document.getElementById("employeeName");
const employeePosition = document.getElementById("employeePosition");
const employeeAvatar = document.getElementById("employeeAvatar");

const logoutButton = document.getElementById("logoutButton");

const navItems = document.querySelectorAll(".nav-item");
const actionCards = document.querySelectorAll(".action-card");

const pageTitle = document.getElementById("pageTitle");

const registerContent = document.getElementById("registerContent");
const searchContent = document.getElementById("searchContent");
const accountContent = document.getElementById("accountContent");
const depositContent = document.getElementById("depositContent");
const withdrawContent = document.getElementById("withdrawContent");
const transferContent = document.getElementById("transferContent");
const historyContent = document.getElementById("historyContent");

const sections = {
    home: document.getElementById("homeSection"),
    register: document.getElementById("registerSection"),
    search: document.getElementById("searchSection"),
    account: document.getElementById("accountSection"),
    deposit: document.getElementById("depositSection"),
    withdraw: document.getElementById("withdrawSection"),
    transfer: document.getElementById("transferSection"),
    history: document.getElementById("historySection")
};

const titles = {
    home: "Dashboard",
    register: "Register Client",
    search: "Search Client",
    account: "View Account",
    deposit: "Deposit",
    withdraw: "Withdraw",
    transfer: "Transfer",
    history: "Transaction History"
};


// LOGIN

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    loginMessage.textContent = "Signing in...";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            loginMessage.textContent = data.error || "LOGIN FAILED";

            return;

        }

        const employee = data.employee;

        employeeName.textContent =
            `${employee.firstName} ${employee.lastName}`;

        employeePosition.textContent =
            employee.position;

        employeeAvatar.textContent =
            `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

        loginMessage.textContent = "";

        loginScreen.classList.add("hidden");
        dashboardScreen.classList.remove("hidden");

        showSection("home");

    }
    catch (error) {

        console.log(error);

        loginMessage.textContent =
            "SERVICE TEMPORARILY UNAVAILABLE";

    }

});


// SECTION SWITCHING

function showSection(sectionName) {

    Object.values(sections).forEach(section => {

        section.classList.add("hidden");

    });

    sections[sectionName].classList.remove("hidden");

    pageTitle.textContent = titles[sectionName];

    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionName) {

            item.classList.add("active");

        }

    });

}


// SIDEBAR NAVIGATION

navItems.forEach(item => {

    item.addEventListener("click", () => {

        showSection(item.dataset.section);

    });

});


// QUICK ACTION CARDS

actionCards.forEach(card => {

    card.addEventListener("click", () => {

        showSection(card.dataset.go);

    });

});


// REGISTER CLIENT

registerContent.innerHTML = `
    <form id="registerForm" class="operation-form">

        <div class="form-grid">

            <div class="input-group">
                <label for="registerUsername">Username</label>
                <input id="registerUsername" type="text" placeholder="Enter username" required>
            </div>

            <div class="input-group">
                <label for="registerFirstName">First name</label>
                <input id="registerFirstName" type="text" placeholder="Enter first name" required>
            </div>

            <div class="input-group">
                <label for="registerLastName">Last name</label>
                <input id="registerLastName" type="text" placeholder="Enter last name" required>
            </div>

            <div class="input-group">
                <label for="registerPhone">Phone</label>
                <input id="registerPhone" type="text" placeholder="Enter phone number" required>
            </div>

            <div class="input-group full-width">
                <label for="registerEmail">Email</label>
                <input id="registerEmail" type="email" placeholder="Enter email address" required>
            </div>

        </div>

        <button class="primary-button operation-button" type="submit">
            Register client
        </button>

        <div id="registerResult"></div>

    </form>
`;

const registerForm = document.getElementById("registerForm");
const registerResult = document.getElementById("registerResult");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    registerResult.innerHTML = `
        <p class="operation-message">
            Registering client...
        </p>
    `;

    const clientData = {
        username: document.getElementById("registerUsername").value.trim(),
        firstName: document.getElementById("registerFirstName").value.trim(),
        lastName: document.getElementById("registerLastName").value.trim(),
        phone: document.getElementById("registerPhone").value.trim(),
        email: document.getElementById("registerEmail").value.trim()
    };

    try {

        const response = await fetch("/api/clients", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(clientData)

        });

        const data = await response.json();

        if (!response.ok) {

            registerResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>Registration failed</strong>
                    <p>${data.error || "CLIENT COULD NOT BE REGISTERED"}</p>
                </div>
            `;

            return;

        }

        registerResult.innerHTML = `
            <div class="result-card success-card">

                <p class="eyebrow">
                    CLIENT CREATED
                </p>

                <h3>
                    ${clientData.firstName} ${clientData.lastName}
                </h3>

                <div class="credential-grid">

                    <div>
                        <span>Client ID</span>
                        <strong>${data.clientId}</strong>
                    </div>

                    <div>
                        <span>Account ID</span>
                        <strong>${data.accountId}</strong>
                    </div>

                    <div>
                        <span>Account Number</span>
                        <strong>${data.accountNumber}</strong>
                    </div>

                    <div>
                        <span>Username</span>
                        <strong>${data.username}</strong>
                    </div>

                    <div>
                        <span>Temporary Password</span>
                        <strong>${data.temporaryPassword}</strong>
                    </div>

                    <div>
                        <span>Passkey</span>
                        <strong>${data.passkey}</strong>
                    </div>

                </div>

            </div>
        `;

        registerForm.reset();

    }
    catch (error) {

        console.log(error);

        registerResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});


// SEARCH CLIENT

searchContent.innerHTML = `
    <form id="searchForm" class="operation-form">

        <div class="input-group">

            <label for="searchClientId">
                Client ID
            </label>

            <input
                id="searchClientId"
                type="number"
                min="1"
                placeholder="Enter client ID"
                required
            >

        </div>

        <button class="primary-button operation-button" type="submit">
            Search client
        </button>

        <div id="searchResult"></div>

    </form>
`;

const searchForm = document.getElementById("searchForm");
const searchResult = document.getElementById("searchResult");

searchForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const clientId =
        document.getElementById("searchClientId").value;

    searchResult.innerHTML = `
        <p class="operation-message">
            Searching...
        </p>
    `;

    try {

        const response =
            await fetch(`/api/clients/${clientId}`);

        const data = await response.json();

        if (!response.ok) {

            searchResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>Client not found</strong>
                    <p>${data.error || "SEARCH FAILED"}</p>
                </div>
            `;

            return;

        }

        searchResult.innerHTML = `
            <div class="result-card success-card">

                <p class="eyebrow">
                    CLIENT FOUND
                </p>

                <h3>
                    ${data.firstName} ${data.lastName}
                </h3>

                <div class="credential-grid">

                    <div>
                        <span>Client ID</span>
                        <strong>${data.id}</strong>
                    </div>

                    <div>
                        <span>Username</span>
                        <strong>${data.username}</strong>
                    </div>

                    <div>
                        <span>Phone</span>
                        <strong>${data.phone}</strong>
                    </div>

                    <div>
                        <span>Email</span>
                        <strong>${data.email}</strong>
                    </div>

                </div>

            </div>
        `;

    }
    catch (error) {

        console.log(error);

        searchResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});


// VIEW ACCOUNT

accountContent.innerHTML = `
    <form id="accountForm" class="operation-form">

        <div class="input-group">

            <label for="accountNumberInput">
                Account Number
            </label>

            <input
                id="accountNumberInput"
                type="text"
                placeholder="Enter account number"
                required
            >

        </div>

        <button class="primary-button operation-button" type="submit">
            View account
        </button>

        <div id="accountResult"></div>

    </form>
`;

const accountForm = document.getElementById("accountForm");
const accountResult = document.getElementById("accountResult");

accountForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const accountNumber =
        document.getElementById("accountNumberInput").value.trim();

    accountResult.innerHTML = `
        <p class="operation-message">
            Loading account...
        </p>
    `;

    try {

        const response =
            await fetch(`/api/accounts/${accountNumber}`);

        const data = await response.json();

        if (!response.ok) {

            accountResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>Account not found</strong>
                    <p>${data.error || "ACCOUNT LOOKUP FAILED"}</p>
                </div>
            `;

            return;

        }

        accountResult.innerHTML = `
            <div class="result-card success-card">

                <p class="eyebrow">
                    ACCOUNT FOUND
                </p>

                <h3>
                    ${data.accountNumber}
                </h3>

                <div class="credential-grid">

                    <div>
                        <span>Account ID</span>
                        <strong>${data.id}</strong>
                    </div>

                    <div>
                        <span>Client ID</span>
                        <strong>${data.clientId}</strong>
                    </div>

                    <div>
                        <span>Balance</span>
                        <strong>
                            $${Number(data.balance).toFixed(2)}
                        </strong>
                    </div>

                </div>

            </div>
        `;

    }
    catch (error) {

        console.log(error);

        accountResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});


// DEPOSIT

depositContent.innerHTML = `
    <form id="depositForm" class="operation-form">

        <div class="form-grid">

            <div class="input-group">

                <label for="depositAccountNumber">
                    Account Number
                </label>

                <input
                    id="depositAccountNumber"
                    type="text"
                    placeholder="Enter account number"
                    required
                >

            </div>

            <div class="input-group">

                <label for="depositAmount">
                    Amount
                </label>

                <input
                    id="depositAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >

            </div>

        </div>

        <button class="primary-button operation-button" type="submit">
            Complete deposit
        </button>

        <div id="depositResult"></div>

    </form>
`;

const depositForm = document.getElementById("depositForm");
const depositResult = document.getElementById("depositResult");

depositForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const accountNumber =
        document.getElementById("depositAccountNumber").value.trim();

    const amount =
        Number(document.getElementById("depositAmount").value);

    depositResult.innerHTML = `
        <p class="operation-message">
            Processing deposit...
        </p>
    `;

    try {

        const response = await fetch(
            `/api/accounts/${accountNumber}/deposits`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount
                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            depositResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>Deposit failed</strong>
                    <p>${data.error || "DEPOSIT COULD NOT BE COMPLETED"}</p>
                </div>
            `;

            return;

        }

        depositResult.innerHTML = `
            <div class="result-card success-card">

                <p class="eyebrow">
                    DEPOSIT COMPLETED
                </p>

                <h3>
                    $${Number(data.amount).toFixed(2)}
                </h3>

                <div class="credential-grid">

                    <div>
                        <span>Transaction ID</span>
                        <strong>${data.transactionId}</strong>
                    </div>

                    <div>
                        <span>Account ID</span>
                        <strong>${data.accountId}</strong>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>${data.date}</strong>
                    </div>

                </div>

            </div>
        `;

        depositForm.reset();

    }
    catch (error) {

        console.log(error);

        depositResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});


// WITHDRAW

withdrawContent.innerHTML = `
    <form id="withdrawForm" class="operation-form">

        <div class="form-grid">

            <div class="input-group">

                <label for="withdrawAccountNumber">
                    Account Number
                </label>

                <input
                    id="withdrawAccountNumber"
                    type="text"
                    placeholder="Enter account number"
                    required
                >

            </div>

            <div class="input-group">

                <label for="withdrawAmount">
                    Amount
                </label>

                <input
                    id="withdrawAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >

            </div>

            <div class="input-group full-width">

                <label for="withdrawPassKey">
                    Passkey
                </label>

                <input
                    id="withdrawPassKey"
                    type="password"
                    placeholder="Enter account passkey"
                    required
                >

            </div>

        </div>

        <button class="primary-button operation-button" type="submit">
            Complete withdrawal
        </button>

        <div id="withdrawResult"></div>

    </form>
`;

const withdrawForm = document.getElementById("withdrawForm");
const withdrawResult = document.getElementById("withdrawResult");

withdrawForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const accountNumber =
        document.getElementById("withdrawAccountNumber").value.trim();

    const amount =
        Number(document.getElementById("withdrawAmount").value);

    const passKey =
        document.getElementById("withdrawPassKey").value.trim();

    withdrawResult.innerHTML = `
        <p class="operation-message">
            Processing withdrawal...
        </p>
    `;

    try {

        const response = await fetch(
            `/api/accounts/${accountNumber}/withdrawals`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount,
                    passKey
                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            withdrawResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>Withdrawal failed</strong>
                    <p>${data.error || "WITHDRAWAL COULD NOT BE COMPLETED"}</p>
                </div>
            `;

            return;

        }

        withdrawResult.innerHTML = `
            <div class="result-card success-card">

                <p class="eyebrow">
                    WITHDRAWAL COMPLETED
                </p>

                <h3>
                    $${Number(data.amount).toFixed(2)}
                </h3>

                <div class="credential-grid">

                    <div>
                        <span>Transaction ID</span>
                        <strong>${data.transactionId}</strong>
                    </div>

                    <div>
                        <span>Account ID</span>
                        <strong>${data.accountId}</strong>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>${data.date}</strong>
                    </div>

                </div>

            </div>
        `;

        withdrawForm.reset();

    }
    catch (error) {

        console.log(error);

        withdrawResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});


// TRANSFER

transferContent.innerHTML = `
    <form id="transferForm" class="operation-form">

        <div class="form-grid">

            <div class="input-group">

                <label for="transferSourceAccount">
                    Source Account
                </label>

                <input
                    id="transferSourceAccount"
                    type="text"
                    placeholder="Enter source account"
                    required
                >

            </div>

            <div class="input-group">

                <label for="transferDestinationAccount">
                    Destination Account
                </label>

                <input
                    id="transferDestinationAccount"
                    type="text"
                    placeholder="Enter destination account"
                    required
                >

            </div>

            <div class="input-group">

                <label for="transferAmount">
                    Amount
                </label>

                <input
                    id="transferAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >

            </div>

            <div class="input-group">

                <label for="transferPassKey">
                    Source Passkey
                </label>

                <input
                    id="transferPassKey"
                    type="password"
                    placeholder="Enter source passkey"
                    required
                >

            </div>

            <div class="input-group full-width">

                <label for="transferConcept">
                    Concept
                </label>

                <input
                    id="transferConcept"
                    type="text"
                    maxlength="200"
                    placeholder="Enter transfer concept"
                    required
                >

            </div>

        </div>

        <button class="primary-button operation-button" type="submit">
            Complete transfer
        </button>

        <div id="transferResult"></div>

    </form>
`;

const transferForm = document.getElementById("transferForm");
const transferResult = document.getElementById("transferResult");

transferForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const sourceAccountNumber = document.getElementById("transferSourceAccount").value.trim();

    const destinationAccountNumber = document.getElementById("transferDestinationAccount").value.trim();

    const amount = Number(document.getElementById("transferAmount").value);

    const concept = document.getElementById("transferConcept").value.trim();

    const passKey = document.getElementById("transferPassKey").value.trim();

    transferResult.innerHTML = `
        <p class="operation-message">
            Processing transfer...
        </p>
    `;

    try {

        const response = await fetch("/api/transfers", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                sourceAccountNumber,
                destinationAccountNumber,
                amount,
                concept,
                passKey
            })

        });

        const data = await response.json();

        if (!response.ok) {

            transferResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>Transfer failed</strong>
                    <p>${data.error || "TRANSFER COULD NOT BE COMPLETED"}</p>
                </div>
            `;

            return;

        }

        transferResult.innerHTML = `
            <div class="result-card success-card">

                <p class="eyebrow">
                    TRANSFER COMPLETED
                </p>

                <h3>
                    $${Number(data.amount).toFixed(2)}
                </h3>

                <div class="credential-grid">

                    <div>
                        <span>Transfer ID</span>
                        <strong>${data.transferId}</strong>
                    </div>

                    <div>
                        <span>Source Transaction</span>
                        <strong>${data.sourceTransactionId}</strong>
                    </div>

                    <div>
                        <span>Destination Transaction</span>
                        <strong>${data.destinationTransactionId}</strong>
                    </div>

                    <div>
                        <span>Source Account</span>
                        <strong>${data.sourceAccountNumber}</strong>
                    </div>

                    <div>
                        <span>Destination Account</span>
                        <strong>${data.destinationAccountNumber}</strong>
                    </div>

                    <div>
                        <span>Concept</span>
                        <strong>${data.concept}</strong>
                    </div>

                </div>

            </div>
        `;

        transferForm.reset();

    }
    catch (error) {

        console.log(error);

        transferResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});




historyContent.innerHTML = `
    <form id="historyForm" class="operation-form">

        <div class="input-group">

            <label for="historyAccountNumber">
                Account Number
            </label>

            <input
                id="historyAccountNumber"
                type="text"
                placeholder="Enter account number"
                required
            >

        </div>

        <button class="primary-button operation-button" type="submit">
            Load transactions
        </button>

        <div id="historyResult"></div>

    </form>
`;



const historyForm = document.getElementById("historyForm");
const historyResult = document.getElementById("historyResult");

historyForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const accountNumber =
        document.getElementById("historyAccountNumber").value.trim();

    historyResult.innerHTML = `
        <p class="operation-message">
            Loading transactions...
        </p>
    `;

    try {

        const response = await fetch(`/api/accounts/${accountNumber}/transactions`);

        const data = await response.json();

        if (!response.ok) {

            historyResult.innerHTML = `
                <div class="result-card error-card">
                    <strong>History unavailable</strong>
                    <p>${data.error || "TRANSACTION HISTORY COULD NOT BE LOADED"}</p>
                </div>
            `;

            return;

        }

        if (data.transactions.length === 0) {

            historyResult.innerHTML = `
                <div class="result-card">
                    <strong>No transactions found</strong>
                    <p>This account has no recorded activity yet.</p>
                </div>
            `;

            return;

        }

        const transactionCards = data.transactions.map(transaction => {

            const amount = Number(transaction.amount).toFixed(2);

            const transferInfo =
                transaction.transferId
                    ? `
                        <p>
                            <strong>Transfer ID:</strong>
                            ${transaction.transferId}
                        </p>

                        <p>
                            <strong>From:</strong>
                            ${transaction.sourceAccountNumber}
                        </p>

                        <p>
                            <strong>To:</strong>
                            ${transaction.destinationAccountNumber}
                        </p>

                        <p>
                            <strong>Concept:</strong>
                            ${transaction.concept}
                        </p>
                    `
                    : "";

            return `
                <div class="transaction-item">

                    <div>

                        <span class="transaction-type">
                            ${transaction.type}
                        </span>

                        <h3>
                            $${amount}
                        </h3>

                    </div>

                    <div class="transaction-details">

                        <p>
                            <strong>Transaction ID:</strong>
                            ${transaction.transactionId}
                        </p>

                        ${transferInfo}

                        <p>
                            <strong>Date:</strong>
                            ${transaction.date}
                        </p>

                    </div>

                </div>
            `;

        }).join("");

        historyResult.innerHTML = `
            <div class="history-wrapper">

                <p class="eyebrow">
                    ACCOUNT ACTIVITY
                </p>

                <h3>
                    ${data.accountNumber}
                </h3>

                <div class="transaction-list">
                    ${transactionCards}
                </div>

            </div>
        `;

    }
    catch (error) {

        console.log(error);

        historyResult.innerHTML = `
            <div class="result-card error-card">
                <strong>Service unavailable</strong>
                <p>STEPONE could not communicate with the server.</p>
            </div>
        `;

    }

});




logoutButton.addEventListener("click", () => {

    dashboardScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");

    loginForm.reset();

    showSection("home");

});




