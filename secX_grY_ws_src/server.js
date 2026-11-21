// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: server.js
// Description: Main Web Service Server Entrypoint (Express Framework + CORS + MySQL)
// ==============================================================================

const path = require('path');
module.paths.push(path.join(__dirname, '..', 'secX_grY_fe_src', 'node_modules'));
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const logRoutes = require('./routes/logs');
const publicApiRoutes = require('./routes/publicApi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares & CORS (อนุญาตให้ Front-end Server บน Port 3100 และ Postman เรียกใช้ Web Services ได้ ตามสไลด์ Lecture 13)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Mount Web Services API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/public', publicApiRoutes);

// Root Health & API Directory Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'ITDS242 Web Services API - UNIMART Gunpla Store',
    status: 'ONLINE',
    endpoints: {
      auth: '/api/auth/login',
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      logs: '/api/logs',
      publicApi: '/api/public/exchange-rate'
    }
  });
});

// Serve Static Frontend Files as convenience fallback if someone opens http://localhost:3000 directly
const fePath = path.join(__dirname, '..', 'secX_grY_fe_src');
app.use(express.static(fePath));

// Start Web Service Server & Verify Database Connection
app.listen(PORT, async () => {
  console.log('==============================================================================');
  console.log(`🚀 Unimart Web Service Server running at: http://localhost:${PORT}`);
  console.log(`📡 Postman API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Separate Front-end Server URL: http://localhost:3100`);
  console.log('==============================================================================');

  try {
    const connection = await pool.getConnection();
    if (connection && connection.isFallback) {
      console.log('⚡ [Database Ready] ไม่พบ MySQL Server ที่เปิดอยู่ -> เปิดโหมด In-Memory SQL Database อัตโนมัติ!');
      console.log('✅ สามารถยิงทดสอบ API ทุกเส้นใน Postman (GET / POST / PUT / DELETE) ได้ทันที 100%');
    } else {
      console.log('✅ [MySQL Connected] เชื่อมต่อและเตรียมฐานข้อมูล unimart_db สำเร็จเรียบร้อยแล้ว!');
    }
    if (connection && connection.release) connection.release();
  } catch (err) {
    console.warn('[MySQL แจ้งเตือน]:', err.message);
  }
});
