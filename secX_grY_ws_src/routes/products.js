// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: routes/products.js
// Description: Product Web Services with MySQL (CRUD & Multi-Criteria Search)
// ==============================================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==============================================================================
// 1. GET /api/products - การค้นหาและเข้าถึงข้อมูลสินค้า (Search & View)
// รองรับทั้งแบบไม่มีเงื่อนไข (Select All) และการระบุเกณฑ์ค้นหาตามเกณฑ์อาจารย์
// ==============================================================================
// Postman Test Sample 1 (No Criteria - ดึงข้อมูลสินค้าทั้งหมด):
// GET http://localhost:3000/api/products
//
// Postman Test Sample 2 (Criteria 1 - ค้นหาด้วยคำค้น Keyword):
// GET http://localhost:3000/api/products?q=Freedom
//
// Postman Test Sample 3 (Criteria 2 - ค้นหาด้วย Grade และ Category):
// GET http://localhost:3000/api/products?grade=MG&category=gundam
//
// Postman Test Sample 4 (Criteria 3 - ค้นหาแบบช่วงราคา Min/Max และจัดเรียง):
// GET http://localhost:3000/api/products?minPrice=1500&maxPrice=2000&sortBy=price_asc
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    const { q, grade, category, minPrice, maxPrice, status, sortBy } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // เกณฑ์ค้นหาที่ 1: คำค้นหา Keyword (ชื่อสินค้า, ซีรีส์, คำอธิบาย)
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

    // เกณฑ์ค้นหาที่ 4: ช่วงราคาขั้นต่ำและสูงสุด (Price Range)
    if (minPrice && !isNaN(minPrice)) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // เกณฑ์ค้นหาเพิ่มเติม: สถานะสินค้า (Status)
    if (status && status.trim() !== '') {
      sql += ' AND status = ?';
      params.push(status.trim());
    }

    // การจัดเรียงลำดับผลลัพธ์ (Sorting)
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
      sql += ' ORDER BY id ASC';
    }

    const [rows] = await pool.query(sql, params);
    return res.status(200).json({
      success: true,
      count: rows.length,
      criteria: { q, grade, category, minPrice, maxPrice, status, sortBy },
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าจากฐานข้อมูล',
      error: error.message
    });
  }
});

// ==============================================================================
// 2. GET /api/products/:id - การดูรายละเอียดสินค้าเดี่ยว (View Single Product)
// ==============================================================================
// Postman Test Sample:
// GET http://localhost:3000/api/products/1
// ==============================================================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสินค้ารหัส ID ${id} ในระบบ`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้ารายชิ้น',
      error: error.message
    });
  }
});

// ==============================================================================
// 3. POST /api/products - การเพิ่มสินค้าใหม่ลงสู่ฐานข้อมูล (Insert New Product)
// ==============================================================================
// Postman Test Sample:
// POST http://localhost:3000/api/products
// Headers: Content-Type: application/json
// Body (raw JSON):
// {
//   "name": "MG 1/100 Sazabi Ver.Ka",
//   "series": "Mobile Suit Gundam: Char's Counterattack",
//   "grade": "MG",
//   "category": "gundam",
//   "scale": "1/100",
//   "price": 2800.00,
//   "stock": 10,
//   "status": "In Stock",
//   "image_url": "assets/images/product-freedom.png",
//   "description": "MSN-04 Sazabi Ver.Ka สีแดงพรีเมียม"
// }
// ==============================================================================
router.post('/', async (req, res) => {
  const {
    name,
    series = 'Universal Century',
    grade = 'HG',
    category = 'gundam',
    scale = '1/144',
    price,
    stock = 0,
    release_date,
    rating = 5.0,
    image_url = 'assets/images/product-freedom.png',
    description = '',
    details = '',
    reference_source = 'Bandai Hobby Site',
    status = 'In Stock'
  } = req.body;

  // Validation ตรวจสอบข้อมูลบังคับ
  if (!name || price === undefined || price === null || isNaN(price)) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อสินค้า (name) และราคา (price) ให้ถูกต้อง'
    });
  }

  try {
    const insertSql = `
      INSERT INTO products (
        name, series, grade, category, scale, price, stock,
        release_date, rating, image_url, description, details, reference_source, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name.trim(),
      series.trim(),
      grade.trim(),
      category.trim(),
      scale.trim(),
      parseFloat(price),
      parseInt(stock, 10) || 0,
      release_date || new Date().toISOString().slice(0, 10),
      parseFloat(rating) || 5.0,
      image_url.trim(),
      description.trim(),
      details.trim(),
      reference_source.trim(),
      status.trim()
    ];

    const [result] = await pool.query(insertSql, values);
    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: `เพิ่มสินค้าใหม่ "${name}" สำเร็จเรียบร้อยแล้ว`,
      data: newProduct[0]
    });
  } catch (error) {
    console.error('Error inserting product:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้าลงสู่ฐานข้อมูล',
      error: error.message
    });
  }
});

// ==============================================================================
// 4. PUT /api/products/:id - การแก้ไขข้อมูลสินค้าและเติมสต็อก (Update & Restock)
// ==============================================================================
// Postman Test Sample 1 (แก้ไขราคาและสต็อก):
// PUT http://localhost:3000/api/products/1
// Headers: Content-Type: application/json
// Body (raw JSON): { "price": 1850.00, "stock": 25, "status": "In Stock" }
//
// Postman Test Sample 2 (Restock เติมสต็อกสินค้า):
// PUT http://localhost:3000/api/products/1
// Headers: Content-Type: application/json
// Body (raw JSON): { "stock": 50, "status": "In Stock" }
// ==============================================================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสินค้ารหัส ID ${id} ในระบบ ไม่สามารถแก้ไขได้`
      });
    }

    const current = existing[0];
    const updateData = {
      name: req.body.name !== undefined ? req.body.name.trim() : current.name,
      series: req.body.series !== undefined ? req.body.series.trim() : current.series,
      grade: req.body.grade !== undefined ? req.body.grade.trim() : current.grade,
      category: req.body.category !== undefined ? req.body.category.trim() : current.category,
      scale: req.body.scale !== undefined ? req.body.scale.trim() : current.scale,
      price: req.body.price !== undefined ? parseFloat(req.body.price) : current.price,
      stock: req.body.stock !== undefined ? parseInt(req.body.stock, 10) : current.stock,
      release_date: req.body.release_date !== undefined ? req.body.release_date : current.release_date,
      rating: req.body.rating !== undefined ? parseFloat(req.body.rating) : current.rating,
      image_url: req.body.image_url !== undefined ? req.body.image_url.trim() : current.image_url,
      description: req.body.description !== undefined ? req.body.description.trim() : current.description,
      details: req.body.details !== undefined ? req.body.details.trim() : current.details,
      reference_source: req.body.reference_source !== undefined ? req.body.reference_source.trim() : current.reference_source,
      status: req.body.status !== undefined ? req.body.status.trim() : current.status
    };

    const updateSql = `
      UPDATE products SET
        name = ?, series = ?, grade = ?, category = ?, scale = ?, price = ?, stock = ?,
        release_date = ?, rating = ?, image_url = ?, description = ?, details = ?,
        reference_source = ?, status = ?
      WHERE id = ?
    `;

    const values = [
      updateData.name, updateData.series, updateData.grade, updateData.category, updateData.scale,
      updateData.price, updateData.stock, updateData.release_date, updateData.rating,
      updateData.image_url, updateData.description, updateData.details, updateData.reference_source,
      updateData.status, id
    ];

    await pool.query(updateSql, values);
    const [refreshed] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: `ปรับปรุงข้อมูลสินค้ารหัส ID ${id} สำเร็จเรียบร้อยแล้ว`,
      data: refreshed[0]
    });
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลสินค้า',
      error: error.message
    });
  }
});

// ==============================================================================
// 5. DELETE /api/products/:id - การลบสินค้าออกจากฐานข้อมูล (Delete Product)
// ==============================================================================
// Postman Test Sample:
// DELETE http://localhost:3000/api/products/16
// ==============================================================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสินค้ารหัส ID ${id} ในระบบ ไม่สามารถลบได้`
      });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: `ลบสินค้า "${existing[0].name}" (ID: ${id}) ออกจากฐานข้อมูลเรียบร้อยแล้ว`,
      deletedId: parseInt(id, 10)
    });
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบสินค้าออกจากฐานข้อมูล',
      error: error.message
    });
  }
});

module.exports = router;
