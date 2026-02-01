# MindBridge - AI-Powered Mental Health Support

A privacy-first, bilingual (Bangla + English) Progressive Web App (PWA) for early mental health detection and support, designed specifically for Bangladesh.

## � Live Demo

**Frontend**: [https://mind-bridgerp.netlify.app/](https://mind-bridgerp.netlify.app/)  
**Backend API**: [https://mindbridge-solivo-ai-hacakthon-2025-production.up.railway.app/](https://mindbridge-solivo-ai-hacakthon-2025-production.up.railway.app/)

## �🎯 All Features Implemented ✅

### ✅ 1. Profile Data Loading
- User profile data loads properly from backend
- Displays full name, email, member since date, language, and role
- Shows statistics: average mood, total check-ins, common concerns
- Recent activity with mood scores and entries

### ✅ 2. Sign Out Functionality
- Working logout button in Profile page
- Logout clears authentication tokens
- Redirects to login page after logout
- Also accessible from Navigation component

### ✅ 3. User Roles
- Database schema includes role field
- Profile displays user role (User/Admin)
- Admin users can access Admin Dashboard
- Role-based navigation and routing

### ✅ 4. Password Features
- **Show Password Toggle**: Eye icon to show/hide password in login and registration
- **Forgot Password**: Complete flow with email verification and reset
- **Change Password**: Option in user profile to update password
- Password strength validation (minimum 6 characters)

### ✅ 5. Media Recording Features
- **Microphone Access**: Real-time voice recording using Web Audio API
- **Camera Access**: Real-time video recording using MediaRecorder API
- Live preview during recording
- Recording timer display
- Audio/video playback before submission
- Option to delete and re-record

### ✅ 6. AI/ML Integration
- **Hugging Face API**: Optional integration for advanced sentiment analysis
- **Keyword-based Analysis**: Intelligent fallback system
- Analyzes journal text, voice transcripts, and video content
- Provides:
  - Sentiment analysis (positive, negative, neutral, anxious)
  - Mood score (1-10)
  - Stress level (low, moderate, high)
  - Risk assessment (low, medium, high)
  - Personalized recommendations
  - Concern detection (depression, anxiety, sleep, isolation, etc.)

### ✅ 7. User History
- All check-ins saved to database with timestamps
- Voice file path and video file path storage
- History displayed in:
  - Profile page (recent activity)
  - Dashboard (mood trends chart)
- Mood trends tracking over time
- Statistics aggregation

### ✅ 8. Admin Dashboard
- Admin users get access to admin-only routes
- Features:
  - Active users count
  - Total check-ins statistics
  - Flagged users monitoring
  - Cohort trends (bar chart)
  - Risk distribution (pie chart)
  - Anonymized data for privacy

### ✅ 9. Project Configuration
- **.gitignore**: Comprehensive file excluding node_modules, .env, build files, uploads, etc.
- **Environment files**: Backend and frontend .env configurations
- **Database migrations**: Updated schema for all features
- **Clean code structure**: Organized and maintainable

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or bun

### Installation & Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup database (creates tables and seed data)
npm run migrate

# 3. (Optional) Create an admin user
cd backend
npm run create-admin
cd ..

# 4. Start the application
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000

## 🎯 Project Structure

```
MindBridge/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.tsx     # Login/Register with password toggle & forgot password
│   │   │   ├── Profile.tsx  # User profile with change password
│   │   │   ├── CheckIn.tsx  # Voice & video recording
│   │   │   ├── Dashboard.tsx
│   │   │   └── Admin.tsx    # Admin dashboard
│   │   ├── services/
│   │   │   └── api.ts       # API integration
│   │   └── components/
│   └── .env                 # Frontend config
├── backend/                  # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js      # Auth with password reset
│   │   │   └── checkins.js  # Check-ins with AI analysis
│   │   ├── services/
│   │   │   └── aiAnalysis.js # Hugging Face + keyword analysis
│   │   ├── database/
│   │   │   └── migrate.js   # Database migrations
│   │   └── server.js
│   └── .env                 # Backend config
├── .gitignore               # Git ignore file
├── SETUP_GUIDE.md          # Detailed setup guide
└── package.json            # Root package.json
```

## 🎨 Key Features

### Authentication & Security
- ✅ User registration with consent form
- ✅ Secure login with JWT
- ✅ Password visibility toggle
- ✅ Forgot password flow
- ✅ Change password in profile
- ✅ Auto-logout on token expiry
- ✅ Protected routes

### Check-in System
- ✅ Text journal entries
- ✅ **Real microphone recording** with playback
- ✅ **Real camera video recording** with preview
- ✅ AI-powered sentiment analysis
- ✅ Mood scoring (1-10)
- ✅ Stress level assessment
- ✅ Risk evaluation
- ✅ Personalized recommendations

### Dashboard & Analytics
- ✅ Mood trends over time (chart)
- ✅ Wellness score display
- ✅ Recent check-ins history
- ✅ Time range filters (7, 30, 90 days)
- ✅ Statistics cards

### Admin Features
- ✅ User statistics
- ✅ Cohort analytics
- ✅ Risk distribution visualization
- ✅ Flagged users monitoring
- ✅ Anonymized data

### Profile Management
- ✅ User information display
- ✅ **Role display** (User/Admin)
- ✅ Statistics overview
- ✅ Recent activity
- ✅ **Change password dialog**
- ✅ **Logout button**

## 🔧 Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router v6
- Recharts (data visualization)
- Web Audio API (voice recording)
- MediaRecorder API (video recording)

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- bcryptjs (password hashing)
- Hugging Face Inference API

## 📝 Usage Guide

### For Regular Users

1. **Sign Up**
   - Go to http://localhost:8080
   - Click "Sign Up"
   - Fill in details and accept consent

2. **Make a Check-in**
   - Navigate to "Check In"
   - Choose entry type:
     - **Text**: Write journal entry
     - **Voice**: Click record, speak, stop recording
     - **Video**: Click record video, allow camera, stop
   - Submit to get AI analysis

3. **View History**
   - Profile: Recent activity
   - Dashboard: Mood trends

4. **Manage Account**
   - Change password in Profile
   - Logout from Profile page

### For Admins

1. **Create Admin Account**
   ```bash
   cd backend
   npm run create-admin
   ```

2. **Access Admin Dashboard**
   - Login with admin credentials
   - Navigate to "Admin" in menu
   - View analytics and statistics

## 🤖 AI Analysis

The system uses a dual-approach AI analysis:

1. **Hugging Face API** (Optional, Free):
   - Advanced sentiment analysis
   - Emotion detection
   - Requires free API key from huggingface.co

2. **Keyword-based Fallback**:
   - Works without API key
   - Intelligent pattern matching
   - Detects concerns and provides recommendations
   - Risk assessment based on keywords

## 🌍 Bilingual Support
- English
- Bengali (বাংলা)
- Toggle in navigation bar

## 🔒 Privacy & Security
- ✅ On-device processing option
- ✅ Encrypted passwords (bcrypt)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ Anonymized admin data
- ✅ Consent-based data collection

## 📱 PWA Features
- ✅ Offline capable
- ✅ Installable on mobile
- ✅ Responsive design
- ✅ Mobile-friendly interface

## 🛠️ Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Migrations
```bash
npm run migrate
```

### Create Admin User
```bash
cd backend
npm run create-admin
```

## 🌐 Environment Variables


```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

- **users**: User accounts with roles
- **check_ins**: All entries with voice/video paths
- **mood_trends**: Aggregated mood data
- **admin_users**: Admin credentials
- **support_resources**: Help resources
- **consent_settings**: User privacy preferences

## 🎉 Project Status

✅ **All Requirements Completed**

1. ✅ Profile data loads properly
2. ✅ Signout functionality works
3. ✅ Role option visible
4. ✅ Show password & forgot password implemented
5. ✅ Change password in profile
6. ✅ Real microphone & camera recording
7. ✅ AI/ML model with free API integration
8. ✅ User history saved
9. ✅ Admin dashboard accessible
10. ✅ .gitignore file created
11. ✅ Project runs successfully

## 📞 Support Resources

Built-in Bangladesh mental health helplines:
- National Mental Health Helpline: 09678771771
- Kaan Pete Roi: 01779554391
- Moner Bondhu: 01844335544

## 👨‍💻 Author

MindBridge - Mental Health Support Platform
Built for Solivo AI Hackathon 2025

## 📄 License

MIT License

---

**Note**: This is a complete, production-ready application with all requested features implemented and tested. The project is ready to use!

## 🧪 Testing

1. Open browser: `http://localhost:5173`
2. Click "Sign Up"
3. Create account and explore!

## 📡 API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/check-ins` - Get check-ins (protected)
- `POST /api/check-ins` - Create check-in (protected)
- `GET /api/dashboard/summary` - Dashboard data (protected)
- `GET /api/support` - Support resources

## 🗃️ Database Schema

- **users**: Authentication and profile
- **check_ins**: Daily mood entries
- **mood_trends**: Aggregated data
- **support_resources**: Helplines and resources

## 🎉 Quick Start

```bash
# 1. Install PostgreSQL (password: ripro805)
# 2. Create database: mindbridge_db
npm install
npm run migrate
npm run dev
# Open http://localhost:5173
```

**Project is now fully dynamic with PostgreSQL! 🚀**
