
require("dotenv").config()

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const User = mongoose.model("User", new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
}))

const Complaint = mongoose.model("Complaint", new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  photo: { type: String },
  status: { type: String, default: "pending" },
  remark: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
}))


async function seedDatabase() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB connected for seeding...")

  
    await User.deleteMany({})
    await Complaint.deleteMany({})
    console.log("Cleared existing data...")

   
    const hashedPassword = await bcrypt.hash("password123", 10)

    const users = await User.insertMany([
      {
        username: "john_doe",
        email: "john@example.com",
        password: hashedPassword,
        isAdmin: false,
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: hashedPassword,
        isAdmin: false,
      },
      {
        username: "admin_user",
        email: "admin@fixmycity.com",
        password: hashedPassword,
        isAdmin: true,
      },
    ])
    console.log("Created sample users...")

   
    await Complaint.insertMany([
      {
        title: "Large pothole on Main Street",
        description: "A huge pothole causing damage to vehicles.",
        location: "Main Street & Oak Avenue",
        status: "pending",
        userId: users[0]._id,
      },
      {
        title: "Broken streetlight",
        description: "The streetlight on Elm Street has been out for a week.",
        location: "123 Elm Street",
        status: "in-progress",
        remark: "Maintenance team notified.",
        userId: users[1]._id,
      },
    ])
    console.log("Created sample complaints...")
    console.log("\n✅ SEED DATA CREATED SUCCESSFULLY")

  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    
    await mongoose.connection.close()
    console.log("MongoDB connection closed.")
  }
}

seedDatabase()
