# 🔧 Netlify 404 Fix - Alternative Methods

## ✅ Method 1: Check Project Configuration

Since "Redirects and rewrites" isn't visible, try:

1. Go to **Project configuration** (in the menu you listed)
2. Look for:
   - **Redirects**
   - **Rewrites**
   - **Headers and redirects**
   - **Routing rules**
3. If you find any of these, add:
   - Rule: `/*`
   - To: `/index.html`
   - Status: `200`

---

## ✅ Method 2: Use netlify.toml (Already Done!)

The `netlify.toml` file should handle this automatically. Let's verify:

### Step 1: Check if netlify.toml is in the Right Place

**Option A:** If Netlify reads from root:
- ✅ `netlify.toml` (root) - Already created!

**Option B:** If Netlify reads from base directory:
- ✅ `frontend/netlify.toml` - Already created!

### Step 2: Push to GitHub

The `netlify.toml` files need to be in your GitHub repository:

```bash
git add netlify.toml frontend/netlify.toml frontend/public/_redirects
git commit -m "Fix: Add Netlify redirects configuration"
git push
```

### Step 3: Clear Cache & Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## ✅ Method 3: Verify _redirects File is Deployed

The `_redirects` file in `frontend/public/` should be copied to `dist/` during build.

### Check Locally First:

1. Open terminal in project root
2. Run:
   ```bash
   cd frontend
   npm run build
   ```
3. Check if file exists:
   ```bash
   cat dist/_redirects
   ```
4. Should show: `/*    /index.html   200`

### Check on Netlify:

After deployment, visit:
- `https://yoursite.netlify.app/_redirects`

Should show: `/*    /index.html   200`

If you see 404, the file isn't being deployed.

---

## ✅ Method 4: Fix netlify.toml Location

Since your base directory is `frontend`, Netlify might be looking for `netlify.toml` in the root of your repo (not in frontend).

**Current setup:**
- ✅ `netlify.toml` (root) - Should work!
- ✅ `frontend/netlify.toml` - Backup

**But we need to fix the root `netlify.toml`:**

The root `netlify.toml` has `publish = "frontend/dist"`, but if base is `frontend`, it should be `dist`.

Let me update it...

---

## 🎯 Recommended Steps

1. **Push all files to GitHub:**
   - `netlify.toml` (root)
   - `frontend/netlify.toml`
   - `frontend/public/_redirects`

2. **Clear cache and redeploy** on Netlify

3. **Test:** Visit `https://yoursite.netlify.app/courses`

4. **Verify:** Visit `https://yoursite.netlify.app/_redirects` (should show the redirect rule)

---

## 🔍 Troubleshooting

### If _redirects file isn't working:

The file format must be exact:
```
/*    /index.html   200
```

- No quotes
- Spaces between fields
- Status code: `200` (not 301 or 302)

### If netlify.toml isn't working:

Make sure:
- File is in the repository (pushed to GitHub)
- File syntax is correct (no typos)
- Netlify is reading from the correct location

---

## 📋 Quick Checklist

- [ ] `netlify.toml` exists in root
- [ ] `frontend/netlify.toml` exists
- [ ] `frontend/public/_redirects` exists
- [ ] All files pushed to GitHub
- [ ] Netlify settings: Base = `frontend`, Publish = `dist`
- [ ] Cleared cache and redeployed
- [ ] Tested: `yoursite.netlify.app/_redirects` shows content

---

## 🎉 That's It!

The `netlify.toml` and `_redirects` files should work automatically once pushed to GitHub and deployed!

