# 🚀 Deployment Guide: Netlify (Frontend) + Render (Backend)

This guide will walk you through deploying your NEB Video Courses Platform to production.

---

## 📋 Prerequisites

- GitHub account with your code pushed
- Netlify account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (free tier available) OR use Render's MongoDB

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Render

1. **Create a `render.yaml` file** (already created in backend folder)
2. **Update your MongoDB connection** to use MongoDB Atlas (recommended)

### Step 2: Sign up for Render

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)

### Step 3: Create New Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Connect your GitHub account if not already connected
4. Select your repository: `prabin-institute-neb-courses`
5. Configure the service:
   - **Name**: `prabin-institute-backend` (or any name you prefer)
   - **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or choose paid for better performance)

### Step 4: Configure Environment Variables

In Render dashboard, go to your service → **Environment** tab, and add:

```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
FRONTEND_URL=https://your-netlify-app.netlify.app
ESEWA_MERCHANT_ID=your_esewa_merchant_id
ESEWA_SECRET_KEY=your_esewa_secret_key
NODE_ENV=production
```

**Important Notes:**
- Render uses port `10000` by default (or the PORT env var you set)
- Make sure `FRONTEND_URL` matches your Netlify URL (update after Step 2)

**How to get MongoDB Atlas URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. **IMPORTANT: Whitelist IP for Render:**
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This is required! Render's IP must be whitelisted
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

**⚠️ If you get connection errors, see `MONGODB_SETUP.md` for troubleshooting**

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
3. Wait for deployment to complete (usually 3-5 minutes for first deploy)

### Step 6: Get Your Backend URL

1. Once deployed, Render will provide a URL like: `https://prabin-institute-backend.onrender.com`
2. **Copy this URL** - you'll need it for the frontend!
3. Note: Free tier services spin down after 15 minutes of inactivity, so first request may be slow

---

## 🎨 Part 2: Deploy Frontend to Netlify

### Step 1: Prepare Frontend

1. **Create environment file** in `frontend` folder:
   - Create `.env.production` file (or set in Netlify)
   - Add: `VITE_API_URL=https://your-render-backend.onrender.com`

2. **Update axios calls** (already done - using the config file)

### Step 2: Sign up for Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Click **"Sign up"** → Choose **"GitHub"**

### Step 3: Deploy from GitHub

1. Click **"Add new site"** → **"Import an existing project"**
2. Select **"GitHub"** and authorize Netlify
3. Choose your repository: `prabin-institute-neb-courses`
4. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

### Step 4: Add Environment Variables

In Netlify dashboard → **Site settings** → **Environment variables**, add:

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

**Replace with your actual Render backend URL!**

### Step 5: Deploy

1. Click **"Deploy site"**
2. Netlify will:
   - Install dependencies
   - Run build command
   - Deploy to a URL like: `https://random-name-123.netlify.app`

### Step 6: Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable to your Netlify URL:
   ```
   FRONTEND_URL=https://your-netlify-app.netlify.app
   ```
3. Render will automatically redeploy

### Step 7: Custom Domain (Optional)

1. In Netlify → **Domain settings**
2. Click **"Add custom domain"**
3. Follow instructions to configure your domain

---

## 🔄 Part 3: Update Configuration

### Update Frontend API URL

After getting your Render backend URL, update Netlify environment variable:

1. Netlify Dashboard → Your Site → **Site settings** → **Environment variables**
2. Update `VITE_API_URL` with your Render URL
3. Trigger a new deployment (or it will auto-deploy on next git push)

### Update Backend CORS

1. Render Dashboard → Your Service → **Environment**
2. Update `FRONTEND_URL` with your Netlify URL
3. Render will auto-redeploy

---

## ✅ Part 4: Verify Deployment

### Test Your Backend

1. Visit: `https://your-backend.onrender.com/api/courses`
2. Should return JSON data (or empty array if no courses)
3. **Note**: Free tier may take 30-60 seconds to wake up if it was sleeping

### Test Your Frontend

1. Visit your Netlify URL
2. Try to:
   - Browse courses
   - Register/Login
   - View dashboard

### Common Issues

**CORS Error:**
- Make sure `FRONTEND_URL` in Render matches your Netlify URL exactly
- Include `https://` in the URL
- Wait a few minutes after updating env vars for redeploy

**API Not Found:**
- Check `VITE_API_URL` in Netlify environment variables
- Make sure it includes `https://` and no trailing slash
- First request may be slow (Render free tier cold start)

**Build Fails:**
- Check build logs in Netlify
- Make sure all dependencies are in `package.json`
- Check for TypeScript errors if using TS

**Backend Timeout:**
- Render free tier has request timeout limits
- Consider upgrading to paid plan for production
- Or optimize your API response times

---

## 🔐 Part 5: Security Checklist

- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Never commit `.env` files
- [ ] Use HTTPS (automatic on Netlify/Render)
- [ ] Enable MongoDB IP whitelist (allow Render IPs or 0.0.0.0/0)
- [ ] Set up MongoDB database user with limited permissions

---

## 📊 Part 6: Monitoring & Logs

### Render Logs
- Render Dashboard → Your Service → **Logs** tab
- Real-time logs available
- Can download logs for analysis

### Netlify Logs
- Netlify Dashboard → Your Site → **Deploys** → Click deploy → View build logs
- Function logs available in Functions tab

---

## 🔄 Part 7: Continuous Deployment

Both platforms support auto-deployment:

- **Render:** Auto-deploys on push to main branch (configurable)
- **Netlify:** Auto-deploys on push to main branch

Just push to GitHub and both will redeploy automatically!

---

## 💰 Pricing

### Netlify (Free Tier)
- 100GB bandwidth/month
- 300 build minutes/month
- Perfect for most projects

### Render (Free Tier)
- 750 hours/month (enough for 24/7)
- Services sleep after 15 min inactivity
- First request after sleep takes 30-60 seconds
- Perfect for development/small projects
- **Paid plans**: Start at $7/month for always-on service

### MongoDB Atlas (Free Tier)
- 512MB storage
- Perfect for development/small projects

---

## 🆘 Troubleshooting

### Backend won't start
- Check Render logs
- Verify all environment variables are set
- Check MongoDB connection string
- Verify PORT is set correctly (Render uses 10000 by default)

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors
- Wait for Render service to wake up (if free tier)

### Build fails
- Check Node version (should be 18+)
- Verify all dependencies are installed
- Check for syntax errors
- Review build logs

### Slow first request
- Render free tier services sleep after inactivity
- First request after sleep takes 30-60 seconds
- This is normal for free tier
- Consider paid plan for production

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

## 🎯 Render-Specific Tips

1. **Auto-Deploy**: Render auto-deploys on git push (enabled by default)
2. **Manual Deploy**: You can trigger manual deploys from dashboard
3. **Environment Variables**: Can be set per-service or per-environment
4. **Custom Domains**: Render supports custom domains on all plans
5. **Health Checks**: Configure health check endpoint for better monitoring
6. **Sleep Mode**: Free tier services sleep after 15 min - first request wakes them up

---

**🎉 Congratulations! Your app is now live!**
