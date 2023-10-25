"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;

const updateUI = (acc) => {
  //Display movements
  displayMovement(acc.movements);

  //Display balance
  calculateBalance(acc);

  //Display summary
  displaySummary(acc);
};

// Diplaying the transaction of users
const displayMovement = (movements) => {
  containerMovements.innerHTML = " ";
  movements.forEach((mov, i) => {
    const type = mov > 1 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Calculating the balance amount of user
const calculateBalance = (acc) => {
  acc.balance = acc.movements.reduce((e, money) => {
    return e + money;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

// Displaying the summary of user
const displaySummary = (acc) => {
  const income = acc.movements
    .filter((e) => {
      return e > 0;
    })
    .reduce((e, curr) => {
      return e + curr;
    }, 0);
  // console.log(income);
  labelSumIn.textContent = `${income}€`;

  const expense = acc.movements
    .filter((e) => {
      return e < 0;
    })
    .reduce((e, curr) => {
      return e + curr;
    }, 0);
  // console.log(expense);
  labelSumOut.textContent = `${Math.abs(expense)}€`;

  const interest = acc.movements
    .filter((e) => e > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Created A username for users
const createUsername = (accounts) => {
  accounts.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  // Login
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Good Morning, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "100";

    //Clearing INput Field
    inputLoginUsername.value = inputLoginPin.value = " ";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// Transfering Money to Another user
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => inputTransferTo.value === acc.userName
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Updating UI
    updateUI(currentAccount);
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

/////////////////////////////////////////////////
