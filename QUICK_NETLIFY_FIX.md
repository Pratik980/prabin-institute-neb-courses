# ⚡ Quick Netlify 404 Fix

## 🎯 Immediate Steps

### 1. Check Netlify Settings

Go to **Netlify Dashboard** → Your site → **Site settings** → **Build & deploy**:

**Must match exactly:**
- Base directory: `frontend`
- Publish directory: `dist`
- Build command: `npm install && npm run build`

### 2. Clear Cache & Redeploy

1. **Deploys** tab → **Trigger deploy** → **"Clear cache and deploy site"**
2. Wait for deployment

### 3. Test

Visit: `https://yoursite.netlify.app/courses`

---

## 🔧 Alternative: Use Netlify UI Redirects

If `_redirects` file isn't working:

1. **Site settings** → **Redirects and rewrites**
2. **New rule:**
   - Rule: `/*`
   - Action: `Rewrite`
   - To: `/index.html`
   - Status: `200`
3. **Save** → **Redeploy**

---

## ✅ Verify _redirects is Deployed

Visit: `https://yoursite.netlify.app/_redirects`

Should show: `/*    /index.html   200`

If you see 404, the file isn't being deployed correctly.

---

## 🎉 That's It!

Try the UI redirects method - it's the most reliable!

