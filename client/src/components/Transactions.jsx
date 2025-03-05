import React from "react";

const Transactions = ({ transactions, refreshTransactions, setEditTransaction, setShowForm }) => {
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-transaction/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        refreshTransactions();
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="w-full p-3 bg-amber-300">
      <table className="w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.title}</td>
                <td>{tx.amount}</td>
                <td>{tx.type}</td>
                <td>{tx.category}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditTransaction(tx);
                      setShowForm(true); // Show form when editing
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No Transactions Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
