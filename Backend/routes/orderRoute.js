import express from "express";
import { getUserOrders, placeOrder, verifyOrder } from "../controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/create", placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/my-orders", getUserOrders);


export default orderRouter;
