import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockDetail,
  fetchStockHistory,
  updateQuote,
} from "../state/stockSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Charts } from "../components/Charts";

import API from "../axiosInstance";

const API_BASE = import.meta.env.VITE_API_BASE;

export function Stock() {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const { selected, detailStatus, history } = useSelector((s) => s.stocks);
  const [range, setRange] = useState("1d"); 
  const [buying, setBuying] = useState(false);
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();

  
  useEffect(() => {
    dispatch(fetchStockDetail(symbol));
    
    
  }, [dispatch, symbol]);

  
  useEffect(() => {
    dispatch(fetchStockHistory({ symbol, range }));
  }, [dispatch, symbol, range]);

 
  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        const res = await API.get(`${API_BASE}api/stocks/${symbol}`);
        if (!mounted) return;
        const quote = res.data.quote;
        dispatch(updateQuote({ symbol, quote }));
      } catch (e) {
       
      }
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [symbol, dispatch]);

  
  const onBuy = () => {
    navigate("/order", {
      state: { symbol: selected.symbol, price: selected.quote?.c },
    });
  };

  
  const onAddToWatchlist = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      await API.post(
        `${API_BASE}api/watchlist`,
        { symbol },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`${symbol} added to watchlist!`);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to watchlist");
    } finally {
      setAdding(false);
    }
  };

  if (detailStatus === "loading") return <p className="p-4">Loading...</p>;
  if (!selected) return <p className="p-4">No data available.</p>;

  return (
    <div className="p-6">
      {/* Stock header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {selected.symbol} - {selected?.name}
        </h1>
        <div>
          <button
            onClick={onBuy}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2 disabled:opacity-50"
            disabled={buying}
          >
            {buying ? "Buying..." : "Buy Now"}
          </button>

          <button
            onClick={onAddToWatchlist}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Watchlist"}
          </button>
        </div>
      </div>

      {/* Quote section */}
      <div className="mt-4">
        <div>Price: ${selected.quote?.c ?? "—"}</div>
        <div>
          Open: ${selected.quote?.o ?? "—"} | High: ${selected.quote?.h ?? "—"} | Low: $
          {selected.quote?.l ?? "—"} | Prev Close: ${selected.quote?.pc ?? "—"}
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="mt-4">
        <label>Timeframe: </label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="ml-2 border px-2 py-1"
        >
          <option value="1h">1 Hour</option>
          <option value="4h">4 Hours</option>
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      {/* Chart */}
      <div className="mt-6">
        <Charts symbol={symbol} candles={history?.candles} timeframe={range} />
      </div>
    </div>
  );
}
