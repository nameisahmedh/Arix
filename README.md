# Arix - AI Content Creation Platform

A full-stack AI-powered platform for content creation, featuring article generation, blog titles, image creation, and background removal.

## 🚀 Live Demo

- **Frontend**: [https://arix-ai.vercel.app/](https://arix-ai.vercel.app/)
- **Backend API**: [https://arix-6lw6efanp-nameisahmedhs-projects.vercel.app/](https://arix-6lw6efanp-nameisahmedhs-projects.vercel.app/)

## ✨ Features

### 🤖 AI Content Generation
- **Article Writing**: Generate full articles with customizable length
- **Blog Title Generator**: Create catchy blog titles
- **Image Generation**: AI-powered image creation from text prompts
- **Background Removal**: Automatic background removal from images

### 🔐 User Management
- **Authentication**: Secure user authentication with Clerk
- **Usage Limits**: 3 free uses per feature for non-premium users
- **Premium Plans**: Unlimited access for premium subscribers

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Framer Motion animations
- **Real-time Feedback**: Toast notifications and loading states

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Clerk** - Authentication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Clerk** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File uploads

### AI Services
- **Google Gemini** - Text generation
- **ClipDrop API** - Image generation
- **Cloudinary AI** - Background removal

## 📁 Project Structure

```
Arix/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   └── config/        # Configuration files
│   ├── public/            # Public assets
│   └── package.json
├── backend/
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── configs/          # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- Clerk account
- API keys for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Arix
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Environment Setup**

   **Frontend (.env)**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BASE_URL=http://localhost:3000
   ```

   **Backend (.env)**
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   CLIPDROP_API_KEY=your_clipdrop_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🔑 API Keys Setup

### Clerk Authentication
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Get publishable and secret keys

### Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create API key
3. Add to environment variables

### ClipDrop API
1. Sign up at [clipdrop.co](https://clipdrop.co)
2. Get API key from dashboard
3. Add to environment variables

### Cloudinary
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get cloud name, API key, and secret
3. Add to environment variables

## 📊 Usage Limits

### Free Users
- **Articles**: 10 generations
- **Blog Titles**: 10 generations
- **Images**: 3 generations
- **Background Removal**: 3 processes

### Premium Users
- **Unlimited access** to all features
- **Priority support**
- **Advanced features**

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Add all environment variables
   - Redeploy if needed

### Alternative Deployment Options
- **Frontend**: Netlify, Vercel
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Contact support at your-email@example.com

## 🙏 Acknowledgments

- **Clerk** for authentication
- **Google** for Gemini AI
- **ClipDrop** for image generation
- **Cloudinary** for image processing
- **Vercel** for hosting

---

**Built with ❤️ by Ahmed**