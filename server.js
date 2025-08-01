
require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const multer=require("multer")
const path=require("path")
const fs=require("fs")
const app = express()

const PORT = process.env.PORT || 3000


    app.use(express.json())
     app.use(express.static("public"))
    app.use("/uploads", express.static("uploads"))


if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
    const upload = multer({ storage: storage })


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err))


const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
     email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isAdmin: { type: Boolean, default: false },
})

const User = mongoose.model("User", userSchema)


const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
     photo: { type: String }, 
    status: { type: String, default: "pending" }, 
  remark: { type: String },
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      createdAt: { type: Date, default: Date.now },
})

const Complaint = mongoose.model("Complaint", complaintSchema)


app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

   
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

   
    const hashedPassword = await bcrypt.hash(password, 10)

    
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


app.get("/api/complaints/user/:userId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch complaints" })
  }
})


app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId", "username email").sort({ createdAt: -1 })
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch complaints" })
  }
})


app.put("/api/complaints/:id", async (req, res) => {
  try {
    const { status, remark } = req.body

    await Complaint.findByIdAndUpdate(req.params.id, { status, remark })
    res.json({ message: "Complaint updated successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint" })
  }
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
