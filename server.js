

const express = require("express");
const { pool, createTables } = require("./database/database");
const BankRepository = require("./repositories/BankRepository");
const BankService = require("./services/BankServices");


const app = express();

app.use(express.json());
app.use(express.static("frontend"));

const repository = new BankRepository(pool);
const bankService = new BankService(repository);


app.get("/api/health", (req, res) => {

    res.status(200).json({
        status: "STEPONE API RUNNING"
    });

});


app.get("/api/accounts/:accountNumber", async (req, res) => {

    try {

        const accountNumber = req.params.accountNumber;

        const account = await bankService.getAccountByNumber(accountNumber);

        if (!account) {

            return res.status(404).json({
                error: "ACCOUNT NOT FOUND"
            });

        }

        res.status(200).json(account);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});




app.post("/api/auth/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({
                error: "USERNAME AND PASSWORD ARE REQUIRED"
            });

        }

        const employee = await bankService.loginEmployee(username, password);

        if (!employee) {

            return res.status(401).json({
                error: "INVALID USERNAME OR PASSWORD"
            });

        }

        res.status(200).json({
            message: "LOGIN SUCCESSFUL",
            employee: {
                id: employee.id,
                employeeNumber: employee.employeeNumber,
                firstName: employee.firstName,
                lastName: employee.lastName,
                position: employee.position
            }
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});



app.post("/api/clients", async (req, res) => {

    try {

        const { username, firstName, lastName, phone, email } = req.body;

        if (!username || !firstName || !lastName || !phone || !email) {

            return res.status(400).json({
                error: "ALL CLIENT FIELDS ARE REQUIRED"
            });

        }

        const data = {
            username,
            firstName,
            lastName,
            phone,
            email
        };

        const result = await bankService.registerClient(data);

        if (!result) {

            return res.status(400).json({
                error: "CLIENT COULD NOT BE REGISTERED"
            });

        }

        res.status(201).json({
            message: "CLIENT REGISTERED SUCCESSFULLY",
            clientId: result.clientId,
            accountId: result.accountId,
            accountNumber: result.accountNumber,
            username: result.username,
            temporaryPassword: result.password,
            passkey: result.passkey
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});



app.get("/api/clients/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "INVALID CLIENT ID"
            });

        }

        const client = await bankService.searchClientById(id);

        if (!client) {

            return res.status(404).json({
                error: "CLIENT NOT FOUND"
            });

        }

        res.status(200).json({
            id: client.id,
            username: client.username,
            firstName: client.firstName,
            lastName: client.lastName,
            phone: client.phone,
            email: client.email
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});



app.post("/api/accounts/:accountNumber/deposits", async (req, res) => {

    try {

        const accountNumber = req.params.accountNumber;
        const { amount } = req.body;

        if (amount == null) {

            return res.status(400).json({
                error: "AMOUNT IS REQUIRED"
            });

        }

        const account = await bankService.getAccountByNumber(accountNumber);

        if (!account) {

            return res.status(404).json({
                error: "ACCOUNT NOT FOUND"
            });

        }

        const result = await bankService.deposit(account, amount);

        if (!result) {

            return res.status(400).json({
                error: "DEPOSIT COULD NOT BE COMPLETED"
            });

        }

        res.status(200).json({
            message: "DEPOSIT COMPLETED SUCCESSFULLY",
            transactionId: result.transactionId,
            accountId: result.accountId,
            amount: result.amount,
            date: result.currentDate
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});



app.post("/api/accounts/:accountNumber/withdrawals", async (req, res) => {

    try {

        const accountNumber = req.params.accountNumber;
        const { amount, passKey } = req.body;

        if (amount == null || !passKey) {

            return res.status(400).json({
                error: "AMOUNT AND PASSKEY ARE REQUIRED"
            });

        }

        const result = await bankService.withdraw(accountNumber, amount, passKey);

        if (!result) {

            return res.status(400).json({
                error: "WITHDRAWAL COULD NOT BE COMPLETED"
            });

        }

        res.status(200).json({
            message: "WITHDRAWAL COMPLETED SUCCESSFULLY",
            transactionId: result.transactionId,
            accountId: result.accountId,
            amount: result.amount,
            date: result.currentDate
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});



app.post("/api/transfers", async (req, res) => {

    try {

        const {
            sourceAccountNumber,
            destinationAccountNumber,
            amount,
            concept,
            passKey
        } = req.body;

        if (
            !sourceAccountNumber ||
            !destinationAccountNumber ||
            amount == null ||
            !concept ||
            !passKey
        ) {

            return res.status(400).json({
                error: "ALL TRANSFER FIELDS ARE REQUIRED"
            });

        }

        const result = await bankService.transfer(
            sourceAccountNumber,
            destinationAccountNumber,
            amount,
            concept,
            passKey
        );

        if (!result) {

            return res.status(400).json({
                error: "TRANSFER COULD NOT BE COMPLETED"
            });

        }

        res.status(200).json({
            message: "TRANSFER COMPLETED SUCCESSFULLY",
            transferId: result.transferId,
            sourceTransactionId: result.sourceTransactionId,
            destinationTransactionId: result.destinationTransactionId,
            sourceAccountNumber: result.sourceAccountNumber,
            destinationAccountNumber: result.destinationAccountNumber,
            amount: result.amount,
            concept: result.concept,
            date: result.currentDate
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});



app.get("/api/accounts/:accountNumber/transactions", async (req, res) => {

    try {

        const accountNumber = req.params.accountNumber;

        const history = await bankService.getTransactionHistory(accountNumber);

        if (!history) {

            return res.status(404).json({
                error: "ACCOUNT NOT FOUND"
            });

        }

        res.status(200).json({
            accountNumber,
            transactions: history
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });

    }

});

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {

        await createTables();

        app.listen(PORT, () => {

            console.log(`STEPONE API RUNNING ON PORT ${PORT}`);

        });

    } catch (error) {

        console.log(error);

    }

}

startServer();
