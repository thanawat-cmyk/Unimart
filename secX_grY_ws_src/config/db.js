// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: config/db.js
// Description: MySQL Connection Pool Configuration (mysql2/promise)
// ==============================================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// สร้าง Connection Pool สำหรับเชื่อมต่อกับฐานข้อมูล MySQL (ตามสไลด์ Lecture 13)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'unimart_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
