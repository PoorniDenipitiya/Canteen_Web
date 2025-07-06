const Complaint = require("../Models/ComplaintModel");
const { supabase } = require("../supabaseconfig");

async function submitComplaint(req, res) {
  try {
    const { orderId, canteenName, orderedDate, price, paymentMode, complaintType, title, description } = req.body;
    const image = req.file;

    if (!orderId || !canteenName || !orderedDate || !price || !paymentMode || !complaintType || !title || !description) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }


    let imageName;
    if (image) {
      const { data, error } = await supabase
        .storage
        .from('canteenz')
        .upload(Date.now() + "-" + image.originalname, image.buffer, {
          contentType: image.mimetype
        });
      if (error) {
        return res.status(500).json({ message: "Image upload failed", error: error.message });
      }
      imageName = data.path;
    }

    const complaint = new Complaint({
      orderId,
      canteenName,
      orderedDate,
      price,
      paymentMode,
      complaintType,
      title,
      description,
      image: imageName,
      userId: req.user.id
    });
    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function getUserComplaints(req, res) {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Fetch all complaints (public)
async function getAllComplaints(req, res) {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  submitComplaint,
  getUserComplaints,
  getAllComplaints
};
