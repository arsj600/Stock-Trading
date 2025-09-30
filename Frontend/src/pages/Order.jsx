
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../axiosInstance";

const API_BASE = import.meta.env.VITE_API_BASE ;

export function Order() {
  const { state } = useLocation();
  const navigate = useNavigate();

  
  const { symbol, price } = state || {};

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!symbol || !price) {
    return (
      <div className="p-6">
        <p className="text-red-600">No stock selected for order.</p>
        <button
          onClick={() => navigate("/stocklist")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Stocks
        </button>
      </div>
    );
  }


const handleCheckout = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token"); 

    const res = await API.post(
      `${API_BASE}api/order/create`,
      { symbol, quantity, price },  
      { headers: { Authorization: `Bearer ${token}` } } 
    );

    if (res.data.success && res.data.url) {
      window.location.href = res.data.url;
    } else {
      alert("Unable to create checkout session");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Error creating order");
  } finally {
    setLoading(false);
  }
};



  const total = (quantity * price).toFixed(2);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>

      <div className="border p-4 rounded mb-4">
        <p>
          <strong>Stock:</strong> {symbol}
        </p>
        <p>
          <strong>Price per share:</strong> ${price}
        </p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border px-3 py-2 w-full"
        />
      </div>

      <p className="mb-4 text-lg">
        <strong>Total:</strong> ${total}
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
