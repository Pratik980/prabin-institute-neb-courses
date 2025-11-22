# 🔧 Render "Can't Find Path" - Troubleshooting Guide

## ❌ Problem: Render can't find the `backend` folder

---

## ✅ Solution Checklist

### 1. **Verify Repository is Pushed to GitHub**

Render only works with GitHub repositories. Make sure:

- ✅ Your code is pushed to GitHub
- ✅ The `backend/` folder exists in your GitHub repository
- ✅ You can see `backend/package.json` on GitHub

**How to check:**
1. Go to: `https://github.com/Pratik980/prabin-institute-neb-courses`
2. Make sure you can see the `backend/` folder
3. Click into `backend/` and verify `package.json` exists

**If not pushed:**
- Run the `push-to-github.bat` script (double-click it)
- Or manually push using git commands

---

### 2. **Check Root Directory Setting**

In Render dashboard:

**Correct:**
- Root Directory: `backend` (just the word, lowercase)

**Wrong:**
- ❌ `Backend` (uppercase B)
- ❌ `/backend`
- ❌ `./backend`
- ❌ `backend/`
- ❌ Empty/blank
- ❌ Any Windows path like `C:\Users\...`

---

### 3. **Verify Repository Structure on GitHub**

Your GitHub repository should look like this:

```
prabin-institute-neb-courses/
├── backend/              ← This must exist!
│   ├── package.json      ← This must exist!
│   ├── server.js
│   └── ...
├── frontend/
├── README.md
└── ...
```

**If `backend/` is missing on GitHub:**
- The code wasn't pushed correctly
- Push again using the git scripts

---

### 4. **Check Case Sensitivity**

Render is case-sensitive! Make sure:

- ✅ Root Directory: `backend` (all lowercase)
- ❌ NOT: `Backend`, `BACKEND`, `BackEnd`

---

### 5. **Common Render Settings**

When creating/editing service in Render:

```
Name: prabin-institute-backend
Region: (choose closest)
Branch: main (or master)
Root Directory: backend          ← Just "backend"
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

---

### 6. **Verify Build Logs**

After setting Root Directory, check Render logs:

**Good signs:**
- ✅ "Installing dependencies..."
- ✅ "Found package.json"
- ✅ "Starting server..."

**Bad signs:**
- ❌ "Cannot find package.json"
- ❌ "No such file or directory"
- ❌ "Root directory not found"

---

## 🎯 Step-by-Step Fix

### Step 1: Verify on GitHub

1. Go to: `https://github.com/Pratik980/prabin-institute-neb-courses`
2. Check if `backend/` folder exists
3. Click `backend/` → Check if `package.json` exists

### Step 2: Update Render Settings

1. Go to Render dashboard
2. Click your service → **Settings**
3. Scroll to **"Build & Deploy"**
4. Find **"Root Directory"**
5. **Clear the field completely**
6. Type: `backend` (lowercase, no spaces)
7. Click **"Save Changes"**

### Step 3: Manual Deploy

1. After saving, go to **"Manual Deploy"** tab
2. Click **"Deploy latest commit"**
3. Watch the build logs

### Step 4: Check Build Logs

Look for:
- ✅ "Installing dependencies" → Good!
- ✅ "Found package.json" → Good!
- ❌ "Cannot find package.json" → Root Directory is wrong

---

## 🔍 Alternative: Leave Root Directory Empty

If `backend` still doesn't work, try:

1. **Leave Root Directory EMPTY** (blank)
2. **Change Build Command to:** `cd backend && npm install`
3. **Change Start Command to:** `cd backend && npm start`

This tells Render to:
- Start from repo root
- Manually `cd` into backend folder
- Then run commands

---

## 📝 Quick Test

To verify your GitHub repo structure:

1. Visit: `https://github.com/Pratik980/prabin-institute-neb-courses/tree/main/backend`
2. You should see:
   - `package.json`
   - `server.js`
   - `routes/` folder
   - etc.

If this URL works, then `backend` is the correct Root Directory!

---

## 🆘 Still Not Working?

**Check these:**

1. **Repository name:** Is it exactly `prabin-institute-neb-courses`?
2. **Branch name:** Is it `main` or `master`? (Set correctly in Render)
3. **GitHub connection:** Is Render connected to the right GitHub account?
4. **Permissions:** Does Render have access to your repository?

---

## ✅ Success Indicators

When it works, you'll see in Render logs:

```
==> Cloning repository...
==> Building...
==> Installing dependencies...
   npm install
   ✓ Found package.json
   ✓ Installing packages...
==> Starting...
   npm start
   ✓ Server running on port 10000
```

---

## 🎉 That's It!

Once Root Directory is set correctly, Render will find your backend folder and deploy successfully!

