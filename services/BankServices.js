

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const Client = require("../models/Client");
const Account = require("../models/Account");


class BankService {


    constructor(repository) {
        this.repository = repository;
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



}


module.exports = BankService;