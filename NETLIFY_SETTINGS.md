# 📋 Netlify Build Settings - Exact Values

## 🎯 For Your Project

Use these **exact values** in Netlify Dashboard:

---

## ✅ Netlify Build Settings

### **Base directory**
```
frontend
```
*The directory where Netlify installs dependencies and runs your build command.*

---

### **Package directory**
```
frontend
```
*For monorepos, the directory that contains your project files, including the netlify.toml. Set this value only if it is different from the base directory.*

**Note:** Since your `netlify.toml` is in the `frontend/` folder, this should be `frontend` (same as base directory).

---

### **Build command**
```
npm install && npm run build
```
*OR if you prefer:*
```
npm run build
```
*(If dependencies are already cached, you can use just `npm run build`)*

---

### **Publish directory**
```
dist
```
*The directory that contains the files to publish.*

**Important:** This is relative to the **base directory**. So:
- Base directory: `frontend`
- Publish directory: `dist`
- Netlify will look for: `frontend/dist/`

---

### **Functions directory**
```
netlify/functions
```
*The directory where Netlify can find your compiled functions to deploy them.*

**Note:** You probably don't have Netlify functions, so the default `netlify/functions` is fine. You can leave this as default.

---

## 📸 Visual Guide

```
Netlify Dashboard → Your Site → Site settings → Build & deploy

┌─────────────────────────────────────────────┐
│  Build settings                             │
├─────────────────────────────────────────────┤
│  Base directory                             │
│  [frontend                    ]             │
│                                             │
│  Package directory                          │
│  [frontend                    ]             │
│                                             │
│  Build command                              │
│  [npm install && npm run build]            │
│                                             │
│  Publish directory                          │
│  [dist                        ]             │
│                                             │
│  Functions directory                        │
│  [netlify/functions          ]             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Summary

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Package directory** | `frontend` |
| **Build command** | `npm install && npm run build` |
| **Publish directory** | `dist` |
| **Functions directory** | `netlify/functions` (default) |

---

## ✅ After Setting These

1. Click **"Save"**
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait for deployment to complete
5. Your site should work! 🎉

---

## 🔍 Why These Values?

- **Base directory: `frontend`** → Your frontend code is in the `frontend/` folder
- **Package directory: `frontend`** → Your `package.json` and `netlify.toml` are in `frontend/`
- **Build command: `npm install && npm run build`** → Installs dependencies, then builds
- **Publish directory: `dist`** → Vite outputs to `dist/` folder (relative to `frontend/`)

---

## 🎉 That's It!

Copy these exact values into your Netlify dashboard and you're good to go!

