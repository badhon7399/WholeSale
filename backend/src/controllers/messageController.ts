import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { User } from '../models/User';

// Send a Message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { receiverId, messageText } = req.body;

    if (!receiverId || !messageText || messageText.trim() === '') {
      res.status(400).json({ message: 'Receiver and message text are required' });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ message: 'Receiver not found' });
      return;
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message: messageText,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name companyName')
      .populate('receiver', 'name companyName');

    res.status(201).json(populatedMessage);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Get List of Conversations (Chats list)
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const currentUserId = req.user.id;

    // Aggregate to get unique users who exchanged messages with current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name companyName email')
      .populate('receiver', 'name companyName email');

    const conversationsMap = new Map<string, any>();

    for (const msg of messages) {
      const otherUser = msg.sender._id.toString() === currentUserId ? msg.receiver : msg.sender;
      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        // Count unread messages received by current user from this sender
        const unreadCount = await Message.countDocuments({
          sender: otherUserId,
          receiver: currentUserId,
          read: false,
        });

        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount,
        });
      }
    }

    res.json(Array.from(conversationsMap.values()));
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get conversations', error: error.message });
  }
};

// Get Conversation History with a User
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const currentUserId = req.user.id;
    const { otherUserId } = req.params;

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 50));
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    };

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name companyName')
      .populate('receiver', 'name companyName');

    const total = await Message.countDocuments(query);
    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Total-Pages', Math.ceil(total / limit).toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    // Send in chronological order
    res.json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load messages', error: error.message });
  }
};

// Mark conversation messages as Read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const currentUserId = req.user.id;
    const { senderId } = req.body;

    if (!senderId) {
      res.status(400).json({ message: 'Sender ID is required' });
      return;
    }

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark messages as read', error: error.message });
  }
};
