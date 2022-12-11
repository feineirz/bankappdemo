import { Bank, Account } from './bank.js'

const contentBox = document.querySelector('.content')

const momoBank = new Bank('MMB', 'Momo Bank')
const mikeAcc = new Account('Mike Wales', 'mike', '1111')

momoBank.register(mikeAcc)
console.log(momoBank)
