const mongoose = require('mongoose');

const connectDB = (app) => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB Server");
      const PORT = process.env.PORT || 8080;
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.log("Failed to connect to MongoDB", err);
      process.exit(1);
    });
}

module.exports = connectDB;