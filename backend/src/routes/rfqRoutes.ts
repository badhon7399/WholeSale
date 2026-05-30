import { Router } from 'express';
import { getRfqs, createRfq, placeBid, acceptBid } from '../controllers/rfqController';
import { authenticate, authorize } from '../middleware/auth';
import { createRfqValidation, placeBidValidation } from '../middleware/validate';

const router = Router();

router.get('/', getRfqs);
router.post('/', authenticate, authorize(['buyer']), createRfqValidation, createRfq);
router.post('/:id/bid', authenticate, authorize(['supplier']), placeBidValidation, placeBid);
router.patch('/:rfqId/bid/:bidId', authenticate, authorize(['buyer']), acceptBid);

export default router;
