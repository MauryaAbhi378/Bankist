// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-11-10T17:01:17.194Z",
    "2023-11-25T23:36:17.929Z",
    "2023-11-26T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

// Formatting the dates
const formatMovementDates = (date) => {
  const clacDate = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };
  const daypassed = clacDate(new Date(), date);

  if (daypassed === 0) return "Today";
  if (daypassed === 1) return "Yesterday";
  if (daypassed <= 7) return `${daypassed} days`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

// Diplaying the transaction of users
const displayMovement = (acc, sort = false) => {
  containerMovements.innerHTML = " ";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 1 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(date);

    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
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

const updateUI = (acc) => {
  //Display movements
  displayMovement(acc);

  //Display balance
  calculateBalance(acc);

  //Display summary
  displaySummary(acc);
};

// Login into your account
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  // Login
  currentAccount = accounts.find(
    (acc) => inputLoginUsername.value === acc.userName
  );

  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    //Display UI and message
    labelWelcome.textContent = `Good Morning, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "100";

    // Adding dates
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    const locale = currentAccount.locale
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

    //Clearing INput Field
    inputLoginUsername.value = inputLoginPin.value = " ";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// Transfering Money to Another user
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  //Clearing INput Field
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  // Ading Dates
  currentAccount.movementsDates.push(new Date());
  receiverAcc.movementsDates.push(new Date());

  updateUI(currentAccount);
});

// Loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    inputLoanAmount.value = " ";

    // Ading Dates
    currentAccount.movementsDates.push(new Date());

    // Updating the UI
    updateUI(currentAccount);
  }
});

// Closing Account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const deleteAcc = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    // Deleting the account
    accounts.splice(deleteAcc, 1);

    // Hiding the UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
});

let sorted = true;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  displayMovement(accounts, sorted);
  sorted = !sorted;
});
