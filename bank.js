const userKey = "appUser";

// DOM Elements
const logIn = document.getElementById("reg-log");
const banking = document.getElementById("banking-section");
const userInput = document.getElementById("username");
const userPass = document.getElementById("in-password");
const regUser = document.getElementById("reg-username");
const regPass = document.getElementById("reg-password");
const loginBtn = document.getElementById("login-btn");
const createAccount = document.getElementById("create");
const registerBtn = document.getElementById("register-btn");
const register = document.getElementById("register-section");
const userNameDisplay = document.getElementById("user-name");
const balanceDisplay = document.getElementById("balance");
const amountInput = document.getElementById("amount");
const depositBtn = document.getElementById("deposit");
const withdrawBtn = document.getElementById("withdraw");
const transferBtn = document.getElementById("transfer");
const transactionsList = document.getElementById("transactions");
const logoutBtn = document.getElementById("logout");

let currentUser = null;

// Load Users
function loadUsers() {
  const usersJSON = localStorage.getItem(userKey);
  return usersJSON ? JSON.parse(usersJSON) : [];
}

// Save Users
function saveUsers(users) {
  localStorage.setItem(userKey, JSON.stringify(users));
}

// Create Account
createAccount.addEventListener('click', () => {
  logIn.style.display = 'none';
  register.style.display = 'block';
});

// Registration
registerBtn.addEventListener("click", () => {
  const username = regUser.value.trim();
  const password = regPass.value.trim();

  if (!username || !password) {
    alert("Please enter your username and password.");
    return;
  }

  const users = loadUsers();
  if (users.some(user => user.username === username)) {
    alert("Username already exists.");
    return;
  }

  const newUser = {
    username,
    password,
    balance: 0,
    transactions: []
  };

  users.push(newUser);
  saveUsers(users);
  alert("Account created successfully. Please login.");

  register.style.display = 'none';
  logIn.style.display = 'block';
});

// Login
loginBtn.addEventListener("click", () => {
  const username = userInput.value.trim();
  const password = userPass.value.trim();

  const users = loadUsers();
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    alert("Invalid username or password.");
    return;
  }

  currentUser = user;
  logIn.style.display = "none";
  banking.style.display = "block";
  updateUI();
});

// Update UI
function updateUI() {
  userNameDisplay.textContent = currentUser.username.toUpperCase();
  balanceDisplay.textContent = currentUser.balance.toFixed(2);
  renderTransactions();
}

// Render Transactions
function renderTransactions() {
  transactionsList.innerHTML = currentUser.transactions
    .map(transaction => `<li>${transaction.type}: $${transaction.amount.toFixed(2)}</li>`)
    .join("");
}

// Deposit
depositBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  currentUser.balance += amount;
  currentUser.transactions.push({ type: "Deposit", amount });
  saveUsers(loadUsers().map(user => user.username === currentUser.username ? currentUser : user));
  updateUI();
  amountInput.value = "";
});

// Withdraw
withdrawBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0 || amount > currentUser.balance) {
    alert("Invalid amount or insufficient balance.");
    return;
  }

  currentUser.balance -= amount;
  currentUser.transactions.push({ type: "Withdraw", amount });
  saveUsers(loadUsers().map(user => user.username === currentUser.username ? currentUser : user));
  updateUI();
  amountInput.value = "";
});

// Transfer
transferBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0 || amount > currentUser.balance) {
    alert("Invalid amount or insufficient balance.");
    return;
  }

  currentUser.balance -= amount;
  currentUser.transactions.push({ type: "Transfer", amount });
  saveUsers(loadUsers().map(user => user.username === currentUser.username ? currentUser : user));
  updateUI();
  amountInput.value = "";
});

// Logout
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  logIn.style.display = "block";
  banking.style.display = "none";
  register.style.display = 'none';
  userInput.value = "";
  userPass.value = "";
});