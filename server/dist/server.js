"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
// Route imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
// Load env vars
dotenv_1.default.config();
// Connect to database
(0, database_1.default)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Cookie parser
app.use((0, cookie_parser_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// Mount routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
// Error handler middleware (must be last)
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode  ║
    ║  📡 Port: ${PORT}                          ║
    ║  🌍 http://localhost:${PORT}               ║
    ╚════════════════════════════════════════════╝
  `);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`);
    server.close(() => process.exit(1));
});
exports.default = app;
//# sourceMappingURL=server.js.map