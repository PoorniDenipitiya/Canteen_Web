import React from "react";
import "./ComplaintForm.css";

const ComplaintForm = ({
  order,
  complaintType,
  setComplaintType,
  description,
  setDescription,
  imageFile,
  setImageFile,
  onClose,
  onSubmit,
  errorFields = {},
}) => {
  // Debug: log all form values on every render
  console.log('ComplaintForm values:', {
    order,
    complaintType,
    description,
    imageFile,
    errorFields
  });

  return (
    <div className="complaint-form-modal">
      <div className="complaint-form-box">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3>Submit a Complaint</h3>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Order ID</label>
              <input type="text" value={order.orderId} readOnly />
            </div>
            <div className="form-group">
              <label>Canteen Name</label>
              <input type="text" value={order.canteenName} readOnly />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ordered Date</label>
              <input type="text" value={order.orderedDate} readOnly />
            </div>
            <div className="form-group">
              <label>Total Price (Rs.)</label>
              <input type="text" value={order.price ? Number(order.price).toLocaleString() : '-'} readOnly />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Payment Mode</label>
              <input type="text" value={order.paymentMode ? order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1) : '-'} readOnly />
            </div>
            <div className="form-group">
              <label>Order Status</label>
              <input type="text" value={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : '-'} readOnly />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Complaint Type <span className="required">*</span></label>
              <select value={complaintType} onChange={e => setComplaintType(e.target.value)} required>
                <option value="">--select--</option>
                <option value="hygienic">Hygienic Related Complaint</option>
                <option value="general">General Complaint</option>
              </select>
              {errorFields.complaintType && <span className="error-msg">Required</span>}
            </div>
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              {imageFile && <span className="file-name">{imageFile.name}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Description <span className="required">*</span></label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe your complaint..."
              />
              {errorFields.description && <span className="error-msg">Required</span>}
            </div>
          </div>
          <button className="submit-btn" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
