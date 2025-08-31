const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");
const Cart = require("../Models/CartModel");
const { calculateUncollectedPenalty, updateUncollectedToFined } = require("../util/orderPenaltyCalculator");
const jwt = require("jsonwebtoken");

// Middleware to get userId from token
const getUserIdFromToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Create order
router.post("/api/orders", getUserIdFromToken, async (req, res) => {
  const { orderId, canteenName, price, status, paymentMode, items } = req.body;
  try {
    console.log("Order POST body:", req.body); // Debug log
    
    // ✅ Check if an Order with this orderId already exists
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(409).json({ error: "Order with this ID already exists." });
    }

    // Check for uncollected orders and calculate penalty
    const penaltyInfo = await calculateUncollectedPenalty(req.userId, canteenName);
    const totalPrice = price + penaltyInfo.penaltyAmount;

    // Create the order with total price (including penalty)
    const order = await Order.create({
      userId: req.userId,
      orderId,
      canteenName,
      price: totalPrice, // Total price including penalty
      originalPrice: price, // Store original order price
      penaltyAmount: penaltyInfo.penaltyAmount, // Store penalty amount
      status: "order placed",
      paymentMode,
      items,
    });

    // If payment is online, immediately update uncollected orders to fined
    if (paymentMode === "online" && penaltyInfo.penaltyAmount > 0) {
      await updateUncollectedToFined(req.userId, canteenName);
    }

    // ✅ Delete the matching cart (safe cleanup)
    await Cart.deleteOne({ orderId, userId: req.userId });
    
    res.status(201).json({
      ...order.toObject(),
      penaltyInfo: {
        hasUncollectedOrders: penaltyInfo.penaltyAmount > 0,
        penaltyAmount: penaltyInfo.penaltyAmount,
        totalUncollectedAmount: penaltyInfo.totalUncollectedAmount
      }
    });
  } catch (error) {
    console.error("Order creation error:", error); // Debug log
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
});

// Get user's orders
router.get("/api/orders", getUserIdFromToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get all orders for a specific canteen (for admin panel)
router.get("/api/admin/orders", async (req, res) => {
  const { canteenName } = req.query;
  if (!canteenName) return res.status(400).json({ error: "canteenName required" });
  try {
    const orders = await Order.find({ canteenName });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch canteen orders" });
  }
});

module.exports = router;
