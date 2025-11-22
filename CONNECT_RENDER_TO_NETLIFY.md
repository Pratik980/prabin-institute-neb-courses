# 🔗 Connect Render (Backend) to Netlify (Frontend)

## 📋 Step-by-Step Guide

---

## ✅ Step 1: Get Your Render Backend URL

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your backend service (e.g., `prabin-institute-backend`)
3. Copy the **Service URL** (looks like: `https://prabin-institute-backend.onrender.com`)
4. **Save this URL** - you'll need it!

---

## ✅ Step 2: Set Environment Variable in Netlify

### Option A: Using Netlify Dashboard (Recommended)

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Click on your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com` (your Render URL from Step 1)
6. Click **"Save"**

### Option B: Using netlify.toml

Add to your `frontend/netlify.toml`:

```toml
[build.environment]
  NODE_VERSION = "18"
  VITE_API_URL = "https://your-backend-url.onrender.com"
```

**⚠️ Note:** Replace `your-backend-url.onrender.com` with your actual Render URL!

---

## ✅ Step 3: Update Render CORS Settings

Make sure your Render backend allows requests from Netlify:

1. Go to **Render Dashboard** → Your backend service
2. Go to **Environment** tab
3. Check `FRONTEND_URL` environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://your-netlify-site.netlify.app` (your Netlify URL)

**If it doesn't exist, add it!**

---

## ✅ Step 4: Redeploy Both Services

### Netlify:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Render:
1. Go to **Render Dashboard** → Your backend service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Step 5: Test the Connection

1. Visit your Netlify site: `https://your-site.netlify.app`
2. Open browser **Developer Tools** (F12)
3. Go to **Console** tab
4. Try to use the site (login, view courses, etc.)
5. Check **Network** tab - API calls should go to your Render backend URL

**Expected:**
- ✅ API calls should go to: `https://your-backend.onrender.com/api/...`
- ✅ No CORS errors
- ✅ Data loads correctly

---

## 🔍 Troubleshooting

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Fix:**
1. Check `FRONTEND_URL` in Render environment variables
2. Make sure it matches your Netlify URL exactly
3. Redeploy Render backend

### Issue: 404 on API Calls

**Error:** `404 Not Found` on API requests

**Fix:**
1. Check `VITE_API_URL` in Netlify environment variables
2. Make sure it's your Render backend URL (without `/api` at the end)
3. Should be: `https://your-backend.onrender.com`
4. Redeploy Netlify

### Issue: API URL Not Updating

**Error:** Still calling localhost or wrong URL

**Fix:**
1. Clear Netlify cache and redeploy
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for the actual API URL being used

---

## 📝 Quick Checklist

- [ ] Got Render backend URL
- [ ] Added `VITE_API_URL` in Netlify environment variables
- [ ] Set `FRONTEND_URL` in Render environment variables
- [ ] Redeployed Netlify
- [ ] Redeployed Render
- [ ] Tested the connection
- [ ] No CORS errors
- [ ] Data loads correctly

---

## 🎯 Example Configuration

### Netlify Environment Variables:
```
VITE_API_URL = https://prabin-institute-backend.onrender.com
```

### Render Environment Variables:
```
FRONTEND_URL = https://prabin-institute.netlify.app
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key
PORT = 10000
NODE_ENV = production
```

---

## 🎉 That's It!

Your Netlify frontend is now connected to your Render backend!

All API calls from your frontend will go to your Render backend automatically.

