import express from 'express';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { query } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

  // Apply authentication and admin role check to all routes
  router.use(authenticateToken);
  router.use(requireRole(['admin', 'super-admin']));

  // Analytics routes
  router.get('/analytics', (req: AuthRequest, res) => {
    res.json({ message: 'Admin analytics endpoint' });
  });

  router.get('/analytics/revenue-management', (req: AuthRequest, res) => {
    res.json({ message: 'Revenue management endpoint' });
  });

  // Distribution routes
  router.get('/distributions', (req: AuthRequest, res) => {
    res.json({ message: 'Distributions endpoint' });
  });

  router.post('/distributions/process', (req: AuthRequest, res) => {
    res.json({ message: 'Process distributions endpoint' });
  });

  router.get('/distributions/export', (req: AuthRequest, res) => {
    res.json({ message: 'Export distributions endpoint' });
  });

  // Payment Options routes
  router.get('/payment-options', async (req: AuthRequest, res) => {
    try {
      const options = await query('SELECT * FROM payment_options ORDER BY created_at DESC');
      res.json({ paymentOptions: options });
    } catch (error) {
      console.error('Failed to fetch payment options:', error);
      res.status(500).json({ error: 'Failed to fetch payment options' });
    }
  });

  router.post('/payment-options', async (req: AuthRequest, res) => {
    try {
      const { name, type, currency, provider, fee_percentage, is_active, config } = req.body;
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }
      const id = uuidv4();
      await query(
        'INSERT INTO payment_options (id, name, type, currency, provider, fee_percentage, is_active, config) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, type, currency || null, provider || null, fee_percentage || 0, is_active || false, JSON.stringify(config || {})]
      );
      res.status(201).json({ message: 'Payment option created successfully', id });
    } catch (error) {
      console.error('Failed to create payment option:', error);
      res.status(500).json({ error: 'Failed to create payment option' });
    }
  });

  router.put('/payment-options/:id', async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { name, type, currency, provider, fee_percentage, is_active, config } = req.body;
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }
      await query(
        'UPDATE payment_options SET name = ?, type = ?, currency = ?, provider = ?, fee_percentage = ?, is_active = ?, config = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, type, currency || null, provider || null, fee_percentage || 0, is_active || false, JSON.stringify(config || {}), id]
      );
      const updated = await query('SELECT * FROM payment_options WHERE id = ?', [id]);
      if (updated.length === 0) {
        return res.status(404).json({ error: 'Payment option not found' });
      }
      res.json({ message: 'Payment option updated successfully', option: updated[0] });
    } catch (error) {
      console.error('Failed to update payment option:', error);
      res.status(500).json({ error: 'Failed to update payment option' });
    }
  });

  router.delete('/payment-options/:id', async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM payment_options WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment option not found' });
      }
      res.json({ message: 'Payment option deleted successfully' });
    } catch (error) {
      console.error('Failed to delete payment option:', error);
      res.status(500).json({ error: 'Failed to delete payment option' });
    }
  });

export default router;