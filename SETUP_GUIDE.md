# MindBridge - Setup and Run Guide

## ✅ Features Implemented

### 1. **Profile Management**
- ✅ Profile data loads properly from backend
- ✅ Displays user information, statistics, and recent activity
- ✅ Shows user role (User/Admin)

### 2. **Authentication & Security**
- ✅ Sign out functionality works in Profile page
- ✅ Password visibility toggle (eye icon) in login/register
- ✅ Forgot password functionality with email verification
- ✅ Change password option in user profile
- ✅ Secure JWT authentication

### 3. **Check-in Features**
- ✅ Real microphone recording using Web Audio API
- ✅ Real camera recording using MediaRecorder API
- ✅ Audio and video preview with playback
- ✅ Recording time display
- ✅ Text journal entry

### 4. **AI/ML Integration**
- ✅ Hugging Face API integration (optional free API)
- ✅ Keyword-based sentiment analysis (fallback)
- ✅ Analyzes journal entries, voice transcripts, and video
- ✅ Provides mood score, sentiment, stress level
- ✅ Generates personalized recommendations
- ✅ Risk level assessment

### 5. **User History**
- ✅ All check-ins saved to database
- ✅ Voice and video file path storage
- ✅ History displayed in Profile and Dashboard
- ✅ Mood trends tracking

### 6. **Admin Dashboard**
- ✅ Admin users can access admin dashboard
- ✅ Cohort trends and analytics
- ✅ Risk distribution charts
- ✅ User statistics

### 7. **Project Structure**
- ✅ .gitignore file created
- ✅ Environment files configured
- ✅ Database migrations updated

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or bun

### Step 1: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies  
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup Database
```bash
# Make sure PostgreSQL is running
# Default credentials: user=postgres, password=ripro805

# Run migration to create tables
npm run migrate

# (Optional) Create admin user
cd backend
npm run create-admin
# Enter admin email and password when prompted
cd ..
```

### Step 3: Run the Project
```bash
# Start both backend and frontend together
npm run dev
```

This will start:
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 🎯 Usage Guide

### Creating a Regular User
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in your details
4. Accept consent form
5. You'll be redirected to Dashboard

### Creating an Admin User
```bash
cd backend
npm run create-admin
```
Enter email and password for the admin account.

### Using Check-in Features

#### Text Entry
1. Go to "Check In" page
2. Type your thoughts in the text area
3. Click "Submit Check-in"

#### Voice Recording
1. Click "Start Voice Recording"
2. Allow microphone access
3. Speak your thoughts
4. Click "Stop Recording"
5. Review audio playback
6. Click "Submit Check-in"

#### Video Recording
1. Click "Start Video Recording"
2. Allow camera and microphone access
3. Record your video (shows live preview)
4. Click "Stop Recording"
5. Review video playback
6. Click "Submit Check-in"

### Viewing History
- **Profile Page**: See recent activity
- **Dashboard**: View mood trends over time
- Check-ins are saved with analysis results

### Admin Features
- Login with admin credentials
- Navigate to "Admin" in navigation
- View cohort analytics
- See risk distribution
- Monitor user statistics (anonymized)

## 🔧 Configuration

### Backend Environment (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindbridge_db
DB_USER=postgres
DB_PASSWORD=ripro805
JWT_SECRET=your-secret-key
HUGGINGFACE_API_KEY=optional-api-key
```

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Optional: Hugging Face API
For advanced AI analysis, get a free API key:
1. Go to https://huggingface.co/settings/tokens
2. Create an account (free)
3. Generate an access token
4. Add to backend .env: `HUGGINGFACE_API_KEY=your_token`

## 📝 Default Credentials

### Admin Account (after running create-admin)
- Create your own admin account using the script

### Test User
Create during registration

## 🎨 Features Overview

### Authentication
- ✅ Sign up with email/password
- ✅ Login with credentials
- ✅ Password visibility toggle
- ✅ Forgot password/reset
- ✅ Change password in profile
- ✅ JWT-based sessions
- ✅ Auto logout

### Profile
- ✅ User information
- ✅ Statistics (mood average, total check-ins)
- ✅ Recent activity
- ✅ Change password
- ✅ Logout button

### Check-ins
- ✅ Text journaling
- ✅ Voice recording with microphone
- ✅ Video recording with camera
- ✅ Real-time preview
- ✅ AI-powered analysis
- ✅ Personalized recommendations

### Dashboard
- ✅ Mood trends chart
- ✅ Wellness score
- ✅ Risk level indicators
- ✅ Recent check-ins
- ✅ Time range filter

### Admin Dashboard
- ✅ User statistics
- ✅ Cohort trends
- ✅ Risk distribution
- ✅ Anonymized data

## 🛠️ Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Ensure credentials match .env file
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Change VITE_API_URL in frontend/.env accordingly
```

### Microphone/Camera Access Denied
- Browser will prompt for permission
- Allow access when requested
- Check browser settings if blocked

### AI Analysis Not Working
- The app uses keyword-based fallback by default
- For advanced analysis, add HUGGINGFACE_API_KEY
- Free tier has rate limits

## 📦 Build for Production

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Build creates optimized static files in frontend/dist
# Deploy backend as Node.js app
# Deploy frontend to static hosting (Vercel, Netlify, etc.)
```

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/change-password` - Change password
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Check-ins
- POST `/api/check-ins` - Create check-in
- GET `/api/check-ins` - Get user check-ins
- GET `/api/check-ins/:id` - Get specific check-in

### Dashboard
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/mood-trends` - Get mood trends
- GET `/api/dashboard/summary` - Get summary

### Support
- GET `/api/support` - Get support resources

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Protected routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ On-device processing option
- ✅ Privacy-first design

## 📱 PWA Features

- ✅ Offline capable
- ✅ Installable
- ✅ Responsive design
- ✅ Mobile-friendly

## 🌍 Bilingual Support

- ✅ English
- ✅ Bengali (বাংলা)
- ✅ Language toggle in navbar

## 🎉 Ready to Use!

Your MindBridge application is now fully configured with all requested features!
