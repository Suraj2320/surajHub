# 📥 Download & Run SurajHub Locally in VS Code

Complete step-by-step guide to download from Replit and run on your machine.

---

## 🎯 QUICK OVERVIEW

| Step | Time | Action |
|------|------|--------|
| 1 | 2 min | Download ZIP from Replit |
| 2 | 5 min | Extract & open in VS Code |
| 3 | 5 min | Install Node.js + Docker |
| 4 | 2 min | Setup .env file |
| 5 | 5 min | Install dependencies |
| 6 | 2 min | Start database & server |
| 7 | 1 min | Test in browser |

**Total: ~20 minutes to full app running!**

---

## STEP 1: Download Project from Replit

### Option A: Download as ZIP (Easiest)
1. In Replit, click **Files** (left sidebar)
2. Click **⋮ (three dots)** in file browser header
3. Select **Download as ZIP**
4. Wait for download to complete (will be ~50MB with all files)
5. Extract ZIP to your computer
   - **Windows**: Right-click → "Extract All"
   - **Mac**: Double-click the ZIP file
   - **Linux**: `unzip surajhub.zip`

### Option B: Clone from GitHub (If already pushed)
```bash
git clone https://github.com/yourusername/surajhub.git
cd surajhub
```

---

## STEP 2: Open in VS Code

1. **Open VS Code**
2. **File** → **Open Folder**
3. Select the extracted **surajhub** folder
4. Trust the workspace when prompted

You should see the project structure:
```
surajhub/
├── client/          (React frontend)
├── server/          (Express backend)
├── shared/          (Database schema)
├── package.json
├── vite.config.ts
├── docker-compose.yml
└── .env.example
```

---

## STEP 3: Install Required Software

### 3.1 Install Node.js (REQUIRED)

**Windows/Mac:**
1. Go to https://nodejs.org
2. Download **LTS version (v20.x recommended)**
3. Run installer and follow prompts
4. **Restart your computer** after installation

**Linux:**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Verify installation:**
```bash
node --version   # Should show v20.x.x or higher
npm --version    # Should show 9.x.x or higher
```

### 3.2 Install Docker Desktop (RECOMMENDED)

**Windows/Mac:**
1. Go to https://www.docker.com/products/docker-desktop
2. Download for your OS
3. Install and follow setup prompts
4. Start Docker Desktop (it runs in background)

**Linux:**
```bash
sudo apt install docker.io docker-compose
sudo systemctl start docker
```

**Verify Docker:**
```bash
docker --version
docker-compose --version
```

---

## STEP 4: Create .env File

1. In VS Code, open Terminal: **Ctrl+`** (or **Terminal** → **New Terminal**)
2. Create .env file from template:

**On Mac/Linux:**
```bash
cp .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

3. Open `.env` file and verify it contains:
```env
DATABASE_URL=postgresql://surajhub:surajhub_secure_password@postgres:5432/surajhub
PGHOST=localhost
PGPORT=5432
PGUSER=surajhub
PGPASSWORD=secure_password
PGDATABASE=surajhub
SESSION_SECRET=your_random_session_secret_min_32_chars_long_change_in_production
NODE_ENV=development
```

**Leave these blank for local dev:**
- STRIPE_SECRET_KEY
- STRIPE_PUBLIC_KEY
- AWS_* variables

---

## STEP 5: Install Dependencies

In VS Code terminal, run:

```bash
npm ci
```

**This will:**
- Download ~500MB of packages
- Take 3-5 minutes
- Show "added XXX packages" when done

**Wait until it says "done" before proceeding!**

---

## STEP 6: Start Database & Server

### 6A: Start PostgreSQL with Docker

```bash
docker-compose up -d
```

Wait 30 seconds for database to start:

```bash
# Verify containers running
docker-compose ps

# You should see:
# surajhub-db     postgres:15-alpine    Up (healthy)
# surajhub-redis  redis:7-alpine        Up
```

### 6B: Initialize Database Schema

```bash
npm run db:push
```

**Output should show:**
```
✓ Pulling schema from database...
✓ Changes applied
```

### 6C: Start Development Server

```bash
npm run dev
```

**You should see:**
```
✓ Ready in 1234 ms
✓ Local: http://localhost:5000
✓ Press 'q' to quit
```

---

## STEP 7: Test in Browser

1. **Open browser** (Chrome, Firefox, Safari)
2. **Visit:** http://localhost:5000
3. You should see:
   - ✅ SurajHub logo (gradient sun icon)
   - ✅ Product categories
   - ✅ Search bar
   - ✅ Cart button
   - ✅ Sign In button

---

## 🧪 Quick Feature Test

### Test 1: Sign Up
1. Click **Sign In** (top right)
2. Click **"Sign Up"** link
3. Fill in:
   - Email: `test@example.com`
   - Password: `Test123!` (must have uppercase, lowercase, number)
   - First Name: `Test`
   - Last Name: `User`
4. Click **Sign Up**
5. ✅ Should see welcome message

### Test 2: Browse Products
1. Click any category (e.g., "Mobile Phones")
2. ✅ Should see product list
3. Click a product
4. ✅ Should see product details

### Test 3: Add to Cart
1. On any product, click **"Add to Cart"**
2. Look at navbar - cart badge should show **"1"** ✅
3. Click cart icon
4. ✅ Item should be in cart

### Test 4: Order History
1. Click your profile avatar (top right)
2. Click **"My Orders"**
3. ✅ Should see order history (empty for new user)

---

## 📱 Key URLs When Running Locally

| URL | Purpose |
|-----|---------|
| **http://localhost:5000** | Frontend - SurajHub app |
| **http://localhost:3000/api** | Backend API base |
| **http://localhost:5555** | Database GUI (optional) |
| **http://localhost:6379** | Redis cache |

---

## 🛠️ Essential Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run db:push          # Sync database schema
npm run db:studio        # Open database GUI
```

### Docker (Database)
```bash
docker-compose up -d     # Start services (background)
docker-compose ps        # See running containers
docker-compose logs app  # View logs
docker-compose down      # Stop services
docker-compose down -v   # Stop and delete data
```

### Stopping the App
```bash
# Press Ctrl+C in terminal to stop dev server
# Run to stop Docker:
docker-compose down
```

---

## ❌ Troubleshooting

### "Port 5000 already in use"
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### "Cannot connect to database"
```bash
# Check if Docker is running
docker-compose ps

# If not, restart it
docker-compose down -v
docker-compose up -d
sleep 30
npm run db:push
```

### "Node.js not found"
```bash
# Verify Node.js installed
node --version

# If not:
# 1. Install Node.js from https://nodejs.org
# 2. Restart VS Code
# 3. Try again
```

### "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm ci
```

### "Blank page or styling issues"
1. Hard refresh browser: **Ctrl+F5** (or **Cmd+Shift+R** on Mac)
2. Clear browser cache
3. Restart dev server: Press **Ctrl+C** then `npm run dev`

### "Can't login / Always redirected to login"
- This was fixed with JWT token storage
- Make sure you're using the latest code
- Hard refresh browser: **Ctrl+F5**
- Check browser console (F12) for errors

---

## 📊 Project Structure

```
surajhub/
├── client/                   # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom hooks (useAuth)
│   │   ├── context/         # Context (CartContext)
│   │   ├── lib/             # Utilities (queryClient, auth)
│   │   └── main.jsx         # App entry point
│   ├── index.html
│   └── vite.config.ts
│
├── server/                   # Express backend
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # Database operations
│   ├── app.ts               # Express app setup
│   ├── auth.middleware.js   # JWT verification
│   ├── password.utils.js    # Password hashing
│   └── index-dev.ts         # Dev server entry
│
├── shared/                   # Shared code
│   └── schema.ts            # Database schema (Drizzle ORM)
│
├── docker-compose.yml       # Docker services (PostgreSQL, Redis)
├── Dockerfile               # Production container
├── package.json             # Dependencies
├── .env.example             # Environment template
├── vite.config.ts           # Frontend build config
└── drizzle.config.ts        # Database config
```

---

## 🔐 Security Notes

✅ **What's Secure:**
- JWT tokens for authentication
- Password hashing (PBKDF2 + salt)
- Protected API routes
- Role-based access control

⚠️ **For Production:**
- Change `SESSION_SECRET` to random 32+ char string
- Use environment variables from your hosting provider
- Enable HTTPS
- Add rate limiting
- Enable CORS properly
- Set secure cookies

---

## 🚀 Next Steps

### After App is Running:
1. **Explore the codebase:**
   - Frontend: `client/src/pages/` for page components
   - Backend: `server/routes.ts` for API endpoints
   - Database: `shared/schema.ts` for data models

2. **Make your first change:**
   - Edit `client/src/pages/Home.jsx`
   - Changes auto-reload in browser (hot reload)

3. **Test authentication:**
   - Sign up with test account
   - Log in
   - See your profile in navbar (top right)

4. **Understand the stack:**
   - React + Vite (frontend)
   - Express.js (backend)
   - PostgreSQL (database)
   - Tailwind CSS (styling)
   - TanStack Query (data fetching)

---

## 📞 Need Help?

**Check these files:**
- `LOCAL_SETUP_VSCODE.md` - Detailed local setup
- `SECURITY_IMPLEMENTATION.md` - Auth & security details
- `MASTER_DEPLOYMENT_GUIDE.md` - Production deployment
- `QUICK_START_GUIDE.md` - Quick reference

**Common Issues:**
- Port in use? → Kill process or change port in .env
- Database won't connect? → Restart Docker, check DATABASE_URL
- Module not found? → Run `npm ci` again
- Blank page? → Hard refresh (Ctrl+F5) and check console (F12)

---

## ✨ You're All Set!

Your SurajHub development environment is ready to go!

**Start coding:**
```bash
npm run dev
```

**Visit:** http://localhost:5000

**Happy coding!** 🎉

