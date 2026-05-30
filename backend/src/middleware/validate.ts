import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check express-validator results.
 * Returns 400 with field-level error details if validation fails.
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map((e) => ({
          field: (e as any).path || (e as any).param,
          message: e.msg,
        })),
      },
    });
    return;
  }
  next();
};

// ─── Auth Validation Rules ───────────────────────────────────────────────────

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['buyer', 'supplier']).withMessage('Role must be buyer or supplier'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Company name too long'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+\d\s()-]{7,20}$/).withMessage('Invalid phone format'),
  handleValidationErrors,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ─── Product Validation Rules ────────────────────────────────────────────────

export const createProductValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 300 }).withMessage('Title must be 3-300 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('moq')
    .notEmpty().withMessage('MOQ is required')
    .isInt({ min: 1 }).withMessage('MOQ must be at least 1'),
  body('priceTiers')
    .isArray({ min: 1 }).withMessage('At least one price tier is required'),
  body('priceTiers.*.minQuantity')
    .isInt({ min: 1 }).withMessage('Tier min quantity must be at least 1'),
  body('priceTiers.*.pricePerUnit')
    .isFloat({ min: 0.01 }).withMessage('Tier price must be greater than 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  handleValidationErrors,
];

// ─── Order Validation Rules ──────────────────────────────────────────────────

export const createOrderValidation = [
  body('supplier')
    .notEmpty().withMessage('Supplier is required')
    .isMongoId().withMessage('Invalid supplier ID'),
  body('items')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product')
    .isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['bank', 'mfs', 'cod']).withMessage('Invalid payment method'),
  body('shippingAddress')
    .trim()
    .notEmpty().withMessage('Shipping address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[+\d\s()-]{7,20}$/).withMessage('Invalid phone format'),
  handleValidationErrors,
];

// ─── RFQ Validation Rules ────────────────────────────────────────────────────

export const createRfqValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 300 }).withMessage('Title must be 5-300 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 3000 }).withMessage('Description must be 10-3000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('targetPrice')
    .notEmpty().withMessage('Target price is required')
    .isFloat({ min: 0.01 }).withMessage('Target price must be greater than 0'),
  body('deliveryLocation')
    .trim()
    .notEmpty().withMessage('Delivery location is required'),
  body('requiredDate')
    .notEmpty().withMessage('Required date is required')
    .isISO8601().withMessage('Invalid date format'),
  handleValidationErrors,
];

export const placeBidValidation = [
  body('offeredPrice')
    .notEmpty().withMessage('Offered price is required')
    .isFloat({ min: 0.01 }).withMessage('Offered price must be greater than 0'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 5, max: 1000 }).withMessage('Message must be 5-1000 characters'),
  param('id')
    .isMongoId().withMessage('Invalid RFQ ID'),
  handleValidationErrors,
];

// ─── ID Param Validation ─────────────────────────────────────────────────────

export const mongoIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];
