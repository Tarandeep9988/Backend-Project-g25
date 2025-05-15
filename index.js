const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const validateTransaction = require("./middlewares/validateTransaction");
const Transaction = require("./models/Transaction");
const errorHandler = require("./middlewares/errorHandler");
const reqLog = require("./middlewares/reqLog");

dotenv.config();

const app = express();

// Connect to mongoDB server
connectDB(app);

// view ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// custom middleware for logging everything in logs.txt
app.use(reqLog);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



// Routes
app.get("/", (req, res, next) => {
  res.redirect("/transactions");
});

app.get("/transactions", async (req, res, next) => {

  Transaction.find()
  .then((t) => {
    // console.log(t);
    const transactions = [];
    for (const transaction of t) {
      const id = String(transaction._id);
      const date = new Date(transaction.createdAt).toLocaleDateString();
      const time = new Date(transaction.createdAt).toLocaleTimeString();
      transactions.push({id, date, time, title : transaction.title, amount : transaction.amount, type: transaction.type, category: transaction.category});
    }
    // console.log(transactions);
    
    return res.status(200).render("transactions", { transactions });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

app.get("/add-transaction", (req, res, next) => {  
  res.status(200).render("form", { editTransaction : null });
});

app.get("/edit-transaction/:id", (req, res, next) => {
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
    return next(e);
  });
  
});

app.post("/add-transaction", validateTransaction, (req, res, next) => {
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
    console.log(e);
    
    return next(e);
  })
});

app.post("/delete-transaction/:id", (req, res, next) => {
  const id = req.params.id;
  Transaction.findByIdAndDelete(id)
  .then((e) => {
    res.status(200).redirect("/transactions");
  })
  .catch((e) => {
    return next(e);
  });
});

app.post("/update-transaction/:id", validateTransaction, (req, res, next) => {
  const id = req.params.id;
  const { title, amount, type, category } = req.body;
  Transaction.findByIdAndUpdate(id, {
    title, amount, type, category
  })
  .then(() => {
    res.status(200).redirect('/transactions');
  })
  .catch((e) => {
    return next(e);
  });
});

// To handle invalid routes
app.all("*", (req, res, next) => {
  const e = new Error("Page not found");
  e.status = 404;
  next(e);
})

// Error handling middleware
app.use(errorHandler);