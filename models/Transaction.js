

class Transaction {

    constructor(id, accountId, type, amount, date, transferID = null) {
        this.id = id;
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.transferID = transferID;

    }

}

module.exports = Transaction;