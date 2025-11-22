# 🔧 Fix Netlify "Page Not Found" Error

## ✅ Solution Applied

I've fixed the 404 error by:

1. **Created `_redirects` file** in `frontend/public/` folder
   - This file gets copied to `dist/` during build
   - Tells Netlify to redirect all routes to `index.html`

2. **Updated `netlify.toml`** with correct base directory

---

## 📋 What You Need to Do

### Option 1: Update Netlify Settings (Recommended)

1. Go to **Netlify Dashboard** → Your site → **Site settings**
2. Go to **Build & deploy** → **Build settings**
3. Set these values:

```
Base directory: frontend
Build command: npm install && npm run build
Publish directory: frontend/dist
```

4. Click **"Save"**
5. Go to **Deploys** tab → **Trigger deploy** → **Deploy site**

### Option 2: Use netlify.toml (Already Done)

The `netlify.toml` file is already configured. Just:

1. **Commit and push** the changes:
   ```bash
   git add frontend/public/_redirects frontend/netlify.toml
   git commit -m "Fix: Add Netlify redirects for SPA routing"
   git push
   ```

2. Netlify will **auto-deploy** (if enabled)

---

## 🔍 Why This Happens

React Router uses **client-side routing**. When you visit:
- `https://yoursite.netlify.app/courses`
- `https://yoursite.netlify.app/login`

Netlify tries to find a file at `/courses` or `/login`, but these don't exist as files. They're React routes!

The `_redirects` file tells Netlify:
> "For any route that doesn't exist, serve `index.html` instead, and let React Router handle it."

---

## ✅ Verify It Works

After deploying:

1. Visit your Netlify URL: `https://yoursite.netlify.app`
2. Navigate to different pages:
   - `/courses` ✅ Should work
   - `/login` ✅ Should work
   - `/register` ✅ Should work
   - Any route ✅ Should work

3. **Refresh the page** on any route - should still work!

---

## 🎯 Quick Checklist

- ✅ `_redirects` file created in `frontend/public/`
- ✅ `netlify.toml` updated with base directory
- ⏳ **You need to:** Update Netlify build settings OR push changes to GitHub

---

## 🆘 Still Not Working?

**Check these:**

1. **Base directory in Netlify:** Should be `frontend`
2. **Publish directory:** Should be `frontend/dist` (or just `dist` if base is `frontend`)
3. **Build command:** Should run from `frontend/` folder
4. **Deploy logs:** Check if `_redirects` file is in the deployed files

---

## 📝 Files Changed

- ✅ `frontend/public/_redirects` - Created (redirects all routes to index.html)
- ✅ `frontend/netlify.toml` - Updated (added base directory)

---

## 🎉 That's It!

After updating Netlify settings or pushing to GitHub, your 404 errors should be fixed!

