# CampusConnect

CampusConnect is an on-campus talent discovery platform where students can connect through opportunities, whether it's for part-time work, startup gigs, academic projects, or collaborations.

## Features

### Core Functionality
- **Authentication System**: Sign up, login, email verification, password reset, and OAuth (Google, GitHub)
- **Role-Based Dashboards**: Switch between Talent Finder and Talent Seeker modes
- **Job Posting & Discovery**: Create, browse, search, and filter job opportunities
- **Match Score Algorithm**: Intelligent matching system that calculates compatibility between seekers and jobs
- **Real-time Chat**: Firebase-powered messaging system for communication
- **Application Management**: Track application status (Pending, Shortlisted, Accepted, Rejected)
- **Analytics Dashboard**: View insights on job posts, views, applications, and interest rates

### Job Types Supported
- Academic Projects
- Startup/Collaborations
- Part-time Jobs
- Competitions/Hackathons
- Team Search

## Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router DOM
- **Backend**: Firebase
  - Authentication
  - Firestore (Database)
  - Storage (File uploads)
- **Styling**: CSS3 with CSS Variables

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration** ⚠️ **REQUIRED**
   
   **IMPORTANT:** The `.env` file with Firebase credentials is not included in the repository for security. Each developer needs to set up their own Firebase project.
   
   **Quick Setup:**
   ```bash
   # Copy the example file
   cp .env.example .env
   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```
   
   Then:
   1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   2. Enable Authentication (Email/Password, Google, GitHub)
   3. Create Firestore Database (start in test mode for development)
   4. Enable Storage (start in test mode)
   5. Get your Firebase config from Project Settings > Your apps > Web app
   6. Edit `.env` and replace placeholder values with your actual Firebase credentials
   
   **For detailed step-by-step instructions, see:**
   - [`QUICK_FIREBASE_SETUP.md`](./QUICK_FIREBASE_SETUP.md) - Quick setup guide
   - [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) - Complete setup with security rules
   
   **Security Note:** Never commit your `.env` file to git. It's already in `.gitignore`.

5. **Firestore Security Rules**
   
   Set up your Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /jobs/{jobId} {
         allow read: if request.auth != null;
         allow create, update, delete: if request.auth != null && 
           (request.auth.uid == resource.data.postedBy || request.auth.uid == request.resource.data.postedBy);
       }
       match /applications/{applicationId} {
         allow read: if request.auth != null && 
           (request.auth.uid == resource.data.applicantId || 
            request.auth.uid == get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.postedBy);
         allow create: if request.auth != null && request.auth.uid == request.resource.data.applicantId;
         allow update: if request.auth != null && 
           request.auth.uid == get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.postedBy;
       }
       match /chats/{chatId} {
         allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Analytics.jsx
│   │   ├── ApplicantList.jsx
│   │   ├── ApplicationModal.jsx
│   │   ├── Chat.jsx
│   │   ├── ChatList.jsx
│   │   ├── JobCard.jsx
│   │   ├── JobPostForm.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── config/
│   │   └── firebase.js      # Firebase configuration
│   ├── hooks/
│   │   └── useAuth.js       # Authentication hook
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── TalentFinderDashboard.jsx
│   │   ├── TalentSeekerDashboard.jsx
│   │   ├── Profile.jsx
│   │   └── LandingPage.jsx
│   ├── utils/
│   │   └── jobMatching.js   # Match score algorithm
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Key Features Explained

### Match Score Algorithm
The match score calculates compatibility based on:
- Skills matching (40% weight)
- Interests matching (20% weight)
- Job type preference (20% weight)
- Location matching (10% weight)
- Experience level (10% weight)

### Role Switching
Users can seamlessly switch between Talent Finder and Talent Seeker modes without logging out, allowing them to both post opportunities and apply to jobs.

### Real-time Chat
Built with Firestore's real-time listeners, enabling instant messaging between users with unread message indicators.

### Application Status Tracking
- **Pending**: Application submitted, awaiting review
- **Shortlisted**: Application selected for further consideration
- **Accepted**: Application approved
- **Rejected**: Application not selected

## Future Enhancements

- Push notifications for new messages and application updates
- Email notifications
- Advanced filtering and search
- Resume parsing and auto-fill
- AI-powered job recommendations
- Rating and review system
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Sample Data

To populate the database with sample jobs for testing:

1. Log in to the app
2. Switch to **Talent Finder** mode
3. Look for the "Add 20 Sample Jobs" button in the bottom-right corner
4. Click it to populate Firestore with diverse sample jobs

This will add 20 sample jobs across all job types:
- Academic Projects (3 jobs)
- Startup/Collaborations (4 jobs)
- Part-time Jobs (5 jobs)
- Competitions/Hackathons (4 jobs)
- Team Search (4 jobs)

These jobs are designed with varied skills and tags to test the match score algorithm and recommendations.

## Feature Documentation

For detailed information on how all features are implemented, see:
- **[FEATURE_TRACKING.md](./FEATURE_TRACKING.md)** - Complete feature implementation guide
- **[QUICK_FIREBASE_SETUP.md](./QUICK_FIREBASE_SETUP.md)** - Firebase setup instructions

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ for campus communities

