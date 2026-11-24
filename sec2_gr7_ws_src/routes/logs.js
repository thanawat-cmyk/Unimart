// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: routes/logs.js
// Description: Login Logs Web Services with MySQL
// ==============================================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==============================================================================
// 1. GET /api/logs - ดูประวัติการเข้าสู่ระบบทั้งหมด (Search & View Login Logs)
// ==============================================================================
// Postman Test Sample 1 (ดูประวัติทั้งหมด):
// GET http://localhost:3000/api/logs
//
// Postman Test Sample 2 (กรองดูเฉพาะการล็อกอินที่สำเร็จ):
// GET http://localhost:3000/api/logs?status=Success
// ==============================================================================
router.get('/', async (req, res) => {
  const { status, username } = req.query;

  try {
    let sql = 'SELECT * FROM login_logs WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (username) {
      sql += ' AND username_attempt LIKE ?';
      params.push(`%${username}%`);
    }

    sql += ' ORDER BY login_time DESC LIMIT 100';

    const [rows] = await pool.query(sql, params);
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching login logs:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติการเข้าสู่ระบบ',
      error: error.message
    });
  }
});

module.exports = router;
