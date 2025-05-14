const validateTransaction = (req, res, next) => {
  const { title, amount, type, category } = req.body;
  if (!title || !amount || !type || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next();
};


module.exports = validateTransaction;