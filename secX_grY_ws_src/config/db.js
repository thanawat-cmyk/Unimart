// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services
// File: config/db.js
// Description: MySQL Connection Pool Configuration (mysql2/promise)
//              + Auto-Database Setup (secX_grY_database.sql)
//              + Smart In-Memory Fallback so `npm start` + Postman works immediately
// ==============================================================================

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'unimart_db';

// สร้าง Connection Pool สำหรับเชื่อมต่อกับฐานข้อมูล MySQL (ตามสไลด์ Lecture 13)
let activePool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let isMySQLReady = false;
let initAttempted = false;

// ==============================================================================
// 1. ระบบ Auto-Initialize MySQL Database (สร้าง unimart_db และนำเข้า .sql อัตโนมัติ)
// ==============================================================================
async function ensureMySQLInitialized() {
  if (isMySQLReady) return true;
  if (initAttempted) return isMySQLReady;
  initAttempted = true;

  // ลองรหัสผ่านจาก .env ก่อน และถ้ารหัสผ่านไม่ตรง ลองรหัสผ่านมาตรฐานของ XAMPP/MySQL Lab
  const candidatePasswords = [DB_PASSWORD, '', 'root', 'itcs212'];
  const uniquePasswords = [...new Set(candidatePasswords)];

  for (const pwd of uniquePasswords) {
    let adminConn;
    try {
      adminConn = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: pwd,
        connectTimeout: 1500,
        multipleStatements: true
      });

      // ตรวจสอบว่ามีฐานข้อมูลและตารางครบหรือยัง
      await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      await adminConn.query(`USE \`${DB_NAME}\``);

      const [tables] = await adminConn.query(`SHOW TABLES LIKE 'products'`);
      if (tables.length === 0) {
        const sqlFilePath = path.join(__dirname, '..', '..', 'secX_grY_database.sql');
        if (fs.existsSync(sqlFilePath)) {
          const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
          await adminConn.query(sqlScript);
          console.log('[MySQL Auto-Setup] นำเข้าโครงสร้างตารางและข้อมูลเริ่มต้นจาก secX_grY_database.sql สำเร็จ!');
        }
      }

      await adminConn.end();

      // อัปเดต Pool ด้วยรหัสผ่านที่เชื่อมต่อสำเร็จ
      activePool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: pwd,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      isMySQLReady = true;
      return true;
    } catch (err) {
      if (adminConn) {
        try { await adminConn.end(); } catch (_) {}
      }
      // หากไม่ใช่ ER_ACCESS_DENIED_ERROR แปลว่าไม่ได้เปิด MySQL Server ให้ข้ามลูปรหัสผ่านทันที
      if (err.code !== 'ER_ACCESS_DENIED_ERROR') {
        break;
      }
    }
  }

  isMySQLReady = false;
  return false;
}

// ==============================================================================
// 2. ข้อมูลจำลองในหน่วยความจำ (In-Memory Database Fallback ตรงกับ secX_grY_database.sql)
// ช่วยให้ผู้ตรวจหรือเพื่อนที่รัน `npm start` สามารถยิงทดสอบใน Postman ได้ทันทีแม้ไม่ได้เปิด XAMPP
// ==============================================================================
const memoryDB = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', fullname: 'ธนวัฒน์ แสนโบราณ (Admin RakGundam)', email: 'adminrakgundam01@gmail.com', phone: '095-125-1834', age: 21, address: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล ศาลายา นครปฐม 73170', preferences: 'สนใจระบบบริหารจัดการสต็อกกันพลา เกรด Master Grade และ Perfect Grade', role: 'Super Admin', status: 'Active', created_at: '2026-09-01T08:00:00.000Z', updated_at: '2026-09-01T08:00:00.000Z' },
    { id: 2, username: 'nichaphat', password: 'user123', fullname: 'ณิชาภัทร วิชาธรรม', email: 'nichaphat.wic@student.mahidol.ac.th', phone: '081-234-5678', age: 21, address: 'กรุงเทพมหานคร', preferences: 'เน้นโมเดลกันดั้มสเกล 1/144 ซีรีส์ The Witch from Mercury และ Real Grade', role: 'Manager', status: 'Active', created_at: '2026-09-01T08:05:00.000Z', updated_at: '2026-09-01T08:05:00.000Z' },
    { id: 3, username: 'ayosara', password: 'user123', fullname: 'อโยสรา ต้องทรัพย์', email: 'ayosara.ton@student.mahidol.ac.th', phone: '082-345-6789', age: 20, address: 'นนทบุรี', preferences: 'ชื่นชอบโมเดลเกรด High Grade และการทำสีสไตล์ Custom Paint', role: 'Staff', status: 'Active', created_at: '2026-09-01T08:10:00.000Z', updated_at: '2026-09-01T08:10:00.000Z' },
    { id: 4, username: 'khachatorn', password: 'user123', fullname: 'คชาธร ศิริเลิศ', email: 'khachatorn.sir@student.mahidol.ac.th', phone: '083-456-7890', age: 21, address: 'นครปฐม', preferences: 'ชื่นชอบหุ่นรบซีรีส์ Mobile Suit Gundam 00 และงานประกอบ Inner Frame', role: 'Staff', status: 'Active', created_at: '2026-09-01T08:15:00.000Z', updated_at: '2026-09-01T08:15:00.000Z' },
    { id: 5, username: 'thanchanok', password: 'user123', fullname: 'ธัญชนก โรจนสฤษฎิ์', email: 'thanchanok.roj@student.mahidol.ac.th', phone: '084-567-8901', age: 20, address: 'กรุงเทพมหานคร', preferences: 'สนใจอุปกรณ์โมเดล คีมตัดพรีเมียม และปากกาตัดเส้น Gundam Marker', role: 'Staff', status: 'Active', created_at: '2026-09-01T08:20:00.000Z', updated_at: '2026-09-01T08:20:00.000Z' },
    { id: 6, username: 'GundamLover159', password: 'customer123', fullname: 'กันดัม เลิฟเวอร์', email: 'gundamlover159@gmail.com', phone: '098-159-1594', age: 27, address: '159/41 หมู่ 5 ถ.สุขุมวิท ต.บางนา อ.บางนา จ.กรุงเทพมหานคร 10260', preferences: 'เป็นสมาชิกระดับ VIP ชื่นชอบการต่อ MG SEED Series และเก็บสะสม Freedom Gundam', role: 'Customer', status: 'Active', created_at: '2026-09-01T08:30:00.000Z', updated_at: '2026-09-01T08:30:00.000Z' }
  ],
  login_logs: [
    { log_id: 1, user_id: 1, username_attempt: 'admin', login_time: '2026-09-10 09:15:22', ip_address: '127.0.0.1', user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0', status: 'Success' },
    { log_id: 2, user_id: 6, username_attempt: 'GundamLover159', login_time: '2026-09-12 14:30:10', ip_address: '192.168.1.45', user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', status: 'Success' },
    { log_id: 3, user_id: null, username_attempt: 'hacker_test', login_time: '2026-09-13 03:12:44', ip_address: '203.144.144.1', user_agent: 'Python-urllib/3.10', status: 'Failed' },
    { log_id: 4, user_id: 2, username_attempt: 'nichaphat', login_time: '2026-09-14 10:05:00', ip_address: '127.0.0.1', user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0', status: 'Success' },
    { log_id: 5, user_id: 1, username_attempt: 'admin', login_time: '2026-09-15 11:20:18', ip_address: '127.0.0.1', user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0', status: 'Success' }
  ],
  products: [
    { id: 1, name: 'Freedom GUNDAM Ver.2.0', series: 'Mobile Suit Gundam SEED', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 15, release_date: '2024-04-12', rating: 4.9, image_url: 'assets/images/product-freedom.png', description: 'ZGMF-X10A Freedom Gundam ในเวอร์ชัน Master Grade 2.0 โครงสร้างเฟรมสมจริง รายละเอียดปีก Hi-MAT Mode สามารถกางออกได้อย่างสง่างาม พร้อมบีมไรเฟิลและโล่คอมโพสิต', details: 'ชุดประกอบพลาสติกคิทขนาด 1/100 โครงในแบบ Full Inner Frame สติกเกอร์ Realistic Decal พร้อมฐานตั้งฟิกเกอร์ คิระ ยามาโตะ', reference_source: 'Bandai Hobby Site: MG Freedom Gundam Ver.2.0 (Item 0206312) - https://bandai-hobby.net', status: 'In Stock' },
    { id: 2, name: 'Zeta GUNDAM Ver.Ka', series: 'Mobile Suit Zeta Gundam', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 8, release_date: '2023-04-29', rating: 4.8, image_url: 'assets/images/product-freedom.png', description: 'MSZ-006 Zeta Gundam เวอร์ชัน Katoki Hajime สัดส่วนแม่นยำตามอนิเมะ สามารถแปลงร่างเป็น Waverider Mode ได้สมบูรณ์โดยไม่ต้องถอดเปลี่ยนชิ้นส่วน', details: 'โครงสร้างข้อต่อชุบสีเงินพิเศษ โล่ Hyper Mega Launcher และสติกเกอร์ Water Decal ลาย Ver.Ka ครบเซ็ต', reference_source: 'Bandai Hobby Site: MG 1/100 Zeta Gundam Ver.Ka - https://bandai-hobby.net', status: 'In Stock' },
    { id: 3, name: 'ZZ GUNDAM Ver.Ka', series: 'Mobile Suit Gundam ZZ', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 5, release_date: '2023-09-15', rating: 4.7, image_url: 'assets/images/product-freedom.png', description: 'MSZ-010 ZZ Gundam โมเดลขนาดใหญ่ ทรงพลัง มีกลไกการแยกประกอบและรวมร่างเป็น Core Top, Core Base และ G-Fortress ได้ครบถ้วน', details: 'ชิ้นส่วน Extra Finish สีเงินเมทัลลิก ปืน Double Beam Rifle ขนาดใหญ่ และบีมเซเบอร์ทรงพลัง', reference_source: 'Bandai Hobby Site: MG 1/100 ZZ Gundam Ver.Ka - https://bandai-hobby.net', status: 'Low Stock' },
    { id: 4, name: 'Nu GUNDAM Ver.Ka', series: "Mobile Suit Gundam: Char's Counterattack", grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 12, release_date: '2023-11-20', rating: 5.0, image_url: 'assets/images/product-freedom.png', description: 'RX-93 Nu Gundam ผลงานระดับมาสเตอร์พีซ ออกแบบโดย Katoki Hajime โดดเด่นด้วย Fin Funnel 6 ชิ้น และกลไกเปิดเกราะ Psycho-Frame สีเขียวมรกต', details: 'ชิ้นส่วน Die-cast เสริมความมั่นคง ฟินฟันเนลพร้อมฐานจัดแสดงเฉพาะ และดีคอลน้ำพรีเมียม', reference_source: 'Bandai Hobby Site: MG 1/100 Nu Gundam Ver.Ka - https://bandai-hobby.net', status: 'In Stock' },
    { id: 5, name: 'Strike GUNDAM + Aile Striker', series: 'Mobile Suit Gundam SEED', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 20, release_date: '2024-01-10', rating: 4.8, image_url: 'assets/images/product-freedom.png', description: 'GAT-X105 Strike Gundam Ver.RM รีมาสเตอร์ด้วยเทคโนโลยีเฟรมสมัยใหม่ มาพร้อมแพ็ค Aile Striker และ Armor Schneider มีดสั้นพับได้', details: 'ข้อต่อสะโพกขยับกว้างเป็นพิเศษเพื่อท่าโพสแอ็กชันคมชัด พร้อมฐานตั้ง Catapult Deck จำลองยาน Archangel', reference_source: 'Bandai Hobby Site: MG 1/100 Aile Strike Gundam Ver.RM - https://bandai-hobby.net', status: 'In Stock' },
    { id: 6, name: 'GN-001 Gundam Exia', series: 'Mobile Suit Gundam 00', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 9, release_date: '2023-08-05', rating: 4.7, image_url: 'assets/images/product-freedom.png', description: 'กันดั้มผู้เชี่ยวชาญการต่อสู้ระยะประชิดด้วยดาบทั้ง 7 เล่ม (Seven Swords System) สายส่งพลังงาน GN Hologram Ribbon โปร่งแสงสมจริง', details: 'ดาบ GN Sword, GN Long Blade, GN Short Blade, GN Beam Saber x4 และฐานจำลอง GN Drive', reference_source: 'Bandai Hobby Site: MG 1/100 Gundam Exia - https://bandai-hobby.net', status: 'In Stock' },
    { id: 7, name: 'Providence GUNDAM', series: 'Mobile Suit Gundam SEED', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 4, release_date: '2023-06-18', rating: 4.9, image_url: 'assets/images/product-freedom.png', description: 'บอสใหญ่แห่งซีรีส์ SEED กับระบบ DRAGOON System รอบตัว แบ็คแพ็คขนาดมหึมาพร้อมเอฟเฟกต์การยิงบีมรอบทิศทาง', details: 'โครงในดัดแปลงมาจาก Freedom Ver.2.0 ให้ความแข็งแรงยอดเยี่ยม พร้อมเอฟเฟกต์ชิ้นใสสำหรับจัดท่าดรากูน', reference_source: 'Bandai Hobby Site: MG 1/100 Providence Gundam - https://bandai-hobby.net', status: 'Low Stock' },
    { id: 8, name: 'Justice GUNDAM', series: 'Mobile Suit Gundam SEED', grade: 'MG', category: 'gundam', scale: '1/100', price: 1750.00, stock: 7, release_date: '2023-07-22', rating: 4.8, image_url: 'assets/images/product-freedom.png', description: 'ZGMF-X09A Justice Gundam ยูนิตคู่หูของ Freedom โดดเด่นด้วยยานสนับสนุน Fatum-00 บนหลังที่สามารถแยกบินหรือกางขึ้นขี่ได้', details: 'โทนสีชมพูอมม่วงคมชัด บาสเซลเซเบอร์ที่หัวไหล่ และกลไกล็อกฐานสำหรับขึ้นยืนบน Fatum-00', reference_source: 'Bandai Hobby Site: MG 1/100 Justice Gundam - https://bandai-hobby.net', status: 'In Stock' },
    { id: 9, name: 'God GUNDAM (Burning Gundam)', series: 'Mobile Fighter G Gundam', grade: 'RG', category: 'gundam', scale: '1/144', price: 1999.00, stock: 14, release_date: '2024-05-18', rating: 4.9, image_url: 'assets/images/product-god.png', description: 'GF13-017NJII God Gundam พร้อมโหมด Hyper Mode ปีกกางเป็นวงแหวนพลังงานแสงสีทอง มือขวา Bakunetsu God Finger ชิ้นใสสีส้มเปล่งประกาย', details: 'โครง Fighting Action Frame สามารถเตะ ต่อย และโพสท่าศิลปะการต่อสู้ได้อย่างอิสระโดยไม่หลุดหลวม', reference_source: 'Bandai Hobby Site: RG 1/144 God Gundam - https://bandai-hobby.net', status: 'In Stock' },
    { id: 10, name: 'Gundam Barbatos Lupus Rex', series: 'Iron-Blooded Orphans', grade: 'HG', category: 'gundam', scale: '1/144', price: 1450.00, stock: 11, release_date: '2024-02-14', rating: 4.8, image_url: 'assets/images/product-freedom.png', description: 'ร่างสุดยอดของบาร์บาตอส แขนยักษ์ทรงพลัง กรงเล็บสีทอง และหาง Tail Blade พร้อมสายเคเบิลปรับทิศทางได้', details: 'ประกอบง่ายตามมาตรฐาน High Grade พร้อมกระบอง Ultra Large Mace ขนาดยักษ์', reference_source: 'Bandai Hobby Site: HG 1/144 Gundam Barbatos Lupus Rex - https://bandai-hobby.net', status: 'In Stock' },
    { id: 11, name: 'PG Perfect Strike GUNDAM', series: 'Mobile Suit Gundam SEED', grade: 'PG', category: 'gundam', scale: '1/60', price: 8500.00, stock: 2, release_date: '2023-12-01', rating: 5.0, image_url: 'assets/images/hero-banner.png', description: 'สุดยอดโมเดลสเกล 1/60 ติดตั้งแพ็คสไตรเกอร์ครบทั้ง 3 แบบ (Aile + Sword + Launcher) โครงในโลหะหล่อและระบบไฟ LED สมบูรณ์แบบ', details: 'โครงร่าง Inner Frame รายละเอียดสูงพิเศษ ชิ้นส่วนเคลือบโครเมียม และดาบชเวิร์ดเกเบอร์ขนาดยาวกว่า 40 ซม.', reference_source: 'Bandai Hobby Site: PG 1/60 Perfect Strike Gundam - https://bandai-hobby.net', status: 'Low Stock' },
    { id: 12, name: 'RX-78-2 GUNDAM (The Origin)', series: 'Mobile Suit Gundam', grade: 'MG', category: 'gundam', scale: '1/100', price: 1850.00, stock: 6, release_date: '2024-03-30', rating: 4.9, image_url: 'assets/images/about-rx78.png', description: 'กันดั้มปฐมบทเวอร์ชัน The Origin เพิ่มลูกเล่นปืนวัลแคนติดหน้าอก ปืนใหญ่ Shoulder Cannon และเอฟเฟกต์ไฟปากกระบอกปืน', details: 'สามารถเลือกประกอบได้ทั้งรูปแบบ Early Type, Middle Type และ Late Type พร้อมชิ้นส่วนเอฟเฟกต์ใส', reference_source: 'Bandai Hobby Site: MG 1/100 RX-78-02 Gundam (The Origin) - https://bandai-hobby.net', status: 'In Stock' },
    { id: 13, name: 'Action Base 5 Clear Stand', series: 'Official Display Support', grade: 'SD', category: 'parts', scale: 'Universal', price: 350.00, stock: 25, release_date: '2024-01-01', rating: 4.7, image_url: 'assets/images/product-freedom.png', description: 'ฐานตั้งโมเดลสีใส เหมาะสำหรับสเกล 1/144 และ 1/100 ปรับระดับความสูงและมุมก้มเงยได้อย่างอิสระ', details: 'มาพร้อมข้อต่อและแกนยึดหลายรูปแบบ รองรับกันพลาได้เกือบทุกรุ่น ทุกซีรีส์', reference_source: 'Bandai Hobby Site: Action Base 5 Clear - https://bandai-hobby.net', status: 'In Stock' },
    { id: 14, name: 'Gundam Decal Multi-Use (White)', series: 'Detail Up Parts', grade: 'HG', category: 'parts', scale: 'Universal', price: 220.00, stock: 40, release_date: '2024-02-10', rating: 4.6, image_url: 'assets/images/product-freedom.png', description: 'สติกเกอร์ดีคอลน้ำคุณภาพสูง ลายสัญลักษณ์กองทัพ E.F.S.F., Zeon, และตัวเลขมาร์กิ้งสีขาว สำหรับเพิ่มความสมจริง', details: 'แผ่นฟิล์มบางพิเศษ แนบสนิทกับชิ้นงานเมื่อใช้น้ำยาเคลือบดีคอล', reference_source: 'Bandai Hobby Site: Gundam Decal Series - https://bandai-hobby.net', status: 'In Stock' },
    { id: 15, name: 'Bandai Spirits Entry Nipper (Blue)', series: 'Craft Tools', grade: 'Tools', category: 'tools', scale: 'N/A', price: 420.00, stock: 18, release_date: '2024-01-15', rating: 4.8, image_url: 'assets/images/product-god.png', description: 'คีมตัดพลาสติกโมเดลคุณภาพสูง ใบมีดคมบาง ช่วยให้ตัดชิ้นส่วนออกจากแผงรันเนอร์ได้เรียบเนียน ไม่ทิ้งรอยฝ้าขาว', details: 'ด้ามจับหุ้มยางนุ่มกระชับมือ มีสปริงช่วยผ่อนแรงในการตัดต่อเนื่อง', reference_source: 'Bandai Spirits Hobby Tools Catalog - https://bandai-hobby.net', status: 'In Stock' },
    { id: 16, name: 'Gundam Marker Pour-Type (Black)', series: 'Finishing Supplies', grade: 'Tools', category: 'tools', scale: 'N/A', price: 180.00, stock: 35, release_date: '2024-03-01', rating: 4.7, image_url: 'assets/images/product-freedom.png', description: 'ปากกาตัดเส้นชนิดไหล (Pour Type) หมึกสีดำเข้ม เพียงแต้มเบาๆ หมึกจะไหลตามร่องโมเดลโดยอัตโนมัติ', details: 'ลบรอยส่วนเกินได้ง่ายด้วยยางลบหรือแอลกอฮอล์ ให้เส้นคมชัดสมจริงระดับมืออาชีพ', reference_source: 'GSI Creos Mr.Hobby Official - https://www.mr-hobby.com', status: 'In Stock' }
  ],
  orders: [
    { order_id: 1, order_number: 'ORD-25690912-001', user_id: 6, order_date: '2026-09-12 11:20:00', total_amount: 1750.00, shipping_address: '159/41 หมู่ 5 ถ.สุขุมวิท ต.บางนา อ.บางนา จ.กรุงเทพมหานคร 10260', order_status: 'Delivered' }
  ],
  order_items: [
    { item_id: 1, order_id: 1, product_id: 1, quantity: 1, unit_price: 1750.00 }
  ]
};

// ประมวลผลคำสั่ง SQL บน In-Memory DB กรณีเครื่องไม่ได้รัน MySQL Server
function executeInMemoryQuery(sql, params = []) {
  const cleanSql = sql.replace(/\s+/g, ' ').trim();
  const upperSql = cleanSql.toUpperCase();

  // ----------------------------------------------------------------------------
  // A. ตาราง users
  // ----------------------------------------------------------------------------
  if (upperSql.includes('FROM USERS')) {
    // 1. SELECT ... FROM users WHERE username = ? OR email = ?
    if (upperSql.includes('WHERE USERNAME = ? OR EMAIL = ?')) {
      const u = String(params[0] || '').toLowerCase();
      const e = String(params[1] || '').toLowerCase();
      const rows = memoryDB.users.filter(
        item => item.username.toLowerCase() === u || item.email.toLowerCase() === e
      );
      return [rows, []];
    }

    // 2. SELECT ... FROM users WHERE username = ?
    if (upperSql.includes('WHERE USERNAME = ?')) {
      const u = String(params[0] || '').toLowerCase();
      const rows = memoryDB.users.filter(item => item.username.toLowerCase() === u);
      return [rows.map(r => ({ ...r })), []];
    }

    // 3. SELECT ... FROM users WHERE id = ?
    if (upperSql.includes('WHERE ID = ?')) {
      const targetId = Number(params[0]);
      const rows = memoryDB.users.filter(item => Number(item.id) === targetId);
      return [rows.map(r => ({ ...r })), []];
    }

    // 4. SELECT ... FROM users WHERE 1=1 (Search & Filter)
    if (upperSql.includes('WHERE 1=1')) {
      let rows = memoryDB.users.map(r => ({ ...r }));
      let idx = 0;

      if (upperSql.includes('FULLNAME LIKE ?')) {
        const kw = String(params[idx] || '').replace(/%/g, '').toLowerCase();
        idx += 3;
        rows = rows.filter(u =>
          (u.fullname || '').toLowerCase().includes(kw) ||
          (u.username || '').toLowerCase().includes(kw) ||
          (u.email || '').toLowerCase().includes(kw)
        );
      }
      if (upperSql.includes('AND ROLE = ?')) {
        const role = String(params[idx++] || '').toLowerCase();
        rows = rows.filter(u => (u.role || '').toLowerCase() === role);
      }
      if (upperSql.includes('AND STATUS = ?')) {
        const status = String(params[idx++] || '').toLowerCase();
        rows = rows.filter(u => (u.status || '').toLowerCase() === status);
      }
      rows.sort((a, b) => a.id - b.id);
      return [rows, []];
    }
  }

  if (upperSql.startsWith('INSERT INTO USERS')) {
    const nextId = memoryDB.users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1;
    const now = new Date().toISOString();
    const newUser = {
      id: nextId,
      username: params[0],
      password: params[1],
      fullname: params[2],
      email: params[3],
      phone: params[4],
      age: params[5],
      address: params[6],
      preferences: params[7],
      role: params[8] || 'Staff',
      status: params[9] || 'Active',
      created_at: now,
      updated_at: now
    };
    memoryDB.users.push(newUser);
    return [{ insertId: nextId, affectedRows: 1 }, []];
  }

  if (upperSql.startsWith('UPDATE USERS SET')) {
    const targetId = Number(params[9]);
    const idx = memoryDB.users.findIndex(u => Number(u.id) === targetId);
    if (idx !== -1) {
      memoryDB.users[idx] = {
        ...memoryDB.users[idx],
        fullname: params[0],
        email: params[1],
        phone: params[2],
        age: params[3],
        address: params[4],
        preferences: params[5],
        role: params[6],
        status: params[7],
        password: params[8],
        updated_at: new Date().toISOString()
      };
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  if (upperSql.startsWith('DELETE FROM USERS WHERE ID = ?')) {
    const targetId = Number(params[0]);
    const before = memoryDB.users.length;
    memoryDB.users = memoryDB.users.filter(u => Number(u.id) !== targetId);
    return [{ affectedRows: before - memoryDB.users.length }, []];
  }

  // ----------------------------------------------------------------------------
  // B. ตาราง products
  // ----------------------------------------------------------------------------
  if (upperSql.includes('FROM PRODUCTS')) {
    if (upperSql.includes('WHERE ID = ?')) {
      const targetId = Number(params[0]);
      const rows = memoryDB.products.filter(p => Number(p.id) === targetId);
      return [rows.map(r => ({ ...r })), []];
    }

    if (upperSql.includes('WHERE 1=1')) {
      let rows = memoryDB.products.map(r => ({ ...r }));
      let idx = 0;

      if (upperSql.includes('NAME LIKE ?')) {
        const kw = String(params[idx] || '').replace(/%/g, '').toLowerCase();
        idx += 3;
        rows = rows.filter(p =>
          (p.name || '').toLowerCase().includes(kw) ||
          (p.series || '').toLowerCase().includes(kw) ||
          (p.description || '').toLowerCase().includes(kw)
        );
      }
      if (upperSql.includes('AND GRADE = ?')) {
        const g = String(params[idx++] || '').toLowerCase();
        rows = rows.filter(p => (p.grade || '').toLowerCase() === g);
      }
      if (upperSql.includes('AND CATEGORY = ?')) {
        const c = String(params[idx++] || '').toLowerCase();
        rows = rows.filter(p => (p.category || '').toLowerCase() === c);
      }
      if (upperSql.includes('AND PRICE >= ?')) {
        const minP = Number(params[idx++]);
        rows = rows.filter(p => Number(p.price) >= minP);
      }
      if (upperSql.includes('AND PRICE <= ?')) {
        const maxP = Number(params[idx++]);
        rows = rows.filter(p => Number(p.price) <= maxP);
      }
      if (upperSql.includes('AND STATUS = ?')) {
        const st = String(params[idx++] || '').toLowerCase();
        rows = rows.filter(p => (p.status || '').toLowerCase() === st);
      }

      if (upperSql.includes('ORDER BY PRICE ASC')) {
        rows.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (upperSql.includes('ORDER BY PRICE DESC')) {
        rows.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (upperSql.includes('ORDER BY RATING DESC')) {
        rows.sort((a, b) => Number(b.rating) - Number(a.rating));
      } else if (upperSql.includes('ORDER BY RELEASE_DATE DESC')) {
        rows.sort((a, b) => String(b.release_date).localeCompare(String(a.release_date)) || (b.id - a.id));
      } else if (upperSql.includes('ORDER BY NAME ASC')) {
        rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      } else {
        rows.sort((a, b) => a.id - b.id);
      }

      return [rows, []];
    }
  }

  if (upperSql.startsWith('INSERT INTO PRODUCTS')) {
    const nextId = memoryDB.products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
    const newProd = {
      id: nextId,
      name: params[0],
      series: params[1],
      grade: params[2],
      category: params[3],
      scale: params[4],
      price: params[5],
      stock: params[6],
      release_date: params[7],
      rating: params[8],
      image_url: params[9],
      description: params[10],
      details: params[11],
      reference_source: params[12],
      status: params[13]
    };
    memoryDB.products.push(newProd);
    return [{ insertId: nextId, affectedRows: 1 }, []];
  }

  if (upperSql.startsWith('UPDATE PRODUCTS SET')) {
    const targetId = Number(params[14]);
    const idx = memoryDB.products.findIndex(p => Number(p.id) === targetId);
    if (idx !== -1) {
      memoryDB.products[idx] = {
        ...memoryDB.products[idx],
        name: params[0],
        series: params[1],
        grade: params[2],
        category: params[3],
        scale: params[4],
        price: params[5],
        stock: params[6],
        release_date: params[7],
        rating: params[8],
        image_url: params[9],
        description: params[10],
        details: params[11],
        reference_source: params[12],
        status: params[13]
      };
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  if (upperSql.startsWith('DELETE FROM PRODUCTS WHERE ID = ?')) {
    const targetId = Number(params[0]);
    const before = memoryDB.products.length;
    memoryDB.products = memoryDB.products.filter(p => Number(p.id) !== targetId);
    return [{ affectedRows: before - memoryDB.products.length }, []];
  }

  // ----------------------------------------------------------------------------
  // C. ตาราง login_logs
  // ----------------------------------------------------------------------------
  if (upperSql.startsWith('INSERT INTO LOGIN_LOGS')) {
    const nextLogId = memoryDB.login_logs.reduce((max, l) => Math.max(max, Number(l.log_id) || 0), 0) + 1;
    memoryDB.login_logs.unshift({
      log_id: nextLogId,
      user_id: params[0],
      username_attempt: params[1],
      login_time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ip_address: params[2],
      user_agent: params[3],
      status: params[4]
    });
    return [{ insertId: nextLogId, affectedRows: 1 }, []];
  }

  if (upperSql.includes('FROM LOGIN_LOGS')) {
    let rows = memoryDB.login_logs.map(r => ({ ...r }));
    let idx = 0;
    if (upperSql.includes('AND STATUS = ?')) {
      const st = String(params[idx++] || '').toLowerCase();
      rows = rows.filter(l => (l.status || '').toLowerCase() === st);
    }
    if (upperSql.includes('AND USERNAME_ATTEMPT LIKE ?')) {
      const kw = String(params[idx++] || '').replace(/%/g, '').toLowerCase();
      rows = rows.filter(l => (l.username_attempt || '').toLowerCase().includes(kw));
    }
    return [rows, []];
  }

  // ----------------------------------------------------------------------------
  // D. ตาราง orders & order_items
  // ----------------------------------------------------------------------------
  if (upperSql.includes('FROM ORDERS WHERE USER_ID = ?')) {
    const targetUserId = Number(params[0]);
    const rows = memoryDB.orders.filter(o => Number(o.user_id) === targetUserId).map(r => ({ ...r }));
    return [rows, []];
  }

  if (upperSql.includes('FROM ORDER_ITEMS OI')) {
    const targetOrderId = Number(params[0]);
    const rows = memoryDB.order_items
      .filter(oi => Number(oi.order_id) === targetOrderId)
      .map(oi => {
        const prod = memoryDB.products.find(p => Number(p.id) === Number(oi.product_id)) || {};
        return {
          ...oi,
          product_name: prod.name || 'Freedom GUNDAM Ver.2.0',
          product_image: prod.image_url || 'assets/images/product-freedom.png'
        };
      });
    return [rows, []];
  }

  if (upperSql.includes('FROM ORDERS O JOIN USERS U')) {
    const rows = memoryDB.orders.map(o => {
      const u = memoryDB.users.find(user => Number(user.id) === Number(o.user_id)) || {};
      return {
        ...o,
        customer_name: u.fullname || 'กันดัม เลิฟเวอร์',
        customer_email: u.email || 'gundamlover159@gmail.com'
      };
    });
    return [rows, []];
  }

  return [[], []];
}

// ==============================================================================
// 3. Smart Database Interface (ใช้ MySQL จริงเป็นหลัก + Fallback อัตโนมัติเมื่อไม่ได้เปิด MySQL)
// ==============================================================================
const smartPool = {
  async query(sql, params = []) {
    try {
      await ensureMySQLInitialized();
      if (isMySQLReady) {
        return await activePool.query(sql, params);
      }
    } catch (err) {
      isMySQLReady = false;
    }
    return executeInMemoryQuery(sql, params);
  },

  async getConnection() {
    const ready = await ensureMySQLInitialized();
    if (ready) {
      return await activePool.getConnection();
    }
    // คืน Mock Connection พร้อมระบุโหมด In-Memory Fallback
    return {
      isFallback: true,
      release() {}
    };
  }
};

module.exports = smartPool;
