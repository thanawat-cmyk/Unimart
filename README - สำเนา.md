
---

## ⚡ วิธีการติดตั้งและรันโปรแกรม (Setup & Execution Guide)

### 🚀 วิธีรันแบบแยก 2 เซิร์ฟเวอร์ (2 Terminals ตามโครงสร้างใบงานอาจารย์)

#### 1. รัน Web Service Server (`secX_grY_ws_src`- Port `3000`)

เปิด Terminal ที่ 1 เพื่อเปิดเซิร์ฟเวอร์หลังบ้านและฐานข้อมูล 

```bash
cd secX_grY_ws_src
npm start
```
______________________________________________________________________________________________________________________________

#### 2. รัน Front-end Server (`secX_grY_fe_src` - Port `3100`)

เปิด Terminal ที่ 2 เพื่อเปิดเซิร์ฟเวอร์หน้าบ้าน:

```bash
cd secX_grY_fe_src
npm start
```

* **Front-end Web URL:** เปิดเบราว์เซอร์ไปที่ `http://localhost:3100`
---
______________________________________________________________________________________________________________________________

### 💡 ทางลัด: รันทั้ง 2 เซิร์ฟเวอร์พร้อมกันในคำสั่งเดียว (จากโฟลเดอร์หลัก)

หากเปิด Terminal ที่โฟลเดอร์หลัก `unimart-web` สามารถสั่งรันทั้ง **Web Service Server (Port 3000)** และ **Front-end Server (Port 3100)** พร้อมกันได้ทันทีด้วยคำสั่ง:

```bash
npm start
```

______________________________________________________________________________________________________________________________
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
    "series": "Mobile Suit Gundam: Char's Counterattack",
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
    "series": "Mobile Suit Gundam: The Witch from Mercury",
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
    "phone": "089-999-8888",
    "age": 25,
    "address": "45/2 ถ.พหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400",
    "preferences": "ชอบโมเดลเกรด PG และอุปกรณ์ทำสี",
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
    "phone": "081-078-0079",
    "age": 22,
    "address": "Side 7 Colony, Universal Century",
    "preferences": "สะสมโมเดล RX-78-2 และ Nu Gundam",
    "role": "Customer",
    "status": "Active"
  }
  ```

<br>

#### 3.4 แก้ไขข้อมูลผู้ใช้งาน (Update User) — `PUT`

* **ตัวอย่างที่ 1: แก้ไขสิทธิ์ (`role`) และเบอร์โทรศัพท์ของผู้ใช้ ID ที่ 3**
  ```http
  PUT http://localhost:3000/api/users/3
  ```
  **Body (raw JSON):**
  ```json
  {
    "role": "Manager",
    "phone": "082-999-7777",
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
