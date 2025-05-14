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
    console.log(transactions);
    
    return res.status(200).render("transactions", { transactions });
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).send("Error reading transactions");
  });
});

app.get("/add-transaction", (req, res) => {  
  res.status(200).render("form", { editTransaction : null });
});

app.get("/edit-transaction/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  
  // Need to verify the id
  Transaction.findById(id)
  .then((t) => {
    // console.log(t);
    const transaction = {
      id,
      title : t.title,
      amount : t.amount,
      type : t.type,
      category : t.category,
    }
    return res.status(200).render("form", {editTransaction : transaction });
  })
  .catch((e) => {
    return res.status(500).send("Invalid ID!");
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
  const id = req.params.id;
  Transaction.findByIdAndDelete(id)
  .then((e) => {
    res.status(200).redirect("/transactions");
  })
  .catch((e) => {
    res.status(500).send("Unable to Delete");
  });
});

app.post("/update-transaction/:id", validateTransaction, (req, res) => {
  const id = req.params.id;
  const { title, amount, type, category } = req.body;
  Transaction.findByIdAndUpdate(id, {
    title, amount, type, category
  })
  .then(() => {
    res.status(200).redirect('/transactions');
  })
  .catch((e) => {
    res.status(501).send("Invalid id");
  });
});

