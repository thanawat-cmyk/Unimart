// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3: RESTful Web Services
// ไฟล์: config/db.js
// หน้าที่: จัดการการเชื่อมต่อกับฐานข้อมูล MySQL ด้วย Connection Pool
//          พร้อมระบบตรวจสอบและ Fallback อัจฉริยะ (ช่วยให้ทดสอบโค้ดได้แม้ MySQL ยังไม่เปิด)
// ==============================================================================

// นำเข้าไลบรารี mysql2 แบบ Promise-based เพื่อให้สามารถใช้คำสั่ง async/await ได้อย่างสะดวก
const mysql = require('mysql2/promise');
require('dotenv').config();

// กำหนดการตั้งค่าสำหรับการเชื่อมต่อ MySQL (อ่านค่าจาก .env หรือใช้ค่าเริ่มต้น)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',                  // ที่อยู่ของฐานข้อมูล (ปกติคือ localhost หรือ 127.0.0.1)
  port: parseInt(process.env.DB_PORT || '3306', 10),         // Port เริ่มต้นของ MySQL (3306)
  user: process.env.DB_USER || 'root',                       // บัญชีผู้ใช้ฐานข้อมูล (ค่าเริ่มต้นของ XAMPP/MySQL คือ root)
  password: process.env.DB_PASSWORD || '',                   // รหัสผ่านฐานข้อมูล (ค่าเริ่มต้นของ XAMPP มักเป็นค่าว่าง)
  database: process.env.DB_NAME || 'unimart_db',             // ชื่อฐานข้อมูลของโครงงาน
  waitForConnections: true,                                  // หากคิวเชื่อมต่อเต็ม ให้รอจนกว่าจะมี Connection ว่าง
  connectionLimit: 10,                                       // จำนวนการเชื่อมต่อสูงสุดพร้อมกันใน Pool (10 connections)
  queueLimit: 0,                                             // จำนวนคำขอสูงสุดในคิว (0 = ไม่จำกัด)
  enableKeepAlive: true,                                     // รักษาการเชื่อมต่อไม่ให้หลุดอัตโนมัติ
  keepAliveInitialDelay: 0
};

// สร้าง Connection Pool สำหรับจัดสรรการเชื่อมต่อ MySQL เพื่อประสิทธิภาพสูง
const pool = mysql.createPool(dbConfig);

// ตัวแปรสถานะ: เก็บว่าปัจจุบันระบบสามารถเชื่อมต่อกับ MySQL ได้จริงหรือไม่
let isConnected = false;

/**
 * ฟังก์ชันทดสอบการเชื่อมต่อกับฐานข้อมูล MySQL (testConnection)
 * ทำงานเมื่อเซิร์ฟเวอร์เริ่มสตาร์ต เพื่อตรวจสอบว่า MySQL เปิดอยู่และเข้าถึงฐานข้อมูล unimart_db ได้หรือไม่
 * @returns {Promise<boolean>} คืนค่า true หากเชื่อมต่อสำเร็จ, false หากไม่สำเร็จ
 */
async function testConnection() {
  try {
    // ขอยืม Connection จาก Pool มาทดสอบ 1 ช่อง
    const connection = await pool.getConnection();
    console.log(`[MySQL] เชื่อมต่อกับฐานข้อมูล "${dbConfig.database}" สำเร็จ ที่ ${dbConfig.host}:${dbConfig.port}`);
    isConnected = true;
    
    // คืน Connection กลับเข้าสู่ Pool เพื่อให้คำขออื่นใช้งานต่อได้
    connection.release();
    return true;
  } catch (error) {
    // กรณีที่ยังไม่ได้เปิด MySQL Service หรือยังไม่ได้ Import ไฟล์ secX_grY_database.sql
    isConnected = false;
    console.warn(`\n==============================================================================`);
    console.warn(`[MySQL ข้อความแจ้งเตือน] ไม่สามารถเชื่อมต่อกับ MySQL Server ได้ที่ (${dbConfig.host}:${dbConfig.port})`);
    console.warn(`สาเหตุ: ${error.message}`);
    console.warn(`------------------------------------------------------------------------------`);
    console.warn(`ขั้นตอนเพื่อใช้งานฐานข้อมูลจริง:`);
    console.warn(`  1. เปิดโปรแกรม MySQL Server (เช่น กด Start โมดูล MySQL ใน XAMPP Control Panel)`);
    console.warn(`  2. นำเข้าไฟล์ "secX_grY_database.sql" เข้าสู่ MySQL เพื่อสร้างฐานข้อมูล "unimart_db"`);
    console.warn(`  3. ตรวจสอบไฟล์ .env หากรหัสผ่าน root ไม่ใช่ค่าว่าง`);
    console.warn(`* หมายเหตุ: ระบบเซิร์ฟเวอร์จะสลับไปใช้ In-Memory Fallback อัตโนมัติ เพื่อให้หน้าเว็บและ API`);
    console.warn(`  ทุกตัวสามารถกดทดสอบ ค้นหา เพิ่ม ลบ แก้ไข ได้ 100% โดยไม่เกิดข้อผิดพลาดค้าง!`);
    console.warn(`==============================================================================\n`);
    return false;
  }
}

// ส่งออกอ็อบเจกต์และฟังก์ชันเพื่อให้ Route ต่าง ๆ นำไปใช้คิวรีข้อมูล
module.exports = {
  pool,                                     // Connection pool สำหรับรันคำสั่ง SQL เช่น pool.query('SELECT ...')
  testConnection,                           // ฟังก์ชันทดสอบการเชื่อมต่อ
  isDbConnected: () => isConnected,         // ฟังก์ชันอ่านสถานะว่า MySQL กำลังเชื่อมต่ออยู่หรือไม่
  dbConfig                                  // ค่าการตั้งค่าฐานข้อมูล
};
