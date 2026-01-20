# Thrift Market Accra - E-commerce Platform

A full-stack e-commerce platform for a local thrift market in Accra, Ghana, specializing in men's clothing. Built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse and search through curated men's thrift clothing
- **Advanced Filtering**: Filter by category, size, condition, price range
- **Product Details**: Detailed product information including measurements, condition, and reviews
- **Shopping Cart**: Add items to cart, update quantities, and manage orders
- **User Authentication**: Secure JWT-based authentication
- **User Profile**: Manage personal information, addresses, and order history
- **Order Management**: Track orders from placement to delivery
- **Payment Integration**: Stripe integration for secure payments
- **Reviews & Ratings**: Leave reviews and rate products

### Admin Features
- **Product Management**: Create, update, and delete products
- **Order Management**: View and update order status
- **Inventory Tracking**: Real-time stock management
- **Category Management**: Organize products by categories

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **TypeScript** - Type safety
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
thrift-market-accra/
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── client/                # Frontend application
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── store/         # Zustand stores
    │   ├── types/         # TypeScript types
    │   ├── utils/         # Utility functions
    │   ├── App.tsx        # Main app component
    │   └── main.tsx       # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thrift-market-accra
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   **Server** (`server/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/thrift-market-accra
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

   **Client** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the development servers**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - API Health: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+233XXXXXXXXX"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=shirts&sort=price-asc
```

Query Parameters:
- `page` - Page number
- `limit` - Items per page
- `category` - Filter by category ID
- `condition` - Filter by condition (excellent, good, fair)
- `size` - Filter by size
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search term
- `sort` - Sort order (newest, price-asc, price-desc, rating, popular)

#### Get Single Product
```http
GET /api/products/:id
```

#### Get Product by Slug
```http
GET /api/products/slug/:slug
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Vintage Denim Jacket",
  "description": "Classic vintage denim jacket in excellent condition",
  "price": 150,
  "category": "jacket_category_id",
  "images": ["url1", "url2"],
  "stock": 1,
  "condition": "excellent",
  "size": "L",
  "brand": "Levi's"
}
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1,
  "size": "L",
  "color": "Blue"
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove from Cart
```http
DELETE /api/cart/items/:itemId
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [...],
  "shippingAddress": {...},
  "paymentMethod": "stripe",
  "itemsPrice": 150,
  "shippingPrice": 10,
  "taxPrice": 0,
  "totalPrice": 160
}
```

#### Get My Orders
```http
GET /api/orders/myorders
Authorization: Bearer <token>
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

## 🗄️ Database Models

### User Model
- username, email, password (hashed)
- role (customer, admin)
- avatar, phone
- addresses (array of shipping addresses)
- timestamps

### Product Model
- name, slug, description
- price, category
- images (array)
- stock, condition (excellent, good, fair)
- brand, size, color, material
- measurements (chest, waist, length, sleeves)
- isFeatured, isAvailable
- ratings, numReviews, views, sold
- timestamps

### Cart Model
- user reference
- items (array of cart items with product, quantity, price, size, color)
- totalPrice
- timestamps

### Order Model
- user reference
- items (snapshot of cart items)
- shippingAddress
- paymentMethod, paymentResult
- itemsPrice, shippingPrice, taxPrice, totalPrice
- isPaid, paidAt
- isDelivered, deliveredAt
- status (pending, processing, shipped, delivered, cancelled)
- trackingNumber
- timestamps

### Review Model
- user reference, product reference
- rating (1-5), comment
- images (optional)
- isVerifiedPurchase
- helpfulCount
- timestamps

### Category Model
- name, slug, description
- image
- isActive
- timestamps

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- Error handling middleware
- Protected routes
- Role-based access control

## 💳 Payment Integration

The platform uses Stripe for payment processing:

1. Customer adds items to cart
2. Proceeds to checkout
3. Stripe Payment Intent is created
4. Customer enters payment details
5. Payment is processed securely
6. Order is confirmed and stock is updated

## 🚢 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables
2. Build TypeScript:
   ```bash
   npm run build
   ```
3. Start production server:
   ```bash
   npm start
   ```

### Frontend Deployment (e.g., Vercel, Netlify)

1. Set environment variables
2. Build production bundle:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder

## 📝 Development Workflow

1. Create feature branch from `main`
2. Make changes and test locally
3. Commit with descriptive messages
4. Push to remote repository
5. Create pull request
6. After review, merge to `main`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact: info@thriftmarketaccra.com

## 🙏 Acknowledgments

- Built for the local thrift market community in Accra, Ghana
- Promoting sustainable fashion and affordable style

---

**Happy Coding! 🚀**
