# 🛒 UNIMART - Online Gunpla & Hobby Supplies Store
**คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)**  
**วิชา ITDS242 Web Technologies Lab | Course Project (62 คะแนนเต็ม)**

---

## 👥 ข้อมูลสมาชิกกลุ่ม (Team Members)
- **Section:** X | **Group:** Y
1. **6887018** ณิชาภัทร วิชาธรรม
2. **6887063** อโยสรา ต้องทรัพย์
3. **6887025** ธนวัฒน์ แสนโบราณ
4. **6887071** คชาธร ศิริเลิศ
5. **6887077** ธัญชนก โรจนสฤษฎิ์

---

## 🏗️ สถาปัตยกรรมระบบแบบแยกเซิร์ฟเวอร์ (Two-Server System Architecture)

โปรเจกต์นี้ออกแบบและพัฒนาโดยแยกเซิร์ฟเวอร์ออกเป็น **2 เซิร์ฟเวอร์อิสระ** ตามแผนภาพข้อกำหนดในใบงานของอาจารย์ผู้สอน:

```text
+-----------------------------------+            +-----------------------------------------------+
|         Front-end Server          |   HTTP /   |              Web Service Server               |
|         (secX_grY_fe_src)         |   Fetch    |               (secX_grY_ws_src)               |
|                                   |  =======>  |                                               |
|  - Node.js + Express.js           |   CORS     |  - Node.js + Express.js + CORS                |
|  - express.Router() & sendFile()  |  <=======  |  - RESTful Web Services (/api/*)              |
|  - HTML5 / CSS3 / Fetch API       |   JSON     |  - MySQL Connection Pool + Auto-DB Fallback   |
|  - รันบน Port: 3100               |            |  - รันบน Port: 3000  <===>  MySQL (unimart_db)|
+-----------------------------------+            +-----------------------------------------------+
```

1. **Front-end Server (`secX_grY_fe_src` - Port `3100`):**
   - ทำหน้าที่เป็น Web Server ฝั่งหน้าบ้านด้วย `express`, `express.Router()`, `express.static()` และ `res.sendFile()` (ตามสไลด์ Lecture 10: Node.js Part II)
   - เสิร์ฟหน้าเว็บ HTML, CSS, JavaScript และเชื่อมต่อกับ Web Service Server ข้ามพอร์ตผ่าน `fetch('http://localhost:3000/api/...')`
2. **Web Service Server (`secX_grY_ws_src` - Port `3000`):**
   - ทำหน้าที่เป็น RESTful Web Services API Server ด้วย `express`, `cors`, `dotenv` และ `mysql2` (ตามสไลด์ Lecture 13: Web Services with Node.js)
   - มาพร้อมระบบ **Auto-Database Setup & Smart In-Memory SQL Fallback**:
     - **หากเปิด MySQL (XAMPP):** เซิร์ฟเวอร์จะสร้างฐานข้อมูล `unimart_db` และนำเข้าไฟล์ `secX_grY_database.sql` ให้อัตโนมัติทันทีเมื่อสั่ง `npm start`
     - **หากไม่ได้เปิด MySQL (XAMPP):** เซิร์ฟเวอร์จะสลับไปใช้ฐานข้อมูลจำลองในหน่วยความจำ (**In-Memory SQL Database**) ที่มีข้อมูลตรงกับ `secX_grY_database.sql` ทุกตารางโดยอัตโนมัติ ทำให้ผู้ตรวจสามารถสั่ง `npm start` แล้วเปิด **Postman** ยิงทดสอบ API ทุกเส้น (`GET`, `POST`, `PUT`, `DELETE`) ได้ทันที 100% โดยไม่เกิด Error!

---

## 📁 โครงสร้างโปรเจกต์ตามข้อกำหนดการส่งงาน (Project Structure)

> **หมายเหตุสำคัญตามใบงานหน้า 5:** ทั้งโฟลเดอร์ `secX_grY_fe_src` และ `secX_grY_ws_src` ตั้งค่า `.gitignore` ให้ไม่รวมโฟลเดอร์ `node_modules` เรียบร้อยแล้ว

```text
unimart-web/
├── secX_grY_fe_src/                     # [งานที่ 1 & งานที่ 4] Front-end Server & Source Code (Port 3100)
│   ├── server.js                        # Front-end Express Server (express.Router + res.sendFile)
│   ├── app.js                           # Alias Entrypoint สำหรับรัน node app.js / nodemon app.js
│   ├── package.json                     # รายการ Dependencies และ Script (npm start) ของฝั่ง Front-end
│   ├── .env                             # ตั้งค่า PORT=3100 และ API_BASE_URL=http://localhost:3000/api
│   ├── index.html                       # หน้าหลัก (Home Page)
│   ├── search.html                      # หน้าค้นหาและกรองสินค้า (Search & Filter + Public API)
│   ├── product-detail.html              # หน้ารายละเอียดสินค้า (Product Detail & Citations)
│   ├── about.html                       # เกี่ยวกับร้านและวิสัยทัศน์ (About Us)
│   ├── teampage.html                    # ข้อมูลสมาชิกในกลุ่ม (Our Team)
│   ├── login.html                       # หน้าเข้าสู่ระบบ (Authentication Login)
│   ├── profile.html                     # หน้าโปรไฟล์ลูกค้า (Customer Profile & Orders)
│   ├── admin-profile.html               # หน้าโปรไฟล์แอดมิน (Admin/Staff Profile & Shortcuts)
│   ├── admin-products.html              # ระบบจัดการสินค้าหลังบ้าน (Product CRUD & Modals)
│   ├── admin-users.html                 # ระบบจัดการผู้ใช้หลังบ้าน (User CRUD & Modals)
│   ├── css/
│   │   └── style.css                    # Unified External CSS ควบคุมทั้งระบบ
│   ├── js/
│   │   ├── api.js                       # โมดูลเชื่อมต่อ Web Services (http://localhost:3000/api) ด้วย Fetch API
│   │   └── products.js                  # Shared Data Model สินค้าและตัวกรอง
│   └── assets/images/                   # รูปภาพ แบนเนอร์ ไอคอน และมาสคอตจาก Figma
│
├── secX_grY_database.sql                # [งานที่ 2] สคริปต์ฐานข้อมูล MySQL (Tables & Seed Data)
│
├── secX_grY_ws_src/                     # [งานที่ 3] Web Service Server (RESTful API & MySQL - Port 3000)
│   ├── config/
│   │   └── db.js                        # MySQL Connection Pool + Auto-DB Import + In-Memory SQL Fallback
│   ├── routes/
│   │   ├── auth.js                      # เซอร์วิส Authentication (Login & Session)
│   │   ├── products.js                  # เซอร์วิสจัดการสินค้า (CRUD & Multi-Criteria Search)
│   │   ├── users.js                     # เซอร์วิสจัดการผู้ใช้งาน (CRUD & Filter)
│   │   ├── orders.js                    # เซอร์วิสดึงประวัติคำสั่งซื้อ
│   │   ├── logs.js                      # เซอร์วิสดึงประวัติการเข้าสู่ระบบ (Login Logs)
│   │   └── publicApi.js                 # เซอร์วิสเชื่อมต่อ Public API อัตราแลกเปลี่ยน JPY/THB
│   ├── server.js                        # Web Service Express Server (Port 3000)
│   ├── app.js                           # Alias Entrypoint สำหรับรัน node app.js / nodemon app.js
│   ├── Unimart_API.postman_collection.json # ไฟล์ Postman Collection สำหรับนำเข้าและทดสอบผ่าน Postman
│   ├── package.json                     # รายการ Dependencies และ Scripts (npm start) ของฝั่ง Web Service
│   └── .env                             # การตั้งค่า Environment Variables (DB & PORT=3000)
│
└── package.json                         # Root Script อำนวยความสะดวกสำหรับรันทั้ง 2 เซิร์ฟเวอร์พร้อมกัน
```

---

## ⚡ วิธีการติดตั้งและรันโปรแกรม (Setup & Execution Guide)

### 🚀 วิธีรันแบบแยก 2 เซิร์ฟเวอร์ (2 Terminals ตามโครงสร้างใบงานอาจารย์)

#### 1. รัน Web Service Server (`secX_grY_ws_src` - Port `3000`)
เปิด Terminal ที่ 1 เพื่อสตาร์ทเซิร์ฟเวอร์หลังบ้านและฐานข้อมูล (สำหรับรับคำขอจากหน้าเว็บและทดสอบใน **Postman**):
```bash
cd secX_grY_ws_src
npm install
npm start
```
* **Web Service API URL:** `http://localhost:3000/api`
* **พร้อมทดสอบด้วย Postman ทันที:** หากเครื่องเปิด MySQL (XAMPP) อยู่ ระบบจะสร้างฐานข้อมูล `unimart_db` และนำเข้า `secX_grY_database.sql` ให้อัตโนมัติ แต่หากไม่ได้เปิด MySQL ระบบจะเปิดโหมด **In-Memory SQL Database** ให้ยิง Postman ทดสอบได้ครบทุกเส้นทันที!

#### 2. รัน Front-end Server (`secX_grY_fe_src` - Port `3100`)
เปิด Terminal ที่ 2 เพื่อสตาร์ทเซิร์ฟเวอร์หน้าบ้านแยกต่างหาก:
```bash
cd secX_grY_fe_src
npm install
npm start
```
* **Front-end Web URL:** เปิดเบราว์เซอร์ไปที่ `http://localhost:3100`

---

### 💡 ทางลัด: รันทั้ง 2 เซิร์ฟเวอร์พร้อมกันในคำสั่งเดียว (จากโฟลเดอร์หลัก)
หากเปิด Terminal ที่โฟลเดอร์หลัก `unimart-web` สามารถสั่งรันทั้ง **Web Service Server (Port 3000)** และ **Front-end Server (Port 3100)** พร้อมกันได้ทันทีด้วยคำสั่ง:
```bash
npm start
```

---

### 🗄️ การนำเข้าฐานข้อมูล MySQL ด้วยตนเอง (ตัวเลือกเสริมสำหรับงานที่ 2)
หากต้องการนำเข้าไฟล์ `secX_grY_database.sql` ผ่าน **phpMyAdmin** หรือ **MySQL CLI** ด้วยตนเอง:
```bash
mysql -u root -p < secX_grY_database.sql
```
*(สคริปต์จะสร้างฐานข้อมูล `unimart_db` พร้อมตาราง `users`, `login_logs`, `categories`, `products`, `orders`, `order_items` และข้อมูลเริ่มต้นครบถ้วน)*

---

## 🔑 บัญชีผู้ใช้ตัวอย่างสำหรับการทดสอบ (Demo Accounts)

| บัญชี | Username | Password | สิทธิ์ (Role) | หน้าเริ่มต้นหลัง Login |
|---|---|---|---|---|
| **Super Admin** | `admin` | `admin123` | Super Admin | `admin-products.html` |
| **Manager** | `nichaphat` | `user123` | Manager | `admin-products.html` |
| **Staff** | `ayosara` | `user123` | Staff | `admin-products.html` |
| **Customer VIP** | `GundamLover159` | `customer123` | Customer | `profile.html` |

---

## 📡 สรุปรายการ Web Services และตัวอย่างการทดสอบด้วย Postman

ทุก Route ในโฟลเดอร์ `secX_grY_ws_src/routes/` มี **Comment Header ตัวอย่างการทดสอบใน Postman อย่างน้อย 2 ตัวอย่าง** กำกับอยู่ด้านบนของโค้ดอย่างถูกต้องตามข้อกำหนดของอาจารย์ผู้สอน

### 1. Authentication Service (`/api/auth`)
- `POST http://localhost:3000/api/auth/login` : ตรวจสอบ Username/Password, บันทึกประวัติลงตาราง `login_logs` และส่งข้อมูล User พร้อม Token กลับมา
  - **ตัวอย่าง Body (JSON):**
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```
- `GET http://localhost:3000/api/auth/me?username=admin` : ดูข้อมูลบัญชีผู้ใช้ปัจจุบัน

### 2. Products Services (`/api/products` - Search & View, Insert, Update, Delete)
- `GET http://localhost:3000/api/products` : ค้นหาและดูข้อมูลสินค้า
  - **Select All (No Criteria):** `GET http://localhost:3000/api/products` (ดึงสินค้าทั้งหมด 16 รายการ)
  - **Criteria 1 (Keyword):** `GET http://localhost:3000/api/products?q=Freedom`
  - **Criteria 2 (Grade + Category):** `GET http://localhost:3000/api/products?grade=MG&category=gundam`
  - **Criteria 3 (Price Range + Sort):** `GET http://localhost:3000/api/products?minPrice=1500&maxPrice=2000&sortBy=price_asc`
- `GET http://localhost:3000/api/products/1` : ดูรายละเอียดสินค้าเดี่ยวตาม ID
- `POST http://localhost:3000/api/products` : เพิ่มสินค้าใหม่ลงสู่ฐานข้อมูล
- `PUT http://localhost:3000/api/products/1` : ปรับปรุงข้อมูลสินค้าหรือเติมสต็อก (Restock)
- `DELETE http://localhost:3000/api/products/16` : ลบสินค้าออกจากฐานข้อมูล

### 3. Users Services (`/api/users` - Search & View, Insert, Update, Delete)
- `GET http://localhost:3000/api/users` : ค้นหาและดูรายชื่อผู้ใช้งานทั้งหมด
  - **Filter by Keyword:** `GET http://localhost:3000/api/users?q=Gundam`
  - **Filter by Role & Status:** `GET http://localhost:3000/api/users?role=Staff&status=Active`
- `GET http://localhost:3000/api/users/1` : ดูรายละเอียดผู้ใช้เดี่ยวตาม ID
- `POST http://localhost:3000/api/users` : เพิ่มผู้ใช้งานหรือแอดมินใหม่
- `PUT http://localhost:3000/api/users/3` : ปรับปรุงข้อมูลผู้ใช้
- `DELETE http://localhost:3000/api/users/5` : ลบผู้ใช้ออกจากระบบ

### 4. Public API Integration (`/api/public` - งานที่ 4 ข้อ 11)
- `GET http://localhost:3000/api/public/exchange-rate` : เชื่อมต่อไปยัง Live Public API อัตราแลกเปลี่ยนสกุลเงินเยนญี่ปุ่นเป็นเงินบาทไทย (JPY &rarr; THB) สำหรับคำนวณและแสดงราคากันพลาในหน้า `search.html` และ `product-detail.html`

### 5. Orders & Login Logs Services (`/api/orders` & `/api/logs`)
- `GET http://localhost:3000/api/orders/user/6` : ดูประวัติการสั่งซื้อของลูกค้าในหน้า `profile.html`
- `GET http://localhost:3000/api/orders` : ดูรายการคำสั่งซื้อทั้งหมดในระบบ
- `GET http://localhost:3000/api/logs` : ดูประวัติการเข้าสู่ระบบของแอดมินและผู้ใช้งาน (`?status=Success`)

---

## 🧪 การนำเข้าไฟล์ Collection เพื่อทดสอบใน Postman ทันทีใน 1 คลิก

สามารถนำเข้าไฟล์ **`secX_grY_ws_src/Unimart_API.postman_collection.json`** เข้าสู่โปรแกรม Postman เพื่อทดสอบ API ทุก Endpoint ได้ทันที:
1. รันเซิร์ฟเวอร์ด้วยคำสั่ง `cd secX_grY_ws_src && npm start` (หรือรัน `npm start` จากโฟลเดอร์หลัก)
2. เปิดโปรแกรม **Postman** แล้วกดปุ่ม **Import**
3. เลือกไฟล์ `secX_grY_ws_src/Unimart_API.postman_collection.json`
4. กด **Send** ทดสอบการทำงานของ CRUD, Multi-Criteria Search, Filter, Restock และ Authentication ได้ครบทุกเส้นทันที!
