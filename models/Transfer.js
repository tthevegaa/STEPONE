


class Transfer {

    constructor(id, senderAccountId, receiverAccountId, amount, concept, date) {
        this.id = id;
        this.sourceAccountId = senderAccountId;
        this.destinationAccountId = receiverAccountId;
        this.amount = amount;
        this.concept = concept;
        this.date = date;

    }


}

module.exports = Transfer;