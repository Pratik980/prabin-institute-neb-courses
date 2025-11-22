# 🎓 Prabin Institute - NEB Video Courses Platform

A comprehensive full-stack learning management system designed for NEB (Nepal Education Board) exam preparation. Students can browse, enroll, and watch comprehensive video courses covering Physics, Chemistry, and Mathematics.

## ✨ Features

- 📹 **Video-based Course Delivery** - High-quality video lessons for self-paced learning
- 👥 **Student Enrollment System** - Easy course enrollment with admin approval workflow
- 📊 **Progress Tracking & Analytics** - Monitor learning progress with detailed analytics
- 🎨 **Modern UI Design** - Beautiful glassmorphism design with smooth animations
- 🔐 **Role-based Authentication** - Secure login system for Students and Admins
- 💳 **Payment Integration** - eSewa payment gateway integration
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎯 **Gamification** - Badges, trophies, and streaks to motivate learning
- 🔍 **Smart Search & Filters** - Find courses quickly with category and difficulty filters
- 📈 **Admin Dashboard** - Comprehensive admin panel for course and enrollment management

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling with custom animations
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ODM

### Payment
- **eSewa** - Payment gateway integration

## 📁 Project Structure

```
PrabinInstittute/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── ...
│   └── package.json
├── backend/           # Node.js backend API
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   ├── middleware/   # Custom middleware
│   └── package.json
└── README.md
```

## 🚀 Deployment

This project is configured for deployment on:
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

See `DEPLOYMENT.md` for detailed deployment instructions or `QUICK_DEPLOY.md` for a quick 10-minute guide.

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pratik980/prabin-institute-neb-courses.git
   cd prabin-institute-neb-courses
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ESEWA_MERCHANT_ID=your_esewa_merchant_id
   ESEWA_SECRET_KEY=your_esewa_secret_key
   ```

5. **Run the application**

   Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

   Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Key Features Explained

### For Students
- Browse and search courses by category (Physics, Chemistry, Mathematics)
- Enroll in courses with payment integration
- Watch video lessons at your own pace
- Track learning progress with visual progress bars
- View enrolled courses in personalized dashboard

### For Admins
- Create and manage courses
- Approve/reject student enrollments
- View analytics and statistics
- Manage course content and video lessons

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 👥 Contact

- **Phone**: 981-777-1000
- **Email**: prabininstitute@gmail.com

## 🙏 Acknowledgments

Built with ❤️ for NEB students preparing for their examinations.

---

**Note**: This platform is specifically designed for NEB (Nepal Education Board) Class 12 exam preparation.
