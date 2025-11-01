# Local Testing Guide

## Quick Start

### Step 1: Install Dependencies

Make sure you have Node.js installed (v16 or higher). Then run:

```bash
npm install
```

If you get any errors, try:
```bash
npm install --legacy-peer-deps
```

### Step 2: Firebase Setup (5 minutes)

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name and continue
4. Disable Google Analytics (optional for testing)
5. Click "Create project"

#### B. Enable Authentication
1. In Firebase Console, click **Authentication** > **Sign-in method**
2. Enable **Email/Password** (no additional config needed)
3. Enable **Google**:
   - Click Google
   - Enable it
   - Set support email
   - Save
4. (Optional) Enable **GitHub** if you want GitHub OAuth

#### C. Create Firestore Database
1. Click **Firestore Database** > **Create database**
2. Select **Start in test mode** (for local testing)
3. Choose a location (pick closest to you)
4. Click **Enable**

#### D. Enable Storage
1. Click **Storage** > **Get started**
2. Select **Start in test mode**
3. Choose same location as Firestore
4. Click **Done**

#### E. Get Your Firebase Config
1. Click the gear icon ⚙️ (Project Settings)
2. Scroll down to "Your apps"
3. Click the web icon `</>` (Add app)
4. Register app name: "CampusConnect" (or any name)
5. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

#### F. Add Config to Your App

**Option 1: Environment File (Recommended)**
1. Create a `.env` file in the project root (same level as `package.json`)
2. Add:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Option 2: Direct Edit**
1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual config

### Step 3: Set Up Firestore Security Rules (Test Mode)

For local testing, you can use test mode rules temporarily:

1. Go to **Firestore Database** > **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Warning**: These are permissive rules for testing only. Use proper rules for production (see `FIREBASE_SETUP.md`).

### Step 4: Run the Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open http://localhost:5173 (or the port shown in terminal)

## Testing Features

### 1. Test Authentication

**Sign Up:**
- Click "Sign Up" on landing page
- Fill in name, email, password
- Click "Sign Up"
- Check your email for verification (if email verification is enabled)

**Login:**
- Use the credentials you just created
- Or test with Google OAuth

**Password Reset:**
- Click "Forgot password?" on login page
- Enter your email
- Check email for reset link

### 2. Test Talent Seeker Mode

**Browse Jobs:**
1. After login, you'll be in Seeker mode by default
2. You should see the job browsing interface
3. Try searching and filtering

**Complete Profile:**
1. Go to Profile page
2. Add skills, interests, bio
3. Save profile

**Apply to a Job:**
1. Find a job post (you'll need to create one as Finder first)
2. Click "Apply Now"
3. Write a cover letter
4. Optionally upload a resume (PDF, DOC, DOCX)
5. Submit application

### 3. Test Talent Finder Mode

**Switch Role:**
1. Click "Switch to Talent Finder" in navbar or profile
2. You'll be redirected to Finder dashboard

**Create Job Post:**
1. Click "+ Create New Post"
2. Fill in:
   - Title: "Frontend Developer Needed"
   - Description: "Looking for React developer for campus project"
   - Type: Select from dropdown
   - Add skills: Click "Add" after typing skills
   - Add tags: Add relevant tags
3. Click "Create Job Post"

**View Analytics:**
1. Click "Analytics" tab
2. View statistics about your posts

**Manage Applicants:**
1. Click "View Applicants" on a job post
2. See application statuses
3. Update status (Pending → Shortlisted → Accepted)
4. Click "Message" to chat with applicant

### 4. Test Chat/Messaging

**Start a Chat:**
1. As Finder: Click "Message" button on applicant
2. As Seeker: (You'll need to integrate ChatList component - see below)

**Send Messages:**
1. Type a message
2. Press Enter or click "Send"
3. Messages appear in real-time

### 5. Test Match Score

**See Match Scores:**
1. Complete your profile with skills and interests
2. As Seeker, browse jobs
3. Each job card shows a match percentage
4. Jobs in "Recommended" tab are sorted by match score

**How Match Score Works:**
- Skills matching: 40%
- Interests: 20%
- Job type preference: 20%
- Location: 10%
- Experience level: 10%

## Adding Chat List to Dashboard (Optional)

To see all your chats, add ChatList to your dashboards. You can add this button to Navbar:

```jsx
// In Navbar.jsx, add:
import ChatList from './ChatList'
import { useState } from 'react'

// Add state:
const [showChatList, setShowChatList] = useState(false)

// Add button in nav-links (for logged in users):
<button onClick={() => setShowChatList(!showChatList)} className="nav-link">
  Messages
</button>

// Add ChatList component:
{showChatList && (
  <div className="chat-list-overlay">
    <ChatList onSelectChat={(userId, userName) => {
      // Handle chat selection
    }} />
  </div>
)}
```

## Troubleshooting

### Issue: "Firebase: Error (auth/api-key-not-valid)"
**Solution:** Check that your Firebase config in `.env` or `firebase.js` is correct.

### Issue: "Firebase: Error (auth/network-request-failed)"
**Solution:** 
- Check internet connection
- Verify Firebase project is active
- Check browser console for specific errors

### Issue: "Firestore permission denied"
**Solution:**
- Check Firestore rules are in test mode (allows authenticated users)
- Make sure you're logged in
- Check browser console for specific permission errors

### Issue: "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use
**Solution:**
```bash
# Use a different port
npm run dev -- --port 3000
```

### Issue: Environment variables not loading
**Solution:**
- Make sure `.env` file is in project root (not in `src/`)
- Variable names must start with `VITE_`
- Restart dev server after changing `.env`

## Testing Checklist

- [ ] Sign up with email/password
- [ ] Login with email/password
- [ ] Login with Google OAuth
- [ ] Reset password
- [ ] Create profile (skills, interests, bio)
- [ ] Switch between Finder and Seeker roles
- [ ] Create a job post as Finder
- [ ] Apply to job as Seeker
- [ ] View and manage applicants as Finder
- [ ] Send and receive messages in chat
- [ ] See match scores on job cards
- [ ] Bookmark jobs
- [ ] Filter and search jobs
- [ ] View analytics dashboard

## Quick Test Data

### Create Test Jobs Manually

You can create test data directly in Firestore Console:
1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `jobs`
4. Add document with fields:
   - `title`: "React Developer Needed"
   - `description`: "Looking for skilled React developer"
   - `type`: "Part-time Jobs"
   - `postedBy`: (your user UID from Authentication)
   - `requiredSkills`: ["React", "JavaScript"]
   - `tags`: ["remote", "part-time"]
   - `status`: "published"
   - `isFilled`: false
   - `views`: 0
   - `applications`: 0
   - `createdAt`: (Timestamp - set to now)

## Next Steps After Testing

1. **Set up proper Firestore rules** (see `FIREBASE_SETUP.md`)
2. **Set up Storage rules**
3. **Enable email verification** in Firebase Authentication settings
4. **Test all OAuth providers** you plan to use
5. **Deploy** to Firebase Hosting or your preferred hosting service

## Need Help?

- Check browser console for errors
- Check Firebase Console for authentication issues
- Review Firestore data to see if documents are being created
- Use React DevTools to inspect component state

