const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const validateTransaction = require("./middlewares/validateTransaction");
const Transaction = require("./models/Transaction");

dotenv.config();

const app = express();

// Connect to mongoDB server
connectDB(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        fs.appendFile("logs.txt", message, (err) => {
          if (err) console.error("Failed to save log:", err);
        });
      },
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.redirect("/transactions");
});

app.get("/transactions", async (req, res) => {

  Transaction.find()
  .then((t) => {
    console.log(t);
    const transactions = [];
    for (const transaction of t) {
      const id = String(transaction._id);
      const date = new Date(transaction.createdAt).toLocaleDateString();
      const time = new Date(transaction.createdAt).toLocaleTimeString();
      transactions.push({id, date, time, title : transaction.title, amount : transaction.amount, type: transaction.type, category: transaction.category});
    }
    
    return res.status(200).render("transactions", { transactions });
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).send("Error reading transactions");
  });
  // fs.readFile("transactions.json", "utf8", (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send("Error reading transactions file");
  //   }
  //   const transactions = data ? JSON.parse(data) : [];
  //   res.status(200).render("transactions", { transactions });
  // });
});

app.get("/add-transaction", (req, res) => {  
  res.status(200).render("form", { editTransaction: null });
});

app.get("/edit-transaction/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }
    const transactions = data ? JSON.parse(data) : [];
    const editTransaction = transactions.find((t) => t.id === id);
    if (!editTransaction) {
      return res.status(404).send("Transaction not found");
    }
    res.status(200).render("form", { editTransaction });
  });
});

app.post("/add-transaction", validateTransaction, (req, res) => {
  const { title, amount, type, category } = req.body;
  const newTransaction = new Transaction({
    title,
    amount,
    type,
    category,
  });

  // console.log(newTransaction);
  
  newTransaction.save()
  .then((t) => {
    return res.status(201).redirect("/transactions");
  })
  .catch((e) => {
    return res.status(500).send("Error saving Transactions");
  })
});

app.post("/delete-transaction/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }

    const transactions = data ? JSON.parse(data) : [];
    const newTransactions = transactions.filter((t) => t.id !== id);

    fs.writeFile("transactions.json", JSON.stringify(newTransactions, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error deleting transaction");
      }
      res.status(200).redirect("/transactions");
    });
  });
});

app.post("/update-transaction/:id", validateTransaction, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, amount, type, category } = req.body;

  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }

    const transactions = data ? JSON.parse(data) : [];
    const transactionIndex = transactions.findIndex((t) => t.id === id);

    if (transactionIndex === -1) {
      return res.status(404).send("Transaction not found");
    }

    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      title,
      amount,
      type,
      category,
    };

    fs.writeFile("transactions.json", JSON.stringify(transactions, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating transaction");
      }
      res.status(200).redirect("/transactions");
    });
  });
});

