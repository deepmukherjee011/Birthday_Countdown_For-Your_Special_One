# Romantic Birthday Countdown 🎂✨

A beautiful, single-page React application designed to count down to a special someone's birthday. It features a flickering candle countdown, a dynamic starfield background, a random rotating memory (photo/video), and a tap-to-play song player. When the countdown hits zero, it triggers a confetti celebration screen.

## Features
- **Dynamic Age Calculation**: Automatically computes the age based on the birth year.
- **Randomized Memories**: Displays a random photo or video and plays a random song on each visit.
- **Admin Setup**: First-time setup to enter the birthday details and add memories without touching the code.
- **Client-Side Compression**: Images are automatically compressed before uploading to save storage space.
- **Stunning UI**: Dark midnight-indigo theme with warm gold glow and subtle animations.

## Tech Stack
- React + Vite
- Firebase (Firestore & Storage)
- canvas-confetti
- browser-image-compression

---

## 🚀 Setup Instructions

### 1. Firebase Project Setup (Free Spark Plan)
This app relies on Firebase to store the configuration (birthday dates) and memories (photos/audio).

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**. Name it (e.g., "birthday-countdown").
2. Disable Google Analytics (not needed).
3. Once created, click the **Web icon (</>)** to register the app. Give it a nickname and register.
4. You will see a `firebaseConfig` object. Keep this tab open; you will need these keys shortly.

### 2. Enable Firestore Database
1. In the left menu, click **Build > Firestore Database** and click **Create database**.
2. Start in **Test mode** (or update rules later) and choose a location close to you.
3. Once created, go to the **Rules** tab and set it to allow all reads and writes (since this is a private app for you two):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   *Note: Anyone with the link and your keys can read/write data, so keep the deployed URL private.*

### 3. Enable Firebase Storage
1. In the left menu, click **Build > Storage** and click **Get started**.
2. Start in test mode.
3. Go to the **Rules** tab and set:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```

### 4. Local Environment Setup
1. Clone this repository or download the source code.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and copy the contents of `.env.example` into it.
4. Replace the values in `.env` with the keys from your Firebase Console (Step 1.4).

### 5. Running Locally
Run `npm run dev` to start the local server. The app will prompt you for the initial setup.

---

## ☁️ Deployment (Vercel)

Deploying a Vite app on Vercel is free and straightforward.

1. **Push to GitHub**: Initialize a Git repository, commit your code, and push it to a private repository on GitHub.
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **Add New > Project** and import your newly created repository.
4. In the **Environment Variables** section, add all the `VITE_FIREBASE_*` keys from your `.env` file.
5. Ensure the Framework Preset is set to **Vite** (Vercel usually detects this automatically).
6. Click **Deploy**. Vercel will build and provide a free live URL!

---

## ⚙️ Using the Admin Panel
- **First-Time Setup**: When you visit the site for the first time with an empty database, you will be prompted to enter her name and birthday details.
- **Adding Memories**: Click the subtle **pencil icon (✎)** in the bottom right corner of the page to open the Admin Panel. From there, you can upload photos, videos, and audio tracks with optional captions. Images will be automatically compressed before uploading.
