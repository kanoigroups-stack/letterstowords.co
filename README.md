# Word Unscrambler & Wordle Companion Suite

A highly polished, high-performance, and responsive TypeScript web application built with **React**, **Vite**, and **Tailwind CSS**. This suite provides the ultimate word unscrambling, dictionary lookup, anagram finding, word wheel solving, and Wordle training helper companion.

---

## 🚀 One-Click Deployments

You can deploy this React single-page application (SPA) directly from your GitHub repository to these popular hosting platforms with zero configuration changes:

| Platform | Deployment Method | Notes |
| :--- | :--- | :--- |
| **Vercel** | Import directly from GitHub | Select **Vite** as framework preset. It will auto-detect configurations and build to `dist`. |
| **Netlify** | Import directly from GitHub | Set Build Command to `npm run build` and Publish Directory to `dist`. |
| **GitHub Pages** | Setup via GitHub Actions | Perfect for hosting directly under your username (`username.github.io/repo`). |

---

## 📥 How to Download This Project from Google AI Studio

You don't need to manually copy individual files! AI Studio provides a built-in workflow to download or push this entire project:

1. **Open Settings**: Look at the top right of the Google AI Studio interface and click on the **Settings** (gear) icon or the project title menu.
2. **Export Code**:
   - **Download as ZIP**: Select the **Download ZIP** option. This will package the entire codebase (`package.json`, source files, icons, typescript config) into a single archive that you can extract on your desktop.
   - **Export to GitHub**: Select the **Export to GitHub** option. This allows you to link your GitHub account and automatically provision a clean, fresh repository containing this exact code in one click!

---

## 🛠️ Local Development Setup

To run this application locally on your computer:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Extract and Install
```bash
# Extract the ZIP downloaded from AI Studio and enter the directory
cd word-unscrambler-suite

# Install all dependencies
npm install
```

### 3. Run Development Server
```bash
# Start the local development server
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to interact with the suite!

### 4. Build for Production
To generate optimized, minified static files ready to be served from any web server:
```bash
# Compiles output to the /dist folder
npm run build
```

---

## 📁 Repository Directory Structure

When uploading to GitHub, your repository will look like this:

```markdown
├── public/                # Static assets, logo icons
├── src/
│   ├── components/        # Isolated visual tabs & overlay modals
│   │   ├── Header.tsx           # Premium top navigation bar
│   │   ├── Footer.tsx           # Sitemaps & interactive legal guides
│   │   ├── UnscramblerTab.tsx   # Word Unscrambler with wildcards/filters
│   │   ├── DictionaryTab.tsx    # Dictionary lookup (Local + External API)
│   │   ├── DescramblerTab.tsx   # Word Wheel & bulk letter descrambler
│   │   ├── AnagramsTab.tsx      # Perfect anagram generator
│   │   ├── WordleTab.tsx        # Interactive Wordle game with Live Solver AI
│   │   ├── RandomTab.tsx        # Vocabulary training, Word of Day & Scramble
│   │   └── WordDetailModal.tsx  # Dynamic modal showing words, points, meanings
│   ├── data/
│   │   └── words.ts             # Compressed high-frequency 3,000+ words database
│   ├── App.tsx            # Navigation controller and dialog routing
│   ├── types.ts           # Type-safe global Interfaces (word lists, tab keys)
│   ├── utils.ts           # Letter permutation engines & solver math
│   ├── index.css          # Core CSS stylesheet mounting Tailwind CSS
│   └── main.tsx           # Vite TypeScript entry loader
├── package.json           # Installed modules and compiler script actions
├── tsconfig.json          # TypeScript static-type validation guidelines
├── vite.config.ts         # Vite build bundler pipeline configuration
└── README.md              # This instruction guide (perfect for GitHub)
```

---

## ✨ Features & Architecture

### 1. Advanced Unscrambling Mathematics
Uses recursive backtracking search (`solveUnscramble`) to matches letter racks with **blank wildcard tiles (`?` or `*`)** up to 15 letters. It processes filters dynamically:
- **Letters count group sizing**
- **Inclusion locks (Must include)**
- **Starts with & Ends with regex alignments**

### 2. Dual Dictionary Systems
- **Local Engine**: A super-compact, locally bundled high-frequency wordlist defining thousands of words, available completely offline.
- **External Public API**: Safely resolves real-time definitions, phonetic audio paths, speech tags, and synonyms via asynchronous proxy callbacks when the user is online.

### 3. Real-Time Wordle Board Tracking
Solves interactive Wordle games automatically by implementing a state constraint matrix checking locked green characters, yellow exclusions, and gray character lists.

---

## 📜 Licensing
Feel free to modify, distribute, or run this app for personal or commercial projects. Enjoy playing and improving your word game skills!
