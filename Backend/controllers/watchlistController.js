import userModel from "../models/userModel.js";

export const addToWatchlist = async (req, res) => {
  try {
    console.log("Incoming addToWatchlist", req.body, "User:", req.user?._id);

    const { symbol } = req.body;
    if (!symbol) {
      return res.json({ success: false, message: "Stock symbol required" });
    }

    const user = req.user;
    if (!user) {
      return res.json({ success: false, message: "No user from middleware" });
    }

    if (user.watchlist.includes(symbol)) {
      return res.json({ success: false, message: "Already in watchlist" });
    }

    user.watchlist.push(symbol);
    await user.save();

    console.log(" Updated user watchlist:", user.watchlist);

    res.json({ success: true, watchlist: user.watchlist });
  } catch (error) {
    console.error(" Error in addToWatchlist:", error);
    res.json({ success: false, message: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    res.json({ success: true, watchlist: req.user.watchlist });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = req.user;

    user.watchlist = user.watchlist.filter((s) => s !== symbol);
    await user.save();

    res.json({ success: true, watchlist: user.watchlist });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
