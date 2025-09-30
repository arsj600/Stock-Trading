import express from "express";
import {
  
  getStock,
  getStockHistory,
  getRandomStocks,
  streamRandomStocks,
} from "../controllers/stockController.js";

const stockRouter = express.Router();


stockRouter.get("/random", getRandomStocks);
stockRouter.get("/random/stream", streamRandomStocks);


stockRouter.get("/:symbol", getStock);
stockRouter.get("/:symbol/history", getStockHistory);

export default stockRouter;
