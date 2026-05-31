import { Response } from 'express';
import mongoose from 'mongoose';
import { RFQ } from '../models/RFQ';
import { AuthRequest } from '../middleware/auth';

export const getRfqs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, category } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const rfqs = await RFQ.find(query)
      .populate('buyer', 'name companyName')
      .populate('category')
      .populate('bids.supplier', 'name companyName rating reviewCount isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RFQ.countDocuments(query);
    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Total-Pages', Math.ceil(total / limit).toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    res.json(rfqs);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createRfq = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      res.status(403).json({ message: 'Only buyers can submit RFQs' });
      return;
    }

    const { title, description, category, quantity, targetPrice, deliveryLocation, requiredDate } = req.body;

    const rfq = await RFQ.create({
      buyer: req.user.id,
      title,
      description,
      category,
      quantity: Number(quantity),
      targetPrice: Number(targetPrice),
      deliveryLocation,
      requiredDate: new Date(requiredDate),
      status: 'open',
    });

    res.status(201).json(rfq);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const placeBid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Please log in to submit quotes/bids' });
      return;
    }

    const { offeredPrice, message } = req.body;
    const rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      res.status(404).json({ message: 'RFQ not found' });
      return;
    }

    if (rfq.status !== 'open') {
      res.status(400).json({ message: 'RFQ is closed for new bids' });
      return;
    }

    // Check if supplier has already bid
    const existingBidIndex = rfq.bids.findIndex(
      (bid) => bid.supplier.toString() === req.user!.id
    );

    const newBid = {
      supplier: req.user.id,
      offeredPrice: Number(offeredPrice),
      message,
      status: 'pending' as const,
    };

    if (existingBidIndex > -1) {
      // Update existing bid
      rfq.bids[existingBidIndex].offeredPrice = Number(offeredPrice);
      rfq.bids[existingBidIndex].message = message;
      rfq.bids[existingBidIndex].status = 'pending';
    } else {
      // Push new bid
      rfq.bids.push(newBid as any);
    }

    await rfq.save();

    res.json(rfq);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const acceptBid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      res.status(403).json({ message: 'Only the RFQ creator can accept bids' });
      return;
    }

    const { rfqId, bidId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const rfq = await RFQ.findById(rfqId).session(session);

      if (!rfq) {
        res.status(404).json({ message: 'RFQ not found' });
        await session.abortTransaction();
        session.endSession();
        return;
      }

      if (rfq.buyer.toString() !== req.user.id) {
        res.status(403).json({ message: 'Forbidden: You do not own this RFQ' });
        await session.abortTransaction();
        session.endSession();
        return;
      }

      // Update statuses
      let bidFound = false;
      rfq.bids.forEach((bid: any) => {
        if (bid._id.toString() === bidId) {
          bid.status = 'accepted';
          bidFound = true;
        } else {
          bid.status = 'rejected';
        }
      });

      if (!bidFound) {
        res.status(404).json({ message: 'Bid not found' });
        await session.abortTransaction();
        session.endSession();
        return;
      }

      rfq.status = 'closed';
      await rfq.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.json(rfq);
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
