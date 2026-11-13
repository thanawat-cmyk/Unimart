// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: routes/orders.js
// หน้าที่: เว็บเซอร์วิสดึงประวัติคำสั่งซื้อ (Orders Web Services)
//          รองรับการแสดงผลประวัติการซื้อในหน้าโปรไฟล์ลูกค้า (profile.html) และหลังบ้านแอดมิน
// ==============================================================================

const express = require('express');
const router = express.Router();
const { pool, isDbConnected } = require('../config/db');
let { ordersSeed } = require('../data/seedData');

// ==============================================================================
// 1. GET /api/orders/user/:userId - ดึงประวัติคำสั่งซื้อของลูกค้ารายบุคคล
// ==============================================================================
// Postman Test Sample 1 (ดึงประวัติคำสั่งซื้อของ GundamLover159 ID: 6):
// method: GET
// URL: http://localhost:3000/api/orders/user/6
//
// Postman Test Sample 2 (ดึงประวัติคำสั่งซื้อของ Admin ID: 1):
// method: GET
// URL: http://localhost:3000/api/orders/user/1
// ==============================================================================
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params; // รับรหัสลูกค้าจาก URL

  try {
    if (isDbConnected()) {
      // 1.1 คิวรีรายการคำสั่งซื้อของลูกค้ารายนี้จากตาราง orders
      const [orderRows] = await pool.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
        [userId]
      );

      // 1.2 วนลูปดึงรายการสินค้าในคำสั่งซื้อ (order_items) พร้อม JOIN ตาราง products เพื่อเอารูปและชื่อสินค้า
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
    } else {
      // โหมด In-Memory สำรอง
      const userOrders = ordersSeed.filter(o => o.user_id === parseInt(userId, 10));
      return res.status(200).json({
        success: true,
        count: userOrders.length,
        data: userOrders
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติคำสั่งซื้อ',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/orders - ดึงคำสั่งซื้อทั้งหมดในระบบ (สำหรับผู้ดูแลระบบ)
// ==============================================================================
// Postman Test Sample 1:
// method: GET
// URL: http://localhost:3000/api/orders
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      // คิวรีคำสั่งซื้อทั้งหมดพร้อม JOIN เอาชื่อลูกค้าและอีเมล
      const [orderRows] = await pool.query(
        `SELECT o.*, u.fullname as customer_name, u.email as customer_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.order_date DESC`
      );
      return res.status(200).json({
        success: true,
        count: orderRows.length,
        data: orderRows
      });
    } else {
      return res.status(200).json({
        success: true,
        count: ordersSeed.length,
        data: ordersSeed
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อทั้งหมด',
      error: error.message
    });
  }
});

module.exports = router;
