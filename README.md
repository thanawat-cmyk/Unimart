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

## 🚀 คู่มือเริ่มต้นใช้งานสำหรับเครื่องใหม่ (Zero-to-Hero Quick Start Guide)
> **สำหรับผู้ตรวจ, อาจารย์, หรือผู้ทดสอบที่มีเฉพาะโปรแกรม Visual Studio Code (VS Code) ในเครื่อง**  
> ปฏิบัติตามขั้นตอนด้านล่างนี้ตั้งแต่การติดตั้งโปรแกรมพื้นฐานจนถึงการเปิดเว็บไซต์และยิงทดสอบ API ได้อย่างง่ายดาย

```text
สรุปภาพรวมขั้นตอนง่าย ๆ ใน 4 สเต็ป:
[1. ติดตั้ง Node.js] ➔ [2. เปิดโฟลเดอร์ใน VS Code] ➔ [3. สั่ง npm install & npm start ใน 2 Terminals] ➔ [4. เปิด http://localhost:3100]
```

---

### 📦 ขั้นตอนที่ 0: สิ่งที่ต้องติดตั้งในเครื่อง (Prerequisites)

#### 1. ติดตั้ง Node.js (จำเป็นที่สุด ⚠️)
Node.js คือตัวรันเอนจินของ JavaScript บนฝั่งเซิร์ฟเวอร์ที่โปรเจกต์นี้ใช้:
1. เข้าเว็บไซต์ทางการ: 👉 **[https://nodejs.org/](https://nodejs.org/)**
2. ดาวน์โหลดเวอร์ชัน **LTS (Long Term Support)** เช่น Node.js `20.x` หรือ `22.x` (เป็นเวอร์ชันที่เสถียรที่สุด)
3. เปิดไฟล์ที่ดาวน์โหลดมา แล้วกด **Next** ตามขั้นตอนปกติจนเสร็จสิ้น (ติ๊กเลือกค่าเริ่มต้นทั้งหมด)
4. **วิธีตรวจสอบว่าติดตั้งสำเร็จ:**
   - เปิดโปรแกรม **Terminal** (บน Mac/Linux) หรือ **Command Prompt / PowerShell** (บน Windows) แล้วพิมพ์คำสั่ง:
     ```bash
     node -v
     npm -v
     ```
   - หากมีเลขเวอร์ชันแสดงขึ้นมา (เช่น `v20.18.0` และ `10.8.2`) แสดงว่าติดตั้งสำเร็จ 100%!

<br>

#### 2. โปรแกรมฐานข้อมูล MySQL (XAMPP) — *✨ มี In-Memory Fallback ไม่ต้องลงก็รันได้ทันที!*
* **กรณีไม่มี XAMPP หรือไม่ได้เปิด MySQL:**  
  **ไม่ต้องกังวลและไม่ต้องติดตั้งเพิ่มเลยครับ!** โค้ดของโปรเจกต์นี้มาพร้อมระบบ **Smart In-Memory SQL Fallback** โดยอัตโนมัติ เซิร์ฟเวอร์จะจำลองฐานข้อมูลที่ตรงกับไฟล์ `secX_grY_database.sql` ทุกประการให้ทันที สามารถเปิดหน้าเว็บ ค้นหาสินค้า เพิ่ม ลบ แก้ไข เติมสต็อก และยิง Postman ได้ครบทุกเส้น 100%!
* **กรณีมีโปรแกรม XAMPP อยู่แล้ว และต้องการต่อฐานข้อมูล MySQL จริง:**
  1. เปิดโปรแกรม **XAMPP Control Panel**
  2. กดปุ่ม **Start** ที่โมดูล **MySQL** (พอร์ต 3306)
  3. เซิร์ฟเวอร์จะเชื่อมต่อไปยัง MySQL อัตโนมัติทันที
  4. หากต้องการสร้าง User เฉพาะ หรือตั้งค่ารหัสผ่านใน MySQL สามารถดูคู่มือได้ที่ [หัวข้อการจัดการฐานข้อมูล MySQL และการตั้งค่า User](#%EF%B8%8F-การจัดการฐานข้อมูล-mysql-และการตั้งค่า-user-mysql-setup--user-management)

<br>

#### 3. โปรแกรม Postman (สำหรับทดสอบ Web Services API)
สำหรับใช้ทดสอบการทำงานของ Web Services ตามเกณฑ์การให้คะแนน:
* ดาวน์โหลดและติดตั้งได้ฟรีที่: 👉 **[https://www.postman.com/downloads/](https://www.postman.com/downloads/)**

---

### 📂 ขั้นตอนที่ 1: การเปิดโฟลเดอร์โปรเจกต์ใน VS Code

1. แตกไฟล์ Zip (Unzip) โฟลเดอร์โปรเจกต์ออกมาไว้ในเครื่อง (เช่นที่หน้า `Desktop` หรือโฟลเดอร์เอกสาร)
2. เปิดโปรแกรม **Visual Studio Code (VS Code)**
3. ไปที่เมนูด้านบน: **File** &rarr; **Open Folder...** (หรือกดคีย์ลัด `Ctrl + K, Ctrl + O` บน Windows / `Cmd + O` บน Mac)
4. เลือกเปิดโฟลเดอร์โปรเจกต์ (`For_test` หรือ `unimart-web`) จะเห็นโครงสร้างไฟล์ทางแถบซ้ายมือ

---

### 💻 ขั้นตอนที่ 2: การสั่งรันเซิร์ฟเวอร์ผ่าน Terminal ใน VS Code

โปรเจกต์นี้ออกแบบตามข้อกำหนดใบงานของอาจารย์ผู้สอน โดยแยกเป็น **2 เซิร์ฟเวอร์อิสระ**:
- **เซิร์ฟเวอร์หลังบ้าน (Web Service):** รันบนพอร์ต `3000`
- **เซิร์ฟเวอร์หน้าบ้าน (Front-end Web):** รันบนพอร์ต `3100`

ดังนั้นเราจะเปิด **2 หน้าต่าง Terminal ใน VS Code** ดังนี้:

#### 🔹 2.1 สตาร์ตเซิร์ฟเวอร์หลังบ้าน (Terminal ที่ 1: Web Service — Port 3000)
1. ใน VS Code ไปที่เมนูด้านบน: **Terminal** &rarr; **New Terminal** (หรือกดปุ่มคีย์ลัด `` Ctrl + ` ``)
2. พิมพ์คำสั่งเพื่อเข้าโฟลเดอร์ ติดตั้งไลบรารี และเริ่มรันเซิร์ฟเวอร์:
   ```bash
   cd secX_grY_ws_src
   npm install
   npm start
   ```
   > **💡 ทำไมต้องสั่ง `npm install`?**  
   > เนื่องจากตามข้อกำหนดการส่งงานของอาจารย์ จะไม่รวมโฟลเดอร์ `node_modules` มาในไฟล์งาน จึงต้องสั่ง `npm install` ในเครื่องครั้งแรกเพียง 1 ครั้ง เพื่อให้ระบบดาวน์โหลดแพ็กเกจ (เช่น Express, CORS, dotenv) เข้ามาในเครื่องครับ
3. เมื่อเซิร์ฟเวอร์เริ่มทำงาน จะแสดงข้อความ:
   ```text
   🚀 [UNIMART WS] Server running on port 3000
   🔗 API Base URL: http://localhost:3000/api
   ```

<br>

#### 🔹 2.2 สตาร์ตเซิร์ฟเวอร์หน้าบ้าน (Terminal ที่ 2: Front-end — Port 3100)
1. ในหน้าต่าง Terminal ของ VS Code สังเกตแถบขวามือของ Terminal จะมีปุ่ม **`+` (Create New Terminal)** หรือปุ่ม **Split Terminal (แบ่งจอ 2 ข้าง หรือกด `Ctrl + Shift + 5`)** ให้กดเพื่อเปิด Terminal จอที่ 2
2. ใน Terminal จอที่ 2 ให้พิมพ์คำสั่ง:
   ```bash
   cd secX_grY_fe_src
   npm install
   npm start
   ```
3. เมื่อเซิร์ฟเวอร์เริ่มทำงาน จะแสดงข้อความ:
   ```text
   🌐 [UNIMART FRONTEND] Server running at http://localhost:3100
   ```

---

### 🌐 ขั้นตอนที่ 3: เปิดใช้งานและทดสอบผ่านหน้าเว็บเบราว์เซอร์

1. เปิดเว็บเบราว์เซอร์ (Google Chrome, Microsoft Edge, Firefox หรือ Safari)
2. พิมพ์ URL ในแถบที่อยู่เว็บ:
   👉 **`http://localhost:3100`**
3. หน้าหลักของร้าน **UNIMART Gundam & Hobby Store** จะปรากฏขึ้นอย่างสมบูรณ์!
4. **ทดสอบระบบเข้าสู่ระบบ (Login):**  
   คลิกที่ปุ่ม **LOGIN** หรือไปที่ `http://localhost:3100/login.html` โดยมีบัญชีตัวอย่างให้ทดสอบครบทุกระดับสิทธิ์:

| ระดับสิทธิ์ (Role) | Username | Password | ความสามารถและหน้าที่ |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin` | `admin123` | จัดการสินค้าหลังบ้าน (CRUD), จัดการผู้ใช้งาน, เติมสต็อก |
| 👔 **Manager** | `nichaphat` | `user123` | จัดการข้อมูลสินค้าและดูสถิติ |
| 🛠️ **Staff** | `ayosara` | `user123` | เติมสต็อกและอัปเดตสถานะสินค้า |
| 👤 **Customer VIP** | `GundamLover159` | `customer123` | ดูโปรไฟล์ลูกค้าและประวัติคำสั่งซื้อส่วนตัว |

---

### 📬 ขั้นตอนที่ 4: การนำเข้าและทดสอบ API ด้วย Postman

1. เปิดโปรแกรม **Postman**
2. คลิกปุ่ม **Import** ที่มุมบนซ้ายของหน้าต่าง
3. ลากไฟล์หรือกดเลือกไฟล์:
   📁 **`secX_grY_ws_src/Unimart_API.postman_collection.json`**
4. ในแถบด้านซ้ายของ Postman จะมีคอลเลกชันชื่อ **UNIMART Web Services API (ITDS242 Lab)**
5. คลิกเลือกคำขอทดสอบที่ต้องการ (เช่น `GET Products - Select All`, `POST Insert New Product`, `PUT Update Product`) แล้วกดปุ่มสีฟ้า **Send** เพื่อดูผลลัพธ์ JSON ได้ทันที!

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

## ⚙️ คู่มือการตั้งค่าตัวแปรสภาพแวดล้อม (.env Configuration Guide)

ไฟล์ `.env` (Environment Variables) ใช้สำหรับเก็บการตั้งค่าสำคัญของระบบ เช่น หมายเลขพอร์ต, การเชื่อมต่อฐานข้อมูล และ URL ที่ไม่ควรฝังไว้ในโค้ดโดยตรง เพื่อให้สามารถปรับแต่งค่าได้ง่ายตามสภาพแวดล้อมของแต่ละเครื่อง

โปรเจกต์นี้มีไฟล์ `.env` แยกอิสระสำหรับแต่ละเซิร์ฟเวอร์ดังนี้:

---

### 🌐 1. การตั้งค่าฝั่ง Front-end Server (`secX_grY_fe_src/.env`)

ไฟล์นี้ใช้กำหนดพอร์ตของเซิร์ฟเวอร์หน้าบ้าน และที่อยู่ของ Web Service API ที่หน้าบ้านจะเรียกใช้:

```env
# ==============================================================================
# Front-end Server Configuration (.env)
# ==============================================================================

# พอร์ตสำหรับรัน Front-end Web Server (ค่าเริ่มต้นคือ 3100 ตามข้อกำหนด CORS)
PORT=3100

# ที่อยู่ Web Service API URL ของฝั่งหลังบ้านที่ Front-end จะส่งคำขอ (Fetch) ไปหา
API_BASE_URL=http://localhost:3000/api
```

> **คำอธิบายตัวแปร:**
> - `PORT`: กำหนดหมายเลขพอร์ตของหน้าเว็บ (ค่าเริ่มต้น `3100`) หากพอร์ต 3100 ชนกับโปรแกรมอื่น สามารถเปลี่ยนเป็นพอร์ตอื่น เช่น `3200` ได้
> - `API_BASE_URL`: URL ปลายทางของ Web Service API เพื่อให้สคริปต์หน้าบ้าน (`js/api.js`) รู้ว่าจะต้องยิงดึงข้อมูลสินค้าหรือส่งข้อมูลล็อกอินไปที่พอร์ตใด

---

### 💻 2. การตั้งค่าฝั่ง Web Service Server (`secX_grY_ws_src/.env`)

ไฟล์นี้ใช้กำหนดการเชื่อมต่อไปยังฐานข้อมูล MySQL และพอร์ตของหลังบ้าน:

```env
# ==============================================================================
# Web Service Server Configuration (.env)
# ==============================================================================

# พอร์ตสำหรับรัน Web Service RESTful API (ค่าเริ่มต้นคือ 3000)
PORT=3000
NODE_ENV=development

# การเชื่อมต่อฐานข้อมูล MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=unimart_db
```

> **คำอธิบายตัวแปร:**
> - `PORT`: หมายเลขพอร์ตของหลังบ้าน (ค่าเริ่มต้น `3000`)
> - `NODE_ENV`: โหมดการทำงาน (ค่าเริ่มต้น `development`)
> - `DB_HOST`: ที่อยู่เซิร์ฟเวอร์ MySQL (ปกติคือ `localhost` หรือ `127.0.0.1`)
> - `DB_PORT`: หมายเลขพอร์ตของ MySQL (พอร์ตมาตรฐานคือ `3306`)
> - `DB_USER`: ชื่อผู้ใช้ฐานข้อมูล (ค่าเริ่มต้นของ XAMPP คือ `root` หรือใส่ชื่อ User ที่สร้างขึ้นใหม่)
> - `DB_PASSWORD`: รหัสผ่านฐานข้อมูล (ค่าเริ่มต้นของ XAMPP มักเป็น **ค่าว่าง** ให้ปล่อยว่างไว้ แต่หากมีการตั้งรหัสผ่านให้ระบุลงไป เช่น `DB_PASSWORD=pass1234`)
> - `DB_NAME`: ชื่อฐานข้อมูล (ค่าเริ่มต้น `unimart_db`)

> 💡 **หมายเหตุเกี่ยวกับการคัดลอกไฟล์:**  
> หากในโฟลเดอร์ยังไม่มีไฟล์ `.env` (เนื่องจากถูกซ่อนหรือยังไม่ได้สร้าง) สามารถคัดลอกจากไฟล์ต้นแบบ `.env.example` ได้ด้วยคำสั่ง:
> ```bash
> cd secX_grY_ws_src
> cp .env.example .env    # บน Mac / Linux
> copy .env.example .env  # บน Windows Command Prompt / PowerShell
> ```

---

## 🗄️ การจัดการฐานข้อมูล MySQL และการตั้งค่า User (MySQL Setup & User Management)

โปรเจกต์นี้มีระบบ **Smart In-Memory Fallback** ในตัว ทำให้สามารถรันได้ทันทีแม้ไม่ได้เปิดหรือติดตั้ง MySQL แต่หากต้องการต่อใช้งานกับ **ฐานข้อมูล MySQL จริง (เช่น ผ่าน XAMPP)** สามารถจัดการได้ตามคำแนะนำด้านล่างนี้:

---

### 📥 1. การนำเข้าฐานข้อมูล (Import Database)

ระบบหลังบ้านถูกออกแบบมาให้ **สร้างฐานข้อมูล `unimart_db` และนำเข้าไฟล์ `secX_grY_database.sql` ให้อัตโนมัติทันทีที่สั่ง `npm start`** หาก MySQL เปิดใช้งานอยู่  
แต่หากต้องการนำเข้าด้วยตนเอง สามารถทำได้ 2 วิธี:

#### 🔹 วิธีที่ 1: นำเข้าผ่าน phpMyAdmin (GUI)
1. เปิดเบราว์เซอร์ไปที่: **`http://localhost/phpmyadmin`**
2. คลิกที่แท็บ **"Import" (นำเข้า)** บนแถบเมนูด้านบน
3. คลิกปุ่ม **"Choose File" (เลือกไฟล์)** แล้วเลือกไฟล์ [secX_grY_database.sql](file:///C:/Users/thana/.gemini/antigravity/scratch/unimart-web/secX_grY_database.sql)
4. เลื่อนลงมาล่างสุดแล้วคลิกปุ่ม **"Import" (นำเข้า)**
5. ระบบจะสร้างฐานข้อมูล `unimart_db` พร้อมตารางและข้อมูลจำลองครบถ้วน

#### 🔹 วิธีที่ 2: นำเข้าผ่าน Command Line / Terminal
```bash
mysql -u root -p < secX_grY_database.sql
```
*(หากไม่มีรหัสผ่าน ให้กด Enter ข้ามไปได้ทันที)*

---

### 👤 2. การสร้างและตั้งค่า User ใน MySQL (User Management & Privileges)

ในกรณีที่ต้องการสร้าง User บัญชีใหม่สำหรับโปรเจกต์ หรือต้องการกำหนดสิทธิ์ (Privileges) ให้กับฐานข้อมูล มีขั้นตอนดังนี้:

#### 🔹 วิธีที่ 1: ตั้งค่าผ่าน phpMyAdmin (แนะนำ - ทำตามได้ง่ายที่สุด)
1. เปิดเบราว์เซอร์ไปที่: **`http://localhost/phpmyadmin`**
2. คลิกที่แท็บ **"User accounts" (บัญชีผู้ใช้)** บนแถบเมนูด้านบน
3. เลื่อนลงมาคลิกที่ปุ่ม/ลิงก์ **"Add user account" (เพิ่มบัญชีผู้ใช้)**
4. ในส่วน **Login Information (ข้อมูลการเข้าสู่ระบบ):**
   - **User name (ชื่อผู้ใช้):** เลือก *Use text field* แล้วพิมพ์ชื่อที่ต้องการ เช่น `unimart_user` หรือ `itds_admin`
   - **Host name (ชื่อโฮสต์):** เลือก *Local* หรือพิมพ์ `localhost`
   - **Password (รหัสผ่าน):** พิมพ์รหัสผ่านที่ต้องการ เช่น `pass1234`
   - **Re-type (พิมพ์ซ้ำ):** พิมพ์รหัสผ่านเดิมอีกครั้งเพื่อยืนยัน
5. ในส่วน **Database for user account (ฐานข้อมูลสำหรับบัญชีผู้ใช้):**
   - สามารถเลือก *Grant all privileges on wildcard name (username_%)* หรือข้ามไปข้อ 6
6. ในส่วน **Global privileges (สิทธิ์ส่วนกลาง):**
   - ให้คลิกติ๊กถูกที่ **"Check all" (เลือกทั้งหมด)** เพื่อมอบสิทธิ์จัดการข้อมูล (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) และสิทธิ์จัดการโครงสร้าง (`CREATE`, `ALTER`, `INDEX`) ครบทุกด้าน
7. เลื่อนลงมาที่มุมล่างขวา แล้วคลิกปุ่ม **"Go" (ลงมือ)**
8. **ขั้นตอนสำคัญ ⚠️:** เมื่อสร้าง User สำเร็จแล้ว ให้เปิดไฟล์ `secX_grY_ws_src/.env` แล้วแก้ไขค่าให้ตรงกับที่สร้างไว้:
   ```env
   DB_USER=unimart_user
   DB_PASSWORD=pass1234
   ```

---

#### 🔹 วิธีที่ 2: ตั้งค่าผ่านคำสั่ง SQL (SQL Query / MySQL CLI)
สามารถเปิดแท็บ **SQL** ใน phpMyAdmin หรือใช้ MySQL Command Line แล้วรันชุดคำสั่งด้านล่างนี้:

```sql
-- 1. สร้างผู้ใช้ใหม่ (เปลี่ยน unimart_user และ pass1234 ตามที่ต้องการ)
CREATE USER 'unimart_user'@'localhost' IDENTIFIED BY 'pass1234';

-- 2. มอบสิทธิ์การจัดการทุกอย่างบนฐานข้อมูล unimart_db ให้กับผู้ใช้คนนี้
GRANT ALL PRIVILEGES ON unimart_db.* TO 'unimart_user'@'localhost';

-- 3. รีเฟรชสิทธิ์ของระบบให้มีผลบังคับใช้ทันที
FLUSH PRIVILEGES;
```

---

#### 🔹 วิธีที่ 3: กรณีต้องการเปลี่ยนหรือตั้งรหัสผ่านให้ผู้ใช้ `root`
หากต้องการใช้ผู้ใช้หลัก `root` แต่ต้องการตั้งรหัสผ่านเพิ่มเติม:
```sql
-- ตั้งรหัสผ่านใหม่ให้กับ root บน localhost
ALTER USER 'root'@'localhost' IDENTIFIED BY 'my_secret_password';
FLUSH PRIVILEGES;
```
จากนั้นอัปเดตไฟล์ `secX_grY_ws_src/.env`:
```env
DB_USER=root
DB_PASSWORD=my_secret_password
```

---

### 🔄 3. สรุปความสอดคล้องระหว่าง MySQL และ `.env`

ทุกครั้งที่มีการเปลี่ยนแปลงข้อมูลเกี่ยวกับ MySQL ให้ตรวจสอบว่าค่าใน `secX_grY_ws_src/.env` ตรงกันเสมอ:

| ค่าใน MySQL | ตัวแปรใน `.env` | ตัวอย่างค่า | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| Database Host | `DB_HOST` | `localhost` | เครื่องที่รันฐานข้อมูล |
| Port | `DB_PORT` | `3306` | พอร์ตมาตรฐานของ MySQL |
| User Account | `DB_USER` | `root` หรือ `unimart_user` | ชื่อบัญชีผู้ใช้ที่สร้างใน MySQL |
| Password | `DB_PASSWORD` | *(ค่าว่าง)* หรือ `pass1234` | รหัสผ่านของ User นั้น ๆ |
| Database Name | `DB_NAME` | `unimart_db` | ชื่อฐานข้อมูลของโปรเจกต์ |

เมื่อบันทึกไฟล์ `.env` เรียบร้อยแล้ว ให้สั่ง `npm start` ใน Terminal ของ `secX_grY_ws_src` ระบบจะเชื่อมต่อกับ MySQL ด้วยสิทธิ์และผู้ใช้ใหม่ได้ทันที!

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

1. รันเซิร์ฟเวอร์ด้วยคำสั่ง `cd secX_grY_ws_src && npm start`
2. เปิดโปรแกรม **Postman** แล้วกดปุ่ม **Import**
3. เลือกไฟล์ `secX_grY_ws_src/Unimart_API.postman_collection.json`
4. กด **Send** ทดสอบการทำงานของ CRUD, Multi-Criteria Search, Filter, Restock และ Authentication ได้ครบทุกเส้นทันที!
