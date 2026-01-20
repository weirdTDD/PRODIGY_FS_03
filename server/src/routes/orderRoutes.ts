import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  createPaymentIntent,
  updateOrderToPaid,
  getOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder).get(authorize('admin'), getOrders);

router.get('/myorders', getMyOrders);

router.get('/:id', getOrderById);
router.post('/:id/payment-intent', createPaymentIntent);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
