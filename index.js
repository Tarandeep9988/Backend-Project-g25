const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");

// Loading environment variables
dotenv.config();

// Create the Express app
const app = express();

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all transactions
app.get("/transactions", (req, res) => {
  fs.readFile("transactions.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading transactions file");
    }
    res.json(JSON.parse(data));
  });
}
);

// Custom middlewares
const validateTransaction = (req, res, next) => {
  const { title, amount, type, category } = req.body;
  if (!title || !amount || !type || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next(); 
};



// Adding a new transaction
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
        res.send("Transaction added successfully!");
      }
    );
  });
});

// Deleting a transaction
app.delete("/delete-transaction/:id", (req, res) => {
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
        res.send("Transaction deleted successfully!");
      }
    );
  });
}
);

app.put("/update-transaction/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, amount, type, category } = req.body;
    
    if (!title || !amount || !type || !category) {
        return res.status(400).send("Missing required fields: title, amount, type, category");
    }
    
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
    
        transactions[transactionIndex] = { id, title, amount, type, category };
    
        fs.writeFile(
        "transactions.json",
        JSON.stringify(transactions, null, 2),
        (err) => {
            if (err) {
            console.error(err);
            return res.status(500).send("Error updating transaction");
            }
            res.send("Transaction updated successfully!");
        }
        );
    });
    }   
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
