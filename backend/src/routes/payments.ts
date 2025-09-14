import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Payment routes
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { page = '1', limit = '20', status } = req.query;
    const pageNum = Number.parseInt(page as string);
    const limitNum = Number.parseInt(limit as string);

    let sqlQuery = `
      SELECT p.*, l.title as listing_title, u.username as user_username,
             u.wallet_address as user_address
      FROM payments p
      LEFT JOIN listings l ON p.listing_id = l.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `;
    const params: any[] = [req.user.id];

    if (status) {
      sqlQuery += " AND p.status = ?";
      params.push(status);
    }

    sqlQuery += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(limitNum, (pageNum - 1) * limitNum);

    const payments = await query(sqlQuery, params);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM payments WHERE user_id = ?";
    const countParams: any[] = [req.user.id];

    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
    }

    const countResult = await query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      payments: payments.map((p: any) => ({
        ...p,
        escrow_data: p.escrow_id ? { id: p.escrow_id } : null,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { listingId, amount, currency = 'ETH', paymentMethod = 'crypto' } = req.body;

    // Validate required fields
    if (!listingId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if listing exists
    const listingResult = await query("SELECT * FROM listings WHERE id = ?", [listingId]);

    if (listingResult.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = listingResult[0];

    const paymentId = uuidv4();

    const sqlQuery = `
      INSERT INTO payments (
        id, user_id, listing_id, payment_type, payment_method,
        amount, currency, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    await query(sqlQuery, [
      paymentId,
      req.user.id,
      listingId,
      paymentMethod === 'crypto' ? 'crypto' : 'fiat',
      paymentMethod,
      amount,
      currency,
    ]);

    // Fetch the created payment
    const paymentResult = await query(`
      SELECT p.*, l.title as listing_title, u.username as user_username,
             u.wallet_address as user_address
      FROM payments p
      LEFT JOIN listings l ON p.listing_id = l.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [paymentId]);

    const payment = paymentResult[0];

    res.status(201).json({
      payment: {
        ...payment,
        escrow_data: payment.escrow_id ? { id: payment.escrow_id } : null,
      },
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const paymentResult = await query(`
      SELECT p.*, l.title as listing_title, u.username as user_username,
             u.wallet_address as user_address
      FROM payments p
      LEFT JOIN listings l ON p.listing_id = l.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND p.user_id = ?
    `, [id, req.user.id]);

    if (paymentResult.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentResult[0];

    res.json({
      payment: {
        ...payment,
        escrow_data: payment.escrow_id ? { id: payment.escrow_id } : null,
      },
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Payment processing routes
router.post('/process', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { paymentId, transactionHash } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    // Check if payment exists and belongs to user
    const paymentResult = await query("SELECT * FROM payments WHERE id = ? AND user_id = ?", [paymentId, req.user.id]);

    if (paymentResult.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentResult[0];

    // Update payment status
    await query(
      "UPDATE payments SET status = 'processing', transaction_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [transactionHash, paymentId]
    );

    // Create escrow if payment is for a listing
    if (payment.listing_id) {
      const escrowId = uuidv4();

      await query(`
        INSERT INTO escrows (
          id, payment_id, buyer_id, seller_id, amount, currency, status
        ) VALUES (?, ?, ?, ?, ?, ?, 'active')
      `, [
        escrowId,
        paymentId,
        req.user.id,
        payment.listing_id, // This should be seller_id from listing
        payment.amount,
        payment.currency,
      ]);

      // Update payment with escrow ID
      await query("UPDATE payments SET escrow_id = ? WHERE id = ?", [escrowId, paymentId]);
    }

    // Fetch updated payment
    const updatedResult = await query(`
      SELECT p.*, l.title as listing_title, u.username as user_username,
             u.wallet_address as user_address
      FROM payments p
      LEFT JOIN listings l ON p.listing_id = l.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [paymentId]);

    const updatedPayment = updatedResult[0];

    res.json({
      payment: {
        ...updatedPayment,
        escrow_data: updatedPayment.escrow_id ? { id: updatedPayment.escrow_id } : null,
      },
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router;