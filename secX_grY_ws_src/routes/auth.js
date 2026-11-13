// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: routes/auth.js
// หน้าที่: จัดการระบบพิสูจน์ตัวตน (Authentication Web Services)
//          รองรับการล็อกอิน บันทึกประวัติการเข้าสู่ระบบลง login_logs และดึงโปรไฟล์ผู้ใช้
// ==============================================================================

const express = require('express');
const router = express.Router();
const { pool, isDbConnected } = require('../config/db');
let { usersSeed, loginLogsSeed } = require('../data/seedData');

// ==============================================================================
// 1. POST /api/auth/login - เว็บเซอร์วิสสำหรับการพิสูจน์ตัวตน (Authentication)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 1
// ==============================================================================
// Postman Test Sample 1 (เข้าสู่ระบบด้วยบัญชีแอดมิน - Super Admin):
// method: POST
// URL: http://localhost:3000/api/auth/login
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "username": "admin",
//   "password": "admin123"
// }
//
// Postman Test Sample 2 (เข้าสู่ระบบด้วยบัญชีลูกค้า VIP - Customer):
// method: POST
// URL: http://localhost:3000/api/auth/login
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "username": "GundamLover159",
//   "password": "customer123"
// }
//
// Postman Test Sample 3 (ทดสอบกรอกรหัสผ่านผิด - กรณีเกิดข้อผิดพลาด 401 Unauthorized):
// method: POST
// URL: http://localhost:3000/api/auth/login
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "username": "unknown_user",
//   "password": "wrongpassword"
// }
// ==============================================================================
router.post('/login', async (req, res) => {
  // ขั้นตอนที่ 1: ดึงข้อมูล username และ password จาก Request Body ที่ส่งมาจากฟอร์มหรือ Postman
  const { username, password } = req.body;

  // ขั้นตอนที่ 2: ดึงข้อมูล IP Address และ User-Agent ของไคลเอนต์ เพื่อนำไปบันทึกลงตาราง login_logs
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Client';

  // ตรวจสอบความถูกต้องเบื้องต้น (Validation): ต้องกรอกทั้งชื่อผู้ใช้และรหัสผ่าน
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อผู้เข้าใช้ (username) และรหัสผ่าน (password)'
    });
  }

  try {
    let user = null;

    // ขั้นตอนที่ 3: ค้นหาข้อมูลผู้ใช้จากชื่อผู้ใช้ (Username)
    if (isDbConnected()) {
      // ใช้ Parameterized Query (?) เพื่อป้องกันช่องโหว่ SQL Injection
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? LIMIT 1',
        [username]
      );
      if (rows.length > 0) {
        user = rows[0];
      }
    } else {
      // กรณีไม่ได้เปิด MySQL: ค้นหาจาก In-Memory Dataset
      user = usersSeed.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    // ขั้นตอนที่ 4: ตรวจสอบความถูกต้องของรหัสผ่าน
    const isMatch = user && user.password === password;

    // ขั้นตอนที่ 5: บันทึกประวัติการพยายามเข้าสู่ระบบลงในตาราง login_logs (ตามเกณฑ์งานที่ 2 & 3)
    const logStatus = isMatch ? 'Success' : 'Failed';
    const userId = isMatch && user ? user.id : null;

    if (isDbConnected()) {
      await pool.query(
        'INSERT INTO login_logs (user_id, username_attempt, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)',
        [userId, username, ipAddress, userAgent, logStatus]
      );
    } else {
      loginLogsSeed.push({
        log_id: loginLogsSeed.length + 1,
        user_id: userId,
        username_attempt: username,
        login_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        ip_address: ipAddress,
        user_agent: userAgent,
        status: logStatus
      });
    }

    // ถ้ารหัสผ่านไม่ตรง ให้ตอบกลับด้วย HTTP Status 401 Unauthorized
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้เข้าใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
      });
    }

    // ตรวจสอบสถานะบัญชีผู้ใช้: ต้องเป็นสถานะ 'Active' เท่านั้น
    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: `บัญชีของคุณอยู่ในสถานะ "${user.status}" กรุณาติดต่อผู้ดูแลระบบ`
      });
    }

    // ขั้นตอนที่ 6: จัดเตรียมข้อมูลผู้ใช้ที่จะส่งกลับ โดยตัดฟิลด์ password ออกเพื่อความปลอดภัย (Sanitization)
    const safeUser = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      age: user.age,
      address: user.address,
      preferences: user.preferences,
      role: user.role,
      status: user.status
    };

    // ส่งผลลัพธ์การเข้าสู่ระบบสำเร็จ พร้อม Mock Token สำหรับ Client-side Session
    return res.status(200).json({
      success: true,
      message: `ยินดีต้อนรับคุณ ${safeUser.fullname} เข้าสู่ระบบ Unimart`,
      user: safeUser,
      token: `mock-jwt-token-for-${safeUser.username}-${Date.now()}`
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการล็อกอิน:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/auth/me - ตรวจสอบข้อมูลผู้ใช้ปัจจุบัน (Current Session User)
// ==============================================================================
// Postman Test Sample 1 (ดึงข้อมูลโปรไฟล์ของแอดมิน):
// method: GET
// URL: http://localhost:3000/api/auth/me?username=admin
//
// Postman Test Sample 2 (ดึงข้อมูลโปรไฟล์ของลูกค้า):
// method: GET
// URL: http://localhost:3000/api/auth/me?username=GundamLover159
// ==============================================================================
router.get('/me', async (req, res) => {
  // รับค่า query parameter เช่น ?username=admin
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'โปรดระบุ query parameter "username"'
    });
  }

  try {
    let user = null;
    if (isDbConnected()) {
      // คิวรีเฉพาะฟิลด์ข้อมูลทั่วไป ไม่ดึงรหัสผ่าน
      const [rows] = await pool.query(
        'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, created_at FROM users WHERE username = ?',
        [username]
      );
      if (rows.length > 0) user = rows[0];
    } else {
      user = usersSeed.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้นี้ในระบบ'
      });
    }

    // ตัดรหัสผ่านออกก่อนส่งกลับ
    const { password, ...safeUser } = user;
    return res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
      error: error.message
    });
  }
});

module.exports = router;
