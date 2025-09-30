
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../axiosInstance";


const API_BASE = import.meta.env.VITE_API_BASE;

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verify = async () => {
      try {
        const orderId = params.get("orderId");
        const session_id = params.get("session_id");
        const token = localStorage.getItem("token");

        const res = await API.post(
          `${API_BASE}api/order/verify`,
          { orderId, session_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessage(res.data.message);

        // redirect after success
        if (res.data.success) {
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [params, navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <p>{message}</p>
      <button
        onClick={() => navigate("/stocklist")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Back to Stocks
      </button>
    </div>
  );
}
