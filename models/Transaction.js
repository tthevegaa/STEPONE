

class Transaction {

    constructor(id, accountId, type, amount, date, transferId = null) {
        this.id = id;
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.transferId = transferId;

    }

}

module.exports = Transaction;

