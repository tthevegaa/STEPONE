
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");


class ConsoleUI {


    constructor(bankService) {

        this.bankService = bankService;
        this.rl = readline.createInterface({ input, output });

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

            if (/^\d{6}$/.test(passKey)) {
                return passKey;
            }

            console.log("");
            console.log("INVALID PASSKEY");
            console.log("PASSKEY MUST CONTAIN 6 DIGITS");
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
            console.log("LOG OUT -> 0");
            console.log("");

            const option = (await this.rl.question("SELECT AN OPTION: ")).trim();

            let nextAction = null;

            if (option === "1") {
                nextAction = await this.registerClient();
            }
            else if (option === "2") {
                nextAction = await this.searchClient();
            }
            else if (option === "3") {
                nextAction = await this.viewAccount();
            }
            else if (option === "4") {
                nextAction = await this.deposit();
            }
            else if (option === "5") {
                nextAction = await this.withdraw();
            }
            else if (option === "0") {
                loggedIn = false;
                continue;
            }
            else {

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


    async registerClient() {

        console.log("");
        console.log("----------------------------------------");
        console.log("           REGISTER CLIENT");
        console.log("----------------------------------------");
        console.log("");

        const firstName = (await this.readName("FIRST NAME: ")).toUpperCase();
        const lastName = (await this.readName("LAST NAME: ")).toUpperCase();


        let username;

        while (true) {

            username = await this.readUsername("USERNAME: ");

            const usernameAvailable = await this.bankService.isUsernameAvailable(username);

            if (usernameAvailable) {
                break;
            }

            console.log("");
            console.log("USERNAME ALREADY IN USE");
            console.log("");

        }


        let email;

        while (true) {

            email = await this.readEmail("EMAIL: ");

            const emailAvailable = await this.bankService.isEmailAvailable(email);

            if (emailAvailable) {
                break;
            }

            console.log("");
            console.log("EMAIL ALREADY IN USE");
            console.log("");

        }


        const phone = await this.readPhone("PHONE: ");


        const data = {
            username,
            firstName,
            lastName,
            phone,
            email
        };


        console.log("");
        console.log("----------------------------------------");
        console.log("           CLIENT INFORMATION");
        console.log("----------------------------------------");
        console.log("");
        console.log(`NAME: ${firstName} ${lastName}`);
        console.log(`USERNAME: ${username}`);
        console.log(`EMAIL: ${email}`);
        console.log(`PHONE: ${phone}`);
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

            if (option === "1") {

                const id = await this.readPositiveInteger("CLIENT ID: ");
                client = await this.bankService.searchClientById(id);

            }
            else if (option === "2") {

                const username = await this.readUsername("USERNAME: ");
                client = await this.bankService.searchClientByUsername(username);

            }
            else if (option === "3") {

                const email = await this.readEmail("EMAIL: ");
                client = await this.bankService.searchClientByEmail(email);

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


}


module.exports = ConsoleUI;