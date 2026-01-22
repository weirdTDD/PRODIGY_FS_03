"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/').get(cartController_1.getCart).delete(cartController_1.clearCart);
router.post('/items', cartController_1.addToCart);
router.put('/items/:itemId', cartController_1.updateCartItem);
router.delete('/items/:itemId', cartController_1.removeFromCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map