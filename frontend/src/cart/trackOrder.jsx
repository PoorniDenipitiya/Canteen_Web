import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./trackOrder.css"; // Create this for styling

const TrackOrder = () => {
  const { user } = useContext(AuthContext); // Assumes user info is available here
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/orders", { withCredentials: true });
        setOrders(response.data);
      } catch (error) {
        setOrders([]);
      }
    };
    fetchOrders();

    // Listen for orderPlaced event (same-tab) and storage event (cross-tab)
    const handleOrderUpdate = () => fetchOrders();
    window.addEventListener("orderPlaced", handleOrderUpdate);
    window.addEventListener("storage", handleOrderUpdate);
    return () => {
      window.removeEventListener("orderPlaced", handleOrderUpdate);
      window.removeEventListener("storage", handleOrderUpdate);
    };
  }, [user]);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusDot = (status) => {
    const colors = {
      "order placed": "#999",
      accepted: "#FFA500",
      processing: "#FFD700",
      "order ready": "#4CAF50",
      collected: "#2196F3",
    };
    return (
      <span className="status-indicator">
        <span className="dot" style={{ backgroundColor: colors[status] || "gray" }}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="track-order-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Canteen Name</th>
              <th>Ordered Date</th>
              <th>Total Price (Rs.)</th> 
              <th>Status</th>
              <th>Payment Mode</th>
              
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{order.orderId}</td>
                <td>{order.canteenName}</td>
                <td>{formatDate(order.orderedDate)}</td>
                <td>{order.price ? Number(order.price).toLocaleString() : '-'}</td>
                <td>{getStatusDot(order.status)}</td>
                <td>{order.paymentMode ? order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackOrder;
