# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "CampusConnect" (or your preferred name)
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click, enable, and save
   - **Google**: Click, enable, add support email, and save
   - **GitHub**: Click, enable, add Client ID and Secret (from GitHub OAuth app), and save

## Step 3: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click "Enable"

## Step 4: Set Up Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other users' profiles
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.postedBy == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.postedBy == request.auth.uid;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if request.auth != null && (
        resource.data.applicantId == request.auth.uid ||
        get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.postedBy == request.auth.uid
      );
      allow create: if request.auth != null && 
        request.resource.data.applicantId == request.auth.uid;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.postedBy == request.auth.uid;
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }
  }
}
```

3. Click "Publish"

## Step 5: Enable Storage

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Start in test mode (for development)
4. Choose the same location as Firestore
5. Click "Done"

## Step 6: Set Up Storage Rules

1. Go to **Storage** > **Rules**
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

3. Click "Publish"

## Step 7: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app (nickname: "CampusConnect Web")
5. Copy the Firebase configuration object

## Step 8: Add Config to Your App

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Option 2: Direct Edit

Edit `src/config/firebase.js` and replace the placeholder values with your actual Firebase config.

## Step 9: GitHub OAuth Setup (Optional)

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: CampusConnect
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copy Client ID and Client Secret
5. Add them to Firebase Authentication > Sign-in method > GitHub

## Testing

After setup, test the following:
1. Sign up with email/password
2. Sign in with Google
3. Create a job post
4. Apply to a job
5. Send a message in chat

## Production Considerations

Before deploying to production:
1. Update Firestore rules to be more restrictive
2. Update Storage rules to enforce authentication and file size limits
3. Enable email verification enforcement
4. Set up proper error handling
5. Configure custom domain (if needed)

