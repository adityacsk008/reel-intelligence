# 🎬 Reel Intelligence

**AI Powered Instagram Reel Analytics Platform**

A professional reel-level intelligence platform built for creators, agencies & brands. Analyze Instagram Reels, track growth, detect viral content, and make data-driven decisions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

[![Deploy Backend on Railway](https://railway.app/button.svg)](https://railway.app/template/reel-intelligence)
[![Deploy Frontend with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/adityacsk008/reel-intelligence)

---

## 🚀 Quick Deploy (5 Minutes!)

### **Option 1: One-Click Deploy (Recommended)**

1. **Backend (Railway):**
   - Click: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)
   - Sign up with GitHub
   - Select this repo → `backend` folder
   - Add MongoDB plugin
   - Set environment variables (see below)
   - Deploy! ✅

2. **Frontend (Vercel):**
   - Click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
   - Import this repo → `frontend` folder
   - Add `REACT_APP_API_URL` environment variable
   - Deploy! ✅

**📖 Detailed Guide:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 🎯 Core Features

### 📊 Reel Analytics
- **Multi-Reel Selection**: Select and analyze multiple reels while scrolling
- **Real-time View Tracking**: Automatic view count reading and updates
- **Growth Metrics**: Total views, averages, highest/lowest performers
- **Viral Detection**: AI-powered viral velocity scoring

### 🧠 AI Intelligence
- **Reel Quality Score**: 0-100 scoring based on engagement and growth
- **Content Classification**: Auto-categorize reels (Movie, Comedy, Motivation, etc.)
- **Growth Tracker**: Historical view snapshots and trend analysis
- **Viral Alerts**: Real-time notifications for viral content

### 🏢 Agency Tools
- **Influencer Shortlisting**: Filter creators by performance metrics
- **Brand Match Score**: AI-calculated brand suitability
- **Pricing Recommendations**: Automated CPM and pricing suggestions
- **Competitor Comparison**: Side-by-side creator analytics

### 📈 Dashboard
- SocialBlade-style analytics interface
- Real-time graphs and charts
- Export reports (CSV, PDF)
- Dark mode analytics UI

---

## 🧱 Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **Axios** - API Communication
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### Additional
- **bcrypt** - Password Hashing
- **dotenv** - Environment Variables
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security Headers

---

## 📂 Project Structure

```
reel-intelligence/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reelController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Reel.js
│   │   └── Analytics.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── reels.js
│   │   ├── analytics.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── utils/
│   │   ├── aiEngine.js
│   │   └── viralDetector.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── ReelScanner/
│   │   │   ├── Analytics/
│   │   │   └── Admin/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
├── QUICK_DEPLOY.md
├── API_DOCS.md
├── DEPLOYMENT.md
└── LICENSE
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js >= 16.0.0
- MongoDB installed and running
- npm or yarn

### 1️⃣ Clone Repository
```bash
git clone https://github.com/adityacsk008/reel-intelligence.git
cd reel-intelligence
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Backend .env Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reel-intelligence
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Start Backend:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Frontend .env Configuration:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔐 Authentication

### User Roles
- **User**: Standard creator/analyst access
- **Admin**: Full platform management

### Default Admin Credentials
```
Email: admin@reelintelligence.com
Password: Admin@123
```

⚠️ **Change these credentials immediately in production!**

---

## 🎥 How to Use

### 1. Reel Scanner
1. Login to your account
2. Navigate to "Reel Scanner"
3. Open Instagram in another tab (logged in)
4. Copy reel details (ID, URL, view count)
5. Add reels to scan list
6. Click "Scan All Reels"
7. View real-time analytics

### 2. Dashboard Analytics
- View total views, averages, and growth metrics
- Track viral reels with AI detection
- Export reports for clients

### 3. Agency Tools
- Shortlist influencers by performance
- Get AI-powered pricing recommendations
- Compare creators side-by-side

---

## 🛡️ Safety & Compliance

✅ **User-Initiated Scanning**: All scans require user action  
✅ **No Credential Storage**: No Instagram passwords stored  
✅ **Rate Limited**: Prevents abuse  
✅ **No Automation**: No background scraping  
✅ **ToS Compliant**: Designed with platform guidelines in mind

⚠️ This is an analytics tool, NOT a bot or fake engagement service.

---

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/admin/login - Admin login
GET /api/auth/me - Get current user
```

### Reels
```
POST /api/reels/scan - Submit scanned reels
GET /api/reels - Get user's reels
GET /api/reels/:id - Get specific reel
DELETE /api/reels/:id - Delete reel
```

### Analytics
```
GET /api/analytics/overview - Dashboard overview
GET /api/analytics/growth - Growth metrics
GET /api/analytics/viral - Viral detection results
POST /api/analytics/compare - Compare creators
GET /api/analytics/export - Export data (CSV)
```

### Admin
```
GET /api/admin/users - List all users
GET /api/admin/stats - Platform statistics
PUT /api/admin/users/:id - Update user
DELETE /api/admin/users/:id - Delete user
```

**📖 Full API Documentation:** [API_DOCS.md](./API_DOCS.md)

---

## 🧠 AI Features Explained

### Viral Detection Algorithm
```javascript
viralScore = (currentViews - avgViews) / avgViews * 100
if (viralScore > 200) → "Going Viral! ⚡"
```

### Quality Score (0-100)
- **40%** - View growth rate
- **30%** - Engagement consistency
- **20%** - Posting frequency
- **10%** - Content variety

### Content Classification
Uses keyword matching and pattern recognition:
- Movie clips
- Comedy skits
- Motivational content
- Trending audio usage

---

## 🎨 UI/UX Features

- 🌙 **Dark Mode Default**: Easy on the eyes
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast Loading**: Optimized performance
- 📊 **Interactive Charts**: Real-time data visualization
- 🎯 **Minimal Clutter**: Focus on insights

---

## 🔧 Development

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Build for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (uses PM2)
cd backend
pm2 start server.js --name reel-intelligence
```

---

## 📦 Deployment

### Quick Deploy (Recommended)
- **Backend:** Railway (Free MongoDB included)
- **Frontend:** Vercel (Free hosting)

**📖 Step-by-Step Guide:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### Other Options
- Traditional VPS (DigitalOcean, AWS)
- Docker Compose
- Heroku

**📖 Detailed Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**📖 Contributing Guidelines:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built for creators, agencies, and brands
- Inspired by SocialBlade analytics
- Powered by AI and modern web technologies

---

## 📧 Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/adityacsk008/reel-intelligence/issues)
- **Documentation**: Check [API_DOCS.md](./API_DOCS.md) and [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 🚀 Roadmap

- [ ] Instagram API integration (official)
- [ ] Multi-platform support (TikTok, YouTube Shorts)
- [ ] Advanced AI predictions
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] White-label solutions for agencies

---

## 💰 Cost

**Free Tier Deployment:**
- Railway: 500 hours/month (sufficient for testing)
- Vercel: Unlimited for personal projects
- **Total: $0/month** 🎉

---

**Made with ❤️ for the creator economy**

⭐ **Star this repo if you find it useful!**

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Reel Scanner
![Reel Scanner](https://via.placeholder.com/800x400?text=Reel+Scanner+Screenshot)

### Analytics
![Analytics](https://via.placeholder.com/800x400?text=Analytics+Screenshot)

---

**🔗 Live Demo:** Coming Soon!  
**📦 Repository:** https://github.com/adityacsk008/reel-intelligence