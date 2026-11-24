// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: routes/products.js
// Description: Product Web Services with MySQL (CRUD & Multi-Criteria Search)
// ==============================================================================

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('../config/db');

/**
 * แปลงรูปภาพ Base64 Data URL ยาวๆ (data:image/...;base64,...) ให้บันทึกเป็นไฟล์รูปจริงใน assets/images/
 * แล้วคืนค่าเป็น Path สั้นๆ เช่น "assets/images/img-17.jpg" (ยาวเพียง ~24 ตัวอักษร)
 */
function shortenImageUrl(rawUrl, itemId = null) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'assets/images/product-freedom.png';
  }
  const trimmed = rawUrl.trim();
  const base64Marker = ';base64,';
  const markerIdx = trimmed.indexOf(base64Marker);

  if (!trimmed.startsWith('data:') || markerIdx === -1) {
    if (trimmed.length > 500) {
      return 'assets/images/product-freedom.png';
    }
    return trimmed;
  }

  try {
    const header = trimmed.slice(0, markerIdx).toLowerCase();
    let ext = 'jpg';
    if (header.includes('png')) ext = 'png';
    else if (header.includes('webp')) ext = 'webp';
    else if (header.includes('gif')) ext = 'gif';

    const base64Data = trimmed.slice(markerIdx + base64Marker.length).replace(/\s+/g, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const stamp = String(Date.now()).slice(-4);
    const suffix = itemId ? `${itemId}-${stamp}` : String(Date.now()).slice(-6);
    const fileName = `img-${suffix}.${ext}`;
    const imagesDir = path.join(__dirname, '..', '..', 'secX_grY_fe_src', 'assets', 'images');

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    fs.writeFileSync(path.join(imagesDir, fileName), buffer);
    return `assets/images/${fileName}`;
  } catch (err) {
    console.warn('Failed to shorten base64 image_url:', err.message);
    return 'assets/images/product-freedom.png';
  }
}

/**
 * จัดรูปแบบข้อมูลสินค้าให้สะอาดและตรงตามฟิลด์ที่กรอกในระบบจริง 10 ฟิลด์
 * (id, name, grade, scale, category, price, stock, status, description, image_url)
 */
function formatProduct(p) {
  if (!p) return null;
  const g = (p.grade || 'HG').toUpperCase().trim();
  let sc = p.scale;
  if ((g === 'HG' || g === 'RG' || g === 'EG') && (!sc || sc === '1/100')) {
    sc = '1/144';
  } else if (g === 'MG' && (!sc || sc === 'N/A')) {
    sc = '1/100';
  } else if (g === 'PG' && (!sc || sc === 'N/A')) {
    sc = '1/60';
  } else if (g === 'SD' && (!sc || sc === 'N/A')) {
    sc = 'Non-scale';
  }
  return {
    id: Number(p.id),
    name: p.name || '',
    grade: p.grade || 'HG',
    scale: sc || '1/144',
    category: p.category || 'gundam',
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
    status: p.status || 'In Stock',
    description: p.description || '',
    image_url: p.image_url || 'assets/images/product-freedom.png'
  };
}

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

    // ตรวจสอบสเกลกันพลา แปลง Base64 และจัดรูปแบบข้อมูลให้ได้เฉพาะฟิลด์มาตรฐาน 10 ฟิลด์
    const normalizedRows = [];
    for (const rawP of rows) {
      const p = formatProduct(rawP);
      if (p.image_url && typeof p.image_url === 'string' && (p.image_url.startsWith('data:') || p.image_url.length > 500)) {
        const shortPath = shortenImageUrl(p.image_url, p.id);
        p.image_url = shortPath;
        try {
          await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [shortPath, p.id]);
        } catch (_) {}
      }
      normalizedRows.push(p);
    }

    return res.status(200).json({
      success: true,
      count: normalizedRows.length,
      criteria: { q, grade, category, minPrice, maxPrice, status, sortBy },
      data: normalizedRows
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

    const p = formatProduct(rows[0]);
    if (p.image_url && typeof p.image_url === 'string' && p.image_url.startsWith('data:image/')) {
      const shortPath = shortenImageUrl(p.image_url, p.id);
      p.image_url = shortPath;
      try {
        await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [shortPath, p.id]);
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      data: p
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
//   "grade": "MG",
//   "scale": "1/100",
//   "category": "gundam",
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
    grade = 'HG',
    category = 'gundam',
    scale = '1/144',
    price,
    stock = 0,
    image_url = 'assets/images/product-freedom.png',
    description = '',
    status = 'In Stock'
  } = req.body;

  // กำหนดสเกลให้สอดคล้องกับเกรดของกันพลา (HG และ RG ต้องเป็น 1/144 เท่านั้น)
  let effectiveScale = scale;
  const upperGrade = (grade || '').toUpperCase().trim();
  if ((upperGrade === 'HG' || upperGrade === 'RG' || upperGrade === 'EG') && (!effectiveScale || effectiveScale === '1/100')) {
    effectiveScale = '1/144';
  } else if (upperGrade === 'MG' && (!effectiveScale || effectiveScale === 'N/A')) {
    effectiveScale = '1/100';
  } else if (upperGrade === 'PG' && (!effectiveScale || effectiveScale === 'N/A')) {
    effectiveScale = '1/60';
  } else if (upperGrade === 'SD' && (!effectiveScale || effectiveScale === 'N/A')) {
    effectiveScale = 'Non-scale';
  }

  // Validation ตรวจสอบข้อมูลบังคับ
  if (!name || price === undefined || price === null || isNaN(price)) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อสินค้า (name) และราคา (price) ให้ถูกต้อง'
    });
  }

  try {
    // แปลง Base64 เป็นไฟล์รูปสั้นๆ ก่อนบันทึกลง MySQL
    const shortImgUrl = shortenImageUrl(image_url);

    const insertSql = `
      INSERT INTO products (
        name, grade, category, scale, price, stock,
        image_url, description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name.trim(),
      grade.trim(),
      category.trim(),
      effectiveScale.trim(),
      parseFloat(price),
      parseInt(stock, 10) || 0,
      shortImgUrl,
      description.trim(),
      status.trim()
    ];

    const [result] = await pool.query(insertSql, values);

    // หากส่งมาเป็น Base64 ให้ตั้งชื่อไฟล์ตาม ID สินค้าที่เพิ่งได้มา เช่น assets/images/img-17.jpg
    if (image_url && typeof image_url === 'string' && image_url.startsWith('data:image/') && result && result.insertId) {
      const idBasedUrl = shortenImageUrl(image_url, result.insertId);
      try {
        await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [idBasedUrl, result.insertId]);
      } catch (_) {}
    }

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: `เพิ่มสินค้าใหม่ "${name}" สำเร็จเรียบร้อยแล้ว`,
      data: formatProduct(newProduct[0])
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
    const targetGrade = req.body.grade !== undefined && req.body.grade !== null ? String(req.body.grade).trim() : current.grade;
    let targetScale = req.body.scale !== undefined && req.body.scale !== null ? String(req.body.scale).trim() : current.scale;
    const upperG = (targetGrade || '').toUpperCase().trim();
    if ((upperG === 'HG' || upperG === 'RG' || upperG === 'EG') && (!targetScale || targetScale === '1/100')) {
      targetScale = '1/144';
    } else if (upperG === 'MG' && (!targetScale || targetScale === 'N/A')) {
      targetScale = '1/100';
    } else if (upperG === 'PG' && (!targetScale || targetScale === 'N/A')) {
      targetScale = '1/60';
    } else if (upperG === 'SD' && (!targetScale || targetScale === 'N/A')) {
      targetScale = 'Non-scale';
    }

    const rawImgInput = req.body.image_url !== undefined ? req.body.image_url : req.body.image;
    const rawImg = rawImgInput !== undefined && rawImgInput !== null && String(rawImgInput).trim() !== ''
      ? String(rawImgInput).trim()
      : current.image_url;
    const shortImgUrl = shortenImageUrl(rawImg, id);

    const parsedPrice = req.body.price !== undefined && req.body.price !== null && !isNaN(parseFloat(req.body.price))
      ? parseFloat(req.body.price)
      : current.price;
    const parsedStock = req.body.stock !== undefined && req.body.stock !== null && !isNaN(parseInt(req.body.stock, 10))
      ? parseInt(req.body.stock, 10)
      : current.stock;

    let resolvedStatus = current.status;
    if (req.body.status !== undefined && req.body.status !== null && String(req.body.status).trim() !== '') {
      resolvedStatus = String(req.body.status).trim();
    } else if (req.body.stock !== undefined) {
      resolvedStatus = parsedStock <= 0 ? 'Out of Stock' : (parsedStock <= 5 ? 'Low Stock' : 'In Stock');
    }

    const updateData = {
      name: req.body.name !== undefined && req.body.name !== null ? String(req.body.name).trim() : current.name,
      grade: targetGrade,
      category: req.body.category !== undefined && req.body.category !== null ? String(req.body.category).trim() : current.category,
      scale: targetScale,
      price: parsedPrice,
      stock: parsedStock,
      image_url: shortImgUrl,
      description: req.body.description !== undefined && req.body.description !== null ? String(req.body.description).trim() : (current.description || ''),
      status: resolvedStatus
    };

    const updateSql = `
      UPDATE products SET
        name = ?, grade = ?, category = ?, scale = ?, price = ?, stock = ?,
        image_url = ?, description = ?, status = ?
      WHERE id = ?
    `;

    const values = [
      updateData.name, updateData.grade, updateData.category, updateData.scale,
      updateData.price, updateData.stock, updateData.image_url, updateData.description,
      updateData.status, id
    ];

    await pool.query(updateSql, values);
    const [refreshed] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: `ปรับปรุงข้อมูลสินค้ารหัส ID ${id} สำเร็จเรียบร้อยแล้ว`,
      data: formatProduct(refreshed[0])
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

    try { await pool.query('SET FOREIGN_KEY_CHECKS = 0'); } catch (_) {}
    try { await pool.query('DELETE FROM order_items WHERE product_id = ?', [id]); } catch (_) {}
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    try { await pool.query('SET FOREIGN_KEY_CHECKS = 1'); } catch (_) {}

    return res.status(200).json({
      success: true,
      message: `ลบสินค้า "${existing[0].name}" (ID: ${id}) ออกจากฐานข้อมูลเรียบร้อยแล้ว`,
      deletedId: parseInt(id, 10)
    });
  } catch (error) {
    try { await pool.query('SET FOREIGN_KEY_CHECKS = 1'); } catch (_) {}
    console.error(`Error deleting product ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบสินค้าออกจากฐานข้อมูล',
      error: error.message
    });
  }
});

module.exports = router;
