// src/components/Charts.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export function Charts({ symbol, candles, timeframe = "1d" }) {
  if (!candles || candles.length === 0) {
    return <div className="p-4 text-gray-500">No chart data available</div>;
  }

  // ✅ Format data for recharts
  const data = candles.map((c) => ({
    time: new Date(c.time).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    }),
    close: c.close,
  }));

  return (
    <div className="w-full h-[400px] mt-6 border rounded-lg p-2 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2 text-center">
        {symbol} Price Chart ({timeframe})
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(v) => [`$${v.toFixed(2)}`, "Close"]}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
