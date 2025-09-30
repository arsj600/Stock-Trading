import Order from "../models/orderModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const placeOrder = async (req, res) => {
       try {
    const { symbol, quantity, price } = req.body;
     const userId = req.user._id;
    const amount = quantity * price;

    const order = await Order.create({
      userId,
      symbol,
      quantity,
      price,
      amount,
    });

       const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${symbol} x ${quantity}` },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/verify?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
      cancel_url: `${req.headers.origin}/verify?canceled=true&orderId=${order._id}`,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId, status: "paid" });
    const enriched = orders.map(o => ({
      _id: o._id,
      symbol: o.symbol,
      quantity: o.quantity,
      price: o.price,
      amount: o.amount
    }));

    const totalValue = enriched.reduce((acc, o) => acc + o.amount, 0);

    res.json({ success: true, orders: enriched, totalValue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


    export const verifyOrder = async (req, res) => {
     try {
    const { orderId, session_id } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      order.status = "paid";
      order.payment = true;
      await order.save();
      return res.json({ success: true, message: "Payment successful", order });
    } else {
      order.status = "cancelled";
      await order.save();
      return res.json({ success: false, message: "Payment not completed", order });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
  };
