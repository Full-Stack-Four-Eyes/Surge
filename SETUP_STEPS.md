# Complete Setup Steps - Step by Step

## Prerequisites: Install Node.js (if not already installed)

### Step 1: Check if Node.js is Installed

Open PowerShell or Command Prompt and type:
```bash
node --version
npm --version
```

If you see version numbers (like `v18.17.0`), you're good! Skip to **Step 2: Open Project Directory**.

If you get an error like "node is not recognized", continue below.

### Step 1a: Download and Install Node.js

1. **Go to**: https://nodejs.org/
2. **Download**: Click the "LTS" (Long Term Support) version button
   - This will download something like `node-v20.x.x-x64.msi`
3. **Run the installer**:
   - Double-click the downloaded file
   - Click "Next" through the installation
   - ✅ Check "Automatically install the necessary tools" if prompted
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"
4. **Restart your terminal/PowerShell** (close and reopen it)
5. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers for both.

---

## Step 2: Open Project Directory

You need to navigate to your project folder in the terminal.

### Option A: Using File Explorer
1. Open **File Explorer**
2. Navigate to: `D:\SurgeProject\project`
3. Click in the address bar (where it shows the path)
4. Type `powershell` and press Enter
   - OR right-click in the folder → "Open in Terminal" / "Open PowerShell window here"

### Option B: Using PowerShell/Command Prompt
1. Open **PowerShell** (search for "PowerShell" in Start menu)
2. Type:
   ```bash
   cd D:\SurgeProject\project
   ```
3. Press Enter

### Verify you're in the right place:
```bash
pwd
```
Should show: `D:\SurgeProject\project`

Also check if `package.json` exists:
```bash
dir package.json
```
Should show the file.

---

## Step 3: Install Dependencies

**In the same terminal/PowerShell window** (where you're in `D:\SurgeProject\project`), run:

```bash
npm install
```

### What this does:
- Reads `package.json`
- Downloads all required packages (React, Firebase, etc.)
- Creates `node_modules` folder with all dependencies
- Takes 1-3 minutes depending on internet speed

### Expected Output:
You'll see something like:
```
added 234 packages, and audited 235 packages in 45s
```

### If you get errors:

**Error: "npm is not recognized"**
- Node.js is not installed or not in PATH
- Restart terminal after installing Node.js
- Or reinstall Node.js

**Error: "EACCES" or permission errors**
- Run PowerShell as Administrator:
  1. Search "PowerShell" in Start menu
  2. Right-click → "Run as Administrator"
  3. Navigate to project: `cd D:\SurgeProject\project`
  4. Run `npm install` again

**Error: Network/timeout errors**
- Check your internet connection
- Try again, npm sometimes has connection issues
- Or use: `npm install --registry https://registry.npmjs.org/`

**Error: "npm ERR! code ERESOLVE"**
- Try: `npm install --legacy-peer-deps`

---

## Step 4: Set Up Firebase (Required Before Running)

Before running the app, you need Firebase credentials.

### Quick Setup:
1. Go to https://console.firebase.google.com/
2. Click "Add project" (or "Create a project")
3. Enter project name (e.g., "CampusConnect")
4. Continue through setup
5. Go to **Authentication** → Enable **Email/Password** and **Google**
6. Go to **Firestore Database** → Create database → **Test mode**
7. Go to **Storage** → Get started → **Test mode**
8. Go to **Project Settings** (⚙️ icon) → Scroll to "Your apps" → Click web icon `</>`
9. Copy the config values

### Create `.env` file:

1. **In your project folder** (`D:\SurgeProject\project`)
2. Create a new file named `.env` (exactly this name, starting with a dot)
3. Add these lines (replace with YOUR values):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...your-actual-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id-12345
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

**How to create .env file:**
- Option 1: Use Notepad
  1. Open Notepad
  2. Paste the content above (with your values)
  3. Save As → Name it `.env` (with the dot at the start)
  4. Save in `D:\SurgeProject\project`

- Option 2: Use VS Code
  1. Open VS Code in your project
  2. Create new file
  3. Name it `.env`
  4. Paste content
  5. Save

---

## Step 5: Run the Development Server

**In the same terminal** (still in `D:\SurgeProject\project`), run:

```bash
npm run dev
```

### Expected Output:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

  ready in xxx ms.
```

### What this does:
- Starts the development server
- Compiles your React app
- Opens it at http://localhost:5173

### Open in Browser:
1. Copy the URL shown (usually `http://localhost:5173`)
2. Paste in your browser
3. You should see the CampusConnect landing page!

### To Stop the Server:
Press `Ctrl + C` in the terminal

---

## Quick Command Summary

Open PowerShell in `D:\SurgeProject\project`, then:

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Run development server
npm run dev

# 3. Build for production (when ready)
npm run build
```

---

## Troubleshooting

### "Cannot find module" errors after npm install:
```bash
# Delete and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### Port already in use:
```bash
# Use different port
npm run dev -- --port 3000
```

### .env file not working:
- Make sure file is named exactly `.env` (not `.env.txt`)
- Make sure it's in `D:\SurgeProject\project` (root, not in `src/`)
- Restart dev server after creating/editing `.env`

### Firebase errors:
- Double-check your config values in `.env`
- Make sure Firebase services are enabled (Auth, Firestore, Storage)
- Check browser console for specific errors

---

## File Structure After Setup

Your project should look like:
```
D:\SurgeProject\project\
├── node_modules\          (created by npm install)
├── src\
├── public\
├── .env                   (you create this)
├── package.json
├── package-lock.json      (created by npm install)
├── vite.config.js
├── index.html
└── README.md
```

---

## Next Steps After Setup

1. ✅ `npm install` - DONE
2. ✅ Create `.env` with Firebase config
3. ✅ `npm run dev`
4. ✅ Open http://localhost:5173
5. Test sign up/login
6. Create profile
7. Test creating jobs
8. Test applying to jobs

For detailed testing guide, see `LOCAL_TESTING.md`


