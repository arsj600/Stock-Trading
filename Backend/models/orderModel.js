import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, paid, cancelled
  payment: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
