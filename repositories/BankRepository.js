
const Employee = require("../models/Employee");
const Client = require("../models/Client");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Transfer = require("../models/Transfer");




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

    async insertTransfer(transfer) {

        const [result] = await this.pool.execute(`INSERT INTO transfers (source_account_id, destination_account_id, amount, concept, date) VALUES (?, ?, ?, ?, ?)`, [transfer.sourceAccountId, transfer.destinationAccountId, transfer.amount, transfer.concept, transfer.date]);

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

    async findAccountById(accountId) {

        const [rows] = await this.pool.execute(`SELECT * FROM accounts WHERE id = ?`, [accountId]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Account(row.id, row.client_id, row.account_number, row.balance);
    }


    async findTransactionsByAccountId(accountId) {

        const [rows] = await this.pool.execute(`SELECT * FROM transactions WHERE account_id = ? ORDER BY date DESC`, [accountId]);

        return rows.map(row => new Transaction(row.id, row.account_id, row.type, row.amount, row.date, row.transfer_id));
    }


    async findTransfersByAccountId(accountId) {

        const [rows] = await this.pool.execute(`SELECT * FROM transfers WHERE source_account_id = ? OR destination_account_id = ? ORDER BY date DESC`, [accountId, accountId]);

        return rows.map(row => new Transfer(row.id, row.source_account_id, row.destination_account_id, row.amount, row.concept, row.date));
    }

    async findTransferById(transferId) {

        const [rows] = await this.pool.execute(`SELECT * FROM transfers WHERE id = ?`, [transferId]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Transfer(row.id, row.source_account_id, row.destination_account_id, row.amount, row.concept, row.date);
    }




    async updateAccountBalance(accountId, newBalance) {

        const [result] = await this.pool.execute(`UPDATE accounts SET balance = ? WHERE id = ?;`, [newBalance, accountId]);
        return result.affectedRows > 0;
    }




    async performTransferTransaction(sourceAccount, destinationAccount, sourceTransaction, destinationTransaction, transfer) {

        const connection = await this.pool.getConnection();

        try {

            await connection.beginTransaction();

            const [sourceUpdate] = await connection.execute(`UPDATE accounts SET balance = ? WHERE id = ?`, [sourceAccount.balance, sourceAccount.id]);

            if (sourceUpdate.affectedRows === 0) {
                throw new Error("SOURCE ACCOUNT COULD NOT BE UPDATED");
            }

            const [destinationUpdate] = await connection.execute(`UPDATE accounts SET balance = ? WHERE id = ?`, [destinationAccount.balance, destinationAccount.id]);

            if (destinationUpdate.affectedRows === 0) {
                throw new Error("DESTINATION ACCOUNT COULD NOT BE UPDATED");
            }

            const [transferResult] = await connection.execute(`INSERT INTO transfers (source_account_id, destination_account_id, amount, concept, date) VALUES (?, ?, ?, ?, ?)`, [transfer.sourceAccountId, transfer.destinationAccountId, transfer.amount, transfer.concept, transfer.date]);

            const transferId = transferResult.insertId;

            const [sourceTransactionResult] = await connection.execute(`INSERT INTO transactions (account_id, type, amount, date, transfer_id) VALUES (?, ?, ?, ?, ?)`, [sourceTransaction.accountId, sourceTransaction.type, sourceTransaction.amount, sourceTransaction.date, transferId]);

            const [destinationTransactionResult] = await connection.execute(`INSERT INTO transactions (account_id, type, amount, date, transfer_id) VALUES (?, ?, ?, ?, ?)`, [destinationTransaction.accountId, destinationTransaction.type, destinationTransaction.amount, destinationTransaction.date, transferId]);

            await connection.commit();

            return {
                transferId,
                sourceTransactionId: sourceTransactionResult.insertId,
                destinationTransactionId: destinationTransactionResult.insertId
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }

    }



    async performDepositTransaction(account, transaction) {

        const connection = await this.pool.getConnection();

        try {

            await connection.beginTransaction();

            const [accountUpdate] = await connection.execute(`UPDATE accounts SET balance = ? WHERE id = ?`,[account.balance, account.id]);


            if (accountUpdate.affectedRows === 0) {
                throw new Error("ACCOUNT COULD NOT BE UPDATED");
            }


            const [transactionResult] = await connection.execute(
                `INSERT INTO transactions (account_id, type, amount, date, transfer_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    transaction.accountId,
                    transaction.type,
                    transaction.amount,
                    transaction.date,
                    null
                ]
            );


            await connection.commit();

            return transactionResult.insertId;

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }

    }




    async performWithdrawalTransaction(account, transaction) {

        const connection = await this.pool.getConnection();

        try {

            await connection.beginTransaction();

            const [accountUpdate] = await connection.execute(
                `UPDATE accounts SET balance = ? WHERE id = ?`,
                [account.balance, account.id]
            );


            if (accountUpdate.affectedRows === 0) {
                throw new Error("ACCOUNT COULD NOT BE UPDATED");
            }


            const [transactionResult] = await connection.execute(
                `INSERT INTO transactions (account_id, type, amount, date, transfer_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    transaction.accountId,
                    transaction.type,
                    transaction.amount,
                    transaction.date,
                    null
                ]
            );


            await connection.commit();

            return transactionResult.insertId;

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }

    }




}



module.exports = BankRepository;




