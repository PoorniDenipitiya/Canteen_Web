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

    // Get user email from UserModel using userId
    const UserModel = require("../Models/UserModel");
    let userEmail = "";
    try {
      const userDoc = await UserModel.findById(req.user.id);
      if (userDoc && userDoc.email) {
        userEmail = userDoc.email;
      }
    } catch (err) {
      // fallback: leave userEmail blank
    }

    // Send email to admin using nodemailer
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
       rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: userEmail || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Complaint Received : ${complaintType}`,
      text: `A new complaint has been submitted.\n\nOrder ID: ${orderId}\nCanteen Name: ${canteenName}\nOrdered Date: ${orderedDate}\nPrice: ${price}\nPayment Mode: ${paymentMode}\n\nTitle: ${title}\nDescription: ${description}\n\nSubmitted by: ${userEmail}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending complaint email:", error);
      } else {
        console.log("Complaint email sent:", info.response);
      }
    });

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
