const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");
const Cart = require("../Models/CartModel");
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

    const order = await Order.create({
      userId: req.userId,
      orderId,
      canteenName,
      price,
      status: "order placed",
      paymentMode,
      items,
    });

      // ✅ Delete the matching cart (safe cleanup)
    await Cart.deleteOne({ orderId, userId: req.userId });
    
    res.status(201).json(order);
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
