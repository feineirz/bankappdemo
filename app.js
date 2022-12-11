import { Bank, Account } from './bank.js'

const momoBank = new Bank('MMB', 'Momo Bank')
let curAccount

const contentBox = document.querySelector('.content')

const nav_publicMenu = document.querySelector('#public-menu')
const nav_userMenu = document.querySelector('#user-menu')

const nav_register = document.querySelector('#nav-register')
const nav_login = document.querySelector('#nav-login')
const nav_logout = document.querySelector('#nav-logout')

// Register
const registerOverlay = document.querySelector('#register-overlay')
const registerForm = document.querySelector('#register-form')
const reg_fullname = document.querySelector('#reg_fullname')
const reg_username = document.querySelector('#reg_username')
const reg_pin = document.querySelector('#reg_pin')
const reg_errMessage = document.querySelector('#reg_err-message')
const reg_cancel = document.querySelector('#reg_cancel')

// LogIn
const loginOverlay = document.querySelector('#login-overlay')
const loginForm = document.querySelector('#login-form')
const login_username = document.querySelector('#login_username')
const login_pin = document.querySelector('#login_pin')
const login_errMessage = document.querySelector('#login_err-message')
const login_login = document.querySelector('#login_login')
const login_cancel = document.querySelector('#login_cancel')

// ===== Register =====
nav_register.addEventListener('click', e => {
    registerOverlay.style.visibility = 'visible'
    registerOverlay.style.opacity = '100'
})

reg_username.addEventListener('blur', () => {
    reg_username.value = reg_username.value.toLowerCase()
})

reg_cancel.addEventListener('click', () => {
    registerOverlay.style.opacity = '0'
    registerOverlay.style.visibility = 'hidden'
    registerForm.reset()
})
registerForm.addEventListener('submit', e => {
    e.preventDefault()

    const fullname = reg_fullname.value
    const username = reg_username.value
    const pin = reg_pin.value

    // Check if username is exist
    if (momoBank.exist(username)) {
        reg_errMessage.style.display = 'flex'
        reg_errMessage.innerText = 'Username already exist!!!'
        registerForm.reset()
        return
    }

    // Create account and register to the bank
    const acc = new Account(fullname, username, pin)
    momoBank.register(acc)

    registerForm.reset()
    reg_errMessage.style.display = 'none'
    registerOverlay.style.opacity = '0'
    registerOverlay.style.visibility = 'hidden'
})

// ===== LogIn =====
nav_login.addEventListener('click', e => {
    loginOverlay.style.visibility = 'visible'
    loginOverlay.style.opacity = '100'
})

login_login.addEventListener('click', () => {
    const username = login_username.value
    const pin = login_pin.value

    const curAccount = momoBank.login(username, pin)

    if (!curAccount) {
        login_errMessage.style.display = 'flex'
        login_errMessage.innerText = 'Invalid username and/or password!!!'
        loginForm.reset()
        return
    }

    nav_publicMenu.style.display = 'none'
    nav_userMenu.style.display = 'block'

    loginForm.reset()
    login_errMessage.style.display = 'none'
    loginOverlay.style.opacity = '0'
    loginOverlay.style.visibility = 'hidden'
})

login_cancel.addEventListener('click', () => {
    loginForm.reset()
    login_errMessage.style.display = 'none'
    loginOverlay.style.opacity = '0'
    loginOverlay.style.visibility = 'hidden'
})

nav_logout.addEventListener('click', () => {
    curAccount = undefined
    nav_publicMenu.style.display = 'block'
    nav_userMenu.style.display = 'none'
})

// Test case
// const mikeAcc = new Account('Mike Wales', 'mike', 1112)
// momoBank.register(mikeAcc)

// console.log(momoBank.find(mikeAcc.accId))
