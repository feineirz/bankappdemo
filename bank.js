class Movements {
    constructor(amount, desc) {
        this.movId = uniqeId()
        this.recDate = new Date().toISOString()
        this.amount = amount
        this.desc = desc
    }
}

export class Bank {
    #bankCode
    #bankName
    #accounts = []

    constructor(bankCode, bankName) {
        this.#bankCode = bankCode
        this.#bankName = bankName
    }

    get bankCode() {
        return this.#bankCode
    }

    get bankName() {
        return this.#bankName
    }

    register(account) {
        if (!account) return false
        this.#accounts.push(account)
        return true
    }
}

export class Account {
    #accId
    #movements = []
    #pin

    constructor(owner, username, pin) {
        this.#accId = uniqeId()
        this.owner = owner
        this.username = username
        this.#pin = pin
    }

    get accId() {
        return this.#accId
    }

    get pin() {
        return this.#pin
    }

    dispose(amount, desc = 'ATF') {
        if (amount > 0) this.#movements.push(new Movements(amount, desc))
        return this
    }

    withdraw(amount, desc = 'ATF') {
        if (amount > 0) {
            if (this.balance >= amount) this.#movements.push(new Movements(-amount, desc))
            else this.#movements.push(new Movements('Not Enough Balance!', 0))
        }
        return this
    }

    get balance() {
        return this.#movements.length > 0 ? this.#movements.reduce((acc, cur) => acc + cur.amount, 0) : 0
    }
}

const uniqeId = function (lenght = 16) {
    const idSize = Math.pow(10, lenght)
    const uid = (Math.random() * idSize).toFixed(0)
    return uid.length === lenght ? uid : uniqeId(lenght)
}
