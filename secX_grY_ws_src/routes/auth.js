// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: routes/auth.js
// Description: Authentication Web Services with MySQL (Login & Session)
// ==============================================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==============================================================================
// 1. POST /api/auth/login - การตรวจสอบการเข้าสู่ระบบ (Authentication Login)
// ==============================================================================
// Postman Test Sample 1 (Login สำเร็จด้วย Admin):
// POST http://localhost:3000/api/auth/login
// Headers: Content-Type: application/json
// Body (raw JSON): { "username": "admin", "password": "admin123" }
//
// Postman Test Sample 2 (Login ไม่สำเร็จ รหัสผ่านผิด 401):
// POST http://localhost:3000/api/auth/login
// Headers: Content-Type: application/json
// Body (raw JSON): { "username": "admin", "password": "wrongpassword" }
// ==============================================================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Client';

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อผู้เข้าใช้/อีเมล (username) และรหัสผ่าน (password)'
    });
  }

  try {
    const loginIdentifier = String(username).trim();
    // ค้นหาข้อมูลผู้ใช้จากฐานข้อมูล MySQL (รองรับทั้งการล็อกอินด้วย username และ email)
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [loginIdentifier, loginIdentifier]
    );
    const user = rows.length > 0 ? rows[0] : null;

    const isMatch = user && String(user.password).trim() === String(password).trim();
    const logStatus = isMatch ? 'Success' : 'Failed';
    const userId = isMatch && user ? user.id : null;

    // บันทึกลงตาราง login_logs ตามเกณฑ์งานที่ 2 & 3
    try {
      await pool.query(
        'INSERT INTO login_logs (user_id, username_attempt, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)',
        [userId, loginIdentifier, ipAddress, userAgent, logStatus]
      );
    } catch (logErr) {
      console.warn('Logging error (optional):', logErr.message);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `ไม่พบบัญชีผู้ใช้ "${loginIdentifier}" ในระบบ กรุณาตรวจสอบชื่อผู้ใช้หรืออีเมลอีกครั้ง`
      });
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
      });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: `บัญชีของคุณอยู่ในสถานะ "${user.status}" กรุณาติดต่อผู้ดูแลระบบ`
      });
    }

    // ตัด password ออกก่อนส่งกลับ Client (แสดงเฉพาะ 6 ฟิลด์หลักที่กรอกจริง)
    const safeUser = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      status: user.status
    };

    return res.status(200).json({
      success: true,
      message: `ยินดีต้อนรับคุณ ${safeUser.fullname} เข้าสู่ระบบ Unimart`,
      user: safeUser,
      token: `mock_jwt_token_${user.id}_${Date.now()}`
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลเข้าสู่ระบบ',
      error: error.message
    });
  }
});

// แจ้งเตือนหากผู้ใช้หรืออาจารย์ส่งคำขอแบบ GET ไปยัง /api/auth/login
router.get('/login', (req, res) => {
  return res.status(405).json({
    success: false,
    message: 'การเข้าสู่ระบบต้องใช้ HTTP Method "POST" เท่านั้น พร้อมระบุ Content-Type: application/json ใน Body: { "username": "...", "password": "..." }'
  });
});

// ==============================================================================
// 2. GET /api/auth/me - ตรวจสอบข้อมูลบัญชีผู้ใช้ปัจจุบัน (Current Session)
// ==============================================================================
// Postman Test Sample:
// GET http://localhost:3000/api/auth/me?username=admin
// ==============================================================================
router.get('/me', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุ username ใน query parameter (?username=...)'
    });
  }

  try {
    const loginIdentifier = username.trim();
    const [rows] = await pool.query(
      'SELECT id, username, fullname, email, role, status FROM users WHERE username = ? OR email = ? LIMIT 1',
      [loginIdentifier, loginIdentifier]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบบัญชีผู้ใช้ "${username}" ในระบบ`
      });
    }

    return res.status(200).json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบัญชีผู้ใช้',
      error: error.message
    });
  }
});

module.exports = router;
