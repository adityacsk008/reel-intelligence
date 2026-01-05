# 🚀 Quick Deployment Guide

## Backend Deployment (Railway - Recommended)

### Option 1: Railway (Free, Easy, MongoDB included)

1. **Go to Railway:**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `adityacsk008/reel-intelligence`
   - Select `backend` folder as root directory
   - Railway will auto-detect Node.js

3. **Add MongoDB:**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will automatically create MongoDB instance
   - Connection string will be auto-added to environment

4. **Set Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your_super_secret_key_here_change_this
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
   
   Note: `MONGODB_URI` is automatically set by Railway

5. **Deploy:**
   - Railway will automatically deploy
   - Copy your backend URL (e.g., `https://reel-intelligence-backend.up.railway.app`)

---

## Frontend Deployment (Vercel)

### Deploy to Vercel:

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import `adityacsk008/reel-intelligence`
   - Select `frontend` as root directory

3. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```
   
   Replace with your actual Railway backend URL

5. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy
   - Your app will be live at: `https://your-app.vercel.app`

---

## Alternative: Render (Backend + Frontend)

### Backend on Render:

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Select `backend` folder
5. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add MongoDB (Render provides free MongoDB)
7. Set environment variables
8. Deploy

### Frontend on Render:

1. New → Static Site
2. Connect GitHub repo
3. Select `frontend` folder
4. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Add environment variable with backend URL
6. Deploy

---

## Post-Deployment Checklist

### Backend:
- [ ] MongoDB connected successfully
- [ ] Environment variables set
- [ ] CORS configured with frontend URL
- [ ] Health check endpoint working: `/health`
- [ ] Test API: `GET /api/auth/me` (should return 401)

### Frontend:
- [ ] Environment variable set with backend URL
- [ ] App loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads

### Test Flow:
1. Open frontend URL
2. Register new account
3. Login
4. Go to Reel Scanner
5. Add a test reel
6. Check Dashboard for analytics

---

## Quick Deploy Commands

### One-Click Deploy Buttons:

**Backend (Railway):**
```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/adityacsk008/reel-intelligence/tree/main/backend)
```

**Frontend (Vercel):**
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/adityacsk008/reel-intelligence/tree/main/frontend)
```

---

## Troubleshooting

### Backend Issues:
- **MongoDB Connection Failed:** Check Railway MongoDB plugin is added
- **CORS Error:** Update `CORS_ORIGIN` with exact Vercel URL
- **500 Errors:** Check Railway logs

### Frontend Issues:
- **API Not Found:** Verify `REACT_APP_API_URL` is correct
- **Build Failed:** Check Node version (use 18.x)
- **Blank Page:** Check browser console for errors

---

## Environment Variables Summary

### Backend (Railway):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=<auto-set-by-railway>
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel):
```env
REACT_APP_API_URL=https://your-railway-backend.up.railway.app/api
```

---

## URLs After Deployment

- **Frontend:** `https://reel-intelligence.vercel.app`
- **Backend:** `https://reel-intelligence-backend.up.railway.app`
- **API Docs:** `https://reel-intelligence-backend.up.railway.app/api`

---

## Cost

- **Railway:** Free tier (500 hours/month, sufficient for testing)
- **Vercel:** Free tier (unlimited for personal projects)
- **Total:** **$0/month** for hobby projects! 🎉

---

## Need Help?

1. Check Railway/Vercel logs
2. Open GitHub issue
3. Check API_DOCS.md for endpoint details

**Happy Deploying! 🚀**