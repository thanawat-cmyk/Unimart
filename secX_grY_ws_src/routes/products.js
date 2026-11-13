// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: routes/products.js
// หน้าที่: เว็บเซอร์วิสจัดการข้อมูลสินค้าโมเดลกันพลาและอุปกรณ์ (Product Web Services)
//          รองรับ CRUD: การค้นหาหลายเกณฑ์ (Search & View), การเพิ่ม (Insert),
//          การแก้ไข (Update), และการลบ (Delete) พร้อมตัวอย่างทดสอบด้วย Postman
// ==============================================================================

const express = require('express');
const router = express.Router();
const { pool, isDbConnected } = require('../config/db');
let { productsSeed } = require('../data/seedData');

// ==============================================================================
// 1. GET /api/products - การค้นหาและเข้าถึงข้อมูลสินค้า (Search & View)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ก)
// รองรับทั้งแบบไม่มีเงื่อนไข (Select All) และการระบุเกณฑ์ค้นหาอย่างน้อย 3 รูปแบบ
// ==============================================================================
// Postman Test Sample 1 (No Criteria - ดึงข้อมูลสินค้าทั้งหมด 16 รายการ):
// method: GET
// URL: http://localhost:3000/api/products
//
// Postman Test Sample 2 (Criteria 1 - ค้นหาด้วยคำค้นชื่อสินค้าหรือซีรีส์ Keyword):
// method: GET
// URL: http://localhost:3000/api/products?q=Freedom
//
// Postman Test Sample 3 (Criteria 2 - ค้นหาด้วย Grade และ Category):
// method: GET
// URL: http://localhost:3000/api/products?grade=MG&category=gundam
//
// Postman Test Sample 4 (Criteria 3 & 4 - ค้นหาแบบช่วงราคา Min/Max และเรียงลำดับราคา):
// method: GET
// URL: http://localhost:3000/api/products?grade=MG&minPrice=1500&maxPrice=2000&sortBy=price_asc
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    // 1.1 รับค่า Query Parameters จาก URL
    const { q, grade, category, minPrice, maxPrice, status, sortBy } = req.query;

    if (isDbConnected()) {
      // 1.2 เริ่มต้นสร้างคำสั่ง SQL คิวรี (ใช้ WHERE 1=1 เพื่อให้ง่ายต่อการต่อ AND ในเงื่อนไขถัดๆ ไป)
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      // เกณฑ์ค้นหาที่ 1: คำค้นหา (Keyword) ตรวจสอบจากชื่อโมเดล, ซีรีส์ หรือคำอธิบาย
      if (q && q.trim() !== '') {
        sql += ' AND (name LIKE ? OR series LIKE ? OR description LIKE ?)';
        const queryTerm = `%${q.trim()}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }

      // เกณฑ์ค้นหาที่ 2: เกรดของโมเดลกันพลา (Grade เช่น RG, MG, HG, PG, Tools)
      if (grade && grade.trim() !== '') {
        sql += ' AND grade = ?';
        params.push(grade.trim());
      }

      // เกณฑ์ค้นหาที่ 3: หมวดหมู่สินค้า (Category เช่น gundam, parts, tools)
      if (category && category.trim() !== '') {
        sql += ' AND category = ?';
        params.push(category.trim());
      }

      // เกณฑ์ค้นหาที่ 4: ช่วงราคาขั้นต่ำและสูงสุด (Price Range Filter)
      if (minPrice && !isNaN(minPrice)) {
        sql += ' AND price >= ?';
        params.push(parseFloat(minPrice));
      }
      if (maxPrice && !isNaN(maxPrice)) {
        sql += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
      }

      // เกณฑ์ค้นหาเพิ่มเติม: สถานะสินค้า (Status เช่น In Stock, Low Stock, Out of Stock)
      if (status && status.trim() !== '') {
        sql += ' AND status = ?';
        params.push(status.trim());
      }

      // 1.3 การจัดเรียงลำดับผลลัพธ์ (Sorting)
      if (sortBy === 'price_asc') {
        sql += ' ORDER BY price ASC';
      } else if (sortBy === 'price_desc') {
        sql += ' ORDER BY price DESC';
      } else if (sortBy === 'rating_desc') {
        sql += ' ORDER BY rating DESC';
      } else if (sortBy === 'newest') {
        sql += ' ORDER BY release_date DESC, id DESC';
      } else if (sortBy === 'name_asc') {
        sql += ' ORDER BY name ASC';
      } else {
        sql += ' ORDER BY id ASC'; // ค่าเริ่มต้นเรียงตามรหัสสินค้า ID จากน้อยไปมาก
      }

      // รันคำสั่ง SQL ผ่าน MySQL Connection Pool
      const [rows] = await pool.query(sql, params);
      return res.status(200).json({
        success: true,
        count: rows.length,
        criteria: { q, grade, category, minPrice, maxPrice, status, sortBy },
        data: rows
      });
    } else {
      // 1.4 โหมด In-Memory Fallback: สำหรับกรณีทดสอบขณะที่ยังไม่ได้เปิด MySQL
      let results = [...productsSeed];

      if (q && q.trim() !== '') {
        const term = q.trim().toLowerCase();
        results = results.filter(p =>
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.series && p.series.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term))
        );
      }

      if (grade && grade.trim() !== '') {
        results = results.filter(p => p.grade.toLowerCase() === grade.trim().toLowerCase());
      }

      if (category && category.trim() !== '') {
        results = results.filter(p => p.category.toLowerCase() === category.trim().toLowerCase());
      }

      if (minPrice && !isNaN(minPrice)) {
        results = results.filter(p => Number(p.price) >= parseFloat(minPrice));
      }

      if (maxPrice && !isNaN(maxPrice)) {
        results = results.filter(p => Number(p.price) <= parseFloat(maxPrice));
      }

      if (status && status.trim() !== '') {
        results = results.filter(p => p.status.toLowerCase() === status.trim().toLowerCase());
      }

      if (sortBy === 'price_asc') {
        results.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortBy === 'price_desc') {
        results.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortBy === 'rating_desc') {
        results.sort((a, b) => Number(b.rating) - Number(a.rating));
      } else if (sortBy === 'name_asc') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        criteria: { q, grade, category, minPrice, maxPrice, status, sortBy },
        data: results
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูลสินค้า:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการค้นหาข้อมูลสินค้า',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/products/:id - การดูรายละเอียดสินค้าเดี่ยว (View Single Product)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ก) สำหรับหน้ารายละเอียดสินค้า
// ==============================================================================
// Postman Test Sample 1 (ดูรายละเอียดสินค้า ID: 1 - Freedom Gundam):
// method: GET
// URL: http://localhost:3000/api/products/1
//
// Postman Test Sample 2 (ดูรายละเอียดสินค้า ID: 9 - God Gundam):
// method: GET
// URL: http://localhost:3000/api/products/9
// ==============================================================================
router.get('/:id', async (req, res) => {
  const { id } = req.params; // รับรหัสสินค้าจาก Path Parameter

  try {
    let product = null;

    if (isDbConnected()) {
      // คิวรีสินค้าตาม id
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length > 0) product = rows[0];
    } else {
      product = productsSeed.find(p => p.id === parseInt(id, 10));
    }

    // กรณีไม่พบรหัสสินค้าในระบบ ให้ส่งกลับ Status 404 Not Found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสินค้ารหัส ID ${id} ในระบบ`
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. POST /api/products - การเพิ่มข้อมูลสินค้าใหม่ (Insert Product)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ข)
// ==============================================================================
// Postman Test Sample 1 (เพิ่มสินค้าใหม่ - MG Sazabi Ver.Ka):
// method: POST
// URL: http://localhost:3000/api/products
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "name": "MG 1/100 Sazabi Ver.Ka",
//   "series": "Mobile Suit Gundam: Char's Counterattack",
//   "grade": "MG",
//   "category": "gundam",
//   "scale": "1/100",
//   "price": 2800.00,
//   "stock": 10,
//   "release_date": "2024-06-01",
//   "rating": 5.0,
//   "image_url": "assets/images/product-freedom.png",
//   "description": "MSN-04 Sazabi Ver.Ka โมเดลสีแดงระดับตำนาน พร้อมบีมช็อตไรเฟิลและฟันเนล 6 ตัว",
//   "details": "โครงสร้าง Full Inner Frame แข็งแรง พร้อมสติกเกอร์ดีคอลน้ำพรีเมียมจาก Katoki Hajime",
//   "reference_source": "Bandai Hobby Site - https://bandai-hobby.net",
//   "status": "In Stock"
// }
//
// Postman Test Sample 2 (เพิ่มสินค้าใหม่ - RG Hi-Nu Gundam):
// method: POST
// URL: http://localhost:3000/api/products
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "name": "RG 1/144 Hi-Nu Gundam",
//   "series": "Mobile Suit Gundam: Beltorchika's Children",
//   "grade": "RG",
//   "category": "gundam",
//   "scale": "1/144",
//   "price": 1650.00,
//   "stock": 12,
//   "release_date": "2024-07-20",
//   "rating": 4.9,
//   "image_url": "assets/images/product-god.png",
//   "description": "RG Hi-Nu Gundam ความแม่นยำและกลไกข้อต่อระดับสูงสุด พร้อมฟินฟันเนลกางปีกแบบไดนามิก",
//   "details": "ชุดพลาสติกคิทขนาด 1/144 เทคโนโลยี Advanced MS Joint ลิขสิทธิ์แท้ Bandai",
//   "reference_source": "Bandai Hobby Site - https://bandai-hobby.net",
//   "status": "In Stock"
// }
// ==============================================================================
router.post('/', async (req, res) => {
  // ดึงค่าฟิลด์ต่าง ๆ จาก Request Body พร้อมกำหนดค่า Default ป้องกันข้อมูลตกหล่น
  const {
    name,
    series = 'Universal Century',
    grade,
    category = 'gundam',
    scale = '1/100',
    price,
    stock = 0,
    release_date = new Date().toISOString().slice(0, 10),
    rating = 4.5,
    image_url = 'assets/images/product-freedom.png',
    description = '',
    details = '',
    reference_source = 'Bandai Hobby Site - https://bandai-hobby.net',
    status = 'In Stock'
  } = req.body;

  // ตรวจสอบความถูกต้องของข้อมูล (Validation): ฟิลด์จำเป็นต้องมีครบ
  if (!name || !grade || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (name, grade, price)'
    });
  }

  try {
    let newId;

    if (isDbConnected()) {
      // ทำคำสั่ง INSERT ลงตาราง products ใน MySQL
      const [result] = await pool.query(
        `INSERT INTO products (
          name, series, grade, category, scale, price, stock,
          release_date, rating, image_url, description, details, reference_source, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, series, grade, category, scale, parseFloat(price), parseInt(stock, 10),
          release_date, parseFloat(rating), image_url, description, details, reference_source, status
        ]
      );
      newId = result.insertId; // รหัส ID ที่ MySQL สร้างให้โดยอัตโนมัติ (AUTO_INCREMENT)
    } else {
      // In-Memory เพิ่มข้อมูลเข้าอาร์เรย์
      newId = productsSeed.length > 0 ? Math.max(...productsSeed.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        name,
        series,
        grade,
        category,
        scale,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        release_date,
        rating: parseFloat(rating),
        image_url,
        description,
        details,
        reference_source,
        status
      };
      productsSeed.push(newProduct);
    }

    // ตอบกลับด้วย HTTP Status 201 Created
    return res.status(201).json({
      success: true,
      message: 'เพิ่มข้อมูลสินค้าใหม่เข้าสู่ระบบสำเร็จ',
      data: {
        id: newId,
        name,
        series,
        grade,
        category,
        scale,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        status
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
      error: error.message
    });
  }
});

// ==============================================================================
// 4. PUT /api/products/:id - การปรับปรุงข้อมูลสินค้าให้ทันสมัย (Update Product)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ค)
// ==============================================================================
// Postman Test Sample 1 (อัปเดตราคาและจำนวนสต็อกของสินค้า ID: 1):
// method: PUT
// URL: http://localhost:3000/api/products/1
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "price": 1850.00,
//   "stock": 25,
//   "status": "In Stock"
// }
//
// Postman Test Sample 2 (อัปเดตข้อมูลรายละเอียดสินค้าและคะแนนรีวิว ID: 2):
// method: PUT
// URL: http://localhost:3000/api/products/2
// Headers: Content-Type: application/json
// body: raw JSON
// {
//   "rating": 5.0,
//   "description": "Zeta Gundam Ver.Ka ล็อตผลิตใหม่ แถมพรีเมียมวอเตอร์ดีคอลชุดพิเศษ",
//   "stock": 10
// }
// ==============================================================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;  // รหัสสินค้าที่จะแก้ไข
  const updates = req.body;   // ข้อมูลฟิลด์ที่ต้องการแก้ไข

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุข้อมูลที่ต้องการแก้ไขอย่างน้อย 1 รายการ'
    });
  }

  try {
    if (isDbConnected()) {
      // รายการฟิลด์ที่อนุญาตให้อัปเดตได้ (Whitelist Fields เพื่อความปลอดภัย)
      const allowedFields = [
        'name', 'series', 'grade', 'category', 'scale', 'price',
        'stock', 'release_date', 'rating', 'image_url', 'description',
        'details', 'reference_source', 'status'
      ];

      const setClauses = [];
      const values = [];

      // วนลูปสร้างคำสั่ง UPDATE เฉพาะฟิลด์ที่ส่งเข้ามาใน req.body
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
      const sql = `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(sql, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบสินค้ารหัส ID ${id} ที่ต้องการอัปเดต`
        });
      }

      // ดึงข้อมูลสินค้าล่าสุดหลังจากอัปเดตเพื่อส่งกลับให้ไคลเอนต์
      const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return res.status(200).json({
        success: true,
        message: `อัปเดตข้อมูลสินค้ารหัส ID ${id} สำเร็จ`,
        data: updatedRows[0]
      });
    } else {
      // In-Memory อัปเดตในอาร์เรย์
      const index = productsSeed.findIndex(p => p.id === parseInt(id, 10));
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบสินค้ารหัส ID ${id} ที่ต้องการอัปเดต`
        });
      }

      productsSeed[index] = {
        ...productsSeed[index],
        ...updates
      };

      return res.status(200).json({
        success: true,
        message: `อัปเดตข้อมูลสินค้ารหัส ID ${id} สำเร็จ`,
        data: productsSeed[index]
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตสินค้า:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า',
      error: error.message
    });
  }
});

// ==============================================================================
// 5. DELETE /api/products/:id - การลบข้อมูลสินค้า (Delete Product)
// ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 3 ข้อ 2 (ง)
// ==============================================================================
// Postman Test Sample 1 (ลบสินค้าตัวอย่าง ID: 16):
// method: DELETE
// URL: http://localhost:3000/api/products/16
//
// Postman Test Sample 2 (ลบสินค้าตัวอย่าง ID: 15):
// method: DELETE
// URL: http://localhost:3000/api/products/15
// ==============================================================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // รหัสสินค้าที่ต้องการลบ

  try {
    if (isDbConnected()) {
      // ตรวจสอบก่อนว่ามีสินค้ารหัสนี้อยู่ในระบบจริงหรือไม่
      const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบสินค้ารหัส ID ${id} ที่ต้องการลบ`
        });
      }

      // รันคำสั่ง DELETE ลบสินค้าออกจาก MySQL
      await pool.query('DELETE FROM products WHERE id = ?', [id]);

      return res.status(200).json({
        success: true,
        message: `ลบสินค้ารหัส ID ${id} ("${existing[0].name}") ออกจากระบบเรียบร้อยแล้ว`,
        deletedProduct: existing[0]
      });
    } else {
      // In-Memory ลบออกจากอาร์เรย์
      const index = productsSeed.findIndex(p => p.id === parseInt(id, 10));
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `ไม่พบสินค้ารหัส ID ${id} ที่ต้องการลบ`
        });
      }

      const deleted = productsSeed.splice(index, 1)[0];
      return res.status(200).json({
        success: true,
        message: `ลบสินค้ารหัส ID ${id} ("${deleted.name}") ออกจากระบบเรียบร้อยแล้ว`,
        deletedProduct: deleted
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูลสินค้า',
      error: error.message
    });
  }
});

module.exports = router;
