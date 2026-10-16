
require("dotenv").config();
const mysql = require("mysql2/promise");

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
    )`);

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
    )`);

}


async function createTableAccounts() {

    await pool.query(`CREATE TABLE IF NOT EXISTS accounts(
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL UNIQUE,
        account_number VARCHAR(70) NOT NULL UNIQUE,
        balance DECIMAL(12, 4) NOT NULL DEFAULT 0.00
    )`);

}


async function createTables() {

    await createTableEmployees();
    await createTableClients();
    await createTableAccounts();

}


module.exports = {
    pool,
    createTables
};








