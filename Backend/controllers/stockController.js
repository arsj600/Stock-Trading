import axios from "axios";
import dotenv from "dotenv";
import WebSocket from "ws";

dotenv.config();
const API_KEY = process.env.FINNHUB_API_KEY?.trim();
if (!API_KEY) {
  console.error("Missing FINNHUB_API_KEY in .env");
  process.exit(1);
}

const FINNHUB = axios.create({ baseURL: "https://finnhub.io/api/v1" });

let cachedSymbols = [];
let latestQuotes = {};
let ws;


/* WebSocket Init with Fallback */
let wsConnected = false;
let restFallbackInterval;

function initFinnhubWS() {
  try {
    ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    ws.on("open", () => {
      wsConnected = true;
      console.log(" Finnhub WebSocket connected");

      // Clear fallback if WS works
      if (restFallbackInterval) {
        clearInterval(restFallbackInterval);
        restFallbackInterval = null;
      }

      cachedSymbols.forEach((s) => safeSubscribe(s.symbol));
    });

    ws.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg);
        if (parsed.type === "trade" && Array.isArray(parsed.data)) {
          parsed.data.forEach((trade) => {
            const prev = latestQuotes[trade.s]?.c ?? trade.p;
            latestQuotes[trade.s] = {
              c: trade.p,
              pc: prev,
              t: trade.t,
              v: trade.v,
            };
          });
        }
      } catch (e) {
        console.error("WS parse error:", e.message);
      }
    });

    ws.on("error", (err) => {
      console.error(" WebSocket error:", err.code, err.message);
      wsConnected = false;

      // start REST fallback if not running
      if (!restFallbackInterval) {
        console.warn(" Falling back to REST API (polling quotes)");
        restFallbackInterval = setInterval(async () => {
          if (cachedSymbols.length > 0) {
            await fetchQuotesInBatches(cachedSymbols, 5, 1200);
          }
        }, 5000); 
      }

      setTimeout(initFinnhubWS, 5000); 
    });

    ws.on("close", () => {
      console.warn(" WS closed - reconnecting in 5s...");
      wsConnected = false;

      // start REST fallback if not running
      if (!restFallbackInterval) {
        console.warn(" Falling back to REST API (polling quotes)");
        restFallbackInterval = setInterval(async () => {
          if (cachedSymbols.length > 0) {
            await fetchQuotesInBatches(cachedSymbols, 5, 1200);
          }
        }, 5000);
      }

      setTimeout(initFinnhubWS, 5000);
    });
  } catch (err) {
    console.error("WebSocket init failed:", err.message);
    wsConnected = false;

    if (!restFallbackInterval) {
      restFallbackInterval = setInterval(async () => {
        if (cachedSymbols.length > 0) {
          await fetchQuotesInBatches(cachedSymbols, 5, 1200);
        }
      }, 5000);
    }

    setTimeout(initFinnhubWS, 5000);
  }
}
initFinnhubWS();

function safeSubscribe(symbol) {
  try {
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  } catch {}
}

function safeUnsubscribe(symbol) {
  try {
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  } catch {}
}

/* Helpers */
async function fetchAllUSStocks(limit = 60, retries = 3, delayMs = 10000) {
  if (cachedSymbols.length > 0) return cachedSymbols;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await FINNHUB.get("/stock/symbol", {
        params: { exchange: "US", token: API_KEY },
        timeout: 5000, 
      });

      cachedSymbols = res.data
        .filter((s) => s.type === "Common Stock")
        .slice(0, limit)
        .map((s) => ({ symbol: s.symbol, name: s.description || s.symbol }));

      console.log(`Fetched ${cachedSymbols.length} US common stocks (capped at ${limit})`);
      return cachedSymbols;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs)); 
      } else {
        console.error("fetchAllUSStocks failed after retries, using backup symbols");
        cachedSymbols = [
          { symbol: "AAPL", name: "Apple" },
          { symbol: "MSFT", name: "Microsoft" },
          { symbol: "GOOGL", name: "Alphabet" },
        ];
        return cachedSymbols;
      }
    }
  }
}


async function getRandomSymbols(count = 5) {
  const all = await fetchAllUSStocks();
  const safeCount = Math.min(Math.max(1, count), all.length);
  return all
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, safeCount);
}

async function fetchOneQuote(symbol) {
  try {
    const res = await FINNHUB.get("/quote", { params: { symbol, token: API_KEY } });
    return {
      c: res.data.c,   // current price
      pc: res.data.pc, // previous close
      o: res.data.o,   // open
      h: res.data.h,   // high
      l: res.data.l,   // low
      t: Date.now(),
      v: res.data.v ?? 0,
    };
  } catch (err) {
    console.warn(`fetchOneQuote failed for ${symbol}:`, err.message);
    return { c: 0, pc: 0, o: 0, h: 0, l: 0, t: Date.now(), v: 0 };
  }
}

async function fetchQuotesInBatches(symbols, batchSize = 5, delayMs = 1200) {
  const data = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (s) => {
      let quote = latestQuotes[s.symbol];
      if (!quote || Date.now() - quote.t > 60_000) {
        quote = await fetchOneQuote(s.symbol);
        latestQuotes[s.symbol] = quote;
      }
      return { symbol: s.symbol, name: s.name, quote };
    }));
    data.push(...results);
    if (i + batchSize < symbols.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return data;
}

/*  Controller */
export async function getRandomStocks(req, res) {
  try {
    const count = Math.max(1, Number(req.query.count) || 5);
    const symbols = await getRandomSymbols(count);
    const data = await fetchQuotesInBatches(symbols);

    symbols.forEach((s) => safeSubscribe(s.symbol));
    res.json({ count: data.length, data });
  } catch (err) {
    console.error("getRandomStocks ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch random stocks" });
  }
}

export async function streamRandomStocks(req, res) {
  const count = Number(req.query.count) || 5;
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  const symbols = await getRandomSymbols(count);
  symbols.forEach((s) => safeSubscribe(s.symbol));

  const send = async () => {
    const payload = await fetchQuotesInBatches(symbols);
    res.write(`data: ${JSON.stringify({ count: payload.length, data: payload })}\n\n`);
  };

  await send();

  const id = setInterval(send, 5000);
  req.on("close", () => {
    clearInterval(id);
    symbols.forEach((s) => safeUnsubscribe(s.symbol));
  });
}

export async function getStock(req, res) {
  try {
    const { symbol } = req.params;
    const all = await fetchAllUSStocks();
    const name = all.find((s) => s.symbol === symbol)?.name || symbol;

    let quote = latestQuotes[symbol];
    if (!quote || Date.now() - quote.t > 60_000) {
      quote = await fetchOneQuote(symbol);
      latestQuotes[symbol] = quote;
    }

    res.json({ symbol, name, quote });
  } catch (err) {
    console.error("getStock ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch stock" });
  }
}

export async function getStockHistory(req, res) {
  try {
    const { symbol } = req.params;
    const now = Math.floor(Date.now() / 1000);
    const from = now - 60 * 60 * 24 * 30;

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${API_KEY}`;
    const response = await axios.get(url);

    if (response.data.s !== "ok") return res.json(fakeCandles(symbol));

    const candles = response.data.t.map((t, i) => ({
      time: t * 1000,
      open: response.data.o[i],
      high: response.data.h[i],
      low: response.data.l[i],
      close: response.data.c[i],
      volume: response.data.v[i],
    }));

    res.json({ symbol, candles });
  } catch (err) {
    res.json(fakeCandles(req.params.symbol));
  }
}


function fakeCandles(symbol) {
  const now = Date.now();
  const candles = Array.from({ length: 30 }, (_, i) => ({
    time: now - i * 86400000,
    open: 100 + Math.random() * 5,
    high: 105 + Math.random() * 5,
    low: 95 + Math.random() * 5,
    close: 100 + Math.random() * 5,
    volume: Math.floor(Math.random() * 1000),
  }));
  return { symbol, candles };
}
