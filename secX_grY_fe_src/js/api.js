/**
 * ==============================================================================
 * คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
 * วิชา ITDS242 Web Technologies Lab - งานที่ 4: Frontend & Web Services Integration
 * ไฟล์: js/api.js
 * หน้าที่: โมดูลสื่อสารกับ Web Services หลังบ้านด้วย Fetch API
 *          รวมศูนย์การเรียก API สำหรับการยืนยันตัวตน, จัดการสินค้า, จัดการผู้ใช้,
 *          ดึงข้อมูลประวัติคำสั่งซื้อ และเชื่อมต่อ Public API อัตราแลกเปลี่ยนเงินเยน (JPY)
 * ==============================================================================
 */

// ที่อยู่หลัก (Base URL) ของ Web Services Backend บนเครื่อง Localhost
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * ฟังก์ชันกลางสำหรับเรียกใช้งาน Fetch API (fetchApi)
 * ทำหน้าที่แนบ Header มาตรฐาน, แปลง JSON และดักจับ Error ส่งต่อให้ฟังก์ชันต้นทาง
 * 
 * @param {string} endpoint - พาธของ API เช่น '/products' หรือ '/auth/login'
 * @param {object} options - อ็อบเจกต์ตัวเลือกของ Fetch เช่น method, headers, body
 * @returns {Promise<any>} - ข้อมูลผลลัพธ์ JSON ที่ได้รับจากเซิร์ฟเวอร์
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json', // ระบุประเภทเนื้อหาเป็น JSON
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    // ถ้า HTTP Status Code ไม่อยู่ในช่วง 200-299 ให้โยน Error ออกมา
    if (!response.ok) {
      const errorMsg = data.message || `HTTP Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (error) {
    console.warn(`[Unimart API ข้อความแจ้งเตือน] เรียกใช้งาน ${endpoint} ไม่สำเร็จ:`, error.message);
    throw error;
  }
}

/**
 * อ็อบเจกต์ UnimartAPI: รวบรวมเมธอดสำหรับเรียก Web Services ทั้งหมดของระบบ
 */
const UnimartAPI = {

  // ============================================================================
  // 1. ระบบยืนยันตัวตนและการจัดการเซสชัน (Authentication & Session Management)
  // ============================================================================

  /**
   * เข้าสู่ระบบ (Login)
   * ส่ง username และ password ไปยัง POST /api/auth/login
   * หากสำเร็จจะบันทึกข้อมูลผู้ใช้และ Token ลงใน localStorage
   * 
   * @param {string} username - ชื่อผู้เข้าใช้
   * @param {string} password - รหัสผ่าน
   */
  async login(username, password) {
    try {
      const result = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (result.success && result.user) {
        // บันทึกข้อมูลโปรไฟล์และ Token ลงใน localStorage ของเบราว์เซอร์
        localStorage.setItem('unimart_user', JSON.stringify(result.user));
        localStorage.setItem('unimart_token', result.token || '');
      }
      return result;
    } catch (error) {
      // โหมดสำรองออฟไลน์ (Offline Fallback): ช่วยให้ทดสอบล็อกอินได้แม้ปิดเซิร์ฟเวอร์
      console.warn('สลับไปใช้ระบบตรวจสอบบัญชีตัวอย่างจำลอง (Offline Mode)...');
      if (username === 'admin' && password === 'admin123') {
        const adminUser = {
          id: 1,
          username: 'admin',
          fullname: 'ธนวัฒน์ แสนโบราณ (Admin RakGundam)',
          email: 'adminrakgundam01@gmail.com',
          role: 'Super Admin',
          status: 'Active'
        };
        localStorage.setItem('unimart_user', JSON.stringify(adminUser));
        return { success: true, user: adminUser, message: 'เข้าสู่ระบบสำเร็จ (Offline Mode)' };
      } else if (username === 'GundamLover159' && password === 'customer123') {
        const customerUser = {
          id: 6,
          username: 'GundamLover159',
          fullname: 'กันดัม เลิฟเวอร์',
          email: 'gundamlover159@gmail.com',
          role: 'Customer',
          status: 'Active'
        };
        localStorage.setItem('unimart_user', JSON.stringify(customerUser));
        return { success: true, user: customerUser, message: 'เข้าสู่ระบบสำเร็จ (Offline Mode)' };
      }
      throw error;
    }
  },

  /**
   * ออกจากระบบ (Logout)
   * ล้างค่าข้อมูลผู้ใช้ใน localStorage และนำทางกลับไปยังหน้าล็อกอิน
   */
  logout() {
    localStorage.removeItem('unimart_user');
    localStorage.removeItem('unimart_token');
    window.location.href = 'login.html';
  },

  /**
   * ดึงข้อมูลผู้ใช้งานปัจจุบันที่เข้าสู่ระบบค้างไว้ใน localStorage
   * @returns {object|null} ข้อมูลโปรไฟล์ผู้ใช้ หรือ null ถ้ายังไม่ได้ล็อกอิน
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('unimart_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // ============================================================================
  // 2. เว็บเซอร์วิสจัดการสินค้า (Products Services: CRUD & Multi-criteria Search)
  // ============================================================================

  /**
   * ค้นหาและดึงรายการสินค้า (Search & View Products)
   * ส่งคำขอ GET /api/products พร้อมแนบ Query Parameters ต่าง ๆ
   * 
   * @param {object} params - ตัวกรอง เช่น { q, grade, category, minPrice, maxPrice, sortBy, status }
   * @returns {Promise<Array>} รายการสินค้า
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.grade) query.append('grade', params.grade);
    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const res = await fetchApi(`/products${queryString}`);
      return res.data || [];
    } catch (err) {
      // Fallback: ดึงข้อมูลจาก localStorage หรือไฟล์ products.js หากเซิร์ฟเวอร์ยังไม่เปิด (Offline / Cloudflare Pages Mode)
      console.warn('เซิร์ฟเวอร์ Backend ยังไม่พร้อม ใช้งานโมเดลสำรองจาก localStorage / products.js');
      let list = [];
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_products') : null;
        if (stored) {
          list = JSON.parse(stored);
        }
      } catch (e) {
        list = [];
      }

      if (!list || list.length === 0) {
        if (typeof window !== 'undefined' && Array.isArray(window.UNIMART_PRODUCTS)) {
          list = JSON.parse(JSON.stringify(window.UNIMART_PRODUCTS));
          try {
            localStorage.setItem('unimart_local_products', JSON.stringify(list));
          } catch (e) {}
        }
      }

      if (params.q) {
        const t = params.q.toLowerCase();
        list = list.filter(p => (p.name && p.name.toLowerCase().includes(t)) || (p.series && p.series.toLowerCase().includes(t)));
      }
      if (params.grade) list = list.filter(p => p.grade && p.grade.toLowerCase() === params.grade.toLowerCase());
      if (params.category) list = list.filter(p => p.category && p.category.toLowerCase() === params.category.toLowerCase());
      return list;
    }
  },

  /**
   * ดึงรายละเอียดสินค้าเดี่ยวตามรหัส ID
   * ส่งคำขอ GET /api/products/:id
   * 
   * @param {number|string} id - รหัสสินค้า
   * @returns {Promise<object|null>} ข้อมูลสินค้า
   */
  async getProductById(id) {
    try {
      const res = await fetchApi(`/products/${id}`);
      return res.data;
    } catch (err) {
      const numId = parseInt(id, 10);
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_products') : null;
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find(p => p.id === numId);
          if (found) return found;
        }
      } catch (e) {}

      if (typeof window !== 'undefined' && Array.isArray(window.UNIMART_PRODUCTS)) {
        return window.UNIMART_PRODUCTS.find(p => p.id === numId) || null;
      }
      return null;
    }
  },

  /**
   * เพิ่มสินค้าใหม่เข้าสู่ระบบ (Insert Product)
   * ส่งคำขอ POST /api/products พร้อมข้อมูลสินค้าในรูปแบบ JSON
   * 
   * @param {object} productData - ข้อมูลสินค้าใหม่
   */
  async createProduct(productData) {
    try {
      return await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    } catch (err) {
      console.warn('บันทึกลง Backend ไม่สำเร็จ สลับไปบันทึกลง localStorage (Offline / Cloudflare Pages Mode):', err.message);
      let list = [];
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_products') : null;
        if (stored) list = JSON.parse(stored);
      } catch (e) { list = []; }

      if (!list || list.length === 0) {
        if (typeof window !== 'undefined' && Array.isArray(window.UNIMART_PRODUCTS)) {
          list = JSON.parse(JSON.stringify(window.UNIMART_PRODUCTS));
        }
      }

      const newId = list.length > 0 ? Math.max(...list.map(p => Number(p.id) || 0)) + 1 : 1;
      const createdItem = { id: newId, ...productData };
      list.unshift(createdItem);

      try {
        localStorage.setItem('unimart_local_products', JSON.stringify(list));
      } catch (e) {
        console.warn('ไม่สามารถบันทึกรูปภาพขนาดใหญ่ลงใน localStorage ได้:', e);
      }

      return { success: true, message: 'เพิ่มสินค้าสำเร็จ (Offline / Cloudflare Mode)', data: createdItem };
    }
  },

  /**
   * แก้ไขข้อมูลสินค้า (Update Product)
   * ส่งคำขอ PUT /api/products/:id พร้อมข้อมูลฟิลด์ที่ต้องการแก้ไข
   * 
   * @param {number|string} id - รหัสสินค้าที่ต้องการแก้ไข
   * @param {object} productData - ข้อมูลที่ต้องการอัปเดต
   */
  async updateProduct(id, productData) {
    try {
      return await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    } catch (err) {
      console.warn('อัปเดตลง Backend ไม่สำเร็จ สลับไปอัปเดตลง localStorage (Offline / Cloudflare Pages Mode):', err.message);
      let list = [];
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_products') : null;
        if (stored) list = JSON.parse(stored);
      } catch (e) { list = []; }

      if (!list || list.length === 0) {
        if (typeof window !== 'undefined' && Array.isArray(window.UNIMART_PRODUCTS)) {
          list = JSON.parse(JSON.stringify(window.UNIMART_PRODUCTS));
        }
      }

      const numId = parseInt(id, 10);
      const index = list.findIndex(p => p.id === numId);
      if (index !== -1) {
        list[index] = { ...list[index], ...productData };
        try {
          localStorage.setItem('unimart_local_products', JSON.stringify(list));
        } catch (e) {
          console.warn('ไม่สามารถบันทึกขนาดใหญ่ลงใน localStorage ได้:', e);
        }
        return { success: true, message: 'แก้ไขสินค้าสำเร็จ (Offline / Cloudflare Mode)', data: list[index] };
      }
      throw new Error(`ไม่พบสินค้ารหัส ID ${id}`);
    }
  },

  /**
   * ลบสินค้าออกจากระบบ (Delete Product)
   * ส่งคำขอ DELETE /api/products/:id
   * 
   * @param {number|string} id - รหัสสินค้าที่ต้องการลบ
   */
  async deleteProduct(id) {
    try {
      return await fetchApi(`/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('ลบข้อมูลบน Backend ไม่สำเร็จ สลับไปลบใน localStorage (Offline / Cloudflare Pages Mode):', err.message);
      let list = [];
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_products') : null;
        if (stored) list = JSON.parse(stored);
      } catch (e) { list = []; }

      if (!list || list.length === 0) {
        if (typeof window !== 'undefined' && Array.isArray(window.UNIMART_PRODUCTS)) {
          list = JSON.parse(JSON.stringify(window.UNIMART_PRODUCTS));
        }
      }

      const numId = parseInt(id, 10);
      list = list.filter(p => p.id !== numId);
      try {
        localStorage.setItem('unimart_local_products', JSON.stringify(list));
      } catch (e) {}

      return { success: true, message: 'ลบสินค้าสำเร็จ (Offline / Cloudflare Mode)' };
    }
  },

  // ============================================================================
  // 3. เว็บเซอร์วิสจัดการผู้ใช้งาน (Users Services: CRUD & Search)
  // ============================================================================

  /**
   * ดึงรายชื่อผู้ใช้และแอดมินทั้งหมด หรือค้นหาตามเงื่อนไข (Search & View Users)
   * ส่งคำขอ GET /api/users
   * 
   * @param {object} params - ตัวกรอง เช่น { q, role, status }
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    try {
      const res = await fetchApi(`/users${queryString}`);
      return res.data || [];
    } catch (err) {
      console.warn('เซิร์ฟเวอร์ยังไม่พร้อม สลับไปใช้ข้อมูลผู้ใช้จำลอง');
      return [
        { id: 1, fullname: 'ธนวัฒน์ แสนโบราณ (Admin RakGundam)', username: 'admin', email: 'adminrakgundam01@gmail.com', phone: '095-125-1834', role: 'Super Admin', status: 'Active' },
        { id: 2, fullname: 'ณิชาภัทร วิชาธรรม', username: 'nichaphat', email: 'nichaphat.wic@student.mahidol.ac.th', phone: '081-234-5678', role: 'Manager', status: 'Active' },
        { id: 3, fullname: 'อโยสรา ต้องทรัพย์', username: 'ayosara', email: 'ayosara.ton@student.mahidol.ac.th', phone: '082-345-6789', role: 'Staff', status: 'Active' },
        { id: 4, fullname: 'คชาธร ศิริเลิศ', username: 'khachatorn', email: 'khachatorn.sir@student.mahidol.ac.th', phone: '083-456-7890', role: 'Staff', status: 'Active' },
        { id: 5, fullname: 'ธัญชนก โรจนสฤษฎิ์', username: 'thanchanok', email: 'thanchanok.roj@student.mahidol.ac.th', phone: '084-567-8901', role: 'Staff', status: 'Active' },
        { id: 6, fullname: 'กันดัม เลิฟเวอร์', username: 'GundamLover159', email: 'gundamlover159@gmail.com', phone: '098-159-1594', role: 'Customer', status: 'Active' }
      ];
    }
  },

  /**
   * ดึงข้อมูลผู้ใช้เดี่ยวตามรหัส ID
   * @param {number|string} id - รหัสผู้ใช้
   */
  async getUserById(id) {
    const res = await fetchApi(`/users/${id}`);
    return res.data;
  },

  /**
   * เพิ่มผู้ใช้หรือเจ้าหน้าที่ใหม่ (Insert User)
   * ส่งคำขอ POST /api/users
   * @param {object} userData - ข้อมูลผู้ใช้ใหม่
   */
  async createUser(userData) {
    return await fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * แก้ไขข้อมูลผู้ใช้ (Update User)
   * ส่งคำขอ PUT /api/users/:id
   * @param {number|string} id - รหัสผู้ใช้
   * @param {object} userData - ข้อมูลที่ต้องการแก้ไข
   */
  async updateUser(id, userData) {
    return await fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  /**
   * ลบผู้ใช้ออกจากระบบ (Delete User)
   * ส่งคำขอ DELETE /api/users/:id
   * @param {number|string} id - รหัสผู้ใช้
   */
  async deleteUser(id) {
    return await fetchApi(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  // ============================================================================
  // 4. การเชื่อมต่อกับ PUBLIC API ภายนอก (FOREIGN CURRENCY EXCHANGE RATE)
  // ตรงตามเกณฑ์งานที่ 4 ข้อ 11: เชื่อมต่อ API สาธารณะที่เป็นประโยชน์ต่อแอปพลิเคชัน
  // ============================================================================

  /**
   * ดึงอัตราแลกเปลี่ยนเงินเยนญี่ปุ่น (JPY) เทียบเงินบาทไทย (THB)
   * สามารถส่งจำนวนเงินเยนมาเพื่อให้แปลงเป็นเงินบาทได้โดยตรง
   * 
   * @param {number|null} amountJpy - จำนวนเงินเยนที่ต้องการคำนวณ (ถ้ามี)
   * @returns {Promise<object>} อัตราแลกเปลี่ยนและผลการคำนวณ
   */
  async getExchangeRate(amountJpy = null) {
    try {
      const endpoint = amountJpy ? `/public/exchange-rate?amount_jpy=${amountJpy}` : '/public/exchange-rate';
      return await fetchApi(endpoint);
    } catch {
      // Fallback Rate: 1 JPY = 0.238 THB
      const rate = 0.238;
      return {
        success: true,
        provider: 'Offline Fallback',
        base_currency: 'JPY',
        target_currency: 'THB',
        rate: rate,
        conversion: amountJpy ? {
          amount_jpy: amountJpy,
          converted_thb: Math.round(amountJpy * rate),
          formatted_thb: `${Math.round(amountJpy * rate).toLocaleString()} บาท`
        } : null
      };
    }
  },

  // ============================================================================
  // 5. บริการประวัติคำสั่งซื้อ (ORDERS SERVICES)
  // ============================================================================

  /**
   * ดึงประวัติคำสั่งซื้อของลูกค้ารายบุคคล (สำหรับหน้า profile.html)
   * @param {number|string} userId - รหัสลูกค้า
   */
  async getUserOrders(userId) {
    try {
      const res = await fetchApi(`/orders/user/${userId}`);
      return res.data || [];
    } catch {
      return [];
    }
  }
};

// ผูกอ็อบเจกต์เข้ากับ window เพื่อให้สคริปต์ในทุกหน้า HTML เรียกใช้งานผ่าน window.UnimartAPI ได้
if (typeof window !== 'undefined') {
  window.UnimartAPI = UnimartAPI;
}
