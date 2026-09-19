# 📱 DayFlow - Daily Planner & Task Manager

<p align="center">
  <img src="public/icon.svg" alt="DayFlow" width="120" />
</p>

<p align="center">
  <strong>Plan your day. Track your progress. Achieve your goals.</strong>
</p>

<p align="center">
  <a href="#-download-apk-android"><strong>📱 Download APK</strong></a> •
  <a href="#features">Features</a> •
  <a href="#-installation">Install as PWA</a> •
  <a href="#development">Development</a>
</p>

<p align="center">
  <a href="../../releases/latest">
    <img src="https://img.shields.io/github/v/release/YOUR_USERNAME/YOUR_REPO?label=Latest%20APK&style=for-the-badge&color=6366f1" alt="Latest APK Release" />
  </a>
</p>

---

## 🌟 About DayFlow

**DayFlow** is a beautifully designed productivity app that helps you organize your daily life with intelligent scheduling, task management, and comprehensive progress tracking. Whether you're a student, professional, or anyone looking to boost their productivity, DayFlow provides all the tools you need to stay on top of your day.

Unlike complex project management tools, DayFlow focuses on what matters most — **your personal productivity**. Plan your schedule in colorful time blocks, manage tasks with priorities and categories, track your daily/weekly/monthly progress with beautiful charts, and keep notes all in one place.

### ✨ Why Choose DayFlow?

- 🎯 **Simple yet powerful** — Everything you need, nothing you don't
- 📱 **Works everywhere** — Phone, tablet, desktop, or installed as an app
- 🔒 **100% private** — Your data stays on your device, no accounts needed
- 🌐 **Works offline** — Use it anywhere, anytime
- 💜 **Beautiful design** — Clean, modern interface that's a joy to use
- 📊 **Smart insights** — Visual progress reports help you understand your productivity patterns

---

## 🚀 Features

### 📋 Smart Task Management
- Create tasks with titles, descriptions, and due dates
- Set priority levels (Low, Medium, High)
- Organize by categories: Work, Personal, Health, Learning, Finance
- Track task status: To Do → In Progress → Done
- Filter and search through your tasks instantly

### 📅 Visual Daily Schedule
- Plan your day with colorful time blocks (6 AM - 9 PM)
- Navigate between days with ease
- Mark blocks as completed as you go
- Visual progress indicator for the day
- Color-code different activities for quick recognition

### 📊 Progress Reports & Analytics
- **Daily View** — See what you accomplished today
- **Weekly View** — Review your week's productivity
- **Monthly View** — Long-term progress tracking
- Beautiful charts: Bar charts, pie charts, and line graphs
- Track completion rates, streaks, and category distribution
- Monitor schedule adherence over time

### 📝 Quick Notes
- Capture thoughts and ideas instantly
- Color-code your notes for organization
- Search through all your notes
- Edit and update anytime

### 🏠 Smart Dashboard
- At-a-glance overview of your day
- Upcoming schedule blocks
- High-priority tasks that need attention
- Overall progress percentage
- Quick stats and shortcuts

---

## 📲 Installation

### Option 1: Install as PWA (Recommended)

DayFlow is a **Progressive Web App (PWA)**, which means you can install it directly on your phone or computer like a native app!

**On Android (Chrome/Edge):**
1. Open DayFlow in your browser
2. Tap the menu (⋮) or look for the install banner
3. Tap "Install app" or "Add to Home Screen"
4. DayFlow is now installed on your phone!

**On iPhone (Safari):**
1. Open DayFlow in Safari
2. Tap the Share button (⬆️)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" — DayFlow is now on your home screen!

**On Desktop (Chrome/Edge):**
1. Open DayFlow in your browser
2. Click the install icon in the address bar (or menu → Install)
3. DayFlow will open in its own window like a desktop app

### Option 2: Use in Browser

Simply visit the deployed URL and use DayFlow directly in your web browser. All features work the same way!

---

## 📦 Download APK (Android)

### ⭐ Easiest Method: Download from GitHub Releases

**The APK is automatically built and available for download!**

1. Go to your GitHub repository
2. Click on **"Releases"** (right sidebar)
3. Click the latest release (e.g., `v1.0.0`)
4. Under **"Assets"**, click **`DayFlow-v1.0.0.apk`** to download
5. Transfer the APK to your Android phone and install!

### 🚀 How to Create a New APK Release

Every time you want a new APK version:

**Option A: Using GitHub UI (No coding)**
1. Go to your repo on GitHub
2. Click **"Releases"** → **"Create a new release"**
3. Click **"Choose a tag"** → type `v1.0.0` (or next version) → click **"Create new tag"**
4. Click **"Publish release"**
5. ⏳ Wait ~5 minutes for the APK to build automatically
6. The APK will appear in the release assets!

**Option B: Using Git command line**
```bash
git tag v1.0.0
git push origin v1.0.0
```

That's it! GitHub Actions will automatically build the APK and attach it to the release.

### 📲 Installing the APK on Your Phone

1. Download the `.apk` file from GitHub Releases
2. Transfer to your Android phone (via USB, email, cloud storage, etc.)
3. Open the file on your phone
4. If prompted, enable **"Install from unknown sources"** in Settings
5. Tap **"Install"**
6. Open DayFlow from your app drawer!

### 🔧 Alternative: Build APK Manually

If you want to customize the app or build locally:

```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Add Android platform (first time only)
npx cap add android

# Sync web app with Android
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🌐 Deployment

Deploy DayFlow to make it accessible from anywhere:

### GitHub Pages (Free — Automatic!)

The repo already includes a GitHub Actions workflow that handles everything:

1. **Push this repo to GitHub**
2. **That's it!** The workflow will automatically:
   - Build the app
   - Create a `gh-pages` branch
   - Deploy your site

3. Your app will be live at: `https://yourusername.github.io/repo-name/`

**First-time setup (if deployment doesn't start):**
1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **"Deploy from a branch"**
4. Select branch: **`gh-pages`** / folder: **`/ (root)`**
5. Click **Save**

> 💡 The workflow runs automatically on every push to `main`. No manual setup needed after the first deployment!

### Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Click Deploy — Done!

### Netlify (Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder, or connect your repo
4. Your site is live!

---

## 💻 Development

### Prerequisites

- Node.js 18+ installed on your computer
- A code editor (VS Code recommended)
- Git for version control

### Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/dayflow.git
cd dayflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type-safe code
- **Tailwind CSS** — Modern styling
- **Vite** — Lightning-fast build tool
- **Recharts** — Beautiful data visualization
- **Lucide Icons** — Clean icon library
- **date-fns** — Date manipulation
- **LocalStorage** — No database needed!

### Project Structure

```
dayflow/
├── public/           # Static assets & PWA files
│   ├── manifest.json # PWA configuration
│   ├── sw.js         # Service worker
│   └── icon.svg      # App icon
├── src/
│   ├── components/   # React components
│   │   ├── Dashboard.tsx
│   │   ├── Schedule.tsx
│   │   ├── Tasks.tsx
│   │   ├── Progress.tsx
│   │   ├── Notes.tsx
│   │   └── InstallPrompt.tsx
│   ├── App.tsx       # Main app component
│   ├── types.ts      # TypeScript types
│   ├── store.ts      # LocalStorage helpers
│   └── main.tsx      # Entry point
└── index.html        # HTML template
```

---

## 🔐 Privacy & Data

DayFlow is designed with your privacy in mind:

- ✅ **No account required** — Start using immediately
- ✅ **No data collection** — We don't track anything
- ✅ **Local storage only** — Your data stays on your device
- ✅ **No internet needed** — Works completely offline
- ✅ **No third-party services** — No analytics, no ads
- ✅ **Open source** — See exactly what the app does

Your tasks, schedules, notes, and progress data are stored locally in your browser. Clear your browser data to reset everything.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

Built with modern web technologies and a passion for productivity.

---

<p align="center">
  <strong>Made with 💜 for productive people everywhere</strong>
</p>

<p align="center">
  <sub>Keywords: daily planner, task manager, productivity app, schedule planner, time management, to-do list, progress tracker, habit tracker, goal setting, free planner app, offline planner, PWA, mobile app, android app</sub>
</p>
