// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: routes/users.js
// Description: User & Admin Management Web Services with MySQL (CRUD)
// ==============================================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==============================================================================
// 1. GET /api/users - การค้นหาและเข้าถึงข้อมูลผู้ใช้ (Search & View Users)
// ==============================================================================
// Postman Test Sample 1 (ดึงรายชื่อผู้ใช้ทั้งหมด):
// GET http://localhost:3000/api/users
//
// Postman Test Sample 2 (ค้นหาผู้ใช้ด้วยคำค้น Keyword):
// GET http://localhost:3000/api/users?q=Gundam
//
// Postman Test Sample 3 (ค้นหาผู้ใช้ตามสิทธิ์ Role และสถานะ Status):
// GET http://localhost:3000/api/users?role=Staff&status=Active
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    const { q, role, status } = req.query;

    let sql = 'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, created_at, updated_at FROM users WHERE 1=1';
    const params = [];

    // เกณฑ์ค้นหาที่ 1: คำค้นหา Keyword (fullname, username, email)
    if (q && q.trim() !== '') {
      sql += ' AND (fullname LIKE ? OR username LIKE ? OR email LIKE ?)';
      const queryTerm = `%${q.trim()}%`;
      params.push(queryTerm, queryTerm, queryTerm);
    }

    // เกณฑ์ค้นหาที่ 2: สิทธิ์การใช้งาน Role
    if (role && role.trim() !== '') {
      sql += ' AND role = ?';
      params.push(role.trim());
    }

    // เกณฑ์ค้นหาที่ 3: สถานะบัญชีผู้ใช้ Status
    if (status && status.trim() !== '') {
      sql += ' AND status = ?';
      params.push(status.trim());
    }

    sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    return res.status(200).json({
      success: true,
      count: rows.length,
      criteria: { q, role, status },
      data: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งานจากฐานข้อมูล',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/users/:id - ดูรายละเอียดผู้ใช้เดี่ยว (View Single User)
// ==============================================================================
// Postman Test Sample:
// GET http://localhost:3000/api/users/1
// ==============================================================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบผู้ใช้งานรหัส ID ${id} ในระบบ`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้รายบุคคล',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. POST /api/users - การเพิ่มผู้ใช้งานหรือแอดมินใหม่ (Insert New User)
// ==============================================================================
// Postman Test Sample:
// POST http://localhost:3000/api/users
// Headers: Content-Type: application/json
// Body (raw JSON):
// {
//   "username": "somchai_staff",
//   "password": "password123",
//   "fullname": "สมชาย รักการต่อกันดั้ม",
//   "email": "somchai.gunpla@example.com",
//   "phone": "089-999-8888",
//   "age": 25,
//   "address": "45/2 ถ.พหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400",
//   "preferences": "ชอบโมเดลเกรด PG และอุปกรณ์ทำสี",
//   "role": "Staff",
//   "status": "Active"
// }
// ==============================================================================
router.post('/', async (req, res) => {
  const {
    username,
    password,
    fullname,
    email,
    phone = '',
    age = null,
    address = '',
    preferences = '',
    role = 'Staff',
    status = 'Active'
  } = req.body;

  // Validation
  if (!username || !password || !fullname || !email) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลบังคับให้ครบถ้วน: username, password, fullname, email'
    });
  }

  try {
    // ตรวจสอบ username หรือ email ซ้ำ
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username.trim(), email.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'ชื่อผู้เข้าใช้ (username) หรืออีเมล (email) นี้ถูกใช้งานแล้ว'
      });
    }

    const insertSql = `
      INSERT INTO users (username, password, fullname, email, phone, age, address, preferences, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username.trim(),
      password,
      fullname.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      age ? parseInt(age, 10) : null,
      address ? address.trim() : '',
      preferences ? preferences.trim() : '',
      role.trim(),
      status.trim()
    ];

    const [result] = await pool.query(insertSql, values);
    const [newUser] = await pool.query(
      'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: `เพิ่มผู้ใช้ "${fullname}" (Username: ${username}) สำเร็จเรียบร้อยแล้ว`,
      data: newUser[0]
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ลงสู่ฐานข้อมูล',
      error: error.message
    });
  }
});

// ==============================================================================
// 4. PUT /api/users/:id - การแก้ไขข้อมูลผู้ใช้งาน (Update User)
// ==============================================================================
// Postman Test Sample:
// PUT http://localhost:3000/api/users/3
// Headers: Content-Type: application/json
// Body (raw JSON): { "role": "Manager", "phone": "082-999-7777" }
// ==============================================================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบผู้ใช้งานรหัส ID ${id} ในระบบ ไม่สามารถแก้ไขได้`
      });
    }

    const current = existing[0];
    const updateData = {
      fullname: req.body.fullname !== undefined ? req.body.fullname.trim() : current.fullname,
      email: req.body.email !== undefined ? req.body.email.trim() : current.email,
      phone: req.body.phone !== undefined ? req.body.phone.trim() : current.phone,
      age: req.body.age !== undefined ? parseInt(req.body.age, 10) : current.age,
      address: req.body.address !== undefined ? req.body.address.trim() : current.address,
      preferences: req.body.preferences !== undefined ? req.body.preferences.trim() : current.preferences,
      role: req.body.role !== undefined ? req.body.role.trim() : current.role,
      status: req.body.status !== undefined ? req.body.status.trim() : current.status,
      password: req.body.password !== undefined && req.body.password !== '' ? req.body.password : current.password
    };

    const updateSql = `
      UPDATE users SET
        fullname = ?, email = ?, phone = ?, age = ?, address = ?, preferences = ?,
        role = ?, status = ?, password = ?
      WHERE id = ?
    `;

    const values = [
      updateData.fullname, updateData.email, updateData.phone, updateData.age,
      updateData.address, updateData.preferences, updateData.role, updateData.status,
      updateData.password, id
    ];

    await pool.query(updateSql, values);
    const [refreshed] = await pool.query(
      'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, updated_at FROM users WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: `ปรับปรุงข้อมูลผู้ใช้งาน "${refreshed[0].fullname}" (ID: ${id}) สำเร็จแล้ว`,
      data: refreshed[0]
    });
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้งาน',
      error: error.message
    });
  }
});

// ==============================================================================
// 5. DELETE /api/users/:id - การลบผู้ใช้งานออกจากฐานข้อมูล (Delete User)
// ==============================================================================
// Postman Test Sample:
// DELETE http://localhost:3000/api/users/5
// ==============================================================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบผู้ใช้งานรหัส ID ${id} ในระบบ ไม่สามารถลบได้`
      });
    }

    // ป้องกันการลบ Super Admin บัญชีหลัก (ID: 1)
    if (parseInt(id, 10) === 1 || existing[0].role === 'Super Admin') {
      return res.status(403).json({
        success: false,
        message: 'ระบบไม่อนุญาตให้ลบบัญชี Super Admin หลักของระบบ'
      });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: `ลบผู้ใช้งาน "${existing[0].fullname}" (Username: ${existing[0].username}) ออกจากฐานข้อมูลเรียบร้อยแล้ว`,
      deletedId: parseInt(id, 10)
    });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบผู้ใช้งานออกจากฐานข้อมูล',
      error: error.message
    });
  }
});

module.exports = router;
