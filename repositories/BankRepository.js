





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




    async findEmployeeByNumber(employeeNumber) {

        const [rows] = await this.pool.execute(
            `SELECT * FROM employees WHERE employee_number = ?`,
            [employeeNumber]
        );

        return rows[0] || null;
    }

    async findEmployeeByUsername(username) {

        const [rows] = await this.pool.execute(`SELECT * FROM employees WHERE username = ?`, [username]);
        return rows[0] || null;
    }

    async findEmployeeByEmail(email) {

        const [rows] = await this.pool.execute(`SELECT * FROM employees WHERE email = ?`, [email]);
        return rows[0] || null;

    }

    async findClientById(id) {

        const [rows] = await this.pool.execute(`SELECT * FROM clients WHERE id = ?`, [id]);
        return rows[0] || null;
    }

    async findClientByUsername(username) {

        const [rows] = await this.pool.execute(`SELECT * FROM clients WHERE username = ?`, [username]);
        return rows[0] || null;

    }

    async findClientByEmail(email) {

        const [rows] = await this.pool.execute(`SELECT * FROM clients WHERE email = ?`, [email]);
        return rows[0] || null;

    }

    async findAccountByNumber(accountNumber) {

        const [rows] = await this.pool.execute(`SELECT * FROM accounts WHERE account_number = ?`, [accountNumber]);
        return rows[0] || null;
    }

    async findAccountByClientId(clientId) {

        const [rows] = await this.pool.execute(`SELECT * FROM accounts WHERE client_id = ?`, [clientId]);
        return rows[0] || null;
    }



}



module.exports = BankRepository;




