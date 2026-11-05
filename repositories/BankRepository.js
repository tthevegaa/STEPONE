
const Employee = require("../models/Employee");
const Client = require("../models/Client");
const Account = require("../models/Account");




class BankRepository {


    constructor(pool) {
        this.pool = pool;
    }



    async insertEmployee(employee) {

        const [result] = await this.pool.execute(`INSERT INTO employees (username, password, first_name,
            last_name, phone, email, employee_number, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [employee.username, employee.password, employee.firstName, employee.lastName, employee.phone, 
            employee.email, employee.employeeNumber, employee.position]);
        
        return result.insertId;
    }

    async insertAccount(account) {

        const [result] = await this.pool.execute(`INSERT INTO accounts (client_id, account_number, balance) VALUES (?, ?, ?)`,
            [account.clientId, account.accountNumber, account.balance]);

        return result.insertId;
    }

    async insertClient(client) {

        const [result] = await this.pool.execute(`INSERT INTO clients (username, password, first_name, last_name, phone, email, passkey) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [client.username, client.password, client.firstName,
            client.lastName, client.phone, client.email, client.passkey]);
        
        return result.insertId;

    }

    async insertTransaction(transaction) {

        const [result] = await this.pool.execute(`INSERT INTO transactions (account_id, type, amount, date) 
            VALUES (?, ?, ?, ?)`, [transaction.accountId, transaction.type, transaction.amount, transaction.date]);
        
        return result.insertId;
    }




    async findEmployeeByNumber(employeeNumber) {

        const [rows] = await this.pool.execute(
            `SELECT * FROM employees WHERE employee_number = ?`, [employeeNumber]
        );

        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];

        return new Employee(
            row.id,
            row.username,
            row.password,
            row.first_name,
            row.last_name,
            row.phone,
            row.email,
            row.employee_number,
            row.position
        );
    }


    async findEmployeeByUsername(username) {

        const [rows] = await this.pool.execute(
            `SELECT * FROM employees WHERE username = ?`, [username]
        );

        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];


        return new Employee(
            row.id,
            row.username,
            row.password,
            row.first_name,
            row.last_name,
            row.phone,
            row.email,
            row.employee_number,
            row.position
        );

    }


    async findEmployeeByEmail(email) {

        const [rows] = await this.pool.execute(
            `SELECT * FROM employees WHERE email = ?`, [email]
        );

        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];

        return new Employee(
            row.id,
            row.username,
            row.password,
            row.first_name,
            row.last_name,
            row.phone,
            row.email,
            row.employee_number,
            row.position
        );

    }


    async findClientById(id) {

        const [rows] = await this.pool.execute(
            `SELECT * FROM clients WHERE id = ?`, [id]
        );

        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];

        return new Client(
            row.id,
            row.username,
            row.password,
            row.first_name,
            row.last_name,
            row.phone,
            row.email,
            row.passkey
        );

    }


    async findClientByUsername(username) {


        const [rows] = await this.pool.execute(`SELECT * FROM clients WHERE username = ?`, [username]);

        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];

        return new Client(
            row.id,
            row.username,
            row.password,
            row.first_name,
            row.last_name,
            row.phone,
            row.email,
            row.passkey
        );

    }


    async findClientByEmail(email) {

        const [rows] = await this.pool.execute(`SELECT * FROM clients WHERE email = ?`, [email]);


        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];


        return new Client(
            row.id,
            row.username,
            row.password,
            row.first_name,
            row.last_name,
            row.phone,
            row.email,
            row.passkey
        );

    }


    async findAccountByNumber(accountNumber) {

        const [rows] = await this.pool.execute(`SELECT * FROM accounts WHERE account_number = ?`, [accountNumber]);

        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];

        return new Account(
            row.id,
            row.client_id,
            row.account_number,
            row.balance
        );


    }


    async findAccountByClientId(clientId) {

        const [rows] = await this.pool.execute(`SELECT * FROM accounts WHERE client_id = ?`, [clientId]);


        if (rows.length === 0) {
            return null;
        }


        const row = rows[0];

        return new Account(
            row.id,
            row.client_id,
            row.account_number,
            row.balance
        );

    }




    async updateAccountBalance(accountId, newBalance) {

        const [result] = await this.pool.execute(`UPDATE accounts SET balance = ? WHERE id = ?;`, [newBalance, accountId]);
        return result.affectedRows > 0;
    }





}



module.exports = BankRepository;




