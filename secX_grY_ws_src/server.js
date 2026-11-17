// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: server.js
// Description: Main Server Entrypoint (Express Framework)
// ==============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

// Middlewares (ตามสไลด์ Lecture 10 & 13)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve Static Frontend Files (ตามสไลด์ Lecture 10)
const fePath = path.join(__dirname, '..', 'secX_grY_fe_src');
app.use(express.static(fePath));

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

// Start Server & Test Database Connection
app.listen(PORT, async () => {
  console.log('==============================================================================');
  console.log(`🚀 Unimart Web Services Server running at: http://localhost:${PORT}`);
  console.log(`🌐 Frontend Web: http://localhost:${PORT}/index.html`);
  console.log(`📡 API Directory: http://localhost:${PORT}/api`);
  console.log('==============================================================================');

  try {
    const connection = await pool.getConnection();
    console.log('[MySQL] เชื่อมต่อกับฐานข้อมูล unimart_db สำเร็จแล้ว');
    connection.release();
  } catch (err) {
    console.warn('[MySQL แจ้งเตือน] ไม่สามารถเชื่อมต่อกับ MySQL ได้:', err.message);
    console.warn('กรุณาเปิดโปรแกรม XAMPP และกด Start โมดูล MySQL เพื่อใช้งานฐานข้อมูลจริง');
  }
});
