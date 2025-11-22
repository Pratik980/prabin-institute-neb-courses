# ⚡ Quick Deployment Guide - Render + Netlify

## 🚀 Deploy in 10 Minutes!

### Step 1: Deploy Backend to Render (5 min)

1. **Go to Render**: https://render.com → Sign up with GitHub

2. **New Web Service** → **Build and deploy from a Git repository**
   - Select: `prabin-institute-neb-courses`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables** (in Render → Environment tab):
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key_32_chars_min
   FRONTEND_URL=https://your-netlify-app.netlify.app (update after step 2)
   ESEWA_MERCHANT_ID=your_merchant_id
   ESEWA_SECRET_KEY=your_secret_key
   NODE_ENV=production
   ```

4. **Create Web Service** → Wait for deployment (3-5 min)
5. **Get Backend URL**: Copy the URL Render gives you (e.g., `https://xxx.onrender.com`)

---

### Step 2: Deploy Frontend to Netlify (5 min)

1. **Go to Netlify**: https://netlify.com → Sign up with GitHub

2. **Add new site** → **Import from Git** → Select your repo

3. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Environment Variables** (Netlify → Site settings → Environment variables):
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   ⚠️ **Use the Render URL from Step 1!**

5. **Deploy!** → Get your Netlify URL (e.g., `https://xxx.netlify.app`)

---

### Step 3: Update CORS (1 min)

1. Go back to **Render** → Your Service → **Environment**
2. Update `FRONTEND_URL` with your Netlify URL
3. Render auto-redeploys

---

### Step 4: Test! 🎉

Visit your Netlify URL and test:
- ✅ Homepage loads
- ✅ Can browse courses
- ✅ Can register/login
- ✅ API calls work

**Note**: First request to Render may take 30-60 seconds (free tier cold start)

---

## 🔧 Setup MongoDB Atlas (Free)

1. Go to https://mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier)
4. Create database user
5. **IMPORTANT: Whitelist IP for Render:**
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This is required for Render to connect!
6. Get connection string → Use in Render `MONGODB_URI`
7. **See `MONGODB_SETUP.md` for detailed instructions if you get connection errors**

---

## 📝 Environment Variables Checklist

### Render (Backend):
- [ ] `PORT=10000`
- [ ] `MONGODB_URI` (from MongoDB Atlas)
- [ ] `JWT_SECRET` (random 32+ char string)
- [ ] `FRONTEND_URL` (your Netlify URL)
- [ ] `ESEWA_MERCHANT_ID`
- [ ] `ESEWA_SECRET_KEY`
- [ ] `NODE_ENV=production`

### Netlify (Frontend):
- [ ] `VITE_API_URL` (your Render backend URL)

---

## 🆘 Common Issues

**CORS Error?**
- Check `FRONTEND_URL` in Render matches Netlify URL exactly
- Include `https://` in both
- Wait a few minutes after updating env vars

**API 404 or Slow?**
- Check `VITE_API_URL` in Netlify
- Make sure Render backend is running (check logs)
- First request after sleep takes 30-60 seconds (free tier)

**Build Fails?**
- Check build logs in Netlify
- Make sure Node version is 18+
- Check Render logs for backend issues

**Backend Sleeping?**
- Render free tier services sleep after 15 min inactivity
- First request wakes them up (takes 30-60 seconds)
- This is normal - consider paid plan for production

---

## 🎯 That's It!

Your app is now live! 🚀

For detailed instructions, see `DEPLOYMENT.md`

---

## 💡 Render Free Tier Notes

- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Services sleep after 15 min inactivity
- ⏱️ First request after sleep: 30-60 seconds
- 💰 Paid plans start at $7/month (always-on)
