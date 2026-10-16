


const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");


class ConsoleUI {


    constructor(bankService) {

        this.bankService = bankService;
        this.rl = readline.createInterface({input, output});

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

            const option = await this.rl.question("SELECT AN OPTION: ");

            switch (option) {

                case "1":
                    await this.login();
                    break;

                case "0":
                    running = false;
                    break;

                default:
                    console.log("INVALID OPTION");
                    console.log("");
            }
        }

        this.rl.close();
    }


    async login() {

        console.log("");
        console.log("----------------------------------------");
        console.log("              EMPLOYEE LOGIN");
        console.log("----------------------------------------");
        console.log("");

        const username = await this.rl.question("USERNAME: ");
        const password = await this.rl.question("PASSWORD: ");

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
            console.log(`EMPLOYEE: ${employee.first_name} ${employee.last_name}`);

            console.log(`EMPLOYEE NO: ${employee.employee_number}`);
            console.log("");
            console.log("----------------------------------------");
            console.log("");
            console.log("1. REGISTER CLIENT");
            console.log("2. SEARCH CLIENT");
            console.log("3. VIEW ACCOUNT");
            console.log("");
            console.log("0. LOG OUT");
            console.log("");

            const option = await this.rl.question("SELECT AN OPTION: ");

            switch (option) {

                case "1":
                    await this.registerClient();
                    break;

                case "2":
                    await this.searchClient();
                    break;

                case "3":
                    await this.viewAccount();
                    break;

                case "0":
                    loggedIn = false;
                    break;

                default:
                    console.log("INVALID OPTION");
                    console.log("");

            }

        }
    }


    async registerClient() {

        console.log("");
        console.log("----------------------------------------");
        console.log("           REGISTER CLIENT");
        console.log("----------------------------------------");
        console.log("");


        let username;

        while (true) {

            username = await this.rl.question("USERNAME: ");
            const usernameAvailable = await this.bankService.isUsernameAvailable(username);

            if (usernameAvailable) {
                break;
            }

            console.log("USERNAME ALREADY IN USE");

        }


        let email;

        while (true) {

            email = await this.rl.question("EMAIL: ");
            const emailAvailable = await this.bankService.isEmailAvailable(email);

            if (emailAvailable) {
                break;
            }

            console.log("EMAIL ALREADY IN USE");

        }


        const firstName = await this.rl.question("FIRST NAME: ");
        const lastName = await this.rl.question("LAST NAME: ");
        const phone = await this.rl.question("PHONE: ");


        const data = {
            username,
            firstName,
            lastName,
            phone,
            email
        };


        const result = await this.bankService.registerClient(data);


        if (!result) {
            console.log("");
            console.log("CLIENT REGISTRATION FAILED");
            console.log("");
            return;
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


    }


    async searchClient() {

        console.log("");
        console.log("----------------------------------------");
        console.log("             SEARCH CLIENT");
        console.log("----------------------------------------");
        console.log("");
        console.log("1. SEARCH BY ID");
        console.log("2. SEARCH BY USERNAME");
        console.log("3. SEARCH BY EMAIL");
        console.log("");
        console.log("0. BACK");
        console.log("");

        const option = await this.rl.question("SELECT AN OPTION: ");


        let client = null;

        switch (option) {

            case "1": {

                const id = await this.rl.question("CLIENT ID: ");
                client = await this.bankService.searchClientById(id);
                break;

            }


            case "2": {
                const username = await this.rl.question("USERNAME: ");
                client = await this.bankService.searchClientByUsername(username);
                break;
            }


            case "3": {
                const email = await this.rl.question("EMAIL: ");
                client = await this.bankService.searchClientByEmail(email);
                break;
            }


            case "0":
                return;


            default:
                console.log("INVALID OPTION");
                return;
            
        }


        if (!client) {

            console.log("");
            console.log("CLIENT NOT FOUND");
            console.log("");
            return;
        }


        console.log("");
        console.log("CLIENT FOUND");
        console.log("");
        console.log(`ID: ${client.id}`);
        console.log(`USERNAME: ${client.username}`);
        console.log(`NAME: ${client.first_name} ${client.last_name}`);
        console.log(`PHONE: ${client.phone}`);
        console.log(`EMAIL: ${client.email}`);
        console.log("");

    }


    async viewAccount() {

        console.log("");
        console.log("----------------------------------------");
        console.log("              VIEW ACCOUNT");
        console.log("----------------------------------------");
        console.log("");
        console.log("SEARCH BY ACCOUNT NUMBER -> 1");
        console.log("SEARCH BY CLIENT ID -> 2");
        console.log("BACK -> 0");
        console.log("");

        const option = await this.rl.question("SELECT AN OPTION: ");


        let account = null;

        switch (option) {

            case "1": {
                const accountNumber = await this.rl.question("ACCOUNT NUMBER: ");
                account = await this.bankService.getAccountByNumber(accountNumber);
                break;

            }


            case "2": {
                const clientId = await this.rl.question("CLIENT ID: ");
                account = await this.bankService.getAccountByClientId(clientId);
                break;
            }


            case "0":
                return;


            default:
                console.log("INVALID OPTION");
                return;
            
        }


        if (!account) {

            console.log("");
            console.log("ACCOUNT NOT FOUND");
            console.log("");
            return;
        }


        console.log("");
        console.log("ACCOUNT FOUND");
        console.log("");
        console.log(`ACCOUNT ID: ${account.id}`);
        console.log(`CLIENT ID: ${account.client_id}`);
        console.log(`ACCOUNT NUMBER: ${account.account_number}`);
        console.log(`BALANCE: $${account.balance}`);
        console.log("");


    }

}


module.exports = ConsoleUI;