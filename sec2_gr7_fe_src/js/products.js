/**
 * ==============================================================================
 * UNIMART - Products Database & Data Models
 * Course: ITDS242 Web Technologies Lab
 * ==============================================================================
 */

var UNIMART_PRODUCTS = [
    {
        id: 1,
        name: "Freedom GUNDAM Ver.2.0",
        series: "Mobile Suit Gundam SEED",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 15,
        releaseDate: "2024-04-12",
        rating: 4.9,
        image: "assets/images/product-freedom.png",
        image_url: "assets/images/product-freedom.png",
        description: "ZGMF-X10A Freedom Gundam ในเวอร์ชัน Master Grade 2.0 โครงสร้างเฟรมสมจริง รายละเอียดปีก Hi-MAT Mode สามารถกางออกได้อย่างสง่างาม พร้อมบีมไรเฟิลและโล่คอมโพสิต",
        details: "ชุดประกอบพลาสติกคิทขนาด 1/100 โครงในแบบ Full Inner Frame สติกเกอร์ Realistic Decal พร้อมฐานตั้งฟิกเกอร์ คิระ ยามาโตะ",
        reference: "Bandai Hobby Site: MG Freedom Gundam Ver.2.0 (Item 0206312) - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 2,
        name: "Strike Freedom GUNDAM",
        series: "Mobile Suit Gundam SEED Destiny",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 2150,
        stock: 10,
        releaseDate: "2024-03-18",
        rating: 5.0,
        image: "assets/images/product-strike-freedom.jpg",
        image_url: "assets/images/product-strike-freedom.jpg",
        description: "ZGMF-X20A Strike Freedom Gundam โดดเด่นด้วยโครงในสีทองอร่ามและปีก Super DRAGOON ทั้ง 8 ชิ้น พร้อมปืนบีมไรเฟิลคู่ที่สามารถประกบรวมเป็นกระบอกยาวได้",
        details: "โครงสร้างข้อต่อชุบสีทองพิเศษ ปีกกางออกได้เต็มรูปแบบ พร้อมฐานตั้งจัดท่าบินกลางอวกาศและดีคอลครบชุด",
        reference: "Bandai Hobby Site: MG 1/100 Strike Freedom Gundam - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 3,
        name: "Destiny GUNDAM (Wings of Light)",
        series: "Mobile Suit Gundam SEED Destiny",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1950,
        stock: 5,
        releaseDate: "2024-01-25",
        rating: 4.9,
        image: "assets/images/product-destiny.jpg",
        image_url: "assets/images/product-destiny.jpg",
        description: "ZGMF-X42S Destiny Gundam มาพร้อมเอฟเฟกต์ปีกแห่งแสง (Wings of Light) ดาบใหญ่ Arondight Beam Sword และปืนพลังงานสูงพับเก็บหลังไหล่",
        details: "ชิ้นส่วนมือ Palma Fiocina พร้อมเอฟเฟกต์บีมใส บูมเมอแรงบีมคู่ และฐานตั้งแอ็กชันพิเศษ",
        reference: "Bandai Hobby Site: MG 1/100 Destiny Gundam - https://bandai-hobby.net",
        status: "Low Stock"
    },
    {
        id: 4,
        name: "Akatsuki GUNDAM (Oowashi Pack)",
        series: "Mobile Suit Gundam SEED Destiny",
        grade: "RG",
        category: "gundam",
        scale: "1/144",
        price: 2200,
        stock: 12,
        releaseDate: "2024-05-02",
        rating: 5.0,
        image: "assets/images/product-akatsuki.jpg",
        image_url: "assets/images/product-akatsuki.jpg",
        description: "ORB-01 Akatsuki Gundam เกราะสะท้อนบีมสีทอง Yata-no-Kagami เคลือบเงา Multi-faceted Gold Plating สะท้อนแสงสวยงามรอบทิศทาง",
        details: "มาพร้อมแพ็คหลัง Oowashi สำหรับบินในชั้นบรรยากาศ ดาบคู่ Twin Beam Saber และโล่ป้องกันบีม",
        reference: "Bandai Hobby Site: RG 1/144 Akatsuki Gundam - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 5,
        name: "Sword Impulse GUNDAM",
        series: "Mobile Suit Gundam SEED Destiny",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 14,
        releaseDate: "2024-01-10",
        rating: 4.8,
        image: "assets/images/product-sword-impulse.jpg",
        image_url: "assets/images/product-sword-impulse.jpg",
        description: "ZGMF-X56S/β Sword Impulse Gundam หุ่นรบสายประชิดโทนสีแดง-ขาว มาพร้อมดาบผ่ายานรบคู่ Excalibur Laser Anti-Ship Sword ขนาดมหึมา",
        details: "สามารถแยกร่างเป็น Core Splendor, Chest Flyer, Leg Flyer และ Sword Silhouette ได้สมบูรณ์ตามอนิเมะ",
        reference: "Bandai Hobby Site: MG 1/100 Sword Impulse Gundam - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 6,
        name: "Gundam Bael",
        series: "Iron-Blooded Orphans",
        grade: "HG",
        category: "gundam",
        scale: "1/144",
        price: 950,
        stock: 9,
        releaseDate: "2023-11-15",
        rating: 4.8,
        image: "assets/images/product-bael.jpg",
        image_url: "assets/images/product-bael.jpg",
        description: "ASW-G-01 Gundam Bael กันดั้มหมายเลข 1 แห่งตระกูล 72 เสาหลัก โดดเด่นด้วยเกราะสีขาว-น้ำเงิน ปีก Thruster Wing และดาบคู่สีทอง Bael Sword",
        details: "โครงใน Gundam Frame ขยับข้อต่อไหล่และเอวได้กว้างเป็นพิเศษเพื่อโพสท่าฟันดาบคู่กลางอากาศ",
        reference: "Bandai Hobby Site: HG 1/144 Gundam Bael - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 7,
        name: "Providence GUNDAM",
        series: "Mobile Suit Gundam SEED",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1850,
        stock: 4,
        releaseDate: "2023-06-18",
        rating: 4.9,
        image: "assets/images/product-providence.jpg",
        image_url: "assets/images/product-providence.jpg",
        description: "ZGMF-X13A Providence Gundam บอสใหญ่แห่งซีรีส์ SEED กับระบบ DRAGOON System รอบตัว แบ็คแพ็คขนาดมหึมาพร้อมเอฟเฟกต์การยิงบีมรอบทิศทาง",
        details: "โครงในดัดแปลงมาจาก Freedom Ver.2.0 ให้ความแข็งแรงยอดเยี่ยม พร้อมปืน Judicium Beam Rifle และก้านใสจัดท่าดรากูน",
        reference: "Bandai Hobby Site: MG 1/100 Providence Gundam - https://bandai-hobby.net",
        status: "Low Stock"
    },
    {
        id: 8,
        name: "Gundam Barbatos Lupus",
        series: "Iron-Blooded Orphans",
        grade: "HG",
        category: "gundam",
        scale: "1/144",
        price: 1200,
        stock: 11,
        releaseDate: "2023-10-22",
        rating: 4.8,
        image: "assets/images/product-barbatos-lupus.jpg",
        image_url: "assets/images/product-barbatos-lupus.jpg",
        description: "ASW-G-08 Gundam Barbatos Lupus ร่างอัปเกรดเกราะโค้งมนโฉบเฉี่ยว พร้อมดาบยักษ์ Sword-Mace และปืนกลติดแขน 200mm Gun คู่",
        details: "ชุดพลาสติกคิทสเกล 1/144 พร้อมข้อต่อแขนยืดขยายและอาวุธครบมือตามฉากต่อสู้ในอนิเมะซีซัน 2",
        reference: "Bandai Hobby Site: HG 1/144 Gundam Barbatos Lupus - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 9,
        name: "God GUNDAM (Burning Gundam)",
        series: "Mobile Fighter G Gundam",
        grade: "RG",
        category: "gundam",
        scale: "1/144",
        price: 1999,
        stock: 14,
        releaseDate: "2024-05-18",
        rating: 4.9,
        image: "assets/images/product-god.png",
        image_url: "assets/images/product-god.png",
        description: "GF13-017NJII God Gundam พร้อมโหมด Hyper Mode ปีกกางเป็นวงแหวนพลังงานแสงสีทอง มือขวา Bakunetsu God Finger ชิ้นใสสีส้มเปล่งประกาย",
        details: "โครง Fighting Action Frame สามารถเตะ ต่อย และโพสท่าศิลปะการต่อสู้ได้อย่างอิสระโดยไม่หลุดหลวม",
        reference: "Bandai Hobby Site: RG 1/144 God Gundam - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 10,
        name: "Gundam Barbatos Lupus Rex",
        series: "Iron-Blooded Orphans",
        grade: "HG",
        category: "gundam",
        scale: "1/144",
        price: 1450,
        stock: 11,
        releaseDate: "2024-02-14",
        rating: 4.9,
        image: "assets/images/product-barbatos-rex.jpg",
        image_url: "assets/images/product-barbatos-rex.jpg",
        description: "ร่างสุดยอดของบาร์บาตอส แขนยักษ์ทรงพลัง กรงเล็บสีทอง Rex Nails และหาง Tail Blade พร้อมสายเคเบิลดัดปรับทิศทางได้อิสระ",
        details: "ประกอบง่ายตามมาตรฐาน High Grade พร้อมกระบอง Ultra Large Mace ขนาดยักษ์ที่ยืดหดด้ามจับได้",
        reference: "Bandai Hobby Site: HG 1/144 Gundam Barbatos Lupus Rex - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 11,
        name: "PG Perfect Strike GUNDAM",
        series: "Mobile Suit Gundam SEED",
        grade: "PG",
        category: "gundam",
        scale: "1/60",
        price: 8500,
        stock: 2,
        releaseDate: "2023-12-01",
        rating: 5.0,
        image: "assets/images/product-perfect-strike.jpg",
        image_url: "assets/images/product-perfect-strike.jpg",
        description: "สุดยอดโมเดลสเกล 1/60 ติดตั้งแพ็คสไตรเกอร์ครบทั้ง 3 แบบ (Aile + Sword + Launcher) โครงในโลหะหล่อและระบบไฟ LED สมบูรณ์แบบ",
        details: "โครงร่าง Inner Frame รายละเอียดสูงพิเศษ ชิ้นส่วนเคลือบโครเมียม ดาบ Schwert Gewehr และปืนใหญ่ Agni",
        reference: "Bandai Hobby Site: PG 1/60 Perfect Strike Gundam - https://bandai-hobby.net",
        status: "Low Stock"
    },
    {
        id: 12,
        name: "RX-78-2 GUNDAM (The Origin)",
        series: "Mobile Suit Gundam",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1850,
        stock: 6,
        releaseDate: "2024-03-30",
        rating: 4.9,
        image: "assets/images/about-rx78.png",
        image_url: "assets/images/about-rx78.png",
        description: "กันดั้มปฐมบทเวอร์ชัน The Origin เพิ่มลูกเล่นปืนวัลแคนติดหน้าอก ปืนใหญ่ Shoulder Cannon และเอฟเฟกต์ไฟปากกระบอกปืน",
        details: "สามารถเลือกประกอบได้ทั้งรูปแบบ Early Type, Middle Type และ Late Type พร้อมชิ้นส่วนเอฟเฟกต์ใส",
        reference: "Bandai Hobby Site: MG 1/100 RX-78-02 Gundam (The Origin) - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 13,
        name: "Gundam Barbatos (4th Form)",
        series: "Iron-Blooded Orphans",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1690,
        stock: 10,
        releaseDate: "2024-01-20",
        rating: 4.9,
        image: "assets/images/product-barbatos.jpg",
        image_url: "assets/images/product-barbatos.jpg",
        description: "ASW-G-08 Gundam Barbatos ร่างที่ 4 ในเกรด Master Grade โครงใน Gundam Frame จำลองกระบอกสูบไฮดรอลิกสีเงินและเตาปฏิกรณ์ Ahab Reactor หมุนได้จริง",
        details: "มาพร้อมอาวุธครบทั้ง 3 ชนิด: กระบองยักษ์ Mace, ดาบยาว Katana และปืนใหญ่ Smoothbore Gun",
        reference: "Bandai Hobby Site: MG 1/100 Gundam Barbatos - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 14,
        name: "FX-550 Skygrasper + Aile Striker Unit",
        series: "Mobile Suit Gundam SEED",
        grade: "RG",
        category: "parts",
        scale: "1/144",
        price: 1150,
        stock: 16,
        releaseDate: "2024-02-10",
        rating: 4.7,
        image: "assets/images/product-skygrasper.jpg",
        image_url: "assets/images/product-skygrasper.jpg",
        description: "ยานรบสนับสนุน FX-550 Skygrasper พร้อมแพ็คเสริม Aile Striker, Sword Striker และ Launcher Striker สำหรับติดตั้งร่วมกับ RG Strike Gundam",
        details: "สามารถสลับติดตั้งอาวุธเสริมบนลำตัวยาน Skygrasper หรือถอดไปสวมใส่ให้หุ่น RG 1/144 Strike Gundam ได้ทันที",
        reference: "Bandai Hobby Site: RG 1/144 Skygrasper Launcher/Sword Pack - https://bandai-hobby.net",
        status: "In Stock"
    },
    {
        id: 15,
        name: "HG METEOR Unit Support System",
        series: "Mobile Suit Gundam SEED",
        grade: "HG",
        category: "parts",
        scale: "1/144",
        price: 2650,
        stock: 5,
        releaseDate: "2024-01-15",
        rating: 4.9,
        image: "assets/images/product-meteor-unit.jpg",
        image_url: "assets/images/product-meteor-unit.jpg",
        description: "ยุทโธปกรณ์เสริมขนาดยักษ์ METEOR Unit สำหรับเชื่อมต่อกับ HG/RG Freedom Gundam, Strike Freedom และ Justice Gundam",
        details: "ความยาวลำตัวกว่า 57 ซม. พร้อมเอฟเฟกต์ดาบบีมยักษ์ Beam Sword คู่ และช่องเปิดยิงมิสไซล์รอบตัวครบทุกจุด",
        reference: "Bandai Hobby Site: HG 1/144 Meteor Unit - https://bandai-hobby.net",
        status: "Low Stock"
    },
    {
        id: 16,
        name: "RX-78-2 Starter Build & Entry Nipper Set",
        series: "Craft Tools & Starter Kit",
        grade: "Tools",
        category: "tools",
        scale: "N/A",
        price: 590,
        stock: 25,
        releaseDate: "2024-03-01",
        rating: 4.8,
        image: "assets/images/detail-gunpla-main.png",
        image_url: "assets/images/detail-gunpla-main.png",
        description: "ชุดเริ่มต้นต่อกันพลาครบเซ็ต ประกอบด้วยโมเดล RX-78-2 Gundam พร้อมคีมตัดพลาสติก Bandai Spirits Entry Nipper และปากกาตัดเส้น",
        details: "ระบบ Touch Gate ประกอบง่ายไม่ต้องใช้กาว พร้อมคีมตัดใบมีดคมบางช่วยให้งานประกอบเรียบเนียนระดับมืออาชีพ",
        reference: "Bandai Spirits Hobby Tools & Starter Catalog - https://bandai-hobby.net",
        status: "In Stock"
    }
];

// ==============================================================================
// ฟังก์ชันช่วยเหลือสำหรับหน้าเว็บฝั่งไคลเอนต์ (Client-side Helper Functions)
// ==============================================================================

/**
 * ดึงข้อมูลสินค้า 1 ชิ้นตามรหัส ID
 * @param {number|string} id - รหัสสินค้าที่ต้องการค้นหา
 * @returns {object} อ็อบเจกต์ข้อมูลสินค้า (หากไม่พบจะคืนค่าสินค้าแรกเป็นค่าเริ่มต้น)
 */
function getProductById(id) {
    return UNIMART_PRODUCTS.find(p => p.id === parseInt(id, 10)) || UNIMART_PRODUCTS[0];
}

/**
 * กรองข้อมูลสินค้าตามเงื่อนไขการค้นหา (Client-side Multi-criteria Filter)
 * รองรับ: คำค้นหา (Keyword), เกรด (Grade), หมวดหมู่ (Category), และช่วงราคา (Min/Max Price)
 * 
 * @param {object} filters - เงื่อนไขการกรอง { keyword, grade, category, minPrice, maxPrice }
 * @returns {Array} อาร์เรย์ของสินค้าที่ผ่านเงื่อนไขการกรอง
 */
function filterProducts(filters) {
    return UNIMART_PRODUCTS.filter(product => {
        if (filters.keyword && filters.keyword.trim() !== "") {
            const kw = filters.keyword.toLowerCase().trim();
            const inName = product.name.toLowerCase().includes(kw);
            const inSeries = product.series.toLowerCase().includes(kw);
            const inGrade = product.grade.toLowerCase().includes(kw);
            if (!inName && !inSeries && !inGrade) return false;
        }

        if (filters.grade && filters.grade !== "") {
            if (product.grade.toUpperCase() !== filters.grade.toUpperCase()) return false;
        }

        if (filters.category && filters.category !== "") {
            if (product.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        }

        if (filters.minPrice && !isNaN(filters.minPrice) && filters.minPrice > 0) {
            if (product.price < filters.minPrice) return false;
        }

        if (filters.maxPrice && !isNaN(filters.maxPrice) && filters.maxPrice > 0) {
            if (product.price > filters.maxPrice) return false;
        }

        return true;
    });
}

/**
 * จัดเรียงลำดับรายการสินค้า (Sorting)
 * @param {Array} products - อาร์เรย์ของสินค้าที่จะจัดเรียง
 * @param {string} sortType - ประเภทการจัดเรียง: 'price_asc', 'price_desc', 'name_asc', 'newest'
 * @returns {Array} อาร์เรย์สินค้าหลังจัดเรียงลำดับ
 */
function sortProducts(products, sortType) {
    const list = [...products];
    switch (sortType) {
        case 'price_asc':
            return list.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return list.sort((a, b) => b.price - a.price);
        case 'name_asc':
            return list.sort((a, b) => a.name.localeCompare(b.name));
        case 'newest':
        default:
            return list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }
}

// ผูกข้อมูลสินค้าเข้ากับ window เพื่อให้ทุกสคริปต์ (เช่น api.js และหน้า Admin) เรียกใช้งานได้เสมอ
if (typeof window !== 'undefined') {
    window.UNIMART_PRODUCTS = UNIMART_PRODUCTS;
    window.products = UNIMART_PRODUCTS;
}
