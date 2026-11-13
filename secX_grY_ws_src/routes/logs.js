// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: routes/logs.js
// หน้าที่: เว็บเซอร์วิสตรวจสอบประวัติการเข้าสู่ระบบ (Login Logs Web Services)
//          ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 2 ข้อ 2 (บันทึกการเข้าสู่ระบบ)
// ==============================================================================

const express = require('express');
const router = express.Router();
const { pool, isDbConnected } = require('../config/db');
let { loginLogsSeed } = require('../data/seedData');

// ==============================================================================
// 1. GET /api/logs - ดูประวัติการเข้าสู่ระบบทั้งหมด (Search & View Login Logs)
// ==============================================================================
// Postman Test Sample 1 (ดูประวัติการเข้าสู่ระบบทั้งหมด):
// method: GET
// URL: http://localhost:3000/api/logs
//
// Postman Test Sample 2 (กรองดูเฉพาะการล็อกอินที่สำเร็จ status=Success):
// method: GET
// URL: http://localhost:3000/api/logs?status=Success
// ==============================================================================
router.get('/', async (req, res) => {
  // รับค่าตัวกรองสถานะ (status) หรือชื่อผู้ใช้ (username) จาก Query Parameter
  const { status, username } = req.query;

  try {
    if (isDbConnected()) {
      let sql = 'SELECT * FROM login_logs WHERE 1=1';
      const params = [];

      // กรองตามผลลัพธ์ (Success หรือ Failed)
      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }
      // ค้นหาตามชื่อผู้ใช้ที่พยายามล็อกอิน
      if (username) {
        sql += ' AND username_attempt LIKE ?';
        params.push(`%${username}%`);
      }

      // เรียงลำดับจากเวลาล่าสุดไปเก่าสุด จำกัดสูงสุด 100 รายการ
      sql += ' ORDER BY login_time DESC LIMIT 100';
      const [rows] = await pool.query(sql, params);
      return res.status(200).json({
        success: true,
        count: rows.length,
        data: rows
      });
    } else {
      let results = [...loginLogsSeed];
      if (status) {
        results = results.filter(l => l.status.toLowerCase() === status.toLowerCase());
      }
      if (username) {
        results = results.filter(l => l.username_attempt.toLowerCase().includes(username.toLowerCase()));
      }
      return res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการเข้าสู่ระบบ',
      error: error.message
    });
  }
});

module.exports = router;
