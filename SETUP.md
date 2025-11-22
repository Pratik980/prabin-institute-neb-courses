# Prabin Institute - Setup Guide

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Step 1: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://prabininstitute_db_user:prabin123@cluster0.ogtv4bj.mongodb.net/prabin_institute
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Payment Gateway Keys (Optional - for production)
ESEWA_SECRET_KEY=your_esewa_secret
KHALTI_SECRET_KEY=your_khalti_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# WhatsApp Notification (Optional)
WHATSAPP_API_KEY=your_callmebot_api_key
WHATSAPP_PHONE=your_phone_number_with_country_code

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_PATH=./uploads
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 3: Create Admin User

1. Register a user through the frontend at `http://localhost:5173/register`
2. Update the user role to 'admin' in MongoDB:

**Option A: Using MongoDB Compass**
- Connect to your MongoDB cluster
- Navigate to `prabin_institute` database → `users` collection
- Find your user document
- Change `role` field from `"student"` to `"admin"`

**Option B: Using MongoDB Shell**
```javascript
use prabin_institute
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Step 4: Test the Application

1. **As Student:**
   - Register/Login
   - Browse courses
   - Purchase a course
   - Wait for admin approval
   - Watch video lessons

2. **As Admin:**
   - Login with admin account
   - Go to Admin Dashboard
   - Approve pending enrollments
   - Create new courses
   - View analytics

## Payment Gateway Setup (Optional)

### eSewa
1. Register at [eSewa](https://esewa.com.np/)
2. Get your merchant credentials
3. Add to `.env` file

### Khalti
1. Register at [Khalti](https://khalti.com/)
2. Get your API keys
3. Add to `.env` file

### Stripe
1. Register at [Stripe](https://stripe.com/)
2. Get your secret and publishable keys
3. Add to `.env` file

## WhatsApp Notifications Setup (Optional)

For detailed step-by-step instructions, see **[WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md)**

**Quick Setup:**
1. Visit [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
2. Enter your WhatsApp number (with country code, e.g., +9779812345678)
3. Get your API key via WhatsApp message
4. Add to `.env` file:
   ```env
   WHATSAPP_API_KEY=your_api_key_from_whatsapp
   WHATSAPP_PHONE=your_phone_with_country_code_no_plus
   ADMIN_PHONE=your_phone_with_country_code_no_plus
   ```
   **Example:** `WHATSAPP_PHONE=9779812345678` (Nepal: 977 is country code, no + sign)
   
**Note:** Phone number must be in international format without + sign (e.g., `9779812345678` not `+9779812345678`)

## Troubleshooting

### MongoDB Connection Error
- Check your MongoDB connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database name is correct

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend server is running

### Module Not Found
- Run `npm install` in both backend and frontend directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment variables
2. Use a strong `JWT_SECRET`
3. Configure CORS for your production domain
4. Set up proper file storage (AWS S3, Cloudinary, etc.)

### Frontend
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API URLs to production backend

## Support

For issues or questions, check the main README.md file.

