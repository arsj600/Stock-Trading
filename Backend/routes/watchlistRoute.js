import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';




const wrouter = express.Router();

wrouter.post("/", addToWatchlist);
wrouter.get("/", getWatchlist);
wrouter.delete("/:symbol", removeFromWatchlist);

export default wrouter;
