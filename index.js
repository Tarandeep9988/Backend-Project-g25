const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("combined", {
  stream: {
    write: (message) => {
      fs.appendFile("logs.txt", message, (err) => {
        if (err) console.error("Failed to save log:", err);
      });
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const validateTransaction = (req, res, next) => {
  const { title, amount, type, category } = req.body;
  if (!title || !amount || !type || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next();
};

// Redirect to transactions page by default
app.get("/", (req, res) => {
  res.redirect("/transactions");
});

// Transactions list page
app.get("/transactions", (req, res) => {
  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }
    const transactions = data ? JSON.parse(data) : [];
    res.render("transactions", { transactions });
  });
});

// Add transaction form
app.get("/add-transaction", (req, res) => {
  res.render("form", { editTransaction: null });
});

// Edit transaction form
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
    res.render("form", { editTransaction });
  });
});

// Get transactions as JSON (API)
app.get("/transactions/api", (req, res) => {
  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }
    res.json(JSON.parse(data));
  });
});

// Add new transaction
app.post("/add-transaction", validateTransaction, (req, res) => {
  const now = new Date();
  const id = now.getTime();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const { title, amount, type, category } = req.body;

  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }

    const transactions = data ? JSON.parse(data) : [];
    transactions.push({ id, date, time, title, amount, type, category });

    fs.writeFile(
      "transactions.json",
      JSON.stringify(transactions, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving transaction");
        }
        res.redirect("/transactions");
      }
    );
  });
});

// Delete transaction
app.post("/delete-transaction/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }

    const transactions = data ? JSON.parse(data) : [];
    const newTransactions = transactions.filter((t) => t.id !== id);

    fs.writeFile(
      "transactions.json",
      JSON.stringify(newTransactions, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error deleting transaction");
        }
        res.redirect("/transactions");
      }
    );
  });
});

// Update transaction
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

    fs.writeFile(
      "transactions.json",
      JSON.stringify(transactions, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error updating transaction");
        }
        res.redirect("/transactions");
      }
    );
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
