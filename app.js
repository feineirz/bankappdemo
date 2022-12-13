import { Bank, Account } from './bank.js'

const momoBank = new Bank('MMB', 'Momo Bank')
let curAccount

const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})
const fullDatetimeFormat = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Asia/Bangkok',
})

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

// User page
const accountContentPanel = document.querySelector('.account-content')
const greetingsMessage = document.querySelector('.greetings-message')
const accountId = document.querySelector('.account-id')
const acountBalance = document.querySelector('.account-balance')
const transactionBody = document.querySelector('.transaction-body')

const disposeSummaryAmount = document.querySelector('#dispose-summary_amount')
const withdrawSummaryAmount = document.querySelector('#withdraw-summary_amount')

const creditTransfer_accId = document.querySelector('#credit-transfer_accId')
const creditTransfer_amount = document.querySelector('#credit-transfer_amount')
const creditTransfer_form = document.querySelector('#credit-transfer_form')

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
    if (momoBank.register(acc)) {
        showOverlayMessage('Register Result', 'Account registration successful.')
    } else {
        showOverlayMessage('Register Result', 'Account registration fail!!!', 'error')
    }

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

    curAccount = momoBank.login(username, pin)

    if (!curAccount) {
        login_errMessage.style.display = 'flex'
        login_errMessage.innerText = 'Invalid username and/or password!!!'
        loginForm.reset()
        return
    }

    fillDummyData()

    nav_publicMenu.style.display = 'none'
    nav_userMenu.style.display = 'block'

    accountContentPanel.style.display = 'block'
    greetingsMessage.innerText = `Welcome, ${curAccount.owner}`
    accountId.innerText = `AccId. ${curAccount.formatedAccId}`

    updateTransaction()

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

    accountContentPanel.style.display = 'none'
    transactionBody.innerHTML = ''

    showOverlayMessage('Logout Result', 'Logout successful.')
})

creditTransfer_form.addEventListener('submit', e => {
    e.preventDefault()

    const accId = creditTransfer_accId.value
    const amount = creditTransfer_amount.value
    if (momoBank.transfer(curAccount.accId, accId, amount - 0)) {
        showOverlayMessage('Transfering Result', 'Credit transfering successful.')
    } else {
        showOverlayMessage('Transfering Result', 'Credit transfering fail!!!', 'error')
    }
    creditTransfer_form.reset()
    updateTransaction()
})

// Helper Functions
const showOverlayMessage = (title, message, state = 'success') => {
    const messageOverlay = document.querySelector('#message-overlay')
    const messageOverlay_title = document.querySelector('#message-overlay_title')
    const messageOverlay_message = document.querySelector('#message-overlay_message')
    const messageOverlay_ok = document.querySelector('#message-overlay_ok')

    messageOverlay_title.innerText = title

    messageOverlay_message.classList.remove('msg-success', 'msg-warning', 'msg-error')
    messageOverlay_message.classList.add(`msg-${state}`)
    messageOverlay_message.innerText = message

    messageOverlay.style.opacity = 100
    messageOverlay.style.visibility = 'visible'

    messageOverlay_ok.addEventListener('click', () => {
        messageOverlay.style.opacity = 0
        messageOverlay.style.visibility = 'hidden'
    })
}

const updateTransaction = () => {
    acountBalance.innerText = currencyFormat.format(curAccount.balance)

    transactionBody.innerHTML = ''
    curAccount.movements.forEach(mov => {
        transactionBody.insertAdjacentHTML(
            'afterbegin',
            `
			<div class="transaction-item">
				<div class="transaction-desc">
					<p>${mov.desc}</p>
					<p class="transaction-date">${fullDatetimeFormat.format(new Date(mov.recDate))}</p>
				</div>
				<div class="transaction-amount ${mov.amount >= 0 ? 'dispose' : 'withdraw'}">${currencyFormat.format(mov.amount)}</div>
			</div>
			`
        )
    })
    disposeSummaryAmount.innerText = currencyFormat.format(curAccount.totalDispose)
    withdrawSummaryAmount.innerText = currencyFormat.format(curAccount.totalWithdraw)
}

// Test case
const fillDummyData = () => {
    if (curAccount && curAccount.balance === 0) {
        curAccount.dispose(100000, 'Initialize Balance')
    }
}
