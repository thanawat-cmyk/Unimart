// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: routes/orders.js
// Description: Orders Web Services with MySQL
// ==============================================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==============================================================================
// 1. GET /api/orders/user/:userId - ดึงประวัติคำสั่งซื้อของลูกค้ารายบุคคล
// ==============================================================================
// Postman Test Sample:
// GET http://localhost:3000/api/orders/user/6
// ==============================================================================
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [orderRows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
      [userId]
    );

    for (const order of orderRows) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name as product_name, p.image_url as product_image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    return res.status(200).json({
      success: true,
      count: orderRows.length,
      data: orderRows
    });
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติคำสั่งซื้อ',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/orders - ดึงรายการคำสั่งซื้อทั้งหมด (สำหรับแอดมิน)
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.fullname as customer_name, u.email as customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.order_date DESC`
    );

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงคำสั่งซื้อทั้งหมด',
      error: error.message
    });
  }
});

module.exports = router;
