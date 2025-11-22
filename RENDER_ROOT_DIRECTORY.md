# 📁 Render Root Directory Setting

## ✅ Correct Root Directory

**Set Root Directory to:** `backend`

---

## 🎯 Why?

Your project structure is:
```
PrabinInstittute/
├── frontend/          ← Frontend code (deploy to Netlify)
├── backend/           ← Backend code (deploy to Render) ← THIS ONE!
│   ├── server.js
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

Since your backend code is in the `backend/` folder, Render needs to know to look there.

---

## 📝 How to Set in Render Dashboard

### When Creating New Service:

1. **Connect Repository** → Select your GitHub repo
2. **Configure Service:**
   - **Name**: `prabin-institute-backend`
   - **Region**: Choose closest region
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend` ← **Enter this here!**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### If Service Already Exists:

1. Go to your service in Render dashboard
2. Click **"Settings"** tab
3. Scroll to **"Build & Deploy"** section
4. Find **"Root Directory"** field
5. Enter: `backend`
6. Click **"Save Changes"**
7. **Manual Deploy** → **"Deploy latest commit"**

---

## ✅ Verification

After setting root directory, Render should:
- ✅ Find `package.json` in the `backend/` folder
- ✅ Run `npm install` successfully
- ✅ Run `npm start` successfully
- ✅ Start your server on the configured port

---

## 🔍 Quick Check

If you see errors like:
- ❌ "Cannot find package.json"
- ❌ "No such file or directory: server.js"
- ❌ "Build failed"

→ **Check that Root Directory is set to `backend`** (not empty, not `/`, not `./backend`)

---

## 📸 Visual Guide

```
Render Dashboard → Your Service → Settings

┌─────────────────────────────────────┐
│  Build & Deploy                     │
├─────────────────────────────────────┤
│  Root Directory                     │
│  [backend              ]            │ ← Type "backend" here
│                                     │
│  Build Command                      │
│  [npm install          ]            │
│                                     │
│  Start Command                      │
│  [npm start            ]            │
└─────────────────────────────────────┘
```

---

## 🎉 That's It!

Once set correctly, Render will:
1. Look in the `backend/` folder
2. Find `package.json`
3. Install dependencies
4. Start your server

Your backend will be live! 🚀

