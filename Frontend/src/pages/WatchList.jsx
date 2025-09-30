import  { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import API from "../axiosInstance";
const AAPI = import.meta.env.VITE_API_BASE;

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
   const res = await API.get(`${AAPI}api/watchlist`, {
  headers: { Authorization: `Bearer ${token}` }
});

      setWatchlist(res.data.watchlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeStock = async (symbol) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`${AAPI}api/watchlist/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } catch (err) {
      alert("Error removing stock");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>No stocks in your watchlist.</p>
      ) : (
        <ul className="space-y-3">
          {watchlist.map((s) => (
            <li key={s} className="flex justify-between items-center border p-2 rounded">
              <Link to={`/stocks/${s}`} className="text-blue-600 font-medium">
                {s}
              </Link>
              <button
                onClick={() => removeStock(s)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
