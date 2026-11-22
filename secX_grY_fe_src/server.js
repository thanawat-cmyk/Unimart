// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 1 & 4: Front-end Server
// File: server.js
// Description: Dedicated Front-end Express Server (runs separately from Web Service Server)
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
module.paths.push(path.join(__dirname, '..', 'secX_grY_ws_src', 'node_modules'));

// Auto-install dependencies หากคนที่โหลดโปรเจกต์ไปเปิดใน VS Code แล้วกด npm start ทันทีโดยยังไม่ได้รัน npm install
if (!fs.existsSync(path.join(__dirname, 'node_modules', 'express')) && !fs.existsSync(path.join(__dirname, '..', 'secX_grY_ws_src', 'node_modules', 'express'))) {
  console.log('📦 [Auto-Setup] กำลังติดตั้ง Dependencies (npm install) สำหรับ Front-end Server อัตโนมัติ...');
  try {
    execSync('npm install', { cwd: __dirname, stdio: 'inherit' });
  } catch (e) {
    console.warn('กรุณารันคำสั่ง npm install ในโฟลเดอร์ secX_grY_fe_src:', e.message);
  }
}

const express = require('express');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

const app = express();
const router = express.Router();

// กำหนดพอร์ตสำหรับ Front-end Server (ค่าเริ่มต้น Port 3100 ตามสไลด์ CORS Lecture 13)
// แยกกับ Web Service Server ที่รันบน Port 3000
const PORT = process.env.FE_PORT || process.env.PORT || 3100;

// เสิร์ฟไฟล์ Static (HTML, CSS, JS, Images) ในโฟลเดอร์ secX_grY_fe_src (ตามสไลด์ Lecture 10)
app.use(express.static(path.join(__dirname)));

// ==============================================================================
// Routing สำหรับแต่ละหน้าเว็บด้วย express.Router() และ res.sendFile() (ตามสไลด์ Lecture 10)
// ==============================================================================

// 1. หน้าแรก (Home Page)
router.get(['/', '/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. หน้าเข้าสู่ระบบ (Login Page)
router.get(['/login', '/login.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 3. หน้าค้นหาสินค้า (Search & Catalog Page)
router.get(['/search', '/search.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'search.html'));
});

// 4. หน้ารายละเอียดสินค้า (Product Detail Page)
router.get(['/product-detail', '/product-detail.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'product-detail.html'));
});

// 5. หน้าจัดการสินค้าสำหรับแอดมิน (Admin Product Management)
router.get(['/admin-products', '/admin-products.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-products.html'));
});

// 6. หน้าจัดการผู้ใช้งานสำหรับแอดมิน (Admin User Management)
router.get(['/admin-users', '/admin-users.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-users.html'));
});

// 7. หน้าโปรไฟล์แอดมิน (Admin Profile)
router.get(['/admin-profile', '/admin-profile.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-profile.html'));
});

// 8. หน้าโปรไฟล์ลูกค้า (Customer Profile)
router.get(['/profile', '/profile.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// 9. หน้าเกี่ยวกับเรา (About Us)
router.get(['/about', '/about.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

// 10. หน้าสมาชิกผู้จัดทำ (Team Page)
router.get(['/teampage', '/teampage.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'teampage.html'));
});

app.use('/', router);

// 404 Error Handling สำหรับหน้าที่ไม่พบ (ตามสไลด์ Lecture 10)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// ฟังก์ชันหา IP Address ของเครื่องคอมพิวเตอร์ในวงแลน/Wi-Fi สำหรับเปิดผ่านโทรศัพท์มือถือ
function getLocalIpAddress() {
  try {
    const os = require('os');
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  } catch (_) {}
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  console.log('==============================================================================');
  console.log(`🌐 Unimart Front-end Server (บนคอมพิวเตอร์): http://localhost:${PORT}`);
  console.log(`📱 เปิดผ่านโทรศัพท์มือถือ (ต่อ Wi-Fi เดียวกัน): http://${localIp}:${PORT}`);
  console.log(`🔗 Connecting to Web Service Server at: http://${localIp}:3000/api`);
  console.log('==============================================================================');
});
