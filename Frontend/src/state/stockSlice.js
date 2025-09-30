import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axiosInstance";


const API_BASE = import.meta.env.VITE_API_BASE ;

export const fetchRandomStocks = createAsyncThunk(
  "stocks/fetchRandom",
  async (count = 50) => {
    const res = await API.get(`${API_BASE}api/stocks/random?count=${count}`);
    return res.data.data;
  }
);

export const fetchStockDetail = createAsyncThunk(
  "stocks/fetchDetail",
  async (symbol) => {
    const res = await API.get(`${API_BASE}api/stocks/${symbol}`);
    return res.data;
  }
);

export const fetchStockHistory = createAsyncThunk(
  "stocks/fetchHistory",
  async ({ symbol, range }) => {
    const res = await API.get(`${API_BASE}api/stocks/${symbol}/history?range=${range}`);
    return res.data;
  }
);

const slice = createSlice({
  name: "stocks",
  initialState: {
    list: [],
    status: "idle",
    selected: null,
    detailStatus: "idle",
    history: null,
    historyStatus: "idle",
    error: null
  },
  reducers: {
   updateQuote(state, action) {
  const { symbol, quote } = action.payload;
  const stock = state.list.find(s => s.symbol === symbol);
  if (stock) stock.quote = quote;
  if (state.selected?.symbol === symbol) {
    state.selected.quote = quote;
  }
}
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRandomStocks.pending, (s)=>{ s.status="loading"; })
      .addCase(fetchRandomStocks.fulfilled, (s, act)=>{ s.status="succeeded"; s.list = act.payload; })
      .addCase(fetchRandomStocks.rejected, (s, act)=>{ s.status="failed"; s.error = act.error.message; })

      .addCase(fetchStockDetail.pending, (s)=>{ s.detailStatus="loading"; })
      .addCase(fetchStockDetail.fulfilled, (s, act)=>{ s.detailStatus="succeeded"; s.selected = act.payload; })
      .addCase(fetchStockDetail.rejected, (s, act)=>{ s.detailStatus="failed"; s.error = act.error.message; })

      .addCase(fetchStockHistory.pending, (s)=>{ s.historyStatus="loading"; })
      .addCase(fetchStockHistory.fulfilled, (s, act)=>{ s.historyStatus="succeeded"; s.history = act.payload; })
      .addCase(fetchStockHistory.rejected, (s, act)=>{ s.historyStatus="failed"; s.error = act.error.message; });
  }
});

export const { updateQuote } = slice.actions;
export default slice.reducer;
