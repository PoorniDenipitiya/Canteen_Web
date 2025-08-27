import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import config from '../config/appConfig';
import { AuthContext } from "../context/AuthContext";
import "./complaint.css";
import ComplaintForm from "./ComplaintForm";

const TrackOrder = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errorFields, setErrorFields] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");

  const fetchComplaints = async () => {
      try {
  const response = await axios.get(`${config.api_base_urls.user}/api/complaints`, { withCredentials: true });
        setComplaints(response.data);
      } catch (error) {
        setComplaints([]);
      }
    };
    
  // Fetch orders and complaints from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
  const response = await axios.get(`${config.api_base_urls.user}/api/orders`, { withCredentials: true });
        setOrders(response.data);
      } catch (error) {
        setOrders([]);
      }
    };

    

    fetchOrders();
    fetchComplaints();

    // Listen for orderPlaced event (same-tab) and storage event (cross-tab)
    const handleOrderUpdate = () => {
      fetchOrders();
      fetchComplaints();
    };
    window.addEventListener("orderPlaced", handleOrderUpdate);
    window.addEventListener("storage", handleOrderUpdate);
    return () => {
      window.removeEventListener("orderPlaced", handleOrderUpdate);
      window.removeEventListener("storage", handleOrderUpdate);
    };
  }, [user]);

  const handleComplaintClick = (order) => {
    setSelectedOrder(order);
    setComplaintType("");
    setDescription("");
    setTitle("");
    setImageFile(null);
    setErrorFields({});
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedOrder(null);
  };

  // Helper to get complaint status for an order
  const getComplaintStatus = (orderId) => {
    if (!Array.isArray(complaints)) return "";
    const complaint = complaints.find(c => c.orderId === orderId);
    return complaint ? complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1) : "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const errors = {};
    if (!complaintType) errors.complaintType = true;
    if (!description.trim()) errors.description = true;
    setErrorFields(errors);
    if (Object.keys(errors).length > 0) return;

    // Prepare form data
    const formData = new FormData();
    formData.append("orderId", selectedOrder.orderId);
    formData.append("canteenName", selectedOrder.canteenName);
    formData.append("orderedDate", selectedOrder.orderedDate);
    formData.append("price", selectedOrder.price);
    formData.append("paymentMode", selectedOrder.paymentMode);
    formData.append("complaintType", complaintType);
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
  await axios.post(`${config.api_base_urls.user}/api/complaints`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refetch complaints after submission
      fetchComplaints();
      setShowForm(false);
      setSelectedOrder(null);
      setComplaintType("");
      setDescription("");
      setTitle("");
      setImageFile(null);
      setErrorFields({});
    } catch (err) {
      alert("Failed to submit complaint. Please try again.");
    }
  };

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
              <th>Order Status</th>
              <th>Payment mode</th>
              <th>Make a Complaint</th>
              <th>Complaint Status</th>
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
                <td className="complaint-icon-cell">
                  <i className="fas fa-exclamation-circle complaint-icon" title="Make a Complaint" onClick={() => handleComplaintClick(order)}></i>
                </td>
                <td>{getComplaintStatus(order.orderId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && selectedOrder && (
        <ComplaintForm
          order={selectedOrder}
          complaintType={complaintType}
          setComplaintType={setComplaintType}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          imageFile={imageFile}
          setImageFile={setImageFile}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          errorFields={errorFields}
        />
      )}
    </div>
  );
};

export default TrackOrder;
