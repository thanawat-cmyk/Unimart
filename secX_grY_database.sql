-- ==============================================================================
-- Faculty of Information and Communication Technology, Mahidol University
-- ITDS242 Web Technologies Lab - Course Project
-- Task 2: Database Schema & Seed Data (MySQL)
-- File: secX_grY_database.sql
-- Project: UNIMART (Online Gunpla & Hobby Supplies Store)
-- Team Members:
--   1. 6887018 ณิชาภัทร วิชาธรรม
--   2. 6887063 อโยสรา ต้องทรัพย์
--   3. 6887025 ธนวัฒน์ แสนโบราณ
--   4. 6887071 คชาธร ศิริเลิศ
--   5. 6887077 ธัญชนก โรจนสฤษฎิ์
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- ------------------------------------------------------------------------------
-- 1. DATABASE INITIALIZATION
-- ------------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `unimart_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `unimart_db`;

-- Drop existing tables if needed (in reverse dependency order)
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `login_logs`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- ------------------------------------------------------------------------------
-- 2. TABLE: users (ข้อมูลผู้ดูแลระบบ และผู้ใช้งานระบบ)
-- ตรงตามข้อกำหนดเกณฑ์ข้อ 1 & 2:
--   - ชื่อ-นามสกุล (fullname)
--   - ที่อยู่ (address)
--   - อายุ (age)
--   - ความต้องการ/ความสนใจ (preferences)
--   - อีเมล (email)
--   - ข้อมูลการเข้าสู่ระบบ: username, password
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ชื่อผู้เข้าใช้',
  `password` VARCHAR(255) NOT NULL COMMENT 'รหัสผ่าน (รองรับแฮช bcrypt หรือสตริงทดสอบ)',
  `fullname` VARCHAR(100) NOT NULL COMMENT 'ชื่อ - นามสกุลจริง',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT 'ที่อยู่อีเมล',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ติดต่อ',
  `age` INT(3) DEFAULT NULL COMMENT 'อายุ (ตามเกณฑ์อาจารย์ข้อ 1)',
  `address` TEXT DEFAULT NULL COMMENT 'ที่อยู่ (ตามเกณฑ์อาจารย์ข้อ 1)',
  `preferences` TEXT DEFAULT NULL COMMENT 'ความต้องการ/ความสนใจเฉพาะ (ตามเกณฑ์อาจารย์ข้อ 1)',
  `role` ENUM('Super Admin', 'Manager', 'Staff', 'Customer') NOT NULL DEFAULT 'Customer' COMMENT 'สิทธิ์การใช้งาน',
  `status` ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active' COMMENT 'สถานะบัญชี',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างบัญชี',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่อัปเดตล่าสุด',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABLE: login_logs (บันทึกประวัติการเข้าสู่ระบบ)
-- ตรงตามข้อกำหนดเกณฑ์ข้อ 2: "บันทึกการเข้าสู่ระบบ"
-- ------------------------------------------------------------------------------
CREATE TABLE `login_logs` (
  `log_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL COMMENT 'รหัสผู้ใช้ที่ล็อกอิน (ถ้ามี)',
  `username_attempt` VARCHAR(50) NOT NULL COMMENT 'Username ที่ใช้พยายามเข้าสู่ระบบ',
  `login_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'เวลาที่เข้าสู่ระบบ',
  `ip_address` VARCHAR(45) NOT NULL DEFAULT '127.0.0.1' COMMENT 'IP Address ของไคลเอนต์',
  `user_agent` TEXT DEFAULT NULL COMMENT 'ข้อมูลเบราว์เซอร์หรืออุปกรณ์',
  `status` ENUM('Success', 'Failed') NOT NULL DEFAULT 'Success' COMMENT 'ผลลัพธ์การเข้าสู่ระบบ',
  PRIMARY KEY (`log_id`),
  KEY `fk_login_user` (`user_id`),
  CONSTRAINT `fk_login_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABLE: categories (หมวดหมู่สินค้าและบริการ)
-- ------------------------------------------------------------------------------
CREATE TABLE `categories` (
  `category_id` VARCHAR(30) NOT NULL,
  `category_name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABLE: products (ข้อมูลสินค้าโมเดลกันพลาและอุปกรณ์)
-- ตรงตามข้อกำหนดเกณฑ์ข้อ 3:
--   - ข้อมูลสินค้าที่มีความหมาย
--   - รองรับการค้นหาตาม Grade, Category, Price Range, Status
-- ------------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL COMMENT 'ชื่อโมเดลกันพลา/สินค้า',
  `series` VARCHAR(100) NOT NULL DEFAULT 'Universal Century' COMMENT 'ซีรีส์ของกันดั้ม',
  `grade` VARCHAR(20) NOT NULL COMMENT 'เกรดสินค้า เช่น RG, MG, HG, PG, Tools',
  `category` VARCHAR(30) NOT NULL COMMENT 'หมวดหมู่ เชื่อมโยงกับ categories',
  `scale` VARCHAR(20) DEFAULT '1/100' COMMENT 'สัดส่วนโมเดล เช่น 1/144, 1/100, 1/60',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'ราคาสินค้า (บาท)',
  `stock` INT(11) NOT NULL DEFAULT 0 COMMENT 'จำนวนสินค้าคงคลัง',
  `release_date` DATE DEFAULT NULL COMMENT 'วันวางจำหน่ายอย่างเป็นทางการ',
  `rating` DECIMAL(2,1) DEFAULT 4.5 COMMENT 'คะแนนรีวิวเฉลี่ย (1.0 - 5.0)',
  `image_url` VARCHAR(255) NOT NULL DEFAULT 'assets/images/product-freedom.png' COMMENT 'ที่อยู่ไฟล์รูปภาพสินค้า',
  `description` TEXT DEFAULT NULL COMMENT 'คำอธิบายสินค้าจุดเด่น',
  `details` TEXT DEFAULT NULL COMMENT 'รายละเอียดอุปกรณ์ในกล่องและโครงสร้าง',
  `reference_source` VARCHAR(255) DEFAULT NULL COMMENT 'แหล่งอ้างอิงข้อมูลลิขสิทธิ์แท้ (Citations)',
  `status` ENUM('In Stock', 'Low Stock', 'Out of Stock') NOT NULL DEFAULT 'In Stock' COMMENT 'สถานะสินค้า',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_prod_cat` (`category`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABLE: orders (ข้อมูลคำสั่งซื้อสินค้า รองรับหน้า Profile ลูกค้า)
-- ------------------------------------------------------------------------------
CREATE TABLE `orders` (
  `order_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'รหัสคำสั่งซื้อ เช่น ORD-25690912-001',
  `user_id` INT(11) NOT NULL COMMENT 'รหัสลูกค้าผู้สั่งซื้อ',
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สั่งซื้อ',
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'ยอดรวมสุทธิ',
  `shipping_address` TEXT NOT NULL COMMENT 'ที่อยู่จัดส่ง',
  `order_status` ENUM('Pending', 'Processing', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Delivered' COMMENT 'สถานะคำสั่งซื้อ',
  PRIMARY KEY (`order_id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABLE: order_items (รายการสินค้าในคำสั่งซื้อ)
-- ------------------------------------------------------------------------------
CREATE TABLE `order_items` (
  `item_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `product_id` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `fk_item_order` (`order_id`),
  KEY `fk_item_product` (`product_id`),
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 8. SEED DATA (ข้อมูลเริ่มต้นที่มีความหมายตามเกณฑ์อาจารย์)
-- ==============================================================================

-- 8.1 ข้อมูลหมวดหมู่ (Categories)
INSERT INTO `categories` (`category_id`, `category_name`, `description`) VALUES
('gundam', 'Gundam Model Kits', 'โมเดลกันพลาพลาสติกคิทแท้มาตรฐาน Bandai ทั้งเกรด RG, MG, HG, PG'),
('parts', 'Custom & Option Parts', 'พาร์ทเสริม ฐานตั้งโมเดล Action Base สติกเกอร์ดีคอลน้ำ และอุปกรณ์ตกแต่ง'),
('tools', 'Modelling & Craft Tools', 'เครื่องมือและอุปกรณ์ประกอบโมเดล คีมตัด ปากกาตัดเส้น และแผ่นรองตัด');

-- 8.2 ข้อมูลผู้ดูแลระบบและผู้ใช้งาน (Users)
-- ประกอบด้วยสมาชิกกลุ่มทั้ง 5 คน, บัญชีแอดมินกลาง, และบัญชีลูกค้า GundamLover159
INSERT INTO `users` (`id`, `username`, `password`, `fullname`, `email`, `phone`, `age`, `address`, `preferences`, `role`, `status`) VALUES
(1, 'admin', 'admin123', 'ธนวัฒน์ แสนโบราณ (Admin RakGundam)', 'adminrakgundam01@gmail.com', '095-125-1834', 21, 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล ศาลายา นครปฐม 73170', 'สนใจระบบบริหารจัดการสต็อกกันพลา เกรด Master Grade และ Perfect Grade', 'Super Admin', 'Active'),
(2, 'nichaphat', 'user123', 'ณิชาภัทร วิชาธรรม', 'nichaphat.wic@student.mahidol.ac.th', '081-234-5678', 21, 'กรุงเทพมหานคร', 'เน้นโมเดลกันดั้มสเกล 1/144 ซีรีส์ The Witch from Mercury และ Real Grade', 'Manager', 'Active'),
(3, 'ayosara', 'user123', 'อโยสรา ต้องทรัพย์', 'ayosara.ton@student.mahidol.ac.th', '082-345-6789', 20, 'นนทบุรี', 'ชื่นชอบโมเดลเกรด High Grade และการทำสีสไตล์ Custom Paint', 'Staff', 'Active'),
(4, 'khachatorn', 'user123', 'คชาธร ศิริเลิศ', 'khachatorn.sir@student.mahidol.ac.th', '083-456-7890', 21, 'นครปฐม', 'ชื่นชอบหุ่นรบซีรีส์ Mobile Suit Gundam 00 และงานประกอบ Inner Frame', 'Staff', 'Active'),
(5, 'thanchanok', 'user123', 'ธัญชนก โรจนสฤษฎิ์', 'thanchanok.roj@student.mahidol.ac.th', '084-567-8901', 20, 'กรุงเทพมหานคร', 'สนใจอุปกรณ์โมเดล คีมตัดพรีเมียม และปากกาตัดเส้น Gundam Marker', 'Staff', 'Active'),
(6, 'GundamLover159', 'customer123', 'กันดัม เลิฟเวอร์', 'gundamlover159@gmail.com', '098-159-1594', 27, '159/41 หมู่ 5 ถ.สุขุมวิท ต.บางนา อ.บางนา จ.กรุงเทพมหานคร 10260', 'เป็นสมาชิกระดับ VIP ชื่นชอบการต่อ MG SEED Series และเก็บสะสม Freedom Gundam', 'Customer', 'Active');

-- 8.3 ข้อมูลประวัติการเข้าสู่ระบบ (Login Logs)
INSERT INTO `login_logs` (`log_id`, `user_id`, `username_attempt`, `login_time`, `ip_address`, `user_agent`, `status`) VALUES
(1, 1, 'admin', '2026-09-10 09:15:22', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0', 'Success'),
(2, 6, 'GundamLover159', '2026-09-12 14:30:10', '192.168.1.45', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Success'),
(3, NULL, 'hacker_test', '2026-09-13 03:12:44', '203.144.144.1', 'Python-urllib/3.10', 'Failed'),
(4, 2, 'nichaphat', '2026-09-14 10:05:00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0', 'Success'),
(5, 1, 'admin', '2026-09-15 11:20:18', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0', 'Success');

-- 8.4 ข้อมูลสินค้าทั้ง 16 รายการ (Products)
INSERT INTO `products` (`id`, `name`, `series`, `grade`, `category`, `scale`, `price`, `stock`, `release_date`, `rating`, `image_url`, `description`, `details`, `reference_source`, `status`) VALUES
(1, 'Freedom GUNDAM Ver.2.0', 'Mobile Suit Gundam SEED', 'MG', 'gundam', '1/100', 1750.00, 15, '2024-04-12', 4.9, 'assets/images/product-freedom.png', 'ZGMF-X10A Freedom Gundam ในเวอร์ชัน Master Grade 2.0 โครงสร้างเฟรมสมจริง รายละเอียดปีก Hi-MAT Mode สามารถกางออกได้อย่างสง่างาม พร้อมบีมไรเฟิลและโล่คอมโพสิต', 'ชุดประกอบพลาสติกคิทขนาด 1/100 โครงในแบบ Full Inner Frame สติกเกอร์ Realistic Decal พร้อมฐานตั้งฟิกเกอร์ คิระ ยามาโตะ', 'Bandai Hobby Site: MG Freedom Gundam Ver.2.0 (Item 0206312) - https://bandai-hobby.net', 'In Stock'),
(2, 'Zeta GUNDAM Ver.Ka', 'Mobile Suit Zeta Gundam', 'MG', 'gundam', '1/100', 1750.00, 8, '2023-04-29', 4.8, 'assets/images/product-freedom.png', 'MSZ-006 Zeta Gundam เวอร์ชัน Katoki Hajime สัดส่วนแม่นยำตามอนิเมะ สามารถแปลงร่างเป็น Waverider Mode ได้สมบูรณ์โดยไม่ต้องถอดเปลี่ยนชิ้นส่วน', 'โครงสร้างข้อต่อชุบสีเงินพิเศษ โล่ Hyper Mega Launcher และสติกเกอร์ Water Decal ลาย Ver.Ka ครบเซ็ต', 'Bandai Hobby Site: MG 1/100 Zeta Gundam Ver.Ka - https://bandai-hobby.net', 'In Stock'),
(3, 'ZZ GUNDAM Ver.Ka', 'Mobile Suit Gundam ZZ', 'MG', 'gundam', '1/100', 1750.00, 5, '2023-09-15', 4.7, 'assets/images/product-freedom.png', 'MSZ-010 ZZ Gundam โมเดลขนาดใหญ่ ทรงพลัง มีกลไกการแยกประกอบและรวมร่างเป็น Core Top, Core Base และ G-Fortress ได้ครบถ้วน', 'ชิ้นส่วน Extra Finish สีเงินเมทัลลิก ปืน Double Beam Rifle ขนาดใหญ่ และบีมเซเบอร์ทรงพลัง', 'Bandai Hobby Site: MG 1/100 ZZ Gundam Ver.Ka - https://bandai-hobby.net', 'Low Stock'),
(4, 'Nu GUNDAM Ver.Ka', 'Mobile Suit Gundam: Char\'s Counterattack', 'MG', 'gundam', '1/100', 1750.00, 12, '2023-11-20', 5.0, 'assets/images/product-freedom.png', 'RX-93 Nu Gundam ผลงานระดับมาสเตอร์พีซ ออกแบบโดย Katoki Hajime โดดเด่นด้วย Fin Funnel 6 ชิ้น และกลไกเปิดเกราะ Psycho-Frame สีเขียวมรกต', 'ชิ้นส่วน Die-cast เสริมความมั่นคง ฟินฟันเนลพร้อมฐานจัดแสดงเฉพาะ และดีคอลน้ำพรีเมียม', 'Bandai Hobby Site: MG 1/100 Nu Gundam Ver.Ka - https://bandai-hobby.net', 'In Stock'),
(5, 'Strike GUNDAM + Aile Striker', 'Mobile Suit Gundam SEED', 'MG', 'gundam', '1/100', 1750.00, 20, '2024-01-10', 4.8, 'assets/images/product-freedom.png', 'GAT-X105 Strike Gundam Ver.RM รีมาสเตอร์ด้วยเทคโนโลยีเฟรมสมัยใหม่ มาพร้อมแพ็ค Aile Striker และ Armor Schneider มีดสั้นพับได้', 'ข้อต่อสะโพกขยับกว้างเป็นพิเศษเพื่อท่าโพสแอ็กชันคมชัด พร้อมฐานตั้ง Catapult Deck จำลองยาน Archangel', 'Bandai Hobby Site: MG 1/100 Aile Strike Gundam Ver.RM - https://bandai-hobby.net', 'In Stock'),
(6, 'GN-001 Gundam Exia', 'Mobile Suit Gundam 00', 'MG', 'gundam', '1/100', 1750.00, 9, '2023-08-05', 4.7, 'assets/images/product-freedom.png', 'กันดั้มผู้เชี่ยวชาญการต่อสู้ระยะประชิดด้วยดาบทั้ง 7 เล่ม (Seven Swords System) สายส่งพลังงาน GN Hologram Ribbon โปร่งแสงสมจริง', 'ดาบ GN Sword, GN Long Blade, GN Short Blade, GN Beam Saber x4 และฐานจำลอง GN Drive', 'Bandai Hobby Site: MG 1/100 Gundam Exia - https://bandai-hobby.net', 'In Stock'),
(7, 'Providence GUNDAM', 'Mobile Suit Gundam SEED', 'MG', 'gundam', '1/100', 1750.00, 4, '2023-06-18', 4.9, 'assets/images/product-freedom.png', 'บอสใหญ่แห่งซีรีส์ SEED กับระบบ DRAGOON System รอบตัว แบ็คแพ็คขนาดมหึมาพร้อมเอฟเฟกต์การยิงบีมรอบทิศทาง', 'โครงในดัดแปลงมาจาก Freedom Ver.2.0 ให้ความแข็งแรงยอดเยี่ยม พร้อมเอฟเฟกต์ชิ้นใสสำหรับจัดท่าดรากูน', 'Bandai Hobby Site: MG 1/100 Providence Gundam - https://bandai-hobby.net', 'Low Stock'),
(8, 'Justice GUNDAM', 'Mobile Suit Gundam SEED', 'MG', 'gundam', '1/100', 1750.00, 7, '2023-07-22', 4.8, 'assets/images/product-freedom.png', 'ZGMF-X09A Justice Gundam ยูนิตคู่หูของ Freedom โดดเด่นด้วยยานสนับสนุน Fatum-00 บนหลังที่สามารถแยกบินหรือกางขึ้นขี่ได้', 'โทนสีชมพูอมม่วงคมชัด บาสเซลเซเบอร์ที่หัวไหล่ และกลไกล็อกฐานสำหรับขึ้นยืนบน Fatum-00', 'Bandai Hobby Site: MG 1/100 Justice Gundam - https://bandai-hobby.net', 'In Stock'),
(9, 'God GUNDAM (Burning Gundam)', 'Mobile Fighter G Gundam', 'RG', 'gundam', '1/144', 1999.00, 14, '2024-05-18', 4.9, 'assets/images/product-god.png', 'GF13-017NJII God Gundam พร้อมโหมด Hyper Mode ปีกกางเป็นวงแหวนพลังงานแสงสีทอง มือขวา Bakunetsu God Finger ชิ้นใสสีส้มเปล่งประกาย', 'โครง Fighting Action Frame สามารถเตะ ต่อย และโพสท่าศิลปะการต่อสู้ได้อย่างอิสระโดยไม่หลุดหลวม', 'Bandai Hobby Site: RG 1/144 God Gundam - https://bandai-hobby.net', 'In Stock'),
(10, 'Gundam Barbatos Lupus Rex', 'Iron-Blooded Orphans', 'HG', 'gundam', '1/144', 1450.00, 11, '2024-02-14', 4.8, 'assets/images/product-freedom.png', 'ร่างสุดยอดของบาร์บาตอส แขนยักษ์ทรงพลัง กรงเล็บสีทอง และหาง Tail Blade พร้อมสายเคเบิลปรับทิศทางได้', 'ประกอบง่ายตามมาตรฐาน High Grade พร้อมกระบอง Ultra Large Mace ขนาดยักษ์', 'Bandai Hobby Site: HG 1/144 Gundam Barbatos Lupus Rex - https://bandai-hobby.net', 'In Stock'),
(11, 'PG Perfect Strike GUNDAM', 'Mobile Suit Gundam SEED', 'PG', 'gundam', '1/60', 8500.00, 2, '2023-12-01', 5.0, 'assets/images/hero-banner.png', 'สุดยอดโมเดลสเกล 1/60 ติดตั้งแพ็คสไตรเกอร์ครบทั้ง 3 แบบ (Aile + Sword + Launcher) โครงในโลหะหล่อและระบบไฟ LED สมบูรณ์แบบ', 'โครงร่าง Inner Frame รายละเอียดสูงพิเศษ ชิ้นส่วนเคลือบโครเมียม และดาบชเวิร์ดเกเบอร์ขนาดยาวกว่า 40 ซม.', 'Bandai Hobby Site: PG 1/60 Perfect Strike Gundam - https://bandai-hobby.net', 'Low Stock'),
(12, 'RX-78-2 GUNDAM (The Origin)', 'Mobile Suit Gundam', 'MG', 'gundam', '1/100', 1850.00, 6, '2024-03-30', 4.9, 'assets/images/about-rx78.png', 'กันดั้มปฐมบทเวอร์ชัน The Origin เพิ่มลูกเล่นปืนวัลแคนติดหน้าอก ปืนใหญ่ Shoulder Cannon และเอฟเฟกต์ไฟปากกระบอกปืน', 'สามารถเลือกประกอบได้ทั้งรูปแบบ Early Type, Middle Type และ Late Type พร้อมชิ้นส่วนเอฟเฟกต์ใส', 'Bandai Hobby Site: MG 1/100 RX-78-02 Gundam (The Origin) - https://bandai-hobby.net', 'In Stock'),
(13, 'Action Base 5 Clear Stand', 'Official Display Support', 'SD', 'parts', 'Universal', 350.00, 25, '2024-01-01', 4.7, 'assets/images/product-freedom.png', 'ฐานตั้งโมเดลสีใส เหมาะสำหรับสเกล 1/144 และ 1/100 ปรับระดับความสูงและมุมก้มเงยได้อย่างอิสระ', 'มาพร้อมข้อต่อและแกนยึดหลายรูปแบบ รองรับกันพลาได้เกือบทุกรุ่น ทุกซีรีส์', 'Bandai Hobby Site: Action Base 5 Clear - https://bandai-hobby.net', 'In Stock'),
(14, 'Gundam Decal Multi-Use (White)', 'Detail Up Parts', 'HG', 'parts', 'Universal', 220.00, 40, '2024-02-10', 4.6, 'assets/images/product-freedom.png', 'สติกเกอร์ดีคอลน้ำคุณภาพสูง ลายสัญลักษณ์กองทัพ E.F.S.F., Zeon, และตัวเลขมาร์กิ้งสีขาว สำหรับเพิ่มความสมจริง', 'แผ่นฟิล์มบางพิเศษ แนบสนิทกับชิ้นงานเมื่อใช้น้ำยาเคลือบดีคอล', 'Bandai Hobby Site: Gundam Decal Series - https://bandai-hobby.net', 'In Stock'),
(15, 'Bandai Spirits Entry Nipper (Blue)', 'Craft Tools', 'Tools', 'tools', 'N/A', 420.00, 18, '2024-01-15', 4.8, 'assets/images/product-god.png', 'คีมตัดพลาสติกโมเดลคุณภาพสูง ใบมีดคมบาง ช่วยให้ตัดชิ้นส่วนออกจากแผงรันเนอร์ได้เรียบเนียน ไม่ทิ้งรอยฝ้าขาว', 'ด้ามจับหุ้มยางนุ่มกระชับมือ มีสปริงช่วยผ่อนแรงในการตัดต่อเนื่อง', 'Bandai Spirits Hobby Tools Catalog - https://bandai-hobby.net', 'In Stock'),
(16, 'Gundam Marker Pour-Type (Black)', 'Finishing Supplies', 'Tools', 'tools', 'N/A', 180.00, 35, '2024-03-01', 4.7, 'assets/images/product-freedom.png', 'ปากกาตัดเส้นชนิดไหล (Pour Type) หมึกสีดำเข้ม เพียงแต้มเบาๆ หมึกจะไหลตามร่องโมเดลโดยอัตโนมัติ', 'ลบรอยส่วนเกินได้ง่ายด้วยยางลบหรือแอลกอฮอล์ ให้เส้นคมชัดสมจริงระดับมืออาชีพ', 'GSI Creos Mr.Hobby Official - https://www.mr-hobby.com', 'In Stock');

-- 8.5 ข้อมูลคำสั่งซื้อตัวอย่าง (Orders & Order Items)
-- สอดคล้องกับหน้า profile.html (ออเดอร์ของ GundamLover159 สั่งซื้อ Freedom Gundam สถานะจัดส่งแล้ว)
INSERT INTO `orders` (`order_id`, `order_number`, `user_id`, `order_date`, `total_amount`, `shipping_address`, `order_status`) VALUES
(1, 'ORD-25690912-001', 6, '2026-09-12 11:20:00', 1750.00, '159/41 หมู่ 5 ถ.สุขุมวิท ต.บางนา อ.บางนา จ.กรุงเทพมหานคร 10260', 'Delivered');

INSERT INTO `order_items` (`item_id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 1, 1, 1750.00);

COMMIT;
