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
     - **หากไม่ได้เปิด MySQL (XAMPP):** เซิร์ฟเวอร์จะสลับไปใช้ฐานข้อมูลจำลอง (**In-Memory SQL Database**) ที่มีข้อมูลตรงกับ `secX_grY_database.sql` ทุกตารางโดยอัตโนมัติ ทำให้ผู้ตรวจสามารถสั่ง `npm start` แล้วเปิด **Postman** ยิงทดสอบ API ทุกเส้น (`GET`, `POST`, `PUT`, `DELETE`) ได้ทันที 100% โดยไม่เกิด Error!

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
└── README.md                            # คู่มือการติดตั้งและผลการทดสอบ Web Services API
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

<br>

#### 2. รัน Front-end Server (`secX_grY_fe_src` - Port `3100`)

เปิด Terminal ที่ 2 เพื่อสตาร์ทเซิร์ฟเวอร์หน้าบ้านแยกต่างหาก:

```bash
cd secX_grY_fe_src
npm install
npm start
```

* **Front-end Web URL:** เปิดเบราว์เซอร์ไปที่ `http://localhost:3100`

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
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Super Admin | `admin-products.html` |
| **Manager** | `nichaphat` | `user123` | Manager | `admin-products.html` |
| **Staff** | `ayosara` | `user123` | Staff | `admin-products.html` |
| **Customer VIP** | `GundamLover159` | `customer123` | Customer | `profile.html` |

---

## 📡 ตัวอย่างการทดสอบ Web Services ด้วย Postman (Postman Testing Examples)

> ทุกไฟล์ในโฟลเดอร์ `secX_grY_ws_src/routes/` มี **Comment Header ตัวอย่างการทดสอบใน Postman อย่างน้อย 2 ตัวอย่าง** กำกับอยู่ด้านบนของโค้ดอย่างครบถ้วนตามเกณฑ์ของอาจารย์ผู้สอน  
> *(สำหรับคำขอแบบ `POST` และ `PUT` ให้ตั้งค่าใน Postman ที่แท็บ **Body** &rarr; เลือก **raw** &rarr; เลือกชนิดเป็น **JSON**)*

---

### 🔐 1. Authentication Web Service (`/api/auth`)

#### 1.1 เข้าสู่ระบบ (Login) — `POST`

```http
POST http://localhost:3000/api/auth/login
```

* **ตัวอย่างที่ 1: เข้าสู่ระบบสำเร็จด้วยบัญชี Admin (200 OK)**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

* **ตัวอย่างที่ 2: เข้าสู่ระบบสำเร็จด้วยบัญชีลูกค้า (200 OK)**
  ```json
  {
    "username": "GundamLover159",
    "password": "customer123"
  }
  ```

* **ตัวอย่างที่ 3: เข้าสู่ระบบไม่สำเร็จ รหัสผ่านผิด (401 Unauthorized)**
  ```json
  {
    "username": "admin",
    "password": "wrongpassword"
  }
  ```

<br>

#### 1.2 ตรวจสอบข้อมูลบัญชีผู้ใช้ปัจจุบัน (Current Session) — `GET`

* **ตัวอย่างที่ 1: ดูข้อมูลโปรไฟล์ของ `admin`**
  ```http
  GET http://localhost:3000/api/auth/me?username=admin
  ```

* **ตัวอย่างที่ 2: ดูข้อมูลโปรไฟล์ของ `GundamLover159`**
  ```http
  GET http://localhost:3000/api/auth/me?username=GundamLover159
  ```

---

### 📦 2. Products Web Services (`/api/products` — Search, View, Insert, Update, Delete)

> **โครงสร้างข้อมูลสินค้า (Standardized Product Schema - 10 ฟิลด์ตามฟอร์มการกรอกจริง):**  
> `id`, `name`, `grade`, `scale`, `category`, `price`, `stock`, `status`, `description`, `image_url`

#### 2.1 ค้นหาและดูรายการสินค้าทั้งหมด (Search & View Products) — `GET`

* **ตัวอย่างที่ 1: ดึงข้อมูลสินค้าทั้งหมดแบบไม่มีเงื่อนไข (Select All - No Criteria)**
  ```http
  GET http://localhost:3000/api/products
  ```

* **ตัวอย่างที่ 2: ค้นหาสินค้าด้วยคำค้นหา (Criteria 1 - Keyword Search)**
  ```http
  GET http://localhost:3000/api/products?q=Freedom
  ```

* **ตัวอย่างที่ 3: กรองสินค้าตามเกรดและหมวดหมู่ (Criteria 2 - Grade & Category Filter)**
  ```http
  GET http://localhost:3000/api/products?grade=MG&category=gundam
  ```

* **ตัวอย่างที่ 4: กรองตามช่วงราคาขั้นต่ำ-สูงสุด และจัดเรียงราคาจากน้อยไปมาก (Criteria 3 - Price Range & Sort)**
  ```http
  GET http://localhost:3000/api/products?minPrice=1500&maxPrice=2000&sortBy=price_asc
  ```

<br>

#### 2.2 ดูรายละเอียดสินค้ารายชิ้น (View Single Product by ID) — `GET`

* **ตัวอย่างที่ 1: ดูข้อมูลสินค้า ID ที่ 1 (`Freedom GUNDAM Ver.2.0`)**
  ```http
  GET http://localhost:3000/api/products/1
  ```

* **ตัวอย่างที่ 2: ดูข้อมูลสินค้า ID ที่ 9 (`God GUNDAM`)**
  ```http
  GET http://localhost:3000/api/products/9
  ```

<br>

#### 2.3 เพิ่มสินค้าใหม่เข้าสู่ระบบ (Insert New Product) — `POST`

```http
POST http://localhost:3000/api/products
```

* **ตัวอย่างที่ 1: เพิ่มโมเดลกันพลาเกรด MG (`MG 1/100 Sazabi Ver.Ka`)**
  ```json
  {
    "name": "MG 1/100 Sazabi Ver.Ka",
    "grade": "MG",
    "category": "gundam",
    "scale": "1/100",
    "price": 2800.00,
    "stock": 10,
    "status": "In Stock",
    "image_url": "assets/images/product-freedom.png",
    "description": "MSN-04 Sazabi Ver.Ka สีแดงพรีเมียม พร้อมฟันเนลครบชุด"
  }
  ```

* **ตัวอย่างที่ 2: เพิ่มโมเดลกันพลาเกรด HG (`HG 1/144 Gundam Aerial`)**
  ```json
  {
    "name": "HG 1/144 Gundam Aerial",
    "grade": "HG",
    "category": "gundam",
    "scale": "1/144",
    "price": 650.00,
    "stock": 20,
    "status": "In Stock",
    "image_url": "assets/images/product-god.png",
    "description": "หุ่นกันดั้มแอเรียล สเกล 1/144 พร้อมโล่ Escutcheon แยกชิ้นเป็น Bit Stave ได้"
  }
  ```

<br>

#### 2.4 แก้ไขข้อมูลสินค้าและเติมสต็อก (Update & Restock Product) — `PUT`

* **ตัวอย่างที่ 1: แก้ไขราคาและจำนวนสต็อกของสินค้า ID ที่ 1**
  ```http
  PUT http://localhost:3000/api/products/1
  ```
  **Body (raw JSON):**
  ```json
  {
    "name": "Freedom GUNDAM Ver.2.0 (Special Edition)",
    "price": 1850.00,
    "stock": 25,
    "status": "In Stock"
  }
  ```

* **ตัวอย่างที่ 2: เติมสต็อกสินค้า (Restock) ของสินค้า ID ที่ 3**
  ```http
  PUT http://localhost:3000/api/products/3
  ```
  **Body (raw JSON):**
  ```json
  {
    "stock": 30,
    "status": "In Stock"
  }
  ```

<br>

#### 2.5 ลบสินค้าออกจากระบบ (Delete Product) — `DELETE`

* **ตัวอย่างที่ 1: ลบสินค้า ID ที่ 16**
  ```http
  DELETE http://localhost:3000/api/products/16
  ```

* **ตัวอย่างที่ 2: ลบสินค้า ID ที่ 15**
  ```http
  DELETE http://localhost:3000/api/products/15
  ```

---

### 👥 3. Users Web Services (`/api/users` — Search, View, Insert, Update, Delete)

> **โครงสร้างข้อมูลผู้ใช้งาน (Standardized User Schema - 6 ฟิลด์ตามฟอร์มการกรอกจริง):**  
> `id`, `username`, `fullname`, `email`, `role`, `status`

#### 3.1 ค้นหาและดูรายชื่อผู้ใช้งานทั้งหมด (Search & View Users) — `GET`

* **ตัวอย่างที่ 1: ดึงรายชื่อผู้ใช้งานทั้งหมด (Select All Users)**
  ```http
  GET http://localhost:3000/api/users
  ```

* **ตัวอย่างที่ 2: ค้นหาผู้ใช้ด้วยคำค้นหา (Keyword Search)**
  ```http
  GET http://localhost:3000/api/users?q=Gundam
  ```

* **ตัวอย่างที่ 3: กรองผู้ใช้ตามสิทธิ์ (`role`) และสถานะ (`status`)**
  ```http
  GET http://localhost:3000/api/users?role=Staff&status=Active
  ```

<br>

#### 3.2 ดูรายละเอียดผู้ใช้งานรายบุคคล (View Single User by ID) — `GET`

* **ตัวอย่างที่ 1: ดูข้อมูลผู้ใช้ ID ที่ 1**
  ```http
  GET http://localhost:3000/api/users/1
  ```

* **ตัวอย่างที่ 2: ดูข้อมูลผู้ใช้ ID ที่ 6**
  ```http
  GET http://localhost:3000/api/users/6
  ```

<br>

#### 3.3 เพิ่มผู้ใช้งานหรือแอดมินใหม่ (Insert New User) — `POST`

```http
POST http://localhost:3000/api/users
```

* **ตัวอย่างที่ 1: เพิ่มบัญชีเจ้าหน้าที่ใหม่ (`Staff`)**
  ```json
  {
    "username": "somchai_staff",
    "password": "password123",
    "fullname": "สมชาย รักการต่อกันดั้ม",
    "email": "somchai.gunpla@example.com",
    "role": "Staff",
    "status": "Active"
  }
  ```

* **ตัวอย่างที่ 2: เพิ่มบัญชีลูกค้าใหม่ (`Customer`)**
  ```json
  {
    "username": "amuro_ray78",
    "password": "customer123",
    "fullname": "อามูโร่ เรย์",
    "email": "amuro.ray@efsf.org",
    "role": "Customer",
    "status": "Active"
  }
  ```

<br>

#### 3.4 แก้ไขข้อมูลผู้ใช้งาน (Update User) — `PUT`

* **ตัวอย่างที่ 1: แก้ไขสิทธิ์ (`role`) และสถานะของผู้ใช้ ID ที่ 3**
  ```http
  PUT http://localhost:3000/api/users/3
  ```
  **Body (raw JSON):**
  ```json
  {
    "role": "Manager",
    "status": "Active"
  }
  ```

* **ตัวอย่างที่ 2: แก้ไขชื่อ-นามสกุลและสถานะของผู้ใช้ ID ที่ 5**
  ```http
  PUT http://localhost:3000/api/users/5
  ```
  **Body (raw JSON):**
  ```json
  {
    "fullname": "ธัญชนก โรจนสฤษฎิ์ (Senior Staff)",
    "status": "Active"
  }
  ```

<br>

#### 3.5 ลบผู้ใช้งานออกจากระบบ (Delete User) — `DELETE`

* **ตัวอย่างที่ 1: ลบผู้ใช้ ID ที่ 5**
  ```http
  DELETE http://localhost:3000/api/users/5
  ```

* **ตัวอย่างที่ 2: ลบผู้ใช้ ID ที่ 4**
  ```http
  DELETE http://localhost:3000/api/users/4
  ```

---

### 💴 4. Public API Integration (`/api/public` — งานที่ 4 ข้อ 11)

เชื่อมต่อไปยัง Live Public API อัตราแลกเปลี่ยนสกุลเงินเยนญี่ปุ่นเป็นเงินบาทไทย (**JPY &rarr; THB**) สำหรับคำนวณราคาโมเดลกันพลาจากราคาเยน:

* **ตัวอย่างที่ 1: ดึงอัตราแลกเปลี่ยน JPY &rarr; THB ปัจจุบัน**
  ```http
  GET http://localhost:3000/api/public/exchange-rate
  ```

* **ตัวอย่างที่ 2: คำนวณแปลงราคาโมเดลกันพลา 4,500 เยน เป็นเงินบาทไทย**
  ```http
  GET http://localhost:3000/api/public/exchange-rate?amount_jpy=4500
  ```

---

### 🧾 5. Orders & Login Logs Services (`/api/orders` & `/api/logs`)

* **ตัวอย่างที่ 1: ดูประวัติคำสั่งซื้อของลูกค้ารหัส ID ที่ 6**
  ```http
  GET http://localhost:3000/api/orders/user/6
  ```

* **ตัวอย่างที่ 2: ดูรายการคำสั่งซื้อทั้งหมดในระบบ**
  ```http
  GET http://localhost:3000/api/orders
  ```

* **ตัวอย่างที่ 3: ดูประวัติการเข้าสู่ระบบทั้งหมด (Login Logs)**
  ```http
  GET http://localhost:3000/api/logs
  ```

* **ตัวอย่างที่ 4: กรองดูเฉพาะประวัติการเข้าสู่ระบบที่สำเร็จ (`status=Success`)**
  ```http
  GET http://localhost:3000/api/logs?status=Success
  ```

---

## 🧪 การนำเข้าไฟล์ Collection เพื่อทดสอบใน Postman ทันทีใน 1 คลิก

สามารถนำเข้าไฟล์ **`secX_grY_ws_src/Unimart_API.postman_collection.json`** เข้าสู่โปรแกรม Postman เพื่อทดสอบ API ทุก Endpoint ได้ทันที:

1. รันเซิร์ฟเวอร์ด้วยคำสั่ง `cd secX_grY_ws_src && npm start` (หรือรัน `npm start` จากโฟลเดอร์หลัก)
2. เปิดโปรแกรม **Postman** แล้วกดปุ่ม **Import**
3. เลือกไฟล์ `secX_grY_ws_src/Unimart_API.postman_collection.json`
4. กด **Send** ทดสอบการทำงานของ CRUD, Multi-Criteria Search, Filter, Restock และ Authentication ได้ครบทุกเส้นทันที!
