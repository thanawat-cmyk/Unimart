// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: routes/users.js
// หน้าที่: เว็บเซอร์วิสจัดการข้อมูลผู้ดูแลระบบและสมาชิก (User & Admin Management)
//          รองรับ CRUD: การค้นหา (Search & View), การเพิ่ม (Insert),
//          การแก้ไข (Update), และการลบ (Delete) พร้อมตัวอย่างทดสอบด้วย Postman
// ==============================================================================

const express = require('express');
const router = express.Router();
const { pool, isDbConnected } = require('../config/db');
let { usersSeed } = require('../data/seedData');

// ==============================================================================
// 1. GET /api/users - การค้นหาและเข้าถึงข้อมูลผู้ดูแลระบบและสมาชิก (Search & View)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ก)
// รองรับการค้นหาแบบ Select All และการระบุเกณฑ์ค้นหา (คำค้นชื่อ/อีเมล, สิทธิ์ Role, สถานะ Status)
// ==============================================================================
// Postman Test Sample 1 (ดึงรายชื่อผู้ใช้งานและผู้ดูแลระบบทั้งหมด):
// method: GET
// URL: http://localhost:3000/api/users
//
// Postman Test Sample 2 (ค้นหาผู้ใช้ด้วยคำค้น Keyword เช่น Gundam หรือชื่อสมาชิก):
// method: GET
// URL: http://localhost:3000/api/users?q=Gundam
//
// Postman Test Sample 3 (ค้นหาผู้ใช้ตามสิทธิ์การใช้งาน Role และสถานะการใช้งาน Status):
// method: GET
// URL: http://localhost:3000/api/users?role=Staff&status=Active
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    // 1.1 รับ Query Parameters จาก URL
    const { q, role, status } = req.query;

    if (isDbConnected()) {
      // 1.2 สร้างคำสั่ง SQL คัดกรองข้อมูลผู้ใช้ (ไม่ดึง password เพื่อความปลอดภัย)
      let sql = 'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, created_at, updated_at FROM users WHERE 1=1';
      const params = [];

      // เกณฑ์ค้นหาที่ 1: คำค้นหา (Keyword) ตรวจสอบจากชื่อ-นามสกุล, ชื่อผู้ใช้ หรืออีเมล
      if (q && q.trim() !== '') {
        sql += ' AND (fullname LIKE ? OR username LIKE ? OR email LIKE ?)';
        const queryTerm = `%${q.trim()}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }

      // เกณฑ์ค้นหาที่ 2: สิทธิ์การใช้งาน (Role เช่น Super Admin, Manager, Staff, Customer)
      if (role && role.trim() !== '') {
        sql += ' AND role = ?';
        params.push(role.trim());
      }

      // เกณฑ์ค้นหาที่ 3: สถานะบัญชีผู้ใช้ (Status เช่น Active, Inactive, Suspended)
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
    } else {
      // 1.3 In-Memory Fallback: สำหรับการทดสอบ
      let results = usersSeed.map(u => {
        const { password, ...safe } = u;
        return safe;
      });

      if (q && q.trim() !== '') {
        const term = q.trim().toLowerCase();
        results = results.filter(u =>
          (u.fullname && u.fullname.toLowerCase().includes(term)) ||
          (u.username && u.username.toLowerCase().includes(term)) ||
          (u.email && u.email.toLowerCase().includes(term))
        );
      }

      if (role && role.trim() !== '') {
        results = results.filter(u => u.role.toLowerCase() === role.trim().toLowerCase());
      }

      if (status && status.trim() !== '') {
        results = results.filter(u => u.status.toLowerCase() === status.trim().toLowerCase());
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        criteria: { q, role, status },
        data: results
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/users/:id - การดูข้อมูลผู้ใช้เดี่ยว (View Single User by ID)
// ==============================================================================
// Postman Test Sample 1 (ดูข้อมูลผู้ใช้ ID: 1 - Admin):
// method: GET
// URL: http://localhost:3000/api/users/1
//
// Postman Test Sample 2 (ดูข้อมูลผู้ใช้ ID: 6 - GundamLover159):
// method: GET
// URL: http://localhost:3000/api/users/6
// ==============================================================================
router.get('/:id', async (req, res) => {
  const { id } = req.params; // รับรหัสผู้ใช้จาก URL
  try {
    let user = null;

    if (isDbConnected()) {
      const [rows] = await pool.query(
        'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      if (rows.length > 0) user = rows[0];
    } else {
      const found = usersSeed.find(u => u.id === parseInt(id, 10));
      if (found) {
        const { password, ...safe } = found;
        user = safe;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบผู้ใช้งานรหัส ID ${id} ในระบบ`
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. POST /api/users - การเพิ่มข้อมูลผู้ใช้งาน/ผู้ดูแลระบบใหม่ (Insert User)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ข)
// ==============================================================================
// Postman Test Sample 1 (เพิ่มเจ้าหน้าที่แอดมินใหม่ - Staff):
// method: POST
// URL: http://localhost:3000/api/users
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "username": "somchai_staff",
//   "password": "password123",
//   "fullname": "สมชาย รักการต่อกันดั้ม",
//   "email": "somchai.gunpla@example.com",
//   "phone": "089-999-8888",
//   "age": 25,
//   "address": "45/2 ถ.พหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400",
//   "preferences": "ดูแลคลังสินค้าเกรด Perfect Grade และอุปกรณ์ทำสีแอร์บรัช",
//   "role": "Staff",
//   "status": "Active"
// }
//
// Postman Test Sample 2 (เพิ่มสมาชิกลูกค้าใหม่ - Customer):
// method: POST
// URL: http://localhost:3000/api/users
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "username": "gunpla_master_x",
//   "password": "mypassword456",
//   "fullname": "วิชัย มุ่งมั่นศิลป์",
//   "email": "wichai.m@example.com",
//   "phone": "081-123-4567",
//   "age": 28,
//   "address": "99/1 หมู่ 3 ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม 73170",
//   "preferences": "สนใจสินค้าพรีออเดอร์เกรด Real Grade และ Limited Edition",
//   "role": "Customer",
//   "status": "Active"
// }
// ==============================================================================
router.post('/', async (req, res) => {
  // ดึงค่าฟิลด์ที่ส่งเข้ามาใน Request Body
  const {
    username,
    password,
    fullname,
    email,
    phone = null,
    age = null,
    address = null,
    preferences = null,
    role = 'Customer',
    status = 'Active'
  } = req.body;

  // ตรวจสอบความถูกต้องเบื้องต้น (Validation): ฟิลด์สำคัญห้ามว่าง
  if (!username || !password || !fullname || !email) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (username, password, fullname, email)'
    });
  }

  try {
    if (isDbConnected()) {
      // ตรวจสอบชื่อผู้ใช้ (username) หรืออีเมล (email) ซ้ำในระบบ
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'ชื่อผู้เข้าใช้ (username) หรืออีเมล (email) นี้มีอยู่ในระบบแล้ว'
        });
      }

      // บันทึกข้อมูลผู้ใช้ใหม่ลงตาราง users
      const [result] = await pool.query(
        `INSERT INTO users (
          username, password, fullname, email, phone, age, address, preferences, role, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, password, fullname, email, phone, age ? parseInt(age, 10) : null, address, preferences, role, status]
      );

      return res.status(201).json({
        success: true,
        message: 'เพิ่มข้อมูลผู้ใช้ใหม่เข้าสู่ระบบสำเร็จ',
        data: {
          id: result.insertId,
          username,
          fullname,
          email,
          phone,
          age,
          address,
          preferences,
          role,
          status
        }
      });
    } else {
      // In-Memory เช็คความซ้ำซ้อน
      const duplicate = usersSeed.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'ชื่อผู้เข้าใช้ (username) หรืออีเมล (email) นี้มีอยู่ในระบบแล้ว'
        });
      }

      const newId = usersSeed.length > 0 ? Math.max(...usersSeed.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        username,
        password,
        fullname,
        email,
        phone,
        age: age ? parseInt(age, 10) : null,
        address,
        preferences,
        role,
        status,
        created_at: new Date().toISOString()
      };
      usersSeed.push(newUser);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({
        success: true,
        message: 'เพิ่มข้อมูลผู้ใช้ใหม่เข้าสู่ระบบสำเร็จ',
        data: safeUser
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้',
      error: error.message
    });
  }
});

// ==============================================================================
// 4. PUT /api/users/:id - การปรับปรุงข้อมูลผู้ดูแลระบบ/ผู้ใช้ให้ทันสมัย (Update User)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ค)
// ==============================================================================
// Postman Test Sample 1 (อัปเดตบทบาท Role และเบอร์โทรของผู้ใช้ ID: 3):
// method: PUT
// URL: http://localhost:3000/api/users/3
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "role": "Manager",
//   "phone": "082-999-7777",
//   "preferences": "ปรับบทบาทดูแลสต็อกสินค้าพรีเมียมและประสานงานทีม"
// }
//
// Postman Test Sample 2 (ระงับการใช้งานบัญชีของผู้ใช้ ID: 5 โดยเปลี่ยน status เป็น Suspended):
// method: PUT
// URL: http://localhost:3000/api/users/5
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "status": "Suspended"
// }
// ==============================================================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;  // รหัสผู้ใช้ที่จะแก้ไข
  const updates = req.body;   // ข้อมูลฟิลด์ที่จะแก้ไข

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุข้อมูลที่ต้องการแก้ไขอย่างน้อย 1 รายการ'
    });
  }

  try {
    if (isDbConnected()) {
      // รายการฟิลด์ที่อนุญาตให้อัปเดต
      const allowedFields = [
        'fullname', 'email', 'phone', 'age', 'address', 'preferences', 'role', 'status', 'password'
      ];

      const setClauses = [];
      const values = [];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'ไม่มีฟิลด์ข้อมูลที่ถูกต้องสำหรับการอัปเดต'
        });
      }

      values.push(id);
      const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(sql, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบผู้ใช้งานรหัส ID ${id} ที่ต้องการอัปเดต`
        });
      }

      // ดึงข้อมูลล่าสุดหลังจากอัปเดต
      const [updatedRows] = await pool.query(
        'SELECT id, username, fullname, email, phone, age, address, preferences, role, status, updated_at FROM users WHERE id = ?',
        [id]
      );

      return res.status(200).json({
        success: true,
        message: `อัปเดตข้อมูลผู้ใช้งานรหัส ID ${id} สำเร็จ`,
        data: updatedRows[0]
      });
    } else {
      // In-Memory อัปเดตในอาร์เรย์
      const index = usersSeed.findIndex(u => u.id === parseInt(id, 10));
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบผู้ใช้งานรหัส ID ${id} ที่ต้องการอัปเดต`
        });
      }

      usersSeed[index] = {
        ...usersSeed[index],
        ...updates
      };

      const { password, ...safeUser } = usersSeed[index];
      return res.status(200).json({
        success: true,
        message: `อัปเดตข้อมูลผู้ใช้งานรหัส ID ${id} สำเร็จ`,
        data: safeUser
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้',
      error: error.message
    });
  }
});

// ==============================================================================
// 5. DELETE /api/users/:id - การลบข้อมูลบัญชีผู้ใช้งาน (Delete User)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ง)
// ==============================================================================
// Postman Test Sample 1 (ลบบัญชีผู้ใช้ ID: 5):
// method: DELETE
// URL: http://localhost:3000/api/users/5
//
// Postman Test Sample 2 (ลบบัญชีผู้ใช้ ID: 6):
// method: DELETE
// URL: http://localhost:3000/api/users/6
// ==============================================================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // รหัสผู้ใช้ที่จะลบ

  try {
    if (isDbConnected()) {
      // ตรวจสอบการมีอยู่ของบัญชี
      const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบผู้ใช้งานรหัส ID ${id} ที่ต้องการลบ`
        });
      }

      // ป้องกันการลบบัญชี Super Admin หลักของระบบ เพื่อความปลอดภัย
      if (existing[0].role === 'Super Admin') {
        return res.status(403).json({
          success: false,
          message: 'ไม่อนุญาตให้ลบบัญชี Super Admin หลักของระบบ'
        });
      }

      // ดำเนินการลบออกจากตาราง users
      await pool.query('DELETE FROM users WHERE id = ?', [id]);

      const { password, ...safeUser } = existing[0];
      return res.status(200).json({
        success: true,
        message: `ลบผู้ใช้งานรหัส ID ${id} ("${safeUser.fullname}") ออกจากระบบเรียบร้อยแล้ว`,
        deletedUser: safeUser
      });
    } else {
      // In-Memory ลบออกจากอาร์เรย์
      const index = usersSeed.findIndex(u => u.id === parseInt(id, 10));
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบผู้ใช้งานรหัส ID ${id} ที่ต้องการลบ`
        });
      }

      if (usersSeed[index].role === 'Super Admin') {
        return res.status(403).json({
          success: false,
          message: 'ไม่อนุญาตให้ลบบัญชี Super Admin หลักของระบบ'
        });
      }

      const deleted = usersSeed.splice(index, 1)[0];
      const { password, ...safeUser } = deleted;

      return res.status(200).json({
        success: true,
        message: `ลบผู้ใช้งานรหัส ID ${id} ("${safeUser.fullname}") ออกจากระบบเรียบร้อยแล้ว`,
        deletedUser: safeUser
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้',
      error: error.message
    });
  }
});

module.exports = router;
