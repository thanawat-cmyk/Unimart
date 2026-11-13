// ==============================================================================
// คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยมหิดล (ICT Mahidol)
// วิชา ITDS242 Web Technologies Lab - งานที่ 3 & 4: Public Web Service Integration
// ไฟล์: routes/publicApi.js
// หน้าที่: เชื่อมต่อไปยัง Public API ภายนอก เพื่อดึงอัตราแลกเปลี่ยนสกุลเงิน (Exchange Rate)
//          แปลงเงินเยนญี่ปุ่น (JPY) เป็นเงินบาทไทย (THB) ให้กับร้านกันพลา Unimart
//          ตรงตามข้อกำหนดเกณฑ์อาจารย์งานที่ 4 ข้อ 11 (การเชื่อมต่อเว็บเซอร์วิสสาธารณะ)
// ==============================================================================

const express = require('express');
const router = express.Router();

// ข้อมูลอัตราแลกเปลี่ยนสำรอง (Fallback Reference): ใช้กรณีที่เครื่องออฟไลน์หรือไม่สามารถติดต่อ Public API ภายนอกได้
const DEFAULT_EXCHANGE_DATA = {
  source: 'Mock Fallback / ธนาคารแห่งประเทศไทย (BOT Reference)',
  base: 'JPY',
  target: 'THB',
  rate: 0.238, // 1 JPY ≈ 0.238 THB (หรือประมาณ 100 JPY = 23.8 THB)
  last_updated: new Date().toISOString()
};

// ==============================================================================
// 1. GET /api/public/exchange-rate - การเชื่อมต่อกับ Public API ภายนอก
// ==============================================================================
// Postman Test Sample 1 (ดึงข้อมูลอัตราแลกเปลี่ยนปัจจุบัน JPY เป็น THB):
// method: GET
// URL: http://localhost:3000/api/public/exchange-rate
//
// Postman Test Sample 2 (คำนวณแปลงค่าเงินเยน 5500 JPY เป็นเงินบาทไทย):
// method: GET
// URL: http://localhost:3000/api/public/exchange-rate?amount_jpy=5500
// ==============================================================================
router.get('/exchange-rate', async (req, res) => {
  // รับพารามิเตอร์ amount_jpy เช่น ?amount_jpy=5500
  const { amount_jpy } = req.query;

  try {
    let rate = DEFAULT_EXCHANGE_DATA.rate;
    let provider = 'ExchangeRate-API (Live Public API)';
    let lastUpdated = DEFAULT_EXCHANGE_DATA.last_updated;

    // ขั้นตอนที่ 1: ยิง Request ไปยัง Public API ทางการ (ExchangeRate-API)
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/JPY', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000) // กำหนด Timeout 3 วินาที ป้องกันเซิร์ฟเวอร์ค้าง
      });

      if (response.ok) {
        const data = await response.json();
        // ตรวจสอบว่ามีข้อมูลอัตราแลกเปลี่ยนของสกุลเงิน THB หรือไม่
        if (data && data.rates && data.rates.THB) {
          rate = parseFloat(data.rates.THB);
          lastUpdated = data.time_last_update_utc || new Date().toISOString();
        }
      }
    } catch (networkErr) {
      // กรณีเน็ตหลุดหรือถูกบล็อก ให้ใช้ค่าสำรองทันที
      provider = 'Internal Cache / Default Reference (Offline Fallback)';
    }

    // ขั้นตอนที่ 2: จัดเตรียมข้อมูลตอบกลับ
    const responsePayload = {
      success: true,
      provider: provider,
      base_currency: 'JPY',
      target_currency: 'THB',
      rate: rate,
      rate_description: `1 JPY ≈ ${rate.toFixed(4)} THB`,
      last_updated: lastUpdated
    };

    // ขั้นตอนที่ 3: หากผู้ใช้ระบุจำนวนเงินเยนเข้ามา ให้คำนวณเป็นเงินบาททันที
    if (amount_jpy && !isNaN(amount_jpy)) {
      const jpyVal = parseFloat(amount_jpy);
      const thbVal = Math.round(jpyVal * rate);
      responsePayload.conversion = {
        amount_jpy: jpyVal,
        converted_thb: thbVal,
        formatted_thb: `${thbVal.toLocaleString('th-TH')} บาท`
      };
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงอัตราแลกเปลี่ยน',
      error: error.message
    });
  }
});

module.exports = router;
