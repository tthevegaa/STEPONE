


const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

require("dotenv").config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool;



async function createTableEmployees() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS employees(
        id INT PRIMARY KEY AUTO_INCREMENT, 
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL, 
        phone VARCHAR(30), 
        email VARCHAR(150) NOT NULL UNIQUE, 
        employee_number INT NOT NULL UNIQUE, 
        position VARCHAR(250)
    );`);

} 



async function createDefaultAdmin() {

    const [rows] = await pool.query(
        `SELECT id FROM employees WHERE username = ?`,
        ["admin"]
    );

    if (rows.length > 0) {
        return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await pool.query(
        `INSERT INTO employees
        (username, password, first_name, last_name, phone, email, employee_number, position)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            "admin",
            hashedPassword,
            "System",
            "Administrator",
            null,
            "admin@stepone.local",
            10000001,
            "Administrator"
        ]
    );

}


async function createTableClients() {

    await pool.query(`CREATE TABLE IF NOT EXISTS clients(
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(30),
        email VARCHAR(150) NOT NULL UNIQUE,
        passkey VARCHAR(200) NOT NULL
    );`);

}


async function createTableAccounts() {

    await pool.query(`CREATE TABLE IF NOT EXISTS accounts(
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL UNIQUE,
        account_number VARCHAR(70) NOT NULL UNIQUE,
        balance DECIMAL(12, 4) NOT NULL DEFAULT 0.00
    );`);

}


async function createTableTransfers() {

    await pool.query(`CREATE TABLE IF NOT EXISTS transfers(
        id INT PRIMARY KEY AUTO_INCREMENT,
        source_account_id INT NOT NULL,
        destination_account_id INT NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        concept VARCHAR(200) NOT NULL,  
        date DATETIME NOT NULL,
        FOREIGN KEY (source_account_id) REFERENCES accounts(id),
        FOREIGN KEY (destination_account_id) REFERENCES accounts(id)
    );`);
}


async function createTableTransactions() {

    await pool.query(`CREATE TABLE IF NOT EXISTS transactions(
        id INT PRIMARY KEY AUTO_INCREMENT,
        account_id INT NOT NULL,
        type VARCHAR(100) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        date DATETIME NOT NULL, 
        transfer_id INT NULL,
        FOREIGN KEY (transfer_id) REFERENCES transfers(id), 
        FOREIGN KEY (account_id) REFERENCES accounts(id)
    );`);
    
}



async function createTables() {

    await createTableEmployees();
    await createDefaultAdmin();
    await createTableClients();
    await createTableAccounts();
    await createTableTransfers();
    await createTableTransactions();

}


module.exports = {
    pool,
    createTables
};








