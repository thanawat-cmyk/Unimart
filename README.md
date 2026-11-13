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

## 📁 โครงสร้างโปรเจกต์ตามข้อกำหนดการส่งงาน (Project Structure)

```text
unimart-web/
├── secX_grY_fe_src/                     # [งานที่ 1 & งานที่ 4] Frontend Source Code
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
│   │   ├── api.js                       # โมดูลเชื่อมต่อ Web Services ด้วย Fetch API
│   │   └── products.js                  # Shared Data Model สินค้าและตัวกรอง
│   └── assets/images/                   # รูปภาพ แบนเนอร์ ไอคอน และมาสคอตจาก Figma
│
├── secX_grY_database.sql                # [งานที่ 2] สคริปต์ฐานข้อมูล MySQL (Tables & Seed Data)
│
└── secX_grY_ws_src/                     # [งานที่ 3] RESTful Web Services Backend (Node.js & Express)
    ├── config/
    │   └── db.js                        # กำหนดค่าการเชื่อมต่อ MySQL Connection Pool
    ├── data/
    │   └── seedData.js                  # ชุดข้อมูลตั้งต้นและระบบ In-Memory Fallback
    ├── routes/
    │   ├── auth.js                      # เซอร์วิส Authentication (Login & Session)
    │   ├── products.js                  # เซอร์วิสจัดการสินค้า (CRUD & Multi-Criteria Search)
    │   ├── users.js                     # เซอร์วิสจัดการผู้ใช้งาน (CRUD & Filter)
    │   ├── orders.js                    # เซอร์วิสดึงประวัติคำสั่งซื้อ
    │   ├── logs.js                      # เซอร์วิสดึงประวัติการเข้าสู่ระบบ (Login Logs)
    │   └── publicApi.js                 # เซอร์วิสเชื่อมต่อ Public API อัตราแลกเปลี่ยน JPY/THB
    ├── server.js                        # จุดเริ่มต้นเซิร์ฟเวอร์ Express (Port 3000)
    ├── test-apis.js                     # สคริปต์ทดสอบ Web Services อัตโนมัติ (18/18 ผ่าน 100%)
    ├── Unimart_API.postman_collection.json # ไฟล์ Postman Collection สำหรับนำเข้าและทดสอบทันที
    ├── package.json                     # รายการ Dependencies และ Scripts
    └── .env                             # การตั้งค่า Environment Variables
```

---

## ⚡ วิธีการติดตั้งและรันโปรแกรม (Setup & Execution Guide)

### ขั้นตอนที่ 1: ติดตั้งและนำเข้าฐานข้อมูล MySQL (งานที่ 2)
1. เปิดโปรแกรม MySQL (เช่น **phpMyAdmin**, **MySQL Workbench**, หรือ MySQL CLI)
2. นำเข้าไฟล์ `secX_grY_database.sql`:
   ```bash
   mysql -u root -p < secX_grY_database.sql
   ```
   *สคริปต์จะสร้างฐานข้อมูล `unimart_db` พร้อมตาราง `users`, `login_logs`, `categories`, `products`, `orders`, `order_items` และ Seed Data ที่มีความหมายครบถ้วน*

### ขั้นตอนที่ 2: ติดตั้งและรัน Web Services Backend (งานที่ 3)
1. เข้าไปยังโฟลเดอร์ Web Services:
   ```bash
   cd secX_grY_ws_src
   ```
2. ติดตั้ง Dependencies (Express, MySQL2, CORS, Dotenv):
   ```bash
   npm install
   ```
3. เริ่มต้นเซิร์ฟเวอร์:
   ```bash
   npm start
   # หรือสำหรับโหมดพัฒนา: npm run dev
   ```
   *เซิร์ฟเวอร์จะรันที่:* `http://localhost:3000`  
   *(หมายเหตุ: ระบบมี In-Memory Fallback ทำงานอัตโนมัติ หากยังไม่ได้เปิด MySQL เซิร์ฟเวอร์และหน้าเว็บจะยังคงทดสอบได้ 100%)*

### ขั้นตอนที่ 3: เปิดใช้งานหน้าเว็บ Frontend (งานที่ 1 & งานที่ 4)
สามารถเปิดหน้าเว็บได้ 2 รูปแบบ:
1. **ผ่าน Web Server (แนะนำ):** เปิดเบราว์เซอร์ไปที่ `http://localhost:3000/index.html`
2. **เปิดไฟล์ตรง:** ดับเบิลคลิกเปิดไฟล์ `secX_grY_fe_src/index.html` ในเบราว์เซอร์ใดก็ได้

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

ทุก Route มี **Comment Header ตัวอย่างการทดสอบใน Postman อย่างน้อย 2 ตัวอย่าง** กำกับอยู่ด้านบนของโค้ดอย่างถูกต้องตามข้อกำหนดของอาจารย์ผู้สอน

นอกจากนี้สามารถนำเข้าไฟล์ **`secX_grY_ws_src/Unimart_API.postman_collection.json`** เข้าสู่โปรแกรม Postman เพื่อทดสอบได้ทันทีใน 1 คลิก!

### 1. Authentication Service
- `POST /api/auth/login` : ตรวจสอบ Username/Password, บันทึก Login ลง `login_logs` และส่งข้อมูล User พร้อม Token กลับมา
- `GET /api/auth/me?username=:username` : ดูข้อมูลบัญชีผู้ใช้ปัจจุบัน

### 2. Products Services (Search & View, Insert, Update, Delete)
- `GET /api/products` : ค้นหาและดูข้อมูลสินค้า
  - **Select All (No Criteria):** `GET /api/products` (ดึงสินค้าทั้งหมด 16 รายการ)
  - **Criteria 1 (Keyword):** `GET /api/products?q=Freedom`
  - **Criteria 2 (Grade + Category):** `GET /api/products?grade=MG&category=gundam`
  - **Criteria 3 (Price Range + Sort):** `GET /api/products?minPrice=1500&maxPrice=2000&sortBy=price_asc`
- `GET /api/products/:id` : ดูรายละเอียดสินค้าเดี่ยว (เช่น `/api/products/1`)
- `POST /api/products` : เพิ่มสินค้าใหม่ลงสู่ฐานข้อมูล
- `PUT /api/products/:id` : ปรับปรุงข้อมูลสินค้า (เช่น แก้ไขราคาหรือสต็อก)
- `DELETE /api/products/:id` : ลบสินค้าออกจากฐานข้อมูล

### 3. Users Services (Search & View, Insert, Update, Delete)
- `GET /api/users` : ค้นหาและดูรายชื่อผู้ใช้งานทั้งหมด หรือกรองตาม `role` และ `status`
- `GET /api/users/:id` : ดูรายละเอียดผู้ใช้เดี่ยว
- `POST /api/users` : เพิ่มผู้ใช้งาน/ผู้ดูแลระบบใหม่
- `PUT /api/users/:id` : ปรับปรุงข้อมูลผู้ใช้
- `DELETE /api/users/:id` : ลบผู้ใช้ออกจากระบบ

### 4. Public API Integration (งานที่ 4 ข้อ 11)
- `GET /api/public/exchange-rate` : เชื่อมต่อไปยัง Live Public API อัตราแลกเปลี่ยนสกุลเงินเยนญี่ปุ่นเป็นเงินบาทไทย (JPY &rarr; THB) สำหรับคำนวณและแสดงราคากันพลาในหน้า `search.html` และ `product-detail.html`

### 5. Orders & Logs Services
- `GET /api/orders/user/:userId` : ดูประวัติการสั่งซื้อของลูกค้าในหน้า `profile.html`
- `GET /api/logs` : ดูประวัติการเข้าสู่ระบบของแอดมินและผู้ใช้งาน

---

## 🧪 การทดสอบระบบอัตโนมัติ (Automated Test Verification)

รันคำสั่งตรวจสอบ Web Services ทุกฟังก์ชันในโฟลเดอร์ `secX_grY_ws_src`:
```bash
node test-apis.js
```
ผลการทดสอบ: **18 / 18 Tests Passed (100% ผ่านฉลุยทุกเกณฑ์)**
