# 🚀 SurajHub - Local Development on VS Code (Windows/Mac/Linux)

## 📋 EXACT STEP-BY-STEP SETUP

### STEP 1: Install Required Software (5 minutes)

#### 1.1 Install Node.js 18+
- Go to https://nodejs.org/
- Download **LTS version (18.x.x or 20.x.x)**
- Click install and follow prompts
- Verify: Open terminal and run:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 8.x.x or higher
```

#### 1.2 Install Git
- Go to https://git-scm.com/
- Download and install
- Verify: 
```bash
git --version
```

#### 1.3 Install Docker (Optional, but recommended)
- **Windows/Mac**: Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux**: Run:
```bash
sudo apt-get install docker.io docker-compose
```

---

### STEP 2: Clone Project (2 minutes)

```bash
# Open terminal/command prompt and run:
git clone https://github.com/yourusername/surajhub.git
cd surajhub
```

---

### STEP 3: Setup Environment Variables (1 minute)

```bash
# Copy the environment template
cp .env.example .env

# Open .env file and verify it looks like:
# DATABASE_URL=postgresql://surajhub:surajhub_secure_password@postgres:5432/surajhub
# SESSION_SECRET=your_random_session_secret_min_32_chars
# NODE_ENV=development
# (Other variables can be left empty for local dev)
```

---

### STEP 4: Install Dependencies (5 minutes)

```bash
# Install all npm packages
cp .env.example .env

# This will download ~500MB of dependencies
# Wait for it to complete (will show "added XXX packages")
```

---

### STEP 5: Start Local Database (WITH Docker - RECOMMENDED)

#### Option A: Using Docker Compose (EASIEST)

```bash
# Start PostgreSQL + Redis in background
docker-compose up -d

# Wait 30 seconds for containers to start
sleep 30  # On Windows PowerShell, use: Start-Sleep -Seconds 30

# Initialize database schema
npm run db:push

# Verify containers are running:
docker-compose ps

# You should see:
# surajhub-db     postgres:15-alpine    Up (healthy)
# surajhub-redis  redis:7-alpine        Up
```

#### Option B: Without Docker (Manual PostgreSQL)

If you don't have Docker:
1. Install PostgreSQL 15+ locally
2. Create database: `createdb surajhub`
3. Update .env: `DATABASE_URL=postgresql://postgres:password@localhost:5432/surajhub`
4. Run: `npm run db:push`

---

### STEP 6: Start Development Server (1 minute)

```bash
# In the project directory, run:
npm run dev

# Output should show:
# ✓ Ready in 1234 ms
# ✓ Local: http://localhost:5000
# ✓ Press 'q' to quit

# NOTE: Server running on port 5000 and API on port 3000
```

---

### STEP 7: Open Application in Browser (30 seconds)

1. Open browser (Chrome, Firefox, Safari)
2. Visit: **http://localhost:5000**
3. You should see SurajHub homepage with:
   - SurajHub logo (gradient sun icon) ✓
   - Product categories ✓
   - Navigation bar ✓
   - Featured products ✓

---

### STEP 8: Test Features (2 minutes)

#### Test Signup
1. Click "Sign In" button (top right)
2. Click "Create account" link
3. Fill in:
   - Email: `test@example.com`
   - Password: `Test123!`
   - First Name: `Test`
   - Last Name: `User`
4. Click Sign Up
5. Should see welcome message ✓

#### Test Products
1. Click any product category
2. Should see list of products ✓
3. Click product card
4. Should see product details ✓

#### Test Cart
1. Click "Add to Cart" on any product
2. Look at navbar - cart badge should show "1" ✓
3. Click Cart icon
4. Should see item in cart ✓

#### Test Search
1. Click search box
2. Type "phone"
3. Press Enter
4. Should see filtered results ✓

---

## ✅ Verification Checklist

Once you see the app at http://localhost:5000, verify:

- [ ] Homepage loads with SurajHub branding
- [ ] No red error messages
- [ ] Navigation bar is visible
- [ ] Product categories display
- [ ] Cart button shows in navbar
- [ ] Can click on products
- [ ] Search box is functional
- [ ] Sign In button works
- [ ] Database is connected (check `docker-compose ps`)

**If all checkmarks ✓, you're ready to develop!**

---

## 🔧 Common Terminal Commands

### Development
```bash
npm run dev           # Start dev server (press 'q' to stop)
npm run build         # Build for production
npm run db:push       # Sync database schema
npm run db:studio     # Open database GUI (http://localhost:5555)
```

### Docker
```bash
docker-compose up -d          # Start services (background)
docker-compose ps             # See running containers
docker-compose logs app       # View app logs
docker-compose logs -f app    # Follow app logs (live)
docker-compose down           # Stop all services
docker-compose down -v        # Stop and delete data
```

### Database
```bash
# Connect to database
docker-compose exec postgres psql -U surajhub -d surajhub

# List tables
\dt

# Exit
\q
```

---

## 📂 Project Structure

```
surajhub/
├── client/                # React frontend
│   └── src/
│       ├── pages/        # Page components
│       ├── components/   # Reusable components
│       └── main.jsx      # App entry point
│
├── server/               # Express backend
│   ├── app.ts           # Express app
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── index-dev.ts     # Dev server entry
│
├── shared/              # Shared types
│   └── schema.ts        # Database schema
│
├── docker-compose.yml   # Docker services
├── Dockerfile           # Production container
├── package.json         # Dependencies
├── vite.config.ts       # Frontend build config
└── .env                 # Environment variables
```

---

## 🔗 Key URLs (When Running Locally)

| URL | What It Is |
|-----|-----------|
| http://localhost:5000 | Frontend application |
| http://localhost:3000/api/products | API endpoint |
| http://localhost:5555 | Database GUI (after `npm run db:studio`) |
| http://localhost:6379 | Redis cache |

---

## 📝 Important Ports

- **5000**: Frontend (Vite + React)
- **3000**: Backend API (Express)
- **5432**: PostgreSQL Database
- **6379**: Redis Cache
- **5555**: Database Studio (optional)

**If any port is already in use:**
```bash
# Find what's using the port (on Mac/Linux)
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

---

## 🚀 Next Steps After Setup

### Development Workflow
1. Make changes to code
2. Frontend automatically hot-reloads
3. Backend might need manual restart (press Ctrl+C, then `npm run dev`)
4. Test changes in browser

### Create a New Feature
1. Edit files in `client/src/`
2. Changes appear instantly in browser
3. Edit files in `server/` 
4. Restart server to see changes

### Database Changes
1. Edit `shared/schema.ts`
2. Run `npm run db:push`
3. Database is updated

---

## ❓ Troubleshooting

### "npm: command not found"
- Node.js not installed correctly
- Restart terminal/VS Code
- Verify: `node --version`

### "Port 5000 already in use"
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

### "Cannot connect to database"
```bash
# Check Docker containers
docker-compose ps

# Restart database
docker-compose down -v
docker-compose up -d
sleep 30
npm run db:push
```

### "Module not found errors"
```bash
# Reinstall dependencies
rm -rf node_modules
npm ci
npm run build
```

### "Blank page or no styling"
- Hard refresh browser: `Ctrl+F5` (or `Cmd+Shift+R` on Mac)
- Clear browser cache
- Run `npm run build`

---

## 💾 Database GUI (Optional)

View and manage database visually:

```bash
npm run db:studio

# Opens http://localhost:5555 in browser
# Can browse tables, add/edit data, etc.
```

---

## 🛑 Stop Development

### Stop all services:
```bash
# Stop development server
# Press Ctrl+C in terminal

# Stop Docker containers
docker-compose down

# Stop and delete data
docker-compose down -v
```

---

## ✨ You're All Set!

Your SurajHub development environment is ready!

**Next:** Start making changes and see them live in the browser. Happy coding! 🎉

**Questions?** Check the other guides:
- TROUBLESHOOTING.md
- QUICK_START_GUIDE.md
- MASTER_DEPLOYMENT_GUIDE.md

