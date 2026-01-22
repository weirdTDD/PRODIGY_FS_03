"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/logout', authController_1.logout);
router.get('/me', auth_1.protect, authController_1.getMe);
router.put('/updatedetails', auth_1.protect, authController_1.updateDetails);
router.put('/updatepassword', auth_1.protect, authController_1.updatePassword);
router.post('/addresses', auth_1.protect, authController_1.addAddress);
router.put('/addresses/:addressId', auth_1.protect, authController_1.updateAddress);
router.delete('/addresses/:addressId', auth_1.protect, authController_1.deleteAddress);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map