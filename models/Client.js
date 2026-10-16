
const Person = require("./Person");

class Client extends Person {

    constructor(id, username, password, firstName, lastName, phone, email, passkey) {
        super(id, username, password, firstName, lastName, phone, email);

        this.passkey = passkey;

    }

}

module.exports = Client;