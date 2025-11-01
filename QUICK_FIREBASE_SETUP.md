# Quick Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to **https://console.firebase.google.com/**
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `CampusConnect` (or any name you like)
4. Click **Continue**
5. **(Optional)** Disable Google Analytics if you don't need it
6. Click **Create project**
7. Wait for project to be created, then click **Continue**

## Step 2: Enable Authentication

1. In the left sidebar, click **Authentication**
2. Click **"Get started"** (if first time)
3. Click the **"Sign-in method"** tab
4. Enable these providers:

   **Email/Password:**
   - Click **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

   **Google:**
   - Click **Google**
   - Toggle **Enable** to ON
   - Enter a support email (your email is fine)
   - Click **Save**

   **GitHub (Optional):**
   - Click **GitHub**
   - Toggle **Enable** to ON
   - You'll need GitHub OAuth app credentials (can skip for now)

## Step 3: Create Firestore Database

1. In left sidebar, click **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a location (pick the closest to you)
5. Click **Enable**
6. Wait for database to be created

## Step 4: Enable Storage

1. In left sidebar, click **Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Use the same location as Firestore
5. Click **Done**

## Step 5: Get Your Firebase Config

1. Click the **⚙️ (gear icon)** next to "Project Overview" → **Project settings**
2. Scroll down to **"Your apps"** section
3. If you see an existing web app, click it. Otherwise:
   - Click the **Web icon** `</>` (looks like `</>`)
   - Register app nickname: `CampusConnect`
   - Click **Register app**
4. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

5. **Copy these values** - you'll need them next!

## Step 6: Add Config to Your Project

### Create .env file:

1. In your project folder (`D:\SurgeProject\project`), create a new file named `.env`
   - **Important**: The filename is exactly `.env` (starts with a dot, no extension)

2. Open the `.env` file and paste this (replace with YOUR values):

```env
VITE_FIREBASE_API_KEY=AIzaSyC...your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

3. **Save the file**

### How to create .env file:

**Option 1: Using VS Code (Recommended)**
1. Open VS Code in your project folder
2. Right-click in the file explorer (left sidebar)
3. Select "New File"
4. Name it `.env` (with the dot at the start)
5. Paste the content above with your values
6. Save (Ctrl+S)

**Option 2: Using Notepad**
1. Open Notepad
2. Paste the content (with your actual Firebase values)
3. Go to **File** → **Save As**
4. Navigate to `D:\SurgeProject\project`
5. In "File name", type: `.env` (with the dot)
6. In "Save as type", select "All Files"
7. Click **Save**

## Step 7: Restart Dev Server

After creating `.env` file:
1. Go to your terminal where `npm run dev` is running
2. Press **Ctrl + C** to stop the server
3. Run again: `npm run dev`

The app should now connect to Firebase!

## Step 8: Test It!

1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. You should be able to sign in!

## Troubleshooting

### "API key not valid" error:
- Make sure `.env` file is in the root folder (`D:\SurgeProject\project`)
- Make sure variable names start with `VITE_`
- Make sure you restarted the dev server after creating `.env`
- Check that you copied the values correctly (no extra spaces)

### Can't see .env file:
- In File Explorer, go to **View** → Check **"Show hidden items"**
- Or the file might be hidden - that's normal!

### Still not working:
1. Double-check your Firebase config values in `.env`
2. Make sure Authentication is enabled in Firebase Console
3. Make sure Firestore Database is created
4. Restart the dev server

