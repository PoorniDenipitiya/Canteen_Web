/*import React from "react";

const CartPage = () => {
  return (
    <div>
      <h1>Hi Cart</h1>
    </div>
  );
};

export default CartPage;
*/

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import config from '../config/appConfig';
import "./viewCart.css";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import cake from "../Assets/cake.jpeg"; // Default image
import { useNavigate } from "react-router-dom";


const ViewCart = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [cartDetails, setCartDetails] = useState([]);
  const [expandedCart, setExpandedCart] = useState(null);
  const [showPayOnline, setShowPayOnline] = useState(false);
  const [penaltyInfo, setPenaltyInfo] = useState({});

  const navigate = useNavigate();

  const [showPayment, setShowPayment] = useState(false);

  // Check for uncollected orders and calculate penalty
  const checkUncollectedPenalty = async (canteenName) => {
    try {
      const response = await axios.get(`${config.api_base_urls.user}/api/orders`, { withCredentials: true });
      const userOrders = response.data;
      
      // Find uncollected orders for this canteen with cash payment
      const uncollectedOrders = userOrders.filter(order => 
        order.canteenName === canteenName && 
        order.status === "uncollected" && 
        order.paymentMode === "cash"
      );
      
      if (uncollectedOrders.length > 0) {
        const totalUncollectedAmount = uncollectedOrders.reduce((sum, order) => sum + order.price, 0);
        const penaltyAmount = totalUncollectedAmount * 0.5;
        
        setPenaltyInfo(prev => ({
          ...prev,
          [canteenName]: {
            hasUncollectedOrders: true,
            penaltyAmount,
            totalUncollectedAmount,
            uncollectedOrders
          }
        }));
      } else {
        setPenaltyInfo(prev => ({
          ...prev,
          [canteenName]: {
            hasUncollectedOrders: false,
            penaltyAmount: 0,
            totalUncollectedAmount: 0,
            uncollectedOrders: []
          }
        }));
      }
    } catch (error) {
      console.error('Error checking uncollected penalty:', error);
    }
  };

  // Load PayHere script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check penalty for each cart when cart details change
  useEffect(() => {
    if (cartDetails.length > 0) {
      cartDetails.forEach(cart => {
        if (cart.canteenName) {
          checkUncollectedPenalty(cart.canteenName);
        }
      });
    }
  }, [cartDetails]);

  //Payhere payment handler
  const handleOnlinePayment = async (cart, cartIndex) => {
    // Prepare data for hash
    // Calculate total amount including penalty for this cart
    const penalty = penaltyInfo[cart.canteenName];
    const hasPenalty = penalty && penalty.hasUncollectedOrders;
    const totalAmount = hasPenalty ? cart.subtotal + penalty.penaltyAmount : cart.subtotal;
    
    const paymentData = {
      merchant_id: process.env.REACT_APP_PAYHERE_MERCHANT_ID,
      order_id: cart.orderId || cart.order_id || Math.random().toString(36).substr(2, 9),
      amount: totalAmount.toFixed(2),
      currency: "LKR",
    };

  // Get hash from backend
  let hash = "";
  try {
  const response = await axios.post(`${config.api_base_urls.user}/api/payhere/hash`, paymentData);
    hash = response.data.hash;
  } catch (err) {
    alert("Failed to get payment hash");
    return;
  }

    const payment = {
      ...paymentData,
      sandbox: true,
      merchant_id: process.env.REACT_APP_PAYHERE_MERCHANT_ID,
  return_url: `${window.location.origin}/return`,
  cancel_url: `${window.location.origin}/cancel`,
  notify_url: `${config.api_base_urls.admin}/api/payments/notify`,
      items: cart.canteenName || `Cart ${cartIndex + 1}`,
      first_name: user?.firstName || "User",
      last_name: user?.lastName || "",
      email: user?.email || "user@example.com",
      phone: user?.phone || "0771234567",
      address: user?.address || "123, Main Street",
      city: user?.city || "Colombo",
      country: user?.country || "Sri Lanka",
      image_url: cart.items[0]?.image
        ? `https://ucfpbbcfacgrehcoscar.supabase.co/storage/v1/object/public/canteenz/${cart.items[0].image}`
        : undefined, // Use first item's image or undefined
        hash,
    };

    window.payhere.startPayment(payment);

    window.payhere.onCompleted = async (orderId) => {
      alert("Payment completed. Order ID: " + orderId);
      await placeOrder(cart, "online");
      navigate("/myorder");
    };
    window.payhere.onDismissed = () => {
      alert("Payment dismissed");
    };
    window.payhere.onError = (error) => {
      alert("Payment error: " + error);
    };
  };

  // Save order to backend and remove cart from backend after order placed
const saveOrderToBackend = async (cart, paymentMode) => {
  try {
    // Always generate a unique orderId for new orders
    const uniqueOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await axios.post(
  `${config.api_base_urls.user}/api/orders`,
      {
        orderId: uniqueOrderId,
        canteenName: cart.canteenName,
        price: cart.subtotal,
        status: "processing",
        paymentMode,
        items: cart.items, // Send items to backend
      },
      { withCredentials: true }
    );
    try {
  await axios.delete(`${config.api_base_urls.user}/api/cart/${cart.orderId || cart.order_id}`, { withCredentials: true });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (deleteErr) {
      alert("Order placed, but failed to remove cart. Please refresh or contact support.");
      console.error("Failed to remove cart after order", deleteErr);
    }
  } catch (err) {
    alert("Failed to place order. Please try again.");
    console.error("Failed to save order to backend", err);
    throw err;
  }
};

// Remove cart from UI after order placed
const removeCart = (orderId) => {
  const updatedCartDetails = cartDetails.filter((cart) => cart.orderId !== orderId && cart.order_id !== orderId);
  setCartDetails(updatedCartDetails);
  window.dispatchEvent(new Event("cartUpdated"));
};

// Place order: save to backend, then remove cart from UI
const placeOrder = async (cart, paymentMode) => {
  try {
    await saveOrderToBackend(cart, paymentMode);
    window.dispatchEvent(new Event("orderPlaced"));
  } catch (err) {
    // Error already handled in saveOrderToBackend
  }
};

// Handle cash payment for a single cart
const handleCashPayment = async (cart) => {
  await placeOrder(cart, "cash");
  navigate("/myorder");
};

  useEffect(() => {
    // Fetch cart details from backend
    const fetchCartDetails = async () => {
      if (!isLoggedIn) return;
      try {
  const response = await axios.get(`${config.api_base_urls.user}/api/cart`, { withCredentials: true });
        setCartDetails(response.data);
      } catch (error) {
        setCartDetails([]);
      }
    };
    fetchCartDetails();
    // Listen for cart updates (cross-tab and same-tab)
    const handleCartUpdate = () => fetchCartDetails();
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("orderPlaced", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("orderPlaced", handleCartUpdate);
    };
  }, [isLoggedIn, user]);

  // Function to toggle expanded cart
  const toggleExpandCart = (index) => {
    if (expandedCart === index) {
      setExpandedCart(null);
    } else {
      setExpandedCart(index);
    }
  };

  // Function to update quantity
  const updateQuantity = async (cartIndex, itemIndex, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Create a deep copy of cartDetails
      const updatedCartDetails = JSON.parse(JSON.stringify(cartDetails));
      updatedCartDetails[cartIndex].items[itemIndex].quantity = newQuantity;

      // Update subtotal for this cart
      updatedCartDetails[cartIndex].subtotal = updatedCartDetails[
        cartIndex
      ].items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      setCartDetails(updatedCartDetails);

      // Update localStorage
      localStorage.setItem("cartDetails", JSON.stringify(updatedCartDetails));

      // You might want to also update on the server
      // await axios.put(...);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Function to delete item
  const deleteItem = async (cartIndex, itemIndex) => {
    try {
      // Create a deep copy of cartDetails
      const updatedCartDetails = JSON.parse(JSON.stringify(cartDetails));

      // Remove the item
      updatedCartDetails[cartIndex].items.splice(itemIndex, 1);

      // Update subtotal for this cart
      updatedCartDetails[cartIndex].subtotal = updatedCartDetails[
        cartIndex
      ].items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // If no items left in this cart, remove the entire cart
      if (updatedCartDetails[cartIndex].items.length === 0) {
        updatedCartDetails.splice(cartIndex, 1);
      }

      setCartDetails(updatedCartDetails);

      // Update localStorage
      localStorage.setItem("cartDetails", JSON.stringify(updatedCartDetails));

      // You might want to also update on the server
      // await axios.delete(...);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Calculate total across all carts
  const totalAmount = cartDetails.reduce(
    (total, cart) => total + cart.subtotal,
    0
  );


  return (
    <div className="cart-container-viewCart">
      {/* Left side - Cart Table */}
      <div className="cart-items">
        <h2>Your Shopping Cart</h2>

        {cartDetails.length > 0 ? (
          <>
            {cartDetails.map((cart, cartIndex) => (
              <div key={cart.orderId || cartIndex} className="cart-section">
                <div
                  className="cart-header"
                  onClick={() => toggleExpandCart(cartIndex)}
                >
                  <h4>
                    Cart {cartIndex + 1} :{" "}
                    {cart.canteenName || "Unknown Canteen"}
                  </h4>
                  <div className="cart-summary-mini">
                    <span>Order ID: {cart.orderId}</span> /
                    <span>Items: {cart.items.length}</span> /
                    <span>Total: Rs.{cart.subtotal}.00</span>
                  </div>
                </div>
                {expandedCart === cartIndex && (
                  <table>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Food Item</th>
                        {/* <th>Image</th> */}
                        <th>Quantity</th>
                        <th>Unit Price (Rs.)</th>
                        <th>Total Price (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items &&
                        cart.items.map((item, itemIndex) => (
                          <tr key={item._id || itemIndex}>
                            <td>
                              <FaTrash
                                className="delete-icon"
                                onClick={() => deleteItem(cartIndex, itemIndex)}
                              />
                            </td>
                            <td>{item.name}</td>
                            {/*   <td> <img
                              src={
                                item.image
                                  ? `https://ucfpbbcfacgrehcoscar.supabase.co/storage/v1/object/public/canteenz/${item.image}`
                                  : cake
                              }
                              alt={item.name || "Food item"}
                              className="cart-image"
                            /> </td> */}
                            {/* <td>
                            {item.image && (
                              <img src={item.image} alt={item.name} className="cart-image" />
                            )}
                          </td>*/}
                            <td>
                              <button
                                className="quantity-btn"
                                onClick={() =>
                                  updateQuantity(
                                    cartIndex,
                                    itemIndex,
                                    (item.quantity || 1) - 1
                                  )
                                }
                              >
                                <FaMinus />
                              </button>
                              <span className="quantity">
                                {item.quantity || 1}
                              </span>
                              <button
                                className="quantity-btn"
                                onClick={() =>
                                  updateQuantity(
                                    cartIndex,
                                    itemIndex,
                                    (item.quantity || 1) + 1
                                  )
                                }
                              >
                                <FaPlus />
                              </button>
                            </td>
                            <td>Rs. {(item.price || 0).toLocaleString()}</td>
                            <td>
                              Rs.{" "}
                              {(
                                (item.price || 0) * (item.quantity || 1)
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}
      </div>

      {/* Right side - Cart Total */}
      <div className="cart-summary">
        <h3>Cart Total</h3>
        {cartDetails.map((cart, cartIndex) => {
          const penalty = penaltyInfo[cart.canteenName];
          const hasPenalty = penalty && penalty.hasUncollectedOrders;
          
          return (
            <div key={cartIndex}>
              <div className="subtotal">
                <span className="cart-no">
                  {" "}
                  <b>Cart {cartIndex + 1}:</b>
                </span>
                <span className="cart-total">Total: Rs.{cart.subtotal}.00</span>
              </div>
              
              {/* Show penalty information if there are uncollected orders */}
              {hasPenalty && (
                <div className="penalty-info" style={{ 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px', 
                  padding: '10px', 
                  margin: '10px 0',
                  fontSize: '14px'
                }}>
                  <div style={{ color: '#856404', fontWeight: 'bold', marginBottom: '5px' }}>
                    ⚠️ Previous Uncollected Orders
                  </div>
                  <div style={{ color: '#856404', marginBottom: '5px' }}>
                    Total Uncollected: Rs. {penalty.totalUncollectedAmount.toLocaleString()}
                  </div>
                  <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    Penalty (50%): Rs. {penalty.penaltyAmount.toLocaleString()}
                  </div>
                  <div style={{ color: '#856404', fontSize: '12px', marginTop: '5px' }}>
                    This amount will be added to your new order
                  </div>
                </div>
              )}
              
              {/* Show total with penalty */}
              {hasPenalty && (
                <div className="total-with-penalty" style={{ 
                  backgroundColor: '#f8d7da', 
                  border: '1px solid #f5c6cb', 
                  borderRadius: '4px', 
                  padding: '10px', 
                  margin: '10px 0',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#721c24', fontWeight: 'bold', fontSize: '16px' }}>
                    Total to Pay: Rs. {(cart.subtotal + penalty.penaltyAmount).toLocaleString()}
                  </div>
                  <div style={{ color: '#721c24', fontSize: '12px' }}>
                    (Order: Rs. {cart.subtotal.toLocaleString()} + Penalty: Rs. {penalty.penaltyAmount.toLocaleString()})
                  </div>
                </div>
              )}

              <div className="checkout-options">
                <button
                  className="checkout-btn-viewCart online"
                  disabled={cartDetails.length === 0}
                  onClick={() => handleOnlinePayment(cart, cartIndex)}
                >
                  Pay Online
                </button>
                <button
                  className="checkout-btn-viewCart cash"
                  disabled={cartDetails.length === 0}
                  onClick={() => handleCashPayment(cart)}
                >
                  Pay by Cash
                </button>
              </div>

              <hr></hr>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCart;
