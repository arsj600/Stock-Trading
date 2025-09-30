import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomStocks } from "../state/stockSlice";
import { useNavigate } from "react-router-dom";
import greenarrowup from "../assets/greenarrowup.png";
import redarrowdown from "../assets/redarrowdown.png";

export function StocksList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, status } = useSelector((s) => s.stocks);

  const [page, setPage] = useState(1);

  // Filtering sorting state
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterTrend, setFilterTrend] = useState("all"); 
  const [sortBy, setSortBy] = useState("name"); 

  useEffect(() => {
    if (status === "idle") dispatch(fetchRandomStocks(50));
  }, [status, dispatch]);

  if (status === "loading") return <p className="p-4">Loading stocks...</p>;
  if (status === "failed") return <p className="p-4">Error loading stocks.</p>;

  // Filtering logic
  let filtered = list.filter((s) => {
    const price = s.quote?.c ?? null;
    const prevClose = s.quote?.pc ?? null;
    const change = price && prevClose ? price - prevClose : null;

    const matchesSearch =
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      (!minPrice || (price != null && price >= parseFloat(minPrice))) &&
      (!maxPrice || (price != null && price <= parseFloat(maxPrice)));

    const matchesTrend =
      filterTrend === "all" ||
      (filterTrend === "gainers" && change > 0) ||
      (filterTrend === "losers" && change < 0);

    return matchesSearch && matchesPrice && matchesTrend;
  });

  // Sorting
  filtered.sort((a, b) => {
    const priceA = a.quote?.c ?? 0;
    const priceB = b.quote?.c ?? 0;
    const changeA = a.quote?.c && a.quote?.pc ? a.quote.c - a.quote.pc : 0;
    const changeB = b.quote?.c && b.quote?.pc ? b.quote.c - b.quote.pc : 0;

    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price") return priceB - priceA;
    if (sortBy === "change") return changeB - changeA;
    return 0;
  });

  // Pagination
  const perPage = 10;
  const start = (page - 1) * perPage;
  const pageStocks = filtered.slice(start, start + perPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Screener</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 border rounded bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search symbol or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterTrend}
            onChange={(e) => setFilterTrend(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="gainers">Gainers</option>
            <option value="losers">Losers</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by % Change</option>
          </select>
        </div>
      </div>

      {/* Stock list */}
      <ul className="grid gap-3">
        {pageStocks.map((s) => {
          const price = s.quote?.c ?? null;
          const prevClose = s.quote?.pc ?? null;
          const isUp = price != null && prevClose != null && price > prevClose;
          const isDown = price != null && prevClose != null && price < prevClose;

          return (
            <li
              key={s.symbol}
              className="p-4 border rounded hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              onClick={() => navigate(`/stock/${s.symbol}`)}
            >
              <div>
                <div className="font-semibold">
                  {s.name} ({s.symbol})
                </div>
                <div className="text-gray-700">Price: ${price ?? "—"}</div>
              </div>
              <div>
                {isUp && <img src={greenarrowup} alt="up" className="w-8 h-8" />}
                {isDown && <img src={redarrowdown} alt="down" className="w-8 h-8" />}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} / {Math.ceil(filtered.length / perPage) || 1}
        </span>
        <button
          disabled={page === Math.ceil(filtered.length / perPage)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
