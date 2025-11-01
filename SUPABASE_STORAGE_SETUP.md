# Supabase Storage Setup Guide

## Issue: Row-Level Security (RLS) Policy Error

If you're getting `new row violates row-level security policy` when uploading resumes, you need to configure your Supabase Storage bucket permissions.

## Quick Fix: Make Bucket Public (Recommended for Testing)

This allows anyone to upload and read files from the `resumes` bucket.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open Storage**
   - Click on **Storage** in the left sidebar
   - Find the `resumes` bucket

3. **Configure Bucket Settings**
   - Click on the `resumes` bucket
   - Go to **Settings** tab
   - Under **Public bucket**, toggle it to **ON** (make it public)
   - **Save** changes

4. **Set RLS Policies** (Alternative if you want more control)
   - Go to **Policies** tab in the bucket
   - Click **New Policy**
   
   **For Uploads (INSERT):**
   - Policy name: `Allow public uploads`
   - Allowed operation: `INSERT`
   - Policy definition: `true` (or use: `bucket_id = 'resumes'`)
   - Click **Save**

   **For Reads (SELECT):**
   - Policy name: `Allow public reads`
   - Allowed operation: `SELECT`
   - Policy definition: `true`
   - Click **Save**

## More Secure Option: Authenticated Uploads Only

If you want to restrict uploads to authenticated users only (requires Supabase Auth integration):

1. **Enable RLS on the bucket**
2. **Create Policies:**
   
   **For Uploads:**
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'resumes');
   ```

   **For Reads:**
   ```sql
   CREATE POLICY "Allow public reads"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'resumes');
   ```

## Recommended Configuration

For this application (using Firebase Auth), the simplest approach is:

1. **Make the bucket public** (easiest)
2. **OR** Set RLS policies with `SELECT` and `INSERT` operations allowed for all users

After making these changes, try uploading a resume again. The error should be resolved.

