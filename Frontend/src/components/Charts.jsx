import React, { useEffect, useRef, useState } from "react";

// ------------------- Indicators -------------------
function calcSMA(arr, period) {
  const out = [];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= period) {
      sum -= arr[i - period];
      out.push(sum / period);
    } else if (i === period - 1) {
      out.push(sum / period);
    } else {
      out.push(null);
    }
  }
  return out;
}

// ------------------- Charts Component -------------------
export function Charts({ symbol, candles, timeframe = "1d" }) {
  const canvasRef = useRef(null);
  const [state, setState] = useState({ scale: 1, offset: 0 });

  // ✅ Prepare data
  const data = React.useMemo(() => {
    if (!candles || !Array.isArray(candles) || candles.length === 0) return null;
    return candles.map((d) => ({
      t: new Date(d.time),
      o: d.open,
      h: d.high,
      l: d.low,
      c: d.close,
      v: d.volume,
    }));
  }, [candles]);

  const indicators = React.useMemo(() => {
    if (!data) return null;
    return { sma20: calcSMA(data.map((d) => d.c), 20) };
  }, [data]);

  // ✅ Format labels depending on timeframe
  function formatLabel(date, index) {
    if (timeframe === "1h" || timeframe === "4h") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (timeframe === "1d") {
      return date.toLocaleTimeString([], { hour: "2-digit" });
    }
    if (timeframe === "1w") {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    if (timeframe === "1m") {
      return `Week ${Math.floor(index / 7) + 1}`;
    }
    if (timeframe === "1y") {
      return date.toLocaleDateString([], { month: "short" });
    }
    return date.toLocaleDateString();
  }

  // ✅ Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, width, height);

    const margin = 60;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;
    const N = data.length;

    const prices = data.flatMap((d) => [d.h, d.l]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const scaleY = chartHeight / (maxPrice - minPrice);
    const candleWidth = (chartWidth / N) * 0.7;

    // Y-axis
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 6; i++) {
      const price = minPrice + (i * (maxPrice - minPrice)) / 6;
      const y = margin + (maxPrice - price) * scaleY;
      ctx.strokeStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
      ctx.fillStyle = "#000";
      ctx.fillText(price.toFixed(2), margin - 8, y);
    }

    // X-axis
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const xSteps = Math.min(8, N);
    for (let i = 0; i < xSteps; i++) {
      const idx = Math.floor((i / (xSteps - 1)) * (N - 1));
      const d = data[idx].t;
      const x = margin + (idx + 0.5) * (chartWidth / N);
      ctx.strokeStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, height - margin);
      ctx.stroke();
      ctx.fillStyle = "#000";
      ctx.fillText(formatLabel(d, idx), x, height - margin + 6);
    }

    // Candles
    for (let i = 0; i < N; i++) {
      const d = data[i];
      const x = margin + (i + 0.5) * (chartWidth / N);
      const yOpen = margin + (maxPrice - d.o) * scaleY;
      const yClose = margin + (maxPrice - d.c) * scaleY;
      const yHigh = margin + (maxPrice - d.h) * scaleY;
      const yLow = margin + (maxPrice - d.l) * scaleY;
      ctx.strokeStyle = d.c >= d.o ? "green" : "red";
      ctx.fillStyle = d.c >= d.o ? "green" : "red";
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();
      ctx.fillRect(
        x - candleWidth / 2,
        Math.min(yOpen, yClose),
        candleWidth,
        Math.max(2, Math.abs(yClose - yOpen))
      );
    }

    // SMA20
    if (indicators?.sma20) {
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      indicators.sma20.forEach((val, i) => {
        if (val == null) return;
        const x = margin + (i + 0.5) * (chartWidth / N);
        const y = margin + (maxPrice - val) * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Time", width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Price ($)", 0, 0);
    ctx.restore();
  }, [data, indicators, timeframe]);

  return (
    <div style={{ width: "100%", height: 520, border: "1px solid #ddd" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
