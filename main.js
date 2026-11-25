


const {pool, createTables } = require("./database/database");
const ConsoleUI = require("./ui/ConsoleUI");
const BankRepository = require("./repositories/BankRepository");
const BankServices = require("./services/BankServices");

async function main() {

    try {

        const connection = await pool.getConnection();
        console.log("DATABASE SUCCESSFULLY CONNECTED");
        connection.release();


        await createTables();

        const repository = new BankRepository(pool);
        const services = new BankServices(repository);
        const ui = new ConsoleUI(services);

        await ui.start();

    } catch (error) {
        console.log("SYSTEM ERROR");
        console.log(error);
    }

}


main();






