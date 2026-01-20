# Development Setup Guide

## Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB installed/configured
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Stripe account created

## Step-by-Step Setup

### 1. Install Node.js

Download and install from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install MongoDB

**Option A: Local Installation**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Use it in your `.env` file

### 3. Clone and Setup Project

```bash
# Clone repository
git clone <repository-url>
cd thrift-market-accra

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Configure Environment Variables

**Server `.env` file** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/thrift-market-accra
JWT_SECRET=your-long-random-secret-key-at-least-32-characters
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_key_here
```

**Client `.env` file** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 5. Setup Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Copy test keys to environment files
4. Enable test mode

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 7. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- REST Client

### Useful Commands

**Server:**
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

**Client:**
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman or Insomnia

1. Import the API endpoints
2. Create environment variables
3. Test all routes systematically

## Database Seeding (Optional)

Create a seed script to populate initial data:

```bash
npm run seed
```

This will create:
- Admin user
- Sample categories
- Sample products
- Test reviews

## Common Issues & Solutions

### MongoDB Connection Error
**Issue:** `MongooseServerSelectionError`

**Solution:**
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check firewall settings

### Port Already in Use
**Issue:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000
# Kill the process
kill -9 <PID>
```

### CORS Errors
**Issue:** `Access to fetch at ... has been blocked by CORS policy`

**Solution:**
- Verify `CLIENT_URL` in server `.env`
- Check CORS configuration in `server.ts`

### Stripe Webhook Errors
**Issue:** Webhook signature verification failed

**Solution:**
- Use Stripe CLI for local testing
- Verify webhook secret in `.env`

## Git Workflow

### Initial Setup
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, then:
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
```

## Code Quality

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type

### Code Style
- Use ESLint and Prettier
- Follow Airbnb style guide
- Write descriptive variable names

### Best Practices
- Write modular, reusable code
- Add comments for complex logic
- Handle errors appropriately
- Validate user input
- Use environment variables for secrets

## Resources

- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Next Steps

After setup:
1. Create an admin user
2. Add some categories
3. Create sample products
4. Test the shopping flow
5. Customize the styling
6. Add more features!

---

Need help? Create an issue in the repository or contact the development team.
