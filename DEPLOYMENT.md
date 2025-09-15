# Deployment Guide

## Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from root directory:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings on vercel.com
   - Add these environment variables:
   
   **Backend Variables:**
   - `MONGO_URI` = your MongoDB connection string
   - `CLERK_PUBLISHABLE_KEY` = pk_test_bWFueS1nYXJmaXNoLTk1LmNsZXJrLmFjY291bnRzLmRldiQ
   - `CLERK_SECRET_KEY` = sk_test_RY7nwYFVY9W9HNs7xEi9C7lGOV8Bwh0EWWo9tSBYVj
   - `GEMINI_API_KEY` = AIzaSyALgIHs7yXzMUe1a4qSJItstqnWexhYxy0
   - `CLIPDROP_API_KEY` = e59f908dfc6fb94de203ae446c805bb62468a97893b6a19ce1c6c0627401ddfc07278ae10aeeb781c850935d70229df1
   - `REMOVE_BG_API_KEY` = PVhaZyPF6tmVBgLqWuGMXb7R
   - `CLOUDINARY_CLOUD_NAME` = dv2ewjztn
   - `CLOUDINARY_API_KEY` = 737565437768887
   - `CLOUDINARY_API_SECRET` = -Ui-3Cly96girBLxhrYOS__eiQU

5. **Update frontend .env.production with your actual Vercel URL**

## Alternative: Deploy Backend and Frontend Separately

### Backend (Railway/Render):
1. Push backend folder to separate GitHub repo
2. Deploy to Railway or Render
3. Get the deployed URL

### Frontend (Vercel/Netlify):
1. Update VITE_BASE_URL in .env.production with backend URL
2. Deploy frontend folder to Vercel or Netlify