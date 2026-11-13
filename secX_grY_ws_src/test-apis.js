// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Task 3: RESTful Web Services Test Suite
// File: test-apis.js
// Description: Automated in-process test runner to verify all endpoints required by Rubric
// ==============================================================================

const app = require('./server');
const { IncomingMessage, ServerResponse } = require('http');
const { Socket } = require('net');

/**
 * In-process mock HTTP requester that dispatches requests directly to Express.
 * Eliminates TCP port collision and OS firewall / sandbox permission issues.
 */
function request(method, url, body = null) {
  return new Promise((resolve) => {
    const socket = new Socket();
    const req = new IncomingMessage(socket);
    req.method = method.toUpperCase();
    req.url = url;

    const bodyStr = body ? JSON.stringify(body) : '';
    req.headers = {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(bodyStr).toString(),
      'accept': 'application/json',
      'host': 'localhost'
    };

    const res = new ServerResponse(req);
    let resBody = '';

    res.write = function (chunk) {
      if (chunk) resBody += chunk.toString();
      return true;
    };

    res.end = function (chunk) {
      if (chunk) resBody += chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(resBody);
      } catch {
        parsed = resBody;
      }
      resolve({ status: res.statusCode, data: parsed, raw: resBody });
    };

    app(req, res);

    if (bodyStr) {
      req.push(bodyStr);
    }
    req.push(null);
  });
}

async function runTests() {
  console.log('\n==============================================================================');
  console.log('🧪 Starting ITDS242 Web Services Automated Verification');
  console.log('==============================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health & Root API
  await test('GET /api - Health & API Directory', async () => {
    const res = await request('GET', '/api');
    if (res.status !== 200 || !res.data.endpoints) throw new Error(`Status ${res.status}`);
  });

  // 2. Authentication
  await test('POST /api/auth/login - Admin Login Success', async () => {
    const res = await request('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
    if (res.status !== 200 || !res.data.success || res.data.user.role !== 'Super Admin') {
      throw new Error(`Expected Super Admin, got ${JSON.stringify(res.data)}`);
    }
  });

  await test('POST /api/auth/login - Customer Login Success', async () => {
    const res = await request('POST', '/api/auth/login', { username: 'GundamLover159', password: 'customer123' });
    if (res.status !== 200 || !res.data.success || res.data.user.role !== 'Customer') {
      throw new Error(`Expected Customer, got ${JSON.stringify(res.data)}`);
    }
  });

  await test('POST /api/auth/login - Invalid Credentials Rejection (401)', async () => {
    const res = await request('POST', '/api/auth/login', { username: 'admin', password: 'wrong_password' });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 3. Products - Search & View
  await test('GET /api/products - Select All (No criteria)', async () => {
    const res = await request('GET', '/api/products');
    if (res.status !== 200 || res.data.count < 16) throw new Error(`Expected at least 16 products, got ${res.data.count}`);
  });

  await test('GET /api/products?q=Freedom - Criteria Search by Keyword', async () => {
    const res = await request('GET', '/api/products?q=Freedom');
    if (res.status !== 200 || res.data.count === 0) throw new Error('Expected results for Freedom');
  });

  await test('GET /api/products?grade=MG&category=gundam - Multi-criteria search', async () => {
    const res = await request('GET', '/api/products?grade=MG&category=gundam');
    if (res.status !== 200 || res.data.count === 0) throw new Error('Expected results for MG gundam');
  });

  await test('GET /api/products/1 - View Single Product Detail', async () => {
    const res = await request('GET', '/api/products/1');
    if (res.status !== 200 || !res.data.data.name) throw new Error('Product 1 not found');
  });

  // 4. Products - Insert, Update, Delete
  let insertedProdId = null;
  await test('POST /api/products - Insert New Product', async () => {
    const res = await request('POST', '/api/products', {
      name: 'MG 1/100 Sazabi Ver.Ka (Test Item)',
      series: "Char's Counterattack",
      grade: 'MG',
      category: 'gundam',
      scale: '1/100',
      price: 2800,
      stock: 10,
      status: 'In Stock'
    });
    if (res.status !== 201 || !res.data.data.id) throw new Error(`Insert failed: ${JSON.stringify(res.data)}`);
    insertedProdId = res.data.data.id;
  });

  await test('PUT /api/products/:id - Update Product', async () => {
    const res = await request('PUT', `/api/products/${insertedProdId}`, {
      price: 2999.00,
      stock: 12
    });
    if (res.status !== 200 || Number(res.data.data.price) !== 2999) throw new Error(`Update failed: ${JSON.stringify(res.data)}`);
  });

  await test('DELETE /api/products/:id - Delete Product', async () => {
    const res = await request('DELETE', `/api/products/${insertedProdId}`);
    if (res.status !== 200 || !res.data.success) throw new Error(`Delete failed: ${JSON.stringify(res.data)}`);
  });

  // 5. Users - Search & View
  await test('GET /api/users - Select All Users', async () => {
    const res = await request('GET', '/api/users');
    if (res.status !== 200 || res.data.count < 6) throw new Error(`Expected at least 6 users, got ${res.data.count}`);
  });

  await test('GET /api/users?role=Staff - Filter by Role', async () => {
    const res = await request('GET', '/api/users?role=Staff');
    if (res.status !== 200 || res.data.count < 3) throw new Error('Expected at least 3 staff members');
  });

  // 6. Users - Insert, Update, Delete
  let insertedUserId = null;
  await test('POST /api/users - Insert New User', async () => {
    const res = await request('POST', '/api/users', {
      username: `test_user_${Date.now()}`,
      password: 'password123',
      fullname: 'ทดสอบ ผู้ใช้งานใหม่',
      email: `test_${Date.now()}@example.com`,
      role: 'Staff',
      status: 'Active'
    });
    if (res.status !== 201 || !res.data.data.id) throw new Error(`Insert user failed: ${JSON.stringify(res.data)}`);
    insertedUserId = res.data.data.id;
  });

  await test('PUT /api/users/:id - Update User', async () => {
    const res = await request('PUT', `/api/users/${insertedUserId}`, {
      phone: '099-888-7777',
      preferences: 'ทดสอบการแก้ไขข้อมูลความสนใจ'
    });
    if (res.status !== 200) throw new Error(`Update user failed: ${JSON.stringify(res.data)}`);
  });

  await test('DELETE /api/users/:id - Delete User', async () => {
    const res = await request('DELETE', `/api/users/${insertedUserId}`);
    if (res.status !== 200 || !res.data.success) throw new Error(`Delete user failed: ${JSON.stringify(res.data)}`);
  });

  // 7. Public API - Currency Exchange
  await test('GET /api/public/exchange-rate - Foreign Currency Public API', async () => {
    const res = await request('GET', '/api/public/exchange-rate?amount_jpy=5500');
    if (res.status !== 200 || !res.data.rate || !res.data.conversion) {
      throw new Error(`Public API failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 8. Orders
  await test('GET /api/orders/user/6 - Customer Order History', async () => {
    const res = await request('GET', '/api/orders/user/6');
    if (res.status !== 200 || res.data.count === 0) throw new Error('Order history not found');
  });

  console.log('\n==============================================================================');
  console.log(`🏁 Test Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('==============================================================================\n');

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
