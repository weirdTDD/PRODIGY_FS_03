# Thrift Market Accra - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite + TypeScript + Tailwind)           │  │
│  │  - Pages (Home, Products, Cart, Checkout, etc.)     │  │
│  │  - Components (Navbar, Footer, ProductCard, etc.)   │  │
│  │  - State Management (Zustand)                        │  │
│  │  - HTTP Client (Axios)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js API (Node.js + TypeScript)              │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Routes → Controllers → Services → Models      │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  - Authentication Middleware (JWT)                  │  │
│  │  - Error Handling Middleware                        │  │
│  │  - CORS Configuration                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB                                             │  │
│  │  - Users Collection                                  │  │
│  │  - Products Collection                               │  │
│  │  - Orders Collection                                 │  │
│  │  - Carts Collection                                  │  │
│  │  - Reviews Collection                                │  │
│  │  - Categories Collection                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Frontend Stack
```
React 18.2.0
├── TypeScript (Type safety)
├── Vite (Build tool & dev server)
├── React Router v6 (Client-side routing)
├── Zustand (State management)
├── Axios (HTTP client)
├── Tailwind CSS (Styling)
└── Stripe React (Payment UI)
```

### Backend Stack
```
Node.js + Express
├── TypeScript (Type safety)
├── Mongoose (MongoDB ODM)
├── JWT (Authentication)
├── bcryptjs (Password hashing)
├── Stripe (Payment processing)
├── Morgan (HTTP logging)
└── Cookie Parser (Cookie handling)
```

## Request Flow

### User Registration/Login
```
1. User submits credentials → Frontend (LoginPage/RegisterPage)
2. Axios POST request → Server (/api/auth/login or /api/auth/register)
3. Controller validates input
4. Service checks database (User model)
5. Password hashed/verified (bcryptjs)
6. JWT token generated
7. Token sent in response + HTTP-only cookie
8. Frontend stores token in Zustand store
9. User redirected to home page
```

### Product Browsing
```
1. User visits products page → Frontend (ProductsPage)
2. Axios GET request with filters → Server (/api/products)
3. Controller parses query parameters
4. Service builds MongoDB query
5. Database returns filtered products
6. Products sent to frontend
7. Products rendered in grid layout
```

### Add to Cart
```
1. User clicks "Add to Cart" → Frontend (ProductDetailPage)
2. Axios POST request → Server (/api/cart/items)
3. Middleware verifies JWT token
4. Controller validates product and quantity
5. Service checks product availability
6. Cart updated in database
7. Updated cart returned to frontend
8. Zustand store updated
9. Cart icon badge updated
```

### Checkout & Payment
```
1. User proceeds to checkout → Frontend (CheckoutPage)
2. Shipping address collected
3. Stripe Payment Intent created → Server (/api/orders/:id/payment-intent)
4. Stripe Elements UI rendered
5. User enters payment details
6. Payment processed by Stripe
7. Payment confirmation → Server (/api/orders/:id/pay)
8. Order status updated to "paid"
9. Stock updated
10. Order confirmation shown to user
```

## Data Models Relationships

```
User (1) ←────→ (N) Orders
User (1) ←────→ (1) Cart
User (1) ←────→ (N) Reviews

Product (1) ←──→ (N) Cart Items
Product (1) ←──→ (N) Order Items
Product (1) ←──→ (N) Reviews
Product (N) ←──→ (1) Category

Cart (1) ───────→ (N) Cart Items
Order (1) ───────→ (N) Order Items
```

## Security Architecture

### Authentication Flow
```
1. User credentials → Server
2. Password hashed with bcryptjs (10 salt rounds)
3. JWT signed with secret key
4. Token stored in:
   - HTTP-only cookie (secure in production)
   - Frontend Zustand store (for state management)
5. Every protected request includes token in Authorization header
6. Server middleware verifies token
7. User object attached to request
8. Route handler processes request
```

### Authorization Levels
- **Public**: Anyone can access (products, homepage)
- **Authenticated**: Logged-in users (cart, orders, profile)
- **Admin**: Admin users only (product management, order management)

## State Management

### Client State (Zustand)
```javascript
AuthStore
├── user (User object)
├── token (JWT string)
├── isAuthenticated (boolean)
└── actions (setAuth, logout, updateUser)

CartStore
├── cart (Cart object)
├── setCart (function)
├── clearCart (function)
└── itemCount (computed property)
```

### Server State
- No persistent state on server
- Stateless RESTful API
- All state stored in MongoDB
- Session managed via JWT

## API Structure

### RESTful Endpoints

**Authentication**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/updatedetails` - Update user details
- PUT `/api/auth/updatepassword` - Update password
- POST `/api/auth/addresses` - Add address
- PUT `/api/auth/addresses/:id` - Update address
- DELETE `/api/auth/addresses/:id` - Delete address

**Products**
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:id` - Get single product
- GET `/api/products/slug/:slug` - Get product by slug
- GET `/api/products/featured` - Get featured products
- GET `/api/products/:id/related` - Get related products
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

**Cart**
- GET `/api/cart` - Get user cart
- POST `/api/cart/items` - Add item to cart
- PUT `/api/cart/items/:itemId` - Update cart item
- DELETE `/api/cart/items/:itemId` - Remove from cart
- DELETE `/api/cart` - Clear cart

**Orders**
- POST `/api/orders` - Create order
- GET `/api/orders/myorders` - Get user orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders/:id/payment-intent` - Create payment intent
- PUT `/api/orders/:id/pay` - Update order to paid
- PUT `/api/orders/:id/cancel` - Cancel order
- GET `/api/orders` - Get all orders (Admin)
- PUT `/api/orders/:id/status` - Update order status (Admin)

## Database Indexes

### Performance Optimization
```javascript
// Products
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Reviews
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Orders
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
```

## Error Handling

### Frontend
```javascript
try {
  const response = await api.get('/products');
  setProducts(response.data.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else {
    // Show error toast/message
  }
}
```

### Backend
```javascript
// Custom error classes
- ErrorResponse (base class)
- ValidationError (400)
- UnauthorizedError (401)
- ForbiddenError (403)
- NotFoundError (404)
- ConflictError (409)

// Global error handler middleware
- Catches all errors
- Formats error response
- Logs errors in development
```

## Deployment Architecture

### Production Environment
```
┌──────────────────┐
│   Vercel/Netlify │ ← Frontend (React SPA)
└──────────────────┘
         ↓
┌──────────────────┐
│ Railway/Render   │ ← Backend (Express API)
└──────────────────┘
         ↓
┌──────────────────┐
│  MongoDB Atlas   │ ← Database (Cloud)
└──────────────────┘
```

## Future Enhancements

### Planned Features
1. **Admin Dashboard**: Complete admin panel for management
2. **Image Upload**: Direct image upload to cloud storage (Cloudinary)
3. **Email Notifications**: Order confirmations, shipping updates
4. **Advanced Search**: Elasticsearch integration
5. **Wishlist**: Save products for later
6. **Social Login**: Google, Facebook authentication
7. **Mobile App**: React Native version
8. **Analytics**: User behavior tracking
9. **Recommendations**: AI-powered product suggestions
10. **Multi-vendor**: Support multiple sellers

### Performance Optimizations
- Image lazy loading
- Code splitting
- CDN integration
- Redis caching
- Database query optimization
- GraphQL alternative

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clean separation of concerns
- **Secure**: Industry-standard security practices
- **Performant**: Optimized for speed
- **Developer-friendly**: Clear structure and documentation
