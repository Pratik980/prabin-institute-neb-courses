# 🔧 Detailed Fix for Netlify 404 Error

## ✅ What I've Done

1. ✅ Created `_redirects` file in `frontend/public/` 
2. ✅ Updated `frontend/netlify.toml` (removed conflicting base setting)
3. ✅ Created root-level `netlify.toml` as backup

---

## 🎯 Step-by-Step Fix

### Step 1: Verify Netlify Settings

Go to **Netlify Dashboard** → Your site → **Site settings** → **Build & deploy**:

```
Base directory: frontend
Package directory: frontend
Build command: npm install && npm run build
Publish directory: dist
```

**Important:** Make sure these match exactly!

---

### Step 2: Clear Netlify Cache

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. This ensures a fresh build

---

### Step 3: Verify _redirects File is Deployed

After deployment, check if `_redirects` is in your deployed files:

1. Go to **Deploys** tab
2. Click on the latest deploy
3. Click **"Browse published files"** or **"View deploy log"**
4. Look for `_redirects` file in the root of `dist/`

**OR** manually check:
- Visit: `https://yoursite.netlify.app/_redirects`
- You should see: `/*    /index.html   200`

---

### Step 4: Test the Fix

1. Visit your site: `https://yoursite.netlify.app`
2. Try navigating to: `https://yoursite.netlify.app/courses`
3. Try navigating to: `https://yoursite.netlify.app/login`
4. **Refresh the page** on any route - should still work!

---

## 🔍 Troubleshooting

### If still getting 404:

#### Option A: Check Deploy Logs

1. Go to **Deploys** → Latest deploy → **View deploy log**
2. Look for:
   - ✅ "Building site..." → Good
   - ✅ "Build complete" → Good
   - ❌ "Build failed" → Check errors
   - ❌ "Cannot find package.json" → Base directory wrong

#### Option B: Verify _redirects File

The `_redirects` file must be in `frontend/dist/` after build.

**Check locally:**
1. Run: `cd frontend && npm run build`
2. Check if `frontend/dist/_redirects` exists
3. If not, the file isn't being copied correctly

#### Option C: Use Netlify UI Redirects

If `_redirects` file isn't working:

1. Go to **Site settings** → **Redirects and rewrites**
2. Click **"New rule"**
3. Set:
   - **Rule:** `/*`
   - **Action:** `Rewrite`
   - **To:** `/index.html`
   - **Status:** `200`
4. Click **"Save"**
5. Redeploy

#### Option D: Check Base Path

If your site is at a subpath (like `yoursite.netlify.app/app/`):

1. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/app/', // if your site is at subpath
     // ... rest of config
   })
   ```

2. Update `_redirects`:
   ```
   /app/*    /app/index.html   200
   ```

---

## 📋 Files Checklist

Make sure these files exist:

- ✅ `frontend/public/_redirects` - Should contain: `/*    /index.html   200`
- ✅ `frontend/netlify.toml` - Should have redirects section
- ✅ `netlify.toml` (root) - Backup configuration

---

## 🎯 Most Common Issues

### Issue 1: Base Directory Mismatch
**Symptom:** Build fails or can't find files
**Fix:** Make sure Base directory in Netlify = `frontend`

### Issue 2: _redirects Not Copied
**Symptom:** 404 on routes, but homepage works
**Fix:** Verify `_redirects` is in `frontend/dist/` after build

### Issue 3: Cached Build
**Symptom:** Changes not taking effect
**Fix:** Clear cache and redeploy

### Issue 4: Wrong Publish Directory
**Symptom:** Can't find index.html
**Fix:** Publish directory should be `dist` (relative to base)

---

## ✅ Success Indicators

When it works, you'll see:

1. ✅ Homepage loads: `https://yoursite.netlify.app`
2. ✅ Routes work: `https://yoursite.netlify.app/courses`
3. ✅ Refresh works: Refresh any page, still works
4. ✅ `_redirects` accessible: `https://yoursite.netlify.app/_redirects` shows content

---

## 🆘 Still Not Working?

**Try this nuclear option:**

1. **Delete the site** on Netlify (or create a new one)
2. **Reconnect** to GitHub
3. **Set base directory:** `frontend`
4. **Set publish directory:** `dist`
5. **Deploy fresh**

This ensures no cached settings are interfering.

---

## 📞 Quick Test Commands

Test locally first:

```bash
cd frontend
npm run build
# Check if dist/_redirects exists
ls dist/_redirects
# Should show the file
cat dist/_redirects
# Should show: /*    /index.html   200
```

If this works locally, it should work on Netlify!

---

## 🎉 That's It!

Follow these steps and your 404 errors should be fixed!

