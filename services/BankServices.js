

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const Client = require("../models/Client");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Transfer = require("../models/Transfer");



class BankService {


    constructor(repository) {
        this.repository = repository;
    }


    getCurrentDateTime() {

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    }



    async isUsernameAvailable(username) {

        const existingClient = await this.repository.findClientByUsername(username);
        const existingEmployee = await this.repository.findEmployeeByUsername(username);
        if (existingClient || existingEmployee) {
            return false;
        }

        return true;
    }

    async isEmailAvailable(email) {

        const existingClient = await this.repository.findClientByEmail(email);
        const existingEmployee = await this.repository.findEmployeeByEmail(email);
        if (existingClient || existingEmployee) {
            return false;
        }

        return true;
    }


    generatePassword() {

        return crypto.randomBytes(9).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);

    }

    generatePasskey() {

        return crypto.randomInt(100000, 1000000).toString();
    }


    async verifyPasskey(plainPasskey, hashedPasskey) {

        if (!plainPasskey || !hashedPasskey) {
            return false;
        }

        return await bcrypt.compare(plainPasskey, hashedPasskey);
    }


    async validateWithdrawal(accountNumber, amount, passKey) {

        if (!accountNumber || amount == null || !passKey) {
            return null;
        }

        if (amount <= 0) {
            return null;
        }

        const account = await this.getAccountByNumber(accountNumber);

        if (!account) {
            return null;
        }

        const client = await this.searchClientById(account.clientId);

        if (!client) {
            return null;
        }

        const validPasskey = await this.verifyPasskey(passKey, client.passkey);

        if (!validPasskey) {
            return null;
        }

        if (Number(account.balance) < Number(amount)) {
            return null;
        }

        return {
            account,
            client
        };
    }


    async generateAccountNumber() {

        let accountNumber;
        let existingAccount;

        do {
            accountNumber = String(crypto.randomInt(1000000000, 10000000000));

            existingAccount = await this.repository.findAccountByNumber(accountNumber);

        } while (existingAccount);

        return accountNumber;

    }

    async generateEmployeeNumber() {

        let employeeNumber;
        let existingEmployee;

        do {
            employeeNumber = crypto.randomInt(10000000, 100000000);
            existingEmployee = await this.repository.findEmployeeByNumber(employeeNumber);

        } while (existingEmployee);

        return employeeNumber;
    }



    createEmployeeObject(data, password, employeeNumber) {

        return new Employee(
            null,
            data.username,
            password,
            data.firstName,
            data.lastName,
            data.phone,
            data.email,
            employeeNumber,
            data.position
        );

    }

    createClientObject(data, password, passkey) {

        return new Client(
            null,
            data.username,
            password,
            data.firstName,
            data.lastName,
            data.phone,
            data.email,
            passkey
        );
    }

    async createAccountObject(clientId) {

        const accountNumber = await this.generateAccountNumber();

        return new Account(
            null,
            clientId,
            accountNumber,
            0.00
        );

    }


    async loginEmployee(username, password) {

        if (!username || !password) {
            return null;
        }

        const employee = await this.repository.findEmployeeByUsername(username);
        if (!employee) {
            return null;
        }

        const validPassword = await bcrypt.compare(password, employee.password);
        if (!validPassword) {
            return null;
        }

        return employee;

    }


    async registerEmployee(data) {

        const usernameAvailable = await this.isUsernameAvailable(data.username);
        if (!usernameAvailable) {
            return null;
        }

        const emailAvailable = await this.isEmailAvailable(data.email);
        if (!emailAvailable) {
            return null;
        }


        const plainPassword = this.generatePassword();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const employeeNumber = await this.generateEmployeeNumber();


        const employee = this.createEmployeeObject(data, hashedPassword, employeeNumber);
        if (!employee) {
            return null;
        }

        const employeeId = await this.repository.insertEmployee(employee);
        if (!employeeId) {
            return null;
        }


        return {
            plainPassword,
            employeeNumber,
            username: data.username,
            position: data.position
        };


    }


    async registerClient(data) {

        const usernameAvailable = await this.isUsernameAvailable(data.username);
        if (!usernameAvailable) {
            return null;
        }

        const emailAvailable = await this.isEmailAvailable(data.email);
        if (!emailAvailable) {
            return null;
        }


        const plainPassword = this.generatePassword();
        const plainPasskey = this.generatePasskey();

        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const hashedPasskey = await bcrypt.hash(plainPasskey, 10);

        
        const client = this.createClientObject(data, hashedPassword, hashedPasskey);
        const clientId = await this.repository.insertClient(client);

        if (!clientId) {
            return null;
        }


        const account = await this.createAccountObject(clientId);
        const accountId = await this.repository.insertAccount(account);

        if (!accountId) {
            return null;
        }

        return {
            clientId,
            accountId,
            accountNumber: account.accountNumber,
            username: data.username,
            password: plainPassword,
            passkey: plainPasskey
        };

    }


    createTransactionObject(data, currentDate) {

        return new Transaction(
            null,
            data.accountId, 
            data.type, 
            data.amount, 
            currentDate
        );

    }


    async registerTransaction(data) {

        if (!data.accountId || !data.type || data.amount == null) {
            return null;
        }

        if (data.amount <= 0.00) {
            return null;
        }


        const currentDate = this.getCurrentDateTime();

        const transaction = this.createTransactionObject(data, currentDate);


        const transactionId = await this.repository.insertTransaction(transaction);
        if (!transactionId) {
            return null;
        }


        return {
            transactionId,
            accountId: data.accountId,
            amount: data.amount, 
            currentDate, 
            type: data.type
        }

    }





    async searchClientById(id) {

        if (!id) {
            return null;
        }

        return await this.repository.findClientById(id);
    }

    async searchClientByUsername(username) {

        if (!username) {
            return null;
        }

        return await this.repository.findClientByUsername(username);
    }

    async searchClientByEmail(email) {

        if (!email) {
            return null;
        }

        return await this.repository.findClientByEmail(email);
        
    }

    async getAccountByNumber(accountNumber) {

        if (!accountNumber) {
            return null;
        }

        return await this.repository.findAccountByNumber(accountNumber);
    }

    async getAccountByClientId(clientId) {

        if (!clientId) {
            return null;
        }

        return await this.repository.findAccountByClientId(clientId);
    }




    async updateAccountBalance(accountId, newBalance) {

        if (!accountId || newBalance == null) {
            return null;
        }

        return await this.repository.updateAccountBalance(accountId, newBalance);

    }

    async deposit(account, amount) {

        if (!account || amount == null) {
            return null;
        }

        amount = Number(amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return null;
        }

        account.balance = Number(account.balance) + amount;

        const currentDate = this.getCurrentDateTime();

        const transaction = new Transaction(
            null,
            account.id,
            "DEPOSIT",
            amount,
            currentDate
        );

        const transactionId = await this.repository.performDepositTransaction(
            account,
            transaction
        );

        return {
            transactionId,
            accountId: account.id,
            amount,
            currentDate
        };
    }



    async withdraw(accountNumber, amount, passKey) {

        if (!accountNumber || amount == null || !passKey) {
            return null;
        }

        amount = Number(amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return null;
        }

        const account = await this.getAccountByNumber(accountNumber);

        if (!account) {
            return null;
        }

        const client = await this.searchClientById(account.clientId);

        if (!client) {
            return null;
        }


        const validPasskey = await this.verifyPasskey(passKey, client.passkey);

        if (!validPasskey) {
            return null;
        }


        if (Number(account.balance) < amount) {
            return null;
        }

        account.balance = Number(account.balance) - amount;


        const currentDate = this.getCurrentDateTime();


        const transaction = new Transaction(
            null,
            account.id,
            "WITHDRAW",
            amount,
            currentDate
        );


        const transactionId = await this.repository.performWithdrawalTransaction(account, transaction);


        return {
            transactionId,
            accountId: account.id,
            amount,
            currentDate
        };

    }



    async transfer(sourceAccountNumber, destinationAccountNumber, amount, concept, passKey) {

        if (!sourceAccountNumber || !destinationAccountNumber || amount == null || !concept || !passKey) {
            return null;
        }

        if (sourceAccountNumber === destinationAccountNumber) {
            return null;
        }


        amount = Number(amount);


        if (!Number.isFinite(amount) || amount <= 0) {
            return null;
        }

        concept = concept.trim();


        if (concept.length === 0 || concept.length > 200) {
            return null;
        }


        const sourceAccount = await this.getAccountByNumber(sourceAccountNumber);
        const destinationAccount = await this.getAccountByNumber(destinationAccountNumber);


        if (!sourceAccount || !destinationAccount) {
            return null;
        }

        const sourceClient = await this.searchClientById(sourceAccount.clientId);

        if (!sourceClient) {
            return null;
        }

        const validPasskey = await this.verifyPasskey(passKey, sourceClient.passkey);

        if (!validPasskey) {
            return null;
        }

        if (Number(sourceAccount.balance) < amount) {
            return null;
        }


        sourceAccount.balance = Number(sourceAccount.balance) - amount;
        destinationAccount.balance = Number(destinationAccount.balance) + amount;


        const currentDate = this.getCurrentDateTime();

        const transfer = new Transfer(null, sourceAccount.id, destinationAccount.id, amount, concept, currentDate);

        const sourceTransaction = new Transaction(null, sourceAccount.id, "TRANSFER_OUT", amount, currentDate);
        const destinationTransaction = new Transaction(null, destinationAccount.id, "TRANSFER_IN", amount, currentDate);


        const result = await this.repository.performTransferTransaction(sourceAccount, destinationAccount, sourceTransaction, destinationTransaction, transfer);

        
        return {
            transferId: result.transferId,
            sourceTransactionId: result.sourceTransactionId,
            destinationTransactionId: result.destinationTransactionId,
            sourceAccountNumber,
            destinationAccountNumber,
            amount,
            concept,
            currentDate
        };

    }


    async getTransactionHistory(accountNumber) {

        if (!accountNumber) {
            return null;
        }

        const account = await this.getAccountByNumber(accountNumber);

        if (!account) {
            return null;
        }


        const transactions = await this.repository.findTransactionsByAccountId(account.id);

        const history = [];

        for (const transaction of transactions) {

            if (!transaction.transferId) {

                history.push({
                    transactionId: transaction.id,
                    transferId: null,
                    type: transaction.type,
                    amount: transaction.amount,
                    sourceAccountNumber: null,
                    destinationAccountNumber: null,
                    concept: null,
                    date: transaction.date
                });

                continue;
            }

            const transfer = await this.repository.findTransferById(transaction.transferId);


            if (!transfer) {

                history.push({
                    transactionId: transaction.id,
                    transferId: transaction.transferId,
                    type: transaction.type,
                    amount: transaction.amount,
                    sourceAccountNumber: null,
                    destinationAccountNumber: null,
                    concept: null,
                    date: transaction.date
                });

                continue;
            }

            const sourceAccount = await this.repository.findAccountById(transfer.sourceAccountId);
            const destinationAccount = await this.repository.findAccountById(transfer.destinationAccountId);

            history.push({
                transactionId: transaction.id,
                transferId: transfer.id,
                type: transaction.type,
                amount: transaction.amount,
                sourceAccountNumber: sourceAccount ? sourceAccount.accountNumber : null,
                destinationAccountNumber: destinationAccount ? destinationAccount.accountNumber : null,
                concept: transfer.concept,
                date: transaction.date
            });

        }

        return history;
    }




}


module.exports = BankService;


