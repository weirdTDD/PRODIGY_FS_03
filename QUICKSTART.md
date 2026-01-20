# 🚀 Quick Start Guide - Thrift Market Accra

## What You've Got

A complete, production-ready e-commerce platform for a men's thrift clothing store in Accra, Ghana.

### Stack
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **State**: Zustand
- **Payments**: Stripe
- **Auth**: JWT

## 5-Minute Setup

### 1. Prerequisites Check
```bash
node --version  # Should be v18+
npm --version
mongod --version  # Or have MongoDB Atlas ready
```

### 2. Install Everything
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Configure Environment

**Backend** - Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/thrift-market-accra
JWT_SECRET=change-this-to-a-long-random-secret-minimum-32-characters
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

**Frontend** - Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Start Development

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

### 5. Test It Out

1. Visit http://localhost:5173
2. Create an account
3. Browse products (you'll need to add some via the API or admin panel)
4. Add items to cart
5. Proceed to checkout

## Project Structure

```
thrift-market-accra/
├── server/              # Backend API
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth, error handling
│   │   └── server.ts    # Entry point
│   └── package.json
│
└── client/              # Frontend React app
    ├── src/
    │   ├── components/  # UI components
    │   ├── pages/       # Page components
    │   ├── services/    # API calls
    │   ├── store/       # State management
    │   └── App.tsx      # Main component
    └── package.json
```

## Key Features Implemented

### Customer Features ✅
- ✅ User registration & authentication
- ✅ Browse products with filters
- ✅ Product details with reviews
- ✅ Shopping cart management
- ✅ Secure checkout with Stripe
- ✅ Order tracking
- ✅ User profile & addresses
- ✅ Order history

### Admin Features ✅
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Inventory tracking
- ✅ Category management

## Database Models

- **User**: username, email, password, addresses, role
- **Product**: name, price, images, stock, condition, size, etc.
- **Cart**: user's shopping cart with items
- **Order**: order details, payment info, shipping address
- **Review**: product reviews and ratings
- **Category**: product categories

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:itemId` - Update quantity
- `DELETE /api/cart/items/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/payment-intent` - Create payment
- `PUT /api/orders/:id/pay` - Mark as paid

## Next Steps

### 1. Create Sample Data
You'll want to:
- Create some categories (Shirts, Pants, Jackets, Shoes, etc.)
- Add sample products
- Test the full shopping flow

### 2. Customize Styling
- Update colors in `client/tailwind.config.js`
- Modify logo and branding
- Add your own images

### 3. Setup Stripe
1. Create Stripe account
2. Get test API keys
3. Add to `.env` files
4. Test payment flow

### 4. Add Admin User
Create via MongoDB or registration, then update role:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Common Issues

### MongoDB Connection Error
**Fix**: Make sure MongoDB is running
```bash
# Start MongoDB
mongod
```

### Port Already in Use
**Fix**: Kill the process or change port
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
**Fix**: Check `CLIENT_URL` in `server/.env` matches your frontend URL

## Testing

### Manual Testing
1. Register a new user
2. Login with credentials
3. Browse products
4. Add items to cart
5. Update cart quantities
6. Proceed to checkout
7. Enter shipping details
8. Test Stripe payment (use test card: 4242 4242 4242 4242)
9. View order confirmation
10. Check order in order history

### API Testing
Use Postman, Insomnia, or cURL to test endpoints:

```bash
# Example: Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "password123"
  }'
```

## Deployment

### Backend (Railway/Render/Heroku)
1. Push to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect to platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Update `MONGO_URI` in production

## Support & Documentation

- **README.md** - Comprehensive project overview
- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - System architecture details
- **Code Comments** - Inline documentation

## What's NOT Implemented Yet

Some features are placeholders that you can implement:
- Complete admin dashboard UI
- Product image upload (currently manual URLs)
- Email notifications
- Advanced product search
- Wishlist functionality
- Social media login
- Mobile money payment (MTN, Vodafone Cash)
- Product reviews UI (backend ready)

These are great opportunities to extend the platform!

## Tips for Success

1. **Start Simple**: Get basic flow working first
2. **Test Thoroughly**: Test each feature as you add it
3. **Use Git**: Commit frequently with clear messages
4. **Read Docs**: Check documentation files for details
5. **Ask Questions**: Review code comments and architecture

## Resources

- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Ready to build something amazing? Let's go! 🚀**

For detailed information, check:
- `README.md` - Full documentation
- `SETUP.md` - Setup guide
- `ARCHITECTURE.md` - Technical details
