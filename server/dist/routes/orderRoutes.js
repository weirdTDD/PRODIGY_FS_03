"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/').post(orderController_1.createOrder).get((0, auth_1.authorize)('admin'), orderController_1.getOrders);
router.get('/myorders', orderController_1.getMyOrders);
router.get('/:id', orderController_1.getOrderById);
router.post('/:id/payment-intent', orderController_1.createPaymentIntent);
router.put('/:id/pay', orderController_1.updateOrderToPaid);
router.put('/:id/cancel', orderController_1.cancelOrder);
router.put('/:id/status', (0, auth_1.authorize)('admin'), orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map