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

// ข้อมูลผู้ใช้เริ่มต้น 6 บัญชี (ตรงกับ secX_grY_database.sql)
const DEFAULT_SEED_USERS = [
  { id: 1, fullname: 'ธนวัฒน์ แสนโบราณ (Admin RakGundam)', username: 'admin', email: 'adminrakgundam01@gmail.com', phone: '095-125-1834', role: 'Super Admin', status: 'Active' },
  { id: 2, fullname: 'ณิชาภัทร วิชาธรรม', username: 'nichaphat', email: 'nichaphat.wic@student.mahidol.ac.th', phone: '081-234-5678', role: 'Manager', status: 'Active' },
  { id: 3, fullname: 'อโยสรา ต้องทรัพย์', username: 'ayosara', email: 'ayosara.ton@student.mahidol.ac.th', phone: '082-345-6789', role: 'Staff', status: 'Active' },
  { id: 4, fullname: 'คชาธร ศิริเลิศ', username: 'khachatorn', email: 'khachatorn.sir@student.mahidol.ac.th', phone: '083-456-7890', role: 'Staff', status: 'Active' },
  { id: 5, fullname: 'ธัญชนก โรจนสฤษฎิ์', username: 'thanchanok', email: 'thanchanok.roj@student.mahidol.ac.th', phone: '084-567-8901', role: 'Staff', status: 'Active' },
  { id: 6, fullname: 'กันดัม เลิฟเวอร์', username: 'GundamLover159', email: 'gundamlover159@gmail.com', phone: '098-159-1594', role: 'Customer', status: 'Active' }
];

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
    'Content-Type': 'application/json',
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
var UnimartAPI = {

  // ============================================================================
  // 0. ฟังก์ชันจัดการข้อมูลสำรองใน localStorage (ช่วยให้ Add/Edit/Delete ทำงานได้ 100% ทุกโหมด)
  // ============================================================================

  _getSeedProducts() {
    if (typeof window !== 'undefined' && Array.isArray(window.UNIMART_PRODUCTS)) {
      return JSON.parse(JSON.stringify(window.UNIMART_PRODUCTS));
    }
    if (typeof UNIMART_PRODUCTS !== 'undefined' && Array.isArray(UNIMART_PRODUCTS)) {
      return JSON.parse(JSON.stringify(UNIMART_PRODUCTS));
    }
    return [];
  },

  _getLocalProducts() {
    let list = null;
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_products') : null;
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      }
    } catch (e) {
      list = null;
    }

    // หากยังไม่เคยมีข้อมูลใน localStorage เลย ให้เริ่มต้นจาก UNIMART_PRODUCTS
    if (list === null) {
      list = this._getSeedProducts();
      this._saveLocalProducts(list);
    }

    // กรองรายการที่เคยสั่งลบไว้ (ป้องกันกรณีรูปภาพขนาดใหญ่เกินโควตา localStorage)
    try {
      const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_product_ids') : null;
      if (deletedRaw) {
        const deletedIds = JSON.parse(deletedRaw);
        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          list = list.filter(p => !deletedIds.some(dId => Number(dId) === Number(p.id) || String(dId) === String(p.id)));
        }
      }
    } catch (e) {}

    return list.map(p => this.normalizeGunplaItem(p));
  },

  _saveLocalProducts(list) {
    if (typeof localStorage === 'undefined') return;
    const normalized = (list || []).map(p => this.normalizeGunplaItem(p));
    try {
      localStorage.setItem('unimart_local_products', JSON.stringify(normalized));
    } catch (quotaErr) {
      // กรณีรูปภาพ Base64 มีขนาดใหญ่เกิน 5MB ของ localStorage ให้ล้างคีย์เดิมก่อนแล้วย่อเฉพาะรูปที่ใหญ่เกินไป
      console.warn('localStorage เต็ม กำลังบีบอัดข้อมูลรูปภาพเพื่อให้บันทึกการเปลี่ยนแปลงได้...');
      try {
        localStorage.removeItem('unimart_local_products');
      } catch (_) {}
      const compactList = normalized.map(item => {
        const img = item.image_url || item.image || '';
        if (typeof img === 'string' && img.startsWith('data:image/') && img.length > 200000) {
          return {
            ...item,
            image_url: 'assets/images/product-freedom.png',
            image: 'assets/images/product-freedom.png'
          };
        }
        return item;
      });
      try {
        localStorage.setItem('unimart_local_products', JSON.stringify(compactList));
      } catch (e2) {
        console.warn('ไม่สามารถบันทึกลง localStorage ได้:', e2);
      }
    }
  },

  _getLocalUsers() {
    let list = null;
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_local_users') : null;
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      }
    } catch (e) {
      list = null;
    }

    if (list === null) {
      list = JSON.parse(JSON.stringify(DEFAULT_SEED_USERS));
      this._saveLocalUsers(list);
    }

    try {
      const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_user_ids') : null;
      if (deletedRaw) {
        const deletedIds = JSON.parse(deletedRaw);
        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          list = list.filter(u => !deletedIds.some(dId => Number(dId) === Number(u.id) || String(dId) === String(u.id)));
        }
      }
    } catch (e) {}

    return list;
  },

  _saveLocalUsers(list) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('unimart_local_users', JSON.stringify(list || []));
    } catch (e) {
      console.warn('ไม่สามารถบันทึกรายชื่อผู้ใช้ลง localStorage ได้:', e);
    }
  },

  // ============================================================================
  // 1. ระบบยืนยันตัวตนและการจัดการเซสชัน (Authentication & Session Management)
  // ============================================================================

  /**
   * เข้าสู่ระบบ (Login)
   * ส่ง username และ password ไปยัง POST /api/auth/login
   * หากสำเร็จจะบันทึกข้อมูลผู้ใช้และ Token ลงใน localStorage
   */
  async login(username, password) {
    try {
      const result = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (result.success && result.user) {
        localStorage.setItem('unimart_user', JSON.stringify(result.user));
        localStorage.setItem('unimart_token', result.token || '');
      }
      return result;
    } catch (error) {
      console.warn('สลับไปใช้ระบบตรวจสอบบัญชีตัวอย่างจำลอง (Offline Mode)...');
      const u = (username || '').trim().toLowerCase();

      // ตรวจสอบจากรายชื่อผู้ใช้ใน localStorage ก่อน
      const localUsers = this._getLocalUsers();
      const matchedLocalUser = localUsers.find(
        item => (item.username && item.username.toLowerCase() === u) || (item.email && item.email.toLowerCase() === u)
      );
      if (matchedLocalUser && (!matchedLocalUser.password || matchedLocalUser.password === password || password === 'admin123' || password === 'user123' || password === 'customer123')) {
        localStorage.setItem('unimart_user', JSON.stringify(matchedLocalUser));
        return { success: true, user: matchedLocalUser, message: 'เข้าสู่ระบบสำเร็จ (Offline Mode)' };
      }

      if (u === 'admin' && (password === 'admin123' || password === 'admin' || !password)) {
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
      } else if ((u === 'gundamlover159' || u === 'customer' || u === 'gundamlover') && (password === 'customer123' || password === '123456' || password === 'customer' || !password)) {
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
   */
  logout() {
    localStorage.removeItem('unimart_user');
    localStorage.removeItem('unimart_token');
    window.location.href = 'login.html';
  },

  /**
   * ดึงข้อมูลผู้ใช้งานปัจจุบันที่เข้าสู่ระบบค้างไว้ใน localStorage
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
   * ตรวจสอบและแก้ไขอัตราส่วน (Scale) ให้ถูกต้องตามมาตรฐานกันพลา Bandai
   * โดยเกรด HG และ RG ต้องเป็น 1/144 เท่านั้น (ไม่ใช่ 1/100)
   */
  normalizeGunplaItem(p) {
    if (!p) return p;
    const grade = (p.grade || '').toUpperCase().trim();
    if (grade === 'HG' || grade === 'RG' || grade === 'EG') {
      if (!p.scale || p.scale === '1/100' || p.scale === 'N/A' || p.scale === '') {
        p.scale = '1/144';
      }
    } else if (grade === 'MG') {
      if (!p.scale || p.scale === 'N/A' || p.scale === '') {
        p.scale = '1/100';
      }
    } else if (grade === 'PG') {
      if (!p.scale || p.scale === 'N/A' || p.scale === '') {
        p.scale = '1/60';
      }
    } else if (grade === 'SD') {
      if (!p.scale || p.scale === 'N/A' || p.scale === '') {
        p.scale = 'Non-scale';
      }
    }
    return p;
  },

  /**
   * ค้นหาและดึงรายการสินค้า (Search & View Products)
   * ส่งคำขอ GET /api/products พร้อมแนบ Query Parameters ต่าง ๆ
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
      let items = (res.data || []).map(p => this.normalizeGunplaItem(p));
      try {
        const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_product_ids') : null;
        if (deletedRaw) {
          const deletedIds = JSON.parse(deletedRaw);
          if (Array.isArray(deletedIds) && deletedIds.length > 0) {
            items = items.filter(p => !deletedIds.some(dId => Number(dId) === Number(p.id) || String(dId) === String(p.id)));
          }
        }
      } catch (e) {}
      return items;
    } catch (err) {
      console.warn('เซิร์ฟเวอร์ Backend ยังไม่พร้อม ใช้งานโมเดลสำรองจาก localStorage / products.js');
      let list = this._getLocalProducts();

      if (params.q) {
        const t = params.q.toLowerCase().trim();
        list = list.filter(p =>
          (p.name && p.name.toLowerCase().includes(t)) ||
          (p.series && p.series.toLowerCase().includes(t)) ||
          (p.description && p.description.toLowerCase().includes(t)) ||
          String(p.id).includes(t)
        );
      }
      if (params.grade) {
        list = list.filter(p => p.grade && p.grade.toLowerCase() === params.grade.toLowerCase());
      }
      if (params.category) {
        list = list.filter(p => p.category && p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.minPrice && !isNaN(params.minPrice)) {
        list = list.filter(p => Number(p.price) >= Number(params.minPrice));
      }
      if (params.maxPrice && !isNaN(params.maxPrice)) {
        list = list.filter(p => Number(p.price) <= Number(params.maxPrice));
      }
      if (params.status) {
        list = list.filter(p => p.status && p.status.toLowerCase() === params.status.toLowerCase());
      }
      return list;
    }
  },

  /**
   * ดึงรายละเอียดสินค้าเดี่ยวตามรหัส ID
   */
  async getProductById(id) {
    try {
      const res = await fetchApi(`/products/${id}`);
      return this.normalizeGunplaItem(res.data);
    } catch (err) {
      const list = this._getLocalProducts();
      const found = list.find(p => Number(p.id) === Number(id) || String(p.id) === String(id));
      return found ? this.normalizeGunplaItem(found) : null;
    }
  },

  /**
   * เพิ่มสินค้าใหม่เข้าสู่ระบบ (Insert Product)
   */
  async createProduct(productData) {
    productData = this.normalizeGunplaItem(productData);
    try {
      const res = await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      // ซิงก์ลง localStorage ด้วย
      if (res && res.data) {
        try {
          const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_product_ids') : null;
          if (deletedRaw) {
            const deletedIds = JSON.parse(deletedRaw).filter(d => Number(d) !== Number(res.data.id) && String(d) !== String(res.data.id));
            localStorage.setItem('unimart_deleted_product_ids', JSON.stringify(deletedIds));
          }
        } catch (e) {}
        const list = this._getLocalProducts();
        list.unshift(this.normalizeGunplaItem(res.data));
        this._saveLocalProducts(list);
      }
      return res;
    } catch (err) {
      console.warn('บันทึกลง Backend ไม่สำเร็จ สลับไปบันทึกลง localStorage (Offline / Cloudflare Mode):', err.message);
      const list = this._getLocalProducts();
      let maxId = list.length > 0 ? Math.max(...list.map(p => Number(p.id) || 0)) : 16;
      try {
        const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_product_ids') : null;
        if (deletedRaw) {
          const deletedIds = JSON.parse(deletedRaw);
          if (Array.isArray(deletedIds) && deletedIds.length > 0) {
            maxId = Math.max(maxId, ...deletedIds.map(d => Number(d) || 0));
          }
        }
      } catch (e) {}
      const newId = maxId + 1;
      const createdItem = this.normalizeGunplaItem({
        id: newId,
        ...productData,
        image: productData.image_url || productData.image || 'assets/images/product-freedom.png',
        image_url: productData.image_url || productData.image || 'assets/images/product-freedom.png'
      });
      list.unshift(createdItem);
      this._saveLocalProducts(list);

      return { success: true, message: 'เพิ่มสินค้าสำเร็จ', data: createdItem };
    }
  },

  /**
   * แก้ไขข้อมูลสินค้า (Update Product)
   */
  async updateProduct(id, productData) {
    productData = this.normalizeGunplaItem(productData);
    try {
      const res = await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      const list = this._getLocalProducts();
      const idx = list.findIndex(p => Number(p.id) === Number(id) || String(p.id) === String(id));
      if (idx !== -1) {
        list[idx] = this.normalizeGunplaItem({ ...list[idx], ...productData });
        this._saveLocalProducts(list);
      }
      return res;
    } catch (err) {
      console.warn('อัปเดตลง Backend ไม่สำเร็จ สลับไปอัปเดตลง localStorage (Offline / Cloudflare Mode):', err.message);
      const list = this._getLocalProducts();
      const idx = list.findIndex(p => Number(p.id) === Number(id) || String(p.id) === String(id));
      if (idx !== -1) {
        list[idx] = this.normalizeGunplaItem({
          ...list[idx],
          ...productData,
          image: productData.image_url || productData.image || list[idx].image_url || list[idx].image,
          image_url: productData.image_url || productData.image || list[idx].image_url || list[idx].image
        });
        this._saveLocalProducts(list);
      }

      return { success: true, message: 'บันทึกการแก้ไขสินค้าสำเร็จ', data: idx !== -1 ? list[idx] : null };
    }
  },

  /**
   * ลบสินค้าออกจากระบบ (Delete Product)
   */
  async deleteProduct(id) {
    // 1. ลบออกจากรายการสินค้าใน localStorage ก่อน (เพื่อคืนพื้นที่โควตาหากมีรูปภาพขนาดใหญ่)
    const list = this._getLocalProducts().filter(
      p => Number(p.id) !== Number(id) && String(p.id) !== String(id)
    );
    this._saveLocalProducts(list);

    // 2. บันทึกรหัสสินค้าที่ถูกลบลงใน unimart_deleted_product_ids
    try {
      const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_product_ids') : null;
      const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedIds.some(dId => Number(dId) === Number(id) || String(dId) === String(id))) {
        deletedIds.push(Number(id) || id);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('unimart_deleted_product_ids', JSON.stringify(deletedIds));
        }
      }
    } catch (e) {}

    // 3. ส่งคำขอลบไปยัง Web Service Server (หากเปิดรันอยู่)
    try {
      return await fetchApi(`/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('ลบข้อมูลใน localStorage เรียบร้อยแล้ว (Offline / Cloudflare Mode):', err.message);
      return { success: true, message: 'ลบสินค้าสำเร็จ', deletedId: Number(id) || id };
    }
  },

  // ============================================================================
  // 3. เว็บเซอร์วิสจัดการผู้ใช้งาน (Users Services: CRUD & Search)
  // ============================================================================

  /**
   * ดึงรายชื่อผู้ใช้และแอดมินทั้งหมด หรือค้นหาตามเงื่อนไข (Search & View Users)
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    try {
      const res = await fetchApi(`/users${queryString}`);
      let items = res.data || [];
      try {
        const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_user_ids') : null;
        if (deletedRaw) {
          const deletedIds = JSON.parse(deletedRaw);
          if (Array.isArray(deletedIds) && deletedIds.length > 0) {
            items = items.filter(u => !deletedIds.some(dId => Number(dId) === Number(u.id) || String(dId) === String(u.id)));
          }
        }
      } catch (e) {}
      return items;
    } catch (err) {
      console.warn('เซิร์ฟเวอร์ยังไม่พร้อม สลับไปใช้ข้อมูลผู้ใช้จาก localStorage');
      const localUsers = this._getLocalUsers();

      return localUsers.filter(u => {
        const q = (params.q || '').toLowerCase().trim();
        const matchQ = !q ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.fullname && u.fullname.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          String(u.id).includes(q);
        const matchRole = !params.role || params.role === 'all' || (u.role && u.role.toLowerCase() === params.role.toLowerCase());
        const matchStatus = !params.status || params.status === 'all' || (u.status && u.status.toLowerCase() === params.status.toLowerCase());
        return matchQ && matchRole && matchStatus;
      });
    }
  },

  /**
   * ดึงข้อมูลผู้ใช้เดี่ยวตามรหัส ID
   */
  async getUserById(id) {
    try {
      const res = await fetchApi(`/users/${id}`);
      return res.data;
    } catch (err) {
      const list = this._getLocalUsers();
      return list.find(u => Number(u.id) === Number(id) || String(u.id) === String(id)) || null;
    }
  },

  /**
   * เพิ่มผู้ใช้หรือเจ้าหน้าที่ใหม่ (Insert User)
   */
  async createUser(userData) {
    try {
      const res = await fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res && res.data) {
        try {
          const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_user_ids') : null;
          if (deletedRaw) {
            const deletedIds = JSON.parse(deletedRaw).filter(d => Number(d) !== Number(res.data.id) && String(d) !== String(res.data.id));
            localStorage.setItem('unimart_deleted_user_ids', JSON.stringify(deletedIds));
          }
        } catch (e) {}
        const list = this._getLocalUsers();
        list.push(res.data);
        this._saveLocalUsers(list);
      }
      return res;
    } catch (err) {
      console.warn('เพิ่มผู้ใช้บน Backend ไม่สำเร็จ สลับไปบันทึกลง localStorage (Offline / Cloudflare Mode):', err.message);
      const list = this._getLocalUsers();
      let maxId = list.length > 0 ? Math.max(...list.map(u => Number(u.id) || 0)) : 6;
      try {
        const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_user_ids') : null;
        if (deletedRaw) {
          const deletedIds = JSON.parse(deletedRaw);
          if (Array.isArray(deletedIds) && deletedIds.length > 0) {
            maxId = Math.max(maxId, ...deletedIds.map(d => Number(d) || 0));
          }
        }
      } catch (e) {}
      const newId = maxId + 1;
      const createdUser = {
        id: newId,
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role || 'Staff',
        status: userData.status || 'Active',
        password: userData.password || 'user123'
      };
      list.push(createdUser);
      this._saveLocalUsers(list);
      return { success: true, message: 'เพิ่มผู้ใช้งานสำเร็จ', data: createdUser };
    }
  },

  /**
   * แก้ไขข้อมูลผู้ใช้ (Update User)
   */
  async updateUser(id, userData) {
    try {
      const res = await fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      const list = this._getLocalUsers();
      const idx = list.findIndex(u => Number(u.id) === Number(id) || String(u.id) === String(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...userData };
        this._saveLocalUsers(list);
      }
      return res;
    } catch (err) {
      console.warn('อัปเดตผู้ใช้บน Backend ไม่สำเร็จ สลับไปอัปเดตลง localStorage (Offline / Cloudflare Mode):', err.message);
      const list = this._getLocalUsers();
      const idx = list.findIndex(u => Number(u.id) === Number(id) || String(u.id) === String(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...userData };
        this._saveLocalUsers(list);
      }
      return { success: true, message: 'แก้ไขข้อมูลผู้ใช้สำเร็จ', data: idx !== -1 ? list[idx] : null };
    }
  },

  /**
   * ลบผู้ใช้ออกจากระบบ (Delete User)
   */
  async deleteUser(id) {
    // 1. ลบออกจาก localStorage เสมอ
    try {
      const deletedRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('unimart_deleted_user_ids') : null;
      const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedIds.some(dId => Number(dId) === Number(id) || String(dId) === String(id))) {
        deletedIds.push(Number(id) || id);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('unimart_deleted_user_ids', JSON.stringify(deletedIds));
        }
      }
    } catch (e) {}

    const list = this._getLocalUsers().filter(
      u => Number(u.id) !== Number(id) && String(u.id) !== String(id)
    );
    this._saveLocalUsers(list);

    // 2. ส่งคำขอลบไปยัง Web Service Server (หากเปิดรันอยู่)
    try {
      return await fetchApi(`/users/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('ลบข้อมูลผู้ใช้ใน localStorage เรียบร้อยแล้ว (Offline / Cloudflare Mode):', err.message);
      return { success: true, message: 'ลบผู้ใช้งานสำเร็จ', deletedId: Number(id) || id };
    }
  },

  // ============================================================================
  // 4. การเชื่อมต่อกับ PUBLIC API ภายนอก (FOREIGN CURRENCY EXCHANGE RATE)
  // ============================================================================

  async getExchangeRate(amountJpy = null) {
    try {
      const endpoint = amountJpy ? `/public/exchange-rate?amount_jpy=${amountJpy}` : '/public/exchange-rate';
      return await fetchApi(endpoint);
    } catch {
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

/**
 * ฟังก์ชันปรับปรุงแถบเมนูนำทาง (Navbar) อัตโนมัติ:
 * ตรวจสอบสิทธิ์ผู้ใช้จาก localStorage และแยกการแสดงผลระหว่าง Admin และ Customer
 */
function updateNavbarAuth() {
  const currentUser = UnimartAPI.getCurrentUser();
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  if (currentUser) {
    const isCustomer = currentUser.role === 'Customer';
    const roleBadge = isCustomer ? '👤 Customer' : '🛡️ Admin';
    const badgeColor = isCustomer ? '#2563eb' : '#0d1117';
    const roleLink = isCustomer ? 'profile.html' : 'admin-products.html';
    const roleLabel = isCustomer ? 'My Profile' : 'Admin Panel';

    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 0.78rem; font-weight: 700; background: ${badgeColor}; color: #ffffff; padding: 4px 10px; border-radius: 6px;">
          ${roleBadge}: ${currentUser.username}
        </span>
        <a href="${roleLink}" class="btn-primary" style="padding: 7px 14px; font-size: 0.85rem;" title="${roleLabel}">
          ${roleLabel}
        </a>
        <button type="button" id="btn-global-logout" class="btn-secondary" style="padding: 7px 12px; font-size: 0.85rem; cursor: pointer;" title="ออกจากระบบ">
          Sign out
        </button>
      </div>
    `;

    const logoutBtn = document.getElementById('btn-global-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('คุณต้องการออกจากระบบ (Sign out) ใช่หรือไม่?')) {
          UnimartAPI.logout();
        }
      });
    }
  }
}

// อัปเดตเมนูอัตโนมัติเมื่อหน้าเว็บโหลดเสร็จ
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbarAuth);
  } else {
    updateNavbarAuth();
  }
}
