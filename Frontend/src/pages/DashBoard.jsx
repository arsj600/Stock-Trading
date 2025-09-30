import React, { useEffect, useState } from "react";
import API from "../axiosInstance";

const API_BASE = import.meta.env.VITE_API_BASE;

export function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    invested: 0,
    currentValue: 0,
    profitLoss: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch user paid orders
      const orderRes = await API.get(`${API_BASE}api/order/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let ordersData = [];
      if (orderRes.data.success) {
        ordersData = orderRes.data.orders || [];
      }

      // Fetch watchlist
      const watchRes = await API.get(`${API_BASE}api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (watchRes.data.success) {
        setWatchlist(watchRes.data.watchlist || []);
      }

      // Enrich orders with live price
      let invested = 0,
        currentValue = 0,
        profitLoss = 0;

      const enrichedOrders = await Promise.all(
        ordersData.map(async (o) => {
          try {
            const priceRes = await API.get(`${API_BASE}api/stocks/${o.symbol}`);
            const currentPrice = priceRes.data?.quote?.c || o.price;

            const currentAmount = currentPrice * o.quantity;
            const pnl = currentAmount - o.amount;

            invested += o.amount;
            currentValue += currentAmount;
            profitLoss += pnl;

            return { ...o, currentPrice, currentAmount, pnl };
          } catch (err) {
            console.warn("Price fetch failed for", o.symbol, err.message);
            return {
              ...o,
              currentPrice: o.price,
              currentAmount: o.amount,
              pnl: 0,
            };
          }
        })
      );

      setOrders(enrichedOrders);
      setMetrics({ invested, currentValue, profitLoss });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">
      {/* Portfolio Metrics */}
      <div className="mb-8 grid md:grid-cols-3 gap-8">
        <div className="p-4 bg-blue-600 text-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Invested</h2>
          <p className="text-2xl font-bold">${metrics.invested.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-600 text-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Current Value</h2>
          <p className="text-2xl font-bold">${metrics.currentValue.toFixed(2)}</p>
        </div>
        <div
          className={`p-4 text-white rounded-lg shadow ${
            metrics.profitLoss >= 0 ? "bg-green-700" : "bg-red-600"
          }`}
        >
          <h2 className="text-lg font-semibold">Profit/Loss</h2>
          <p className="text-2xl font-bold">
            {metrics.profitLoss >= 0 ? "+" : ""}
            ${metrics.profitLoss.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Orders Section */}
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">My Bought Stocks</h2>
          {orders.length === 0 ? (
            <p>You haven’t bought any stocks yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Symbol</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Buy Price</th>
                  <th className="p-2 border">Current</th>
                  <th className="p-2 border">P/L</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="text-center">
                    <td className="border p-2">{o.symbol}</td>
                    <td className="border p-2">{o.quantity}</td>
                    <td className="border p-2">${o.price.toFixed(2)}</td>
                    <td className="border p-2">${o.currentPrice.toFixed(2)}</td>
                    <td
                      className={`border p-2 font-bold ${
                        o.pnl >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {o.pnl >= 0 ? "+" : ""}
                      ${o.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Watchlist Section */}
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">My Watchlist</h2>
          {watchlist.length === 0 ? (
            <p>No stocks in your watchlist.</p>
          ) : (
            <ul className="space-y-2">
              {watchlist.map((s) => (
                <li
                  key={s}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span className="font-medium">{s}</span>
                  <a
                    href={`/stock/${s}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
