# 🔧 Fix CORS and Double /api Issues

## 🐛 Problems Found

1. **Double `/api` in URL**: `https://prabin-institute-neb-courses.onrender.com/api/api/auth/login`
   - Your `VITE_API_URL` probably includes `/api` at the end
   - Code also adds `/api` when making requests
   - Result: `/api/api/...`

2. **CORS Trailing Slash Mismatch**:
   - Origin: `https://prabin-institute.netlify.app` (no slash)
   - CORS header: `https://prabin-institute.netlify.app/` (with slash)
   - They don't match exactly!

---

## ✅ What I Fixed

### 1. Frontend (axios.js)
- ✅ Automatically removes trailing slashes from `VITE_API_URL`
- ✅ Removes `/api` if it's at the end of the URL
- ✅ Ensures clean base URL

### 2. Backend (server.js)
- ✅ Normalizes CORS origin matching (removes trailing slashes)
- ✅ Handles both with and without trailing slashes
- ✅ More flexible CORS configuration

---

## 📋 What You Need to Do

### Step 1: Update Netlify Environment Variable

1. Go to **Netlify Dashboard** → Your site → **Site settings** → **Environment variables**
2. Find `VITE_API_URL`
3. **Update it to** (remove `/api` if present):
   ```
   https://prabin-institute-neb-courses.onrender.com
   ```
   **NOT:** `https://prabin-institute-neb-courses.onrender.com/api` ❌

4. Click **"Save"**

### Step 2: Update Render Environment Variable

1. Go to **Render Dashboard** → Your backend service → **Environment** tab
2. Find `FRONTEND_URL`
3. **Update it to** (remove trailing slash if present):
   ```
   https://prabin-institute.netlify.app
   ```
   **NOT:** `https://prabin-institute.netlify.app/` ❌

4. Click **"Save"**

### Step 3: Push Code Changes

The code fixes need to be pushed to GitHub:

```bash
git add frontend/src/config/axios.js backend/server.js
git commit -m "Fix: CORS and double /api URL issues"
git push
```

### Step 4: Redeploy Both Services

**Netlify:**
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

**Render:**
1. Go to **Render Dashboard** → Your backend service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Expected Result

After fixing:

**Before (Wrong):**
- ❌ URL: `https://prabin-institute-neb-courses.onrender.com/api/api/auth/login`
- ❌ CORS Error: Origin mismatch

**After (Correct):**
- ✅ URL: `https://prabin-institute-neb-courses.onrender.com/api/auth/login`
- ✅ No CORS errors
- ✅ Requests work!

---

## 🔍 Verify It's Fixed

1. Visit your Netlify site
2. Open **Developer Tools** (F12) → **Network** tab
3. Try to login
4. Check the request URL:
   - ✅ Should be: `https://prabin-institute-neb-courses.onrender.com/api/auth/login`
   - ❌ NOT: `https://prabin-institute-neb-courses.onrender.com/api/api/auth/login`

5. Check for CORS errors:
   - ✅ No CORS errors in console
   - ✅ Request succeeds

---

## 📝 Quick Checklist

- [ ] Updated `VITE_API_URL` in Netlify (no `/api` at end)
- [ ] Updated `FRONTEND_URL` in Render (no trailing slash)
- [ ] Pushed code changes to GitHub
- [ ] Redeployed Netlify
- [ ] Redeployed Render
- [ ] Tested login - works! ✅

---

## 🎉 That's It!

The CORS and double `/api` issues should now be fixed!

