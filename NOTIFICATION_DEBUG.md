# Notification Debugging Guide

If notifications aren't appearing, follow these steps:

## Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and look for:
1. **When someone applies to your job:**
   - Look for: "Creating notification for job poster: ..."
   - Look for: "Notification created successfully: [id]"
   - Look for: "Failed to create notification..." (if there's an error)

2. **When checking notifications:**
   - Look for: "Notifications received: [count]"
   - Look for: "Notification details: ..."
   - Look for: "Unread count: [number]"
   - Look for: "Error fetching notifications..." (if there's an error)

## Step 2: Check Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Firestore Database**
3. Check the `notifications` collection:
   - Are there any documents?
   - Do they have `userId` matching your user ID?
   - Do they have `read: false`?
   - Do they have `createdAt` timestamp?

## Step 3: Verify User ID Match

Make sure the notification's `userId` matches your current logged-in user's UID:
1. Check console for "Creating notification for: [userId]"
2. Verify this matches your user ID in Firebase Auth

## Step 4: Check Firestore Index

If you see `failed-precondition` error:
1. The app will automatically use a fallback query
2. But you should create the proper index:
   - Collection: `notifications`
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   - See `FIRESTORE_INDEX_SETUP.md` for details

## Step 5: Check Firestore Security Rules

Make sure your Firestore rules allow:
```javascript
match /notifications/{notificationId} {
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null;
  allow update: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

## Step 6: Verify NotificationBell Component

1. Check if the bell icon appears in the navbar
2. Click it to see if dropdown opens
3. Check if notifications appear in the dropdown even if badge doesn't show

## Common Issues:

1. **Notification created but not showing:**
   - Check if `userId` in notification matches your current user
   - Check if query listener is active (look for "Notifications received" in console)

2. **Index missing:**
   - Look for `failed-precondition` error
   - The fallback query should still work

3. **Permission denied:**
   - Check Firestore security rules
   - Make sure user is authenticated

4. **No notification created:**
   - Check for errors in "Failed to create notification" log
   - Verify `selectedJob.postedBy` is a valid user ID

