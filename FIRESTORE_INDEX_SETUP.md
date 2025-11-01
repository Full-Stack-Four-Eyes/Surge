# Firestore Index Setup for Notifications

The notifications feature requires a composite index in Firestore. If you're seeing errors about missing indexes, follow these steps:

## Automatic Setup (Recommended)

1. When you first use the notifications feature, Firestore will show an error message in the browser console
2. Click the link in the error message - it will take you directly to the Firebase Console to create the index
3. Wait for the index to build (usually takes a few minutes)

## Manual Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Set the following:
   - **Collection ID**: `notifications`
   - **Fields to index**:
     - Field: `userId`, Type: `Ascending`
     - Field: `createdAt`, Type: `Descending`
   - **Query scope**: Collection
6. Click **Create**

## Alternative: Use Fallback Query (Already Implemented)

The app already includes a fallback that queries without `orderBy` if the index is missing. The notifications will still work, but they'll be sorted client-side instead of server-side.

## Verify Index Creation

After creating the index:
1. The index status will show as "Building" initially
2. Wait until it shows "Enabled" (usually 2-5 minutes)
3. Refresh your app - notifications should now load properly

## Troubleshooting

- **Notifications not showing up**: Check browser console for errors
- **Index taking too long**: The fallback query will work in the meantime
- **Permission errors**: Ensure your Firestore security rules allow read/write on the `notifications` collection

