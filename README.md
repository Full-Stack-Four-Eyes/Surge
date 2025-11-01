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

3. **Firebase Configuration**
   
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication:
     - Email/Password
     - Google
     - GitHub
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase config from Project Settings

4. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

   Or edit `src/config/firebase.js` directly with your Firebase config.

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

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ for campus communities

