#  UNIMART - Online Gunpla & Hobby Supplies Store

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
