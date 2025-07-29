// 1. Load environment variables from .env file
require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()
// Use the PORT from .env, or default to 3000
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage: storage })

// 2. Use the MONGO_URI from the .env file
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err))

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
})

const User = mongoose.model("User", userSchema)

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  photo: { type: String }, // file path
  status: { type: String, default: "pending" }, // pending, in-progress, resolved
  remark: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
})

const Complaint = mongoose.model("Complaint", complaintSchema)

// --- Routes (No changes needed here) ---

// User registration
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()
    res.json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ error: "Registration failed" })
  }
})


app.post("/api/login", async (req, res) => {
  try {
    
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
   

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

   
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Submit complaint
app.post("/api/complaints", upload.single("photo"), async (req, res) => {
  try {
    const { title, description, location, userId } = req.body

    const complaint = new Complaint({
      title,
      description,
      location,
      photo: req.file ? req.file.filename : null,
      userId,
    })

    await complaint.save()
    res.json({ message: "Complaint submitted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to submit complaint" })
  }
})

// Get user's complaints
app.get("/api/complaints/user/:userId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch complaints" })
  }
})

// Get all complaints (admin only)
app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId", "username email").sort({ createdAt: -1 })
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch complaints" })
  }
})

// Update complaint status (admin only)
app.put("/api/complaints/:id", async (req, res) => {
  try {
    const { status, remark } = req.body

    await Complaint.findByIdAndUpdate(req.params.id, { status, remark })
    res.json({ message: "Complaint updated successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint" })
  }
})

// --- End of Routes ---

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})