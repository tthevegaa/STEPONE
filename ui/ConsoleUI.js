
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");


class ConsoleUI {


    constructor(bankService) {

        this.bankService = bankService;
        this.rl = readline.createInterface({ input, output });

    }



    async readConcept(prompt) {

        while (true) {

            const concept = (await this.rl.question(prompt)).trim();

            if (concept.length > 0 && concept.length <= 200) {
                return concept;
            }

            console.log("");
            console.log("INVALID CONCEPT");
            console.log("CONCEPT MUST CONTAIN BETWEEN 1 AND 200 CHARACTERS");
            console.log("");

        }

    }


    async readNonEmptyInput(prompt) {

        while (true) {

            const value = (await this.rl.question(prompt)).trim();

            if (value.length > 0) {
                return value;
            }

            console.log("");
            console.log("THIS FIELD CANNOT BE EMPTY");
            console.log("");

        }

    }


    async readUsername(prompt) {

        while (true) {

            const username = (await this.rl.question(prompt)).trim();

            if (/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
                return username;
            }

            console.log("");
            console.log("INVALID USERNAME");
            console.log("USE 3-30 LETTERS, NUMBERS, '.', '_' OR '-'");
            console.log("");

        }

    }


    async readName(prompt) {

        while (true) {

            const name = (await this.rl.question(prompt)).trim();

            if (/^[\p{L}][\p{L}\s'-]*$/u.test(name)) {
                return name;
            }

            console.log("");
            console.log("INVALID NAME");
            console.log("");

        }

    }


    async readEmail(prompt) {

        while (true) {

            const email = (await this.rl.question(prompt)).trim();
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (validEmail) {
                return email;
            }

            console.log("");
            console.log("INVALID EMAIL FORMAT");
            console.log("");

        }

    }


    async readPhone(prompt) {

        while (true) {

            const phone = (await this.rl.question(prompt)).trim();

            if (/^\d{8,12}$/.test(phone)) {
                return phone;
            }

            console.log("");
            console.log("INVALID PHONE NUMBER");
            console.log("USE BETWEEN 8 AND 12 DIGITS (ONLY NUMBERS)");
            console.log("");

        }

    }


    async readPositiveInteger(prompt) {

        while (true) {

            const inputValue = (await this.rl.question(prompt)).trim();

            if (/^\d+$/.test(inputValue)) {

                const number = Number(inputValue);

                if (Number.isSafeInteger(number) && number > 0) {
                    return number;
                }

            }

            console.log("");
            console.log("ENTER A VALID POSITIVE NUMBER");
            console.log("");

        }

    }


    async readAccountNumber(prompt) {

        while (true) {

            const accountNumber = (await this.rl.question(prompt)).trim();

            if (/^\d{10}$/.test(accountNumber)) {
                return accountNumber;
            }

            console.log("");
            console.log("INVALID ACCOUNT NUMBER");
            console.log("ACCOUNT NUMBER MUST CONTAIN 10 DIGITS");
            console.log("");

        }

    }


    async readPositiveAmount(prompt) {

        while (true) {

            const amountInput = (await this.rl.question(prompt)).trim();

            if (amountInput.length === 0) {

                console.log("");
                console.log("AMOUNT CANNOT BE EMPTY");
                console.log("");

                continue;
            }

            const amount = Number(amountInput);

            if (Number.isFinite(amount) && amount > 0) {
                return amount;
            }

            console.log("");
            console.log("INVALID AMOUNT");
            console.log("");

        }

    }


    async readPasskey(prompt) {

        while (true) {

            const passKey = (await this.rl.question(prompt)).trim();

            if (passKey === "0") {
                return null;
            }

            if (/^\d{6}$/.test(passKey)) {
                return passKey;
            }

            console.log("");
            console.log("INVALID PASSKEY");
            console.log("PASSKEY MUST CONTAIN 6 DIGITS");
            console.log("");
            console.log("CANCEL -> 0");
            console.log("");

        }

    }


    async confirmAction() {

        while (true) {

            console.log("");
            console.log("----------------------------------------");
            console.log("          CONFIRM OPERATION");
            console.log("----------------------------------------");
            console.log("");
            console.log("CARRY OUT -> 1");
            console.log("CANCEL -> 2");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            if (option === "1") {
                return true;
            }

            if (option === "2") {
                return false;
            }

            console.log("");
            console.log("INVALID OPTION");
            console.log("");

        }

    }


    async afterAction() {

        while (true) {

            console.log("");
            console.log("----------------------------------------");
            console.log("                WHAT NOW?");
            console.log("----------------------------------------");
            console.log("");
            console.log("LOG OUT -> 1");
            console.log("RETURN TO MAIN MENU -> 2");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            if (option === "1") {
                return "logout";
            }

            if (option === "2") {
                return "menu";
            }

            console.log("");
            console.log("INVALID OPTION");
            console.log("");

        }

    }


    async start() {

        let running = true;

        while (running) {

            console.log("========================================");
            console.log("               STEPONE");
            console.log("========================================");
            console.log("        EMPLOYEE BANKING SYSTEM");
            console.log("");
            console.log("LOG IN -> 1");
            console.log("EXIT -> 0");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            if (option === "1") {
                await this.login();
                continue;
            }

            if (option === "0") {
                running = false;
                continue;
            }

            console.log("");
            console.log("INVALID OPTION");
            console.log("");

        }

        this.rl.close();

    }


    async login() {

        console.log("");
        console.log("----------------------------------------");
        console.log("              EMPLOYEE LOGIN");
        console.log("----------------------------------------");
        console.log("");

        const username = await this.readUsername("USERNAME: ");
        const password = await this.readNonEmptyInput("PASSWORD: ");

        const employee = await this.bankService.loginEmployee(username, password);

        if (!employee) {

            console.log("");
            console.log("INVALID USERNAME OR PASSWORD");
            console.log("");

            return;
        }

        await this.showMainMenu(employee);

    }

    async showMainMenu(employee) {

        let loggedIn = true;


        while (loggedIn) {

            console.log("");
            console.log("----------------------------------------");
            console.log("               STEPONE");
            console.log("----------------------------------------");
            console.log("        EMPLOYEE BANKING SYSTEM");
            console.log("");
            console.log(`EMPLOYEE: ${employee.firstName} ${employee.lastName}`);
            console.log(`EMPLOYEE NO: ${employee.employeeNumber}`);
            console.log("");
            console.log("----------------------------------------");
            console.log("");
            console.log("REGISTER CLIENT -> 1");
            console.log("SEARCH CLIENT -> 2");
            console.log("VIEW ACCOUNT -> 3");
            console.log("DEPOSIT -> 4");
            console.log("WITHDRAW -> 5");
            console.log("TRANSFER -> 6");
            console.log("TRANSACTION HISTORY -> 7");
            console.log("LOG OUT -> 0");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            let nextAction = null;


            switch (option) {

                case "1":

                    nextAction = await this.registerClient();
                    break;

                case "2":

                    nextAction = await this.searchClient();
                    break;

                case "3":

                    nextAction = await this.viewAccount();
                    break;

                case "4":

                    nextAction = await this.deposit();
                    break;

                case "5":

                    nextAction = await this.withdraw();
                    break;

                case "6":

                    nextAction = await this.transfer();
                    break;

                case "7":

                    nextAction = await this.viewTransactionHistory();
                    break;

                case "0": {

                    console.log("");
                    console.log("----------------------------------------");
                    console.log("             CONFIRM LOG OUT");
                    console.log("----------------------------------------");
                    console.log("");
                    console.log("LOG OUT -> 1");
                    console.log("CANCEL -> 2");
                    console.log("");

                    const logoutOption = (await this.rl.question("SELECT AN OPTION: ")).trim();

                    if (logoutOption === "1") {

                        loggedIn = false;

                    }
                    else if (logoutOption === "2") {

                        continue;

                    }
                    else {

                        console.log("");
                        console.log("INVALID OPTION");
                        console.log("");

                        continue;
                    }

                    break;
                }

                default:

                    console.log("");
                    console.log("INVALID OPTION");
                    console.log("");

                    continue;
            }

            if (nextAction === "logout") {
                loggedIn = false;
            }
        }

    }



    async readClientRegistrationData() {

        console.log("");
        console.log("CANCEL -> 0");
        console.log("");

        const firstNameInput = (await this.rl.question("FIRST NAME: ")).trim();

        if (firstNameInput === "0") {
            return null;
        }

        if (!/^[\p{L}][\p{L}\s'-]*$/u.test(firstNameInput)) {

            console.log("");
            console.log("INVALID NAME");
            console.log("");

            return null;
        }

        const firstName = firstNameInput.toUpperCase();

        const lastNameInput = (await this.rl.question("LAST NAME: ")).trim();

        if (lastNameInput === "0") {
            return null;
        }

        if (!/^[\p{L}][\p{L}\s'-]*$/u.test(lastNameInput)) {

            console.log("");
            console.log("INVALID NAME");
            console.log("");

            return null;
        }

        const lastName = lastNameInput.toUpperCase();

        let username;

        while (true) {

            const usernameInput = (await this.rl.question("USERNAME: ")).trim();

            if (usernameInput === "0") {
                return null;
            }

            if (!/^[a-zA-Z0-9._-]{3,30}$/.test(usernameInput)) {

                console.log("");
                console.log("INVALID USERNAME");
                console.log("USE 3-30 LETTERS, NUMBERS, '.', '_' OR '-'");
                console.log("");

                continue;
            }

            const usernameAvailable = await this.bankService.isUsernameAvailable(usernameInput);

            if (usernameAvailable) {
                username = usernameInput;
                break;
            }

            console.log("");
            console.log("USERNAME ALREADY IN USE");
            console.log("");

        }

        let email;

        while (true) {

            const emailInput = (await this.rl.question("EMAIL: ")).trim();

            if (emailInput === "0") {
                return null;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {

                console.log("");
                console.log("INVALID EMAIL FORMAT");
                console.log("");

                continue;
            }

            const emailAvailable = await this.bankService.isEmailAvailable(emailInput);

            if (emailAvailable) {
                email = emailInput;
                break;
            }

            console.log("");
            console.log("EMAIL ALREADY IN USE");
            console.log("");

        }

        let phone;

        while (true) {

            const phoneInput = (await this.rl.question("PHONE: ")).trim();

            if (phoneInput === "0") {
                return null;
            }

            if (/^\d{8,12}$/.test(phoneInput)) {
                phone = phoneInput;
                break;
            }

            console.log("");
            console.log("INVALID PHONE NUMBER");
            console.log("USE BETWEEN 8 AND 12 DIGITS");
            console.log("");

        }

        return {
            username,
            firstName,
            lastName,
            phone,
            email
        };
    }


    async registerClient() {

        console.log("");
        console.log("----------------------------------------");
        console.log("           REGISTER CLIENT");
        console.log("----------------------------------------");
        console.log("");

        const data = await this.readClientRegistrationData();

        
        if (!data) {

            console.log("");
            console.log("CLIENT REGISTRATION CANCELLED");
            console.log("");

            return await this.afterAction();
        }


        console.log("");
        console.log("----------------------------------------");
        console.log("           CLIENT INFORMATION");
        console.log("----------------------------------------");
        console.log("");
        console.log(`NAME: ${data.firstName} ${data.lastName}`);
        console.log(`USERNAME: ${data.username}`);
        console.log(`EMAIL: ${data.email}`);
        console.log(`PHONE: ${data.phone}`);
        console.log("");

        const confirmed = await this.confirmAction();

        
        if (!confirmed) {

            console.log("");
            console.log("CLIENT REGISTRATION CANCELLED");
            console.log("");

            return await this.afterAction();
        }

        
        const result = await this.bankService.registerClient(data);

        
        if (!result) {

            console.log("");
            console.log("CLIENT REGISTRATION FAILED");
            console.log("");

            return await this.afterAction();
        }

        console.log("");
        console.log("CLIENT REGISTERED SUCCESSFULLY");
        console.log("");
        console.log(`CLIENT ID: ${result.clientId}`);
        console.log(`ACCOUNT ID: ${result.accountId}`);
        console.log(`ACCOUNT NUMBER: ${result.accountNumber}`);
        console.log(`USERNAME: ${result.username}`);
        console.log(`TEMPORARY PASSWORD: ${result.password}`);
        console.log(`PASSKEY: ${result.passkey}`);
        console.log("");


        return await this.afterAction();

    }


    async searchClient() {

        while (true) {

            console.log("");
            console.log("----------------------------------------");
            console.log("             SEARCH CLIENT");
            console.log("----------------------------------------");
            console.log("");
            console.log("SEARCH BY ID -> 1");
            console.log("SEARCH BY USERNAME -> 2");
            console.log("SEARCH BY EMAIL -> 3");
            console.log("BACK -> 0");
            console.log("");



            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            let client = null;

            switch (option) {

                case "1": {

                    const id = await this.readPositiveInteger("CLIENT ID: ");
                    client = await this.bankService.searchClientById(id);

                    break;
                }

                case "2": {

                    const username = await this.readUsername("USERNAME: ");
                    client = await this.bankService.searchClientByUsername(username);

                    break;
                }

                case "3": {

                    const email = await this.readEmail("EMAIL: ");
                    client = await this.bankService.searchClientByEmail(email);

                    break;
                }

                case "0":

                    return "menu";

                default:

                    console.log("");
                    console.log("INVALID OPTION");
                    console.log("");

                    continue;
            }

            if (!client) {

                console.log("");
                console.log("CLIENT NOT FOUND");
                console.log("");

                return await this.afterAction();
            }

            console.log("");
            console.log("CLIENT FOUND");
            console.log("");
            console.log(`ID: ${client.id}`);
            console.log(`USERNAME: ${client.username}`);
            console.log(`NAME: ${client.firstName} ${client.lastName}`);
            console.log(`PHONE: ${client.phone}`);
            console.log(`EMAIL: ${client.email}`);
            console.log("");

            return await this.afterAction();

        }

    }


    async viewAccount() {

        while (true) {

            console.log("");
            console.log("----------------------------------------");
            console.log("              VIEW ACCOUNT");
            console.log("----------------------------------------");
            console.log("");
            console.log("SEARCH BY ACCOUNT NUMBER -> 1");
            console.log("SEARCH BY CLIENT ID -> 2");
            console.log("BACK -> 0");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            let account = null;

            if (option === "1") {

                const accountNumber = await this.readAccountNumber("ACCOUNT NUMBER: ");
                account = await this.bankService.getAccountByNumber(accountNumber);

            }
            else if (option === "2") {

                const clientId = await this.readPositiveInteger("CLIENT ID: ");
                account = await this.bankService.getAccountByClientId(clientId);

            }
            else if (option === "0") {
                return "menu";
            }
            else {

                console.log("");
                console.log("INVALID OPTION");
                console.log("");

                continue;
            }


            if (!account) {

                console.log("");
                console.log("ACCOUNT NOT FOUND");
                console.log("");

                return await this.afterAction();
            }


            const client = await this.bankService.searchClientById(account.clientId);


            console.log("");
            console.log("ACCOUNT FOUND");
            console.log("");
            console.log(`ACCOUNT ID: ${account.id}`);
            console.log(`CLIENT ID: ${account.clientId}`);

            if (client) {
                console.log(`ACCOUNT HOLDER: ${client.firstName} ${client.lastName}`);
            }

            console.log(`ACCOUNT NUMBER: ${account.accountNumber}`);
            console.log(`BALANCE: $${Number(account.balance).toFixed(2)}`);
            console.log("");

            return await this.afterAction();

        }

    }


    async deposit() {

        console.log("");
        console.log("----------------------------------------");
        console.log("                 DEPOSIT");
        console.log("----------------------------------------");
        console.log("");

        const accountNumber = await this.readAccountNumber("ACCOUNT NUMBER: ");
        const account = await this.bankService.getAccountByNumber(accountNumber);


        if (!account) {

            console.log("");
            console.log("ACCOUNT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }


        const amount = await this.readPositiveAmount("AMOUNT: $");
        const client = await this.bankService.searchClientById(account.clientId);


        console.log("");
        console.log("----------------------------------------");
        console.log("             DEPOSIT SUMMARY");
        console.log("----------------------------------------");
        console.log("");

        if (client) {
            console.log(`ACCOUNT HOLDER: ${client.firstName} ${client.lastName}`);
        }

        console.log(`ACCOUNT NUMBER: ${account.accountNumber}`);
        console.log(`AMOUNT: $${amount.toFixed(2)}`);
        console.log("");


        const confirmed = await this.confirmAction();


        if (!confirmed) {

            console.log("");
            console.log("DEPOSIT CANCELLED");
            console.log("");

            return await this.afterAction();
        }


        const result = await this.bankService.deposit(account, amount);


        if (!result) {

            console.log("");
            console.log("DEPOSIT FAILED");
            console.log("");

            return await this.afterAction();
        }


        console.log("");
        console.log("DEPOSIT COMPLETED SUCCESSFULLY");
        console.log("");
        console.log(`TRANSACTION ID: ${result.transactionId}`);
        console.log(`ACCOUNT ID: ${result.accountId}`);
        console.log(`AMOUNT: $${Number(result.amount).toFixed(2)}`);
        console.log(`DATE: ${result.currentDate}`);
        console.log("");

        return await this.afterAction();

    }


    async withdraw() {

        console.log("");
        console.log("----------------------------------------");
        console.log("                WITHDRAW");
        console.log("----------------------------------------");
        console.log("");

        const accountNumber = await this.readAccountNumber("ACCOUNT NUMBER: ");
        const amount = await this.readPositiveAmount("AMOUNT: $");
        const passKey = await this.readPasskey("PASSKEY: ");

        const validation = await this.bankService.validateWithdrawal(accountNumber, amount, passKey);


        if (!validation) {

            console.log("");
            console.log("WITHDRAWAL VALIDATION FAILED");
            console.log("CHECK ACCOUNT NUMBER, PASSKEY OR AVAILABLE BALANCE");
            console.log("");

            return await this.afterAction();
        }


        const account = validation.account;
        const client = validation.client;


        console.log("");
        console.log("----------------------------------------");
        console.log("            WITHDRAW SUMMARY");
        console.log("----------------------------------------");
        console.log("");
        console.log(`ACCOUNT HOLDER: ${client.firstName} ${client.lastName}`);
        console.log(`ACCOUNT NUMBER: ${account.accountNumber}`);
        console.log(`AMOUNT: $${amount.toFixed(2)}`);
        console.log("");


        const confirmed = await this.confirmAction();


        if (!confirmed) {

            console.log("");
            console.log("WITHDRAWAL CANCELLED");
            console.log("");

            return await this.afterAction();
        }


        const result = await this.bankService.withdraw(accountNumber, amount, passKey);


        if (!result) {

            console.log("");
            console.log("WITHDRAWAL FAILED");
            console.log("CHECK ACCOUNT NUMBER, PASSKEY OR AVAILABLE BALANCE");
            console.log("");

            return await this.afterAction();
        }


        console.log("");
        console.log("WITHDRAWAL COMPLETED SUCCESSFULLY");
        console.log("");
        console.log(`TRANSACTION ID: ${result.transactionId}`);
        console.log(`ACCOUNT ID: ${result.accountId}`);
        console.log(`AMOUNT: $${Number(result.amount).toFixed(2)}`);
        console.log(`DATE: ${result.currentDate}`);
        console.log("");

        return await this.afterAction();

    }


    async transfer() {

        console.log("");
        console.log("----------------------------------------");
        console.log("                TRANSFER");
        console.log("----------------------------------------");
        console.log("");

        const sourceAccountNumber = await this.readAccountNumber("SOURCE ACCOUNT NUMBER: ");
        const sourceAccount = await this.bankService.getAccountByNumber(sourceAccountNumber);

        if (!sourceAccount) {

            console.log("");
            console.log("SOURCE ACCOUNT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }

        console.log("");
        console.log("CANCEL -> 0");
        console.log("");

        const passKey = await this.readPasskey("PASSKEY: ");

        if (!passKey) {

            console.log("");
            console.log("TRANSFER CANCELLED");
            console.log("");

            return await this.afterAction();
        }

        const sourceClient = await this.bankService.searchClientById(sourceAccount.clientId);

        if (!sourceClient) {

            console.log("");
            console.log("SOURCE CLIENT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }

        const validPasskey = await this.bankService.verifyPasskey(passKey, sourceClient.passkey);

        if (!validPasskey) {

            console.log("");
            console.log("SOURCE ACCOUNT VALIDATION FAILED");
            console.log("CHECK ACCOUNT NUMBER OR PASSKEY");
            console.log("");

            return await this.afterAction();
        }

        console.log("");
        console.log("SOURCE ACCOUNT CONFIRMED");
        console.log("");
        console.log(`ACCOUNT HOLDER: ${sourceClient.firstName} ${sourceClient.lastName}`);
        console.log(`ACCOUNT NUMBER: ${sourceAccount.accountNumber}`);
        console.log("");

        const destinationAccountNumber = await this.readAccountNumber("DESTINATION ACCOUNT NUMBER: ");

        if (sourceAccountNumber === destinationAccountNumber) {

            console.log("");
            console.log("SOURCE AND DESTINATION ACCOUNTS CANNOT BE THE SAME");
            console.log("");

            return await this.afterAction();
        }

        const destinationAccount = await this.bankService.getAccountByNumber(destinationAccountNumber);

        if (!destinationAccount) {

            console.log("");
            console.log("DESTINATION ACCOUNT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }

        const destinationClient = await this.bankService.searchClientById(destinationAccount.clientId);

        if (!destinationClient) {

            console.log("");
            console.log("DESTINATION CLIENT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }

        while (true) {

            console.log("");
            console.log("----------------------------------------");
            console.log("       CONFIRM DESTINATION ACCOUNT");
            console.log("----------------------------------------");
            console.log("");
            console.log(`ACCOUNT HOLDER: ${destinationClient.firstName} ${destinationClient.lastName}`);
            console.log(`ACCOUNT NUMBER: ${destinationAccount.accountNumber}`);
            console.log("");
            console.log("CORRECT ACCOUNT -> 1");
            console.log("CANCEL -> 2");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            if (option === "1") {
                break;
            }

            if (option === "2") {

                console.log("");
                console.log("TRANSFER CANCELLED");
                console.log("");

                return await this.afterAction();
            }

            console.log("");
            console.log("INVALID OPTION");
            console.log("");

        }

        const amount = await this.readPositiveAmount("AMOUNT: $");
        const concept = await this.readConcept("CONCEPT: ");

        console.log("");
        console.log("----------------------------------------");
        console.log("             TRANSFER SUMMARY");
        console.log("----------------------------------------");
        console.log("");
        console.log(`FROM: ${sourceClient.firstName} ${sourceClient.lastName}`);
        console.log(`SOURCE ACCOUNT: ${sourceAccount.accountNumber}`);
        console.log(`TO: ${destinationClient.firstName} ${destinationClient.lastName}`);
        console.log(`DESTINATION ACCOUNT: ${destinationAccount.accountNumber}`);
        console.log(`AMOUNT: $${amount.toFixed(2)}`);
        console.log(`CONCEPT: ${concept}`);
        console.log("");

        const confirmed = await this.confirmAction();

        if (!confirmed) {

            console.log("");
            console.log("TRANSFER CANCELLED");
            console.log("");

            return await this.afterAction();
        }

        const result = await this.bankService.transfer(sourceAccountNumber, destinationAccountNumber, amount, concept, passKey);

        if (!result) {

            console.log("");
            console.log("TRANSFER FAILED");
            console.log("CHECK ACCOUNTS, PASSKEY OR AVAILABLE BALANCE");
            console.log("");

            return await this.afterAction();
        }

        console.log("");
        console.log("TRANSFER COMPLETED SUCCESSFULLY");
        console.log("");
        console.log(`TRANSFER ID: ${result.transferId}`);
        console.log(`SOURCE TRANSACTION ID: ${result.sourceTransactionId}`);
        console.log(`DESTINATION TRANSACTION ID: ${result.destinationTransactionId}`);
        console.log(`FROM: ${sourceClient.firstName} ${sourceClient.lastName}`);
        console.log(`SOURCE ACCOUNT: ${result.sourceAccountNumber}`);
        console.log(`TO: ${destinationClient.firstName} ${destinationClient.lastName}`);
        console.log(`DESTINATION ACCOUNT: ${result.destinationAccountNumber}`);
        console.log(`AMOUNT: $${Number(result.amount).toFixed(2)}`);
        console.log(`CONCEPT: ${result.concept}`);
        console.log(`DATE: ${result.currentDate}`);
        console.log("");

        return await this.afterAction();
    }


    async viewTransactionHistory() {

        console.log("");
        console.log("----------------------------------------");
        console.log("          TRANSACTION HISTORY");
        console.log("----------------------------------------");
        console.log("");

        const accountNumber = await this.readAccountNumber("ACCOUNT NUMBER: ");
        const account = await this.bankService.getAccountByNumber(accountNumber);

        if (!account) {

            console.log("");
            console.log("ACCOUNT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }

        const client = await this.bankService.searchClientById(account.clientId);

        if (!client) {

            console.log("");
            console.log("CLIENT NOT FOUND");
            console.log("");

            return await this.afterAction();
        }

        console.log("");
        console.log("----------------------------------------");
        console.log("           CONFIRM ACCOUNT");
        console.log("----------------------------------------");
        console.log("");
        console.log(`ACCOUNT HOLDER: ${client.firstName} ${client.lastName}`);
        console.log(`ACCOUNT NUMBER: ${account.accountNumber}`);
        console.log("");

        const confirmed = await this.confirmAction();

        if (!confirmed) {

            console.log("");
            console.log("TRANSACTION HISTORY CANCELLED");
            console.log("");

            return await this.afterAction();
        }

        const history = await this.bankService.getTransactionHistory(accountNumber);

        if (!history) {

            console.log("");
            console.log("TRANSACTION HISTORY COULD NOT BE RETRIEVED");
            console.log("");

            return await this.afterAction();
        }

        if (history.length === 0) {

            console.log("");
            console.log("NO TRANSACTIONS FOUND");
            console.log("");

            return await this.afterAction();
        }

        console.log("");
        console.log("----------------------------------------");
        console.log("          TRANSACTION HISTORY");
        console.log("----------------------------------------");
        console.log("");
        console.log(`ACCOUNT HOLDER: ${client.firstName} ${client.lastName}`);
        console.log(`ACCOUNT NUMBER: ${account.accountNumber}`);
        console.log("----------------------------------------");

        for (const transaction of history) {

            console.log("");
            console.log(`TRANSACTION ID: ${transaction.transactionId}`);
            console.log(`TYPE: ${transaction.type}`);
            console.log(`AMOUNT: $${Number(transaction.amount).toFixed(2)}`);

            if (transaction.transferId) {

                console.log(`TRANSFER ID: ${transaction.transferId}`);
                console.log(`FROM: ${transaction.sourceAccountNumber}`);
                console.log(`DESTINATION: ${transaction.destinationAccountNumber}`);
                console.log(`CONCEPT: ${transaction.concept}`);

            }

            console.log(`DATE: ${transaction.date}`);
            console.log("----------------------------------------");

        }

        console.log("");

        return await this.afterAction();
    }


}


module.exports = ConsoleUI;