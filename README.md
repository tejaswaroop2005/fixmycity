# FixMyCity - Civic Complaint Reporting System

## Project Overview

FixMyCity is a simple full-stack web application that allows citizens to report civic problems like potholes, broken streetlights, garbage issues, and other community concerns. Government officials can then view these complaints and update their status.

This is a college-level project built with basic web technologies, focusing on functionality over fancy design.

## Technologies Used

### Frontend
- Plain HTML5
- CSS3 (no frameworks)
- Vanilla JavaScript (no libraries)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer (for file uploads)
- bcrypt (for password hashing)

## Features

### For Citizens
- User registration and login
- Submit complaints with title, description, location, and optional photo
- View their own submitted complaints
- Track complaint status (pending, in-progress, resolved)
- See admin remarks on their complaints

### For Admins
- Separate admin login
- View all submitted complaints
- Update complaint status
- Add remarks to complaints
- See citizen information for each complaint

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017)

### Steps

1. **Clone or download the project files**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Make sure MongoDB is running**
   - Start MongoDB service on your system
   - Default connection: \`mongodb://localhost:27017/FixMyCity\`

4. **Seed the database with sample data**
   \`\`\`bash
   npm run seed
   \`\`\`

5. **Start the server**
   \`\`\`bash
   npm start
   \`\`\`
   
   For development with auto-restart:
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser and go to**
   \`http://localhost:3000\`

## Sample Login Credentials

### Citizens
- **Username:** john_doe, **Password:** password123
- **Username:** jane_smith, **Password:** password123

### Admins
- **Username:** admin_user, **Password:** password123


## Project Structure

\`\`\`
FixMyCity/
├── server.js              # Main server file
├── seed.js                # Database seeding script
├── package.json           # Project dependencies
├── README.md             # This file
├── uploads/              # Directory for uploaded photos
└── public/               # Frontend files
    ├── index.html        # Home page
    ├── login.html        # Citizen login
    ├── register.html     # Citizen registration
    ├── dashboard.html    # Citizen dashboard
    ├── admin-login.html  # Admin login
    ├── admin-dashboard.html # Admin dashboard
    └── style.css         # Basic styling
\`\`\`

## How to Use

### For Citizens
1. Go to the home page
2. Register a new account or login with existing credentials
3. Submit complaints using the form on the dashboard
4. View your submitted complaints and their current status

### For Admins
1. Go to the home page and click "Admin Login"
2. Login with admin credentials
3. View all complaints from all citizens
4. Update complaint status and add remarks

## Database Schema

### Users Collection
- username (String, unique)
- email (String, unique)
- password (String, hashed)
- isAdmin (Boolean)

### Complaints Collection
- title (String)
- description (String)
- location (String)
- photo (String, filename)
- status (String: pending/in-progress/resolved)
- remark (String, optional)
- userId (ObjectId, reference to User)
- createdAt (Date)

## Notes

- This is a basic college project focusing on core functionality
- No advanced security features implemented
- File uploads are stored locally in the uploads/ directory
- Basic error handling and validation
- Simple, clean UI without fancy styling
- All authentication is stored in localStorage (not production-ready)

## Future Improvements

- Add proper session management
- Implement email notifications
- Add photo compression
- Better error handling and validation
- Mobile-responsive design
- Search and filter functionality
- User profile management

---

**Created by:** Student  
**Course:** Web Development  
**Year:** 2024
