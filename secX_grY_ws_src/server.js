// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: server.js
// หน้าที่: ไฟล์หลัก (Main Entrypoint) ของเซิร์ฟเวอร์ Express.js
//          ทำหน้าที่ตั้งค่า Middleware, ติดตั้ง Route และเปิดการทำงานของ Web Services
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. นำเข้าไลบรารีและโมดูลที่จำเป็น (Import Dependencies)
// ------------------------------------------------------------------------------
const express = require('express'); // เฟรมเวิร์กสำหรับสร้าง REST API และจัดการ HTTP Request
const cors = require('cors');       // มิดเดิลแวร์เปิด Cross-Origin Resource Sharing เพื่อให้เบราว์เซอร์เรียก API ได้ข้าม Port
const path = require('path');       // โมดูลมาตรฐานของ Node.js สำหรับจัดการเส้นทางไฟล์และไดเรกทอรี
require('dotenv').config();          // โหลดค่าตัวแปรสภาพแวดล้อมจากไฟล์ .env เข้าสู่ process.env

// นำเข้าฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล MySQL
const { testConnection } = require('./config/db');

// นำเข้า Route Handlers (ตัวจัดการเส้นทาง API แยกตามแต่ละโดเมนการทำงาน)
const authRoutes = require('./routes/auth');           // เส้นทางเกี่ยวกับการยืนยันตัวตน (Login, Session)
const productRoutes = require('./routes/products');   // เส้นทางจัดการสินค้า (CRUD, ค้นหาหลายเงื่อนไข)
const userRoutes = require('./routes/users');         // เส้นทางจัดการผู้ใช้และแอดมิน (CRUD)
const orderRoutes = require('./routes/orders');       // เส้นทางประวัติคำสั่งซื้อ
const logRoutes = require('./routes/logs');           // เส้นทางประวัติการล็อกอิน (Login Logs)
const publicApiRoutes = require('./routes/publicApi'); // เส้นทางเชื่อมต่อ Public API ภายนอก (อัตราแลกเปลี่ยนเยน JPY/THB)

// ------------------------------------------------------------------------------
// 2. เริ่มต้นแอปพลิเคชัน Express และกำหนด Port
// ------------------------------------------------------------------------------
const app = express();
// อ่านค่า Port จาก .env ถ้าไม่มีให้ใช้ Port 3000 เป็นค่าเริ่มต้น
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------------------------
// 3. กำหนด Middleware ส่วนกลาง (Global Middlewares)
// ------------------------------------------------------------------------------
// 3.1 เปิดให้ Frontend ทุก Origin สามารถเรียก API ได้โดยไม่ติดปัญหา CORS
app.use(cors());

// 3.2 แปลงข้อมูลใน Body ของ HTTP Request ที่เป็น JSON ให้อยู่ในรูป req.body โดยอัตโนมัติ
app.use(express.json());

// 3.3 รองรับการแปลงข้อมูล Form Data จาก HTML ให้อยู่ใน req.body
app.use(express.urlencoded({ extended: true }));

// 3.4 ให้เซิร์ฟเวอร์ Express ให้บริการไฟล์สถิต (Static Files) เช่น HTML, CSS, รูปภาพ จากโฟลเดอร์ secX_grY_fe_src
// ทำให้เวลาเปิด http://localhost:3000 จะสามารถเข้าใช้งานหน้าเว็บ Frontend ได้ทันทีใน Port เดียว
const fePath = path.join(__dirname, '..', 'secX_grY_fe_src');
app.use(express.static(fePath));

// ------------------------------------------------------------------------------
// 4. ติดตั้งเส้นทาง API หลัก (Mount API Routes)
// ------------------------------------------------------------------------------
// ทุกเส้นทางจะขึ้นต้นด้วย /api เพื่อความเป็นระเบียบและเป็นไปตามมาตรฐาน RESTful API
app.use('/api/auth', authRoutes);           // เช่น POST /api/auth/login
app.use('/api/products', productRoutes);   // เช่น GET /api/products, POST /api/products
app.use('/api/users', userRoutes);         // เช่น GET /api/users, PUT /api/users/:id
app.use('/api/orders', orderRoutes);       // เช่น GET /api/orders/user/:userId
app.use('/api/logs', logRoutes);           // เช่น GET /api/logs
app.use('/api/public', publicApiRoutes);   // เช่น GET /api/public/exchange-rate

// ------------------------------------------------------------------------------
// 5. รูทตรวจสอบสถานะระบบและสารบัญ API (Health Check & API Directory)
// ------------------------------------------------------------------------------
// เรียกผ่าน GET http://localhost:3000/api เพื่อดูรายการ Endpoint ทั้งหมดในระบบ
app.get('/api', (req, res) => {
  res.status(200).json({
    project: 'UNIMART Online Gunpla Store Web Services',
    course: 'ITDS242 Web Technologies Lab',
    institution: 'Faculty of ICT, Mahidol University',
    version: '1.0.0',
    status: 'Running & Healthy',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me?username=:username'
      },
      products: {
        getAllOrSearch: 'GET /api/products?q=&grade=&category=&minPrice=&maxPrice=&sortBy=',
        getById: 'GET /api/products/:id',
        insert: 'POST /api/products',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id'
      },
      users: {
        getAllOrSearch: 'GET /api/users?q=&role=&status=',
        getById: 'GET /api/users/:id',
        insert: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      orders: {
        getAll: 'GET /api/orders',
        getByUser: 'GET /api/orders/user/:userId'
      },
      logs: {
        getAll: 'GET /api/logs?status=&username='
      },
      publicApi: {
        exchangeRate: 'GET /api/public/exchange-rate?amount_jpy='
      }
    }
  });
});

// ------------------------------------------------------------------------------
// 6. เริ่มต้นฟังการเชื่อมต่อของเซิร์ฟเวอร์ (Start Express Server)
// ------------------------------------------------------------------------------
app.listen(PORT, async () => {
  console.log(`\n==============================================================================`);
  console.log(`🚀 เซิร์ฟเวอร์ Unimart Web Services เริ่มทำงานแล้วที่: http://localhost:${PORT}`);
  console.log(`🌐 เข้าชมหน้าเว็บหลัก (Frontend): http://localhost:${PORT}/index.html`);
  console.log(`📄 ดูสารบัญ API และสถานะระบบ: http://localhost:${PORT}/api`);
  console.log(`==============================================================================`);
  
  // ทดสอบการเชื่อมต่อกับฐานข้อมูล MySQL ทันทีที่สตาร์ตเซิร์ฟเวอร์
  await testConnection();
});

// ส่งออกอ็อบเจกต์ app เพื่อให้ไฟล์ทดสอบอัตโนมัติ (test-apis.js) สามารถนำไปรัน Unit Test ได้
module.exports = app;
