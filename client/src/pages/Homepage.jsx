import React, { useState, useEffect } from "react";
import Transactions from "../components/Transactions";

const Homepage = () => {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = {
      title: e.target.title.value,
      amount: e.target.amount.value,
      type: e.target.type.value,
      category: e.target.category.value,
    };

    if (!formData.title || !formData.amount || !formData.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      alert(data);
      e.target.reset();

      fetchTransactions(); // Refresh transaction list
    } catch (error) {
      alert("Error adding transaction");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-20">
        <button
          className="bg-blue-500 text-white rounded-lg p-3 cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add New"}
        </button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="block">Title</label>
              <input type="text" name="title" className="w-full p-2 border rounded" placeholder="Enter Title" />
            </div>

            <div className="mb-3">
              <label className="block">Amount</label>
              <input type="number" name="amount" className="w-full p-2 border rounded" placeholder="Enter Amount" />
            </div>

            <div className="mb-3">
              <label className="block">Type</label>
              <select name="type" className="w-full p-2 border rounded">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block">Category</label>
              <input type="text" name="category" className="w-full p-2 border rounded" placeholder="Enter Category" />
            </div>

            <button className="bg-green-500 text-white p-2 rounded w-full mt-2">Save Transaction</button>
          </form>
        </div>
      )}

      <div className="w-full p-3 bg-amber-300">
        <Transactions transactions={transactions} refreshTransactions={fetchTransactions} />
      </div>
    </>
  );
};

export default Homepage;
