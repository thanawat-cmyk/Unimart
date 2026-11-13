/**
 * ==============================================================================
 * UNIMART - Products Database & Data Models
 * Course: ITDS242 Web Technologies Lab
 * ==============================================================================
 */

const UNIMART_PRODUCTS = [
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
        description: "ZGMF-X10A Freedom Gundam ในเวอร์ชัน Master Grade 2.0 โครงสร้างเฟรมสมจริง รายละเอียดปีก Hi-MAT Mode สามารถกางออกได้อย่างสง่างาม พร้อมบีมไรเฟิลและโล่คอมโพสิต",
        details: "ชุดประกอบพลาสติกคิทขนาด 1/100 โครงในแบบ Full Inner Frame สติกเกอร์ Realistic Decal พร้อมฐานตั้งฟิกเกอร์ คิระ ยามาโตะ",
        reference: "Bandai Hobby Site: MG Freedom Gundam Ver.2.0 (Item 0206312) - https://bandai-hobby.net"
    },
    {
        id: 2,
        name: "Zeta GUNDAM Ver.Ka",
        series: "Mobile Suit Zeta Gundam",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 8,
        releaseDate: "2023-04-29",
        rating: 4.8,
        image: "assets/images/product-freedom.png",
        description: "MSZ-006 Zeta Gundam เวอร์ชัน Katoki Hajime สัดส่วนแม่นยำตามอนิเมะ สามารถแปลงร่างเป็น Waverider Mode ได้สมบูรณ์โดยไม่ต้องถอดเปลี่ยนชิ้นส่วน",
        details: "โครงสร้างข้อต่อชุบสีเงินพิเศษ โล่ Hyper Mega Launcher และสติกเกอร์ Water Decal ลาย Ver.Ka ครบเซ็ต",
        reference: "Bandai Hobby Site: MG 1/100 Zeta Gundam Ver.Ka - https://bandai-hobby.net"
    },
    {
        id: 3,
        name: "ZZ GUNDAM Ver.Ka",
        series: "Mobile Suit Gundam ZZ",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 5,
        releaseDate: "2023-09-15",
        rating: 4.7,
        image: "assets/images/product-freedom.png",
        description: "MSZ-010 ZZ Gundam โมเดลขนาดใหญ่ ทรงพลัง มีกลไกการแยกประกอบและรวมร่างเป็น Core Top, Core Base และ G-Fortress ได้ครบถ้วน",
        details: "ชิ้นส่วน Extra Finish สีเงินเมทัลลิก ปืน Double Beam Rifle ขนาดใหญ่ และบีมเซเบอร์ทรงพลัง",
        reference: "Bandai Hobby Site: MG 1/100 ZZ Gundam Ver.Ka - https://bandai-hobby.net"
    },
    {
        id: 4,
        name: "Nu GUNDAM Ver.Ka",
        series: "Mobile Suit Gundam: Char's Counterattack",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 12,
        releaseDate: "2023-11-20",
        rating: 5.0,
        image: "assets/images/product-freedom.png",
        description: "RX-93 Nu Gundam ผลงานระดับมาสเตอร์พีซ ออกแบบโดย Katoki Hajime โดดเด่นด้วย Fin Funnel 6 ชิ้น และกลไกเปิดเกราะ Psycho-Frame สีเขียวมรกต",
        details: "ชิ้นส่วน Die-cast เสริมความมั่นคง ฟินฟันเนลพร้อมฐานจัดแสดงเฉพาะ และดีคอลน้ำพรีเมียม",
        reference: "Bandai Hobby Site: MG 1/100 Nu Gundam Ver.Ka - https://bandai-hobby.net"
    },
    {
        id: 5,
        name: "Strike GUNDAM + Aile Striker",
        series: "Mobile Suit Gundam SEED",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 20,
        releaseDate: "2024-01-10",
        rating: 4.8,
        image: "assets/images/product-freedom.png",
        description: "GAT-X105 Strike Gundam Ver.RM รีมาสเตอร์ด้วยเทคโนโลยีเฟรมสมัยใหม่ มาพร้อมแพ็ค Aile Striker และ Armor Schneider มีดสั้นพับได้",
        details: "ข้อต่อสะโพกขยับกว้างเป็นพิเศษเพื่อท่าโพสแอ็กชันคมชัด พร้อมฐานตั้ง Catapult Deck จำลองยาน Archangel",
        reference: "Bandai Hobby Site: MG 1/100 Aile Strike Gundam Ver.RM - https://bandai-hobby.net"
    },
    {
        id: 6,
        name: "GN-001 Gundam Exia",
        series: "Mobile Suit Gundam 00",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 9,
        releaseDate: "2023-08-05",
        rating: 4.7,
        image: "assets/images/product-freedom.png",
        description: "กันดั้มผู้เชี่ยวชาญการต่อสู้ระยะประชิดด้วยดาบทั้ง 7 เล่ม (Seven Swords System) สายส่งพลังงาน GN Hologram Ribbon โปร่งแสงสมจริง",
        details: "ดาบ GN Sword, GN Long Blade, GN Short Blade, GN Beam Saber x4 และฐานจำลอง GN Drive",
        reference: "Bandai Hobby Site: MG 1/100 Gundam Exia - https://bandai-hobby.net"
    },
    {
        id: 7,
        name: "Providence GUNDAM",
        series: "Mobile Suit Gundam SEED",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 4,
        releaseDate: "2023-06-18",
        rating: 4.9,
        image: "assets/images/product-freedom.png",
        description: "บอสใหญ่แห่งซีรีส์ SEED กับระบบ DRAGOON System รอบตัว แบ็คแพ็คขนาดมหึมาพร้อมเอฟเฟกต์การยิงบีมรอบทิศทาง",
        details: "โครงในดัดแปลงมาจาก Freedom Ver.2.0 ให้ความแข็งแรงยอดเยี่ยม พร้อมเอฟเฟกต์ชิ้นใสสำหรับจัดท่าดรากูน",
        reference: "Bandai Hobby Site: MG 1/100 Providence Gundam - https://bandai-hobby.net"
    },
    {
        id: 8,
        name: "Justice GUNDAM",
        series: "Mobile Suit Gundam SEED",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1750,
        stock: 7,
        releaseDate: "2023-07-22",
        rating: 4.8,
        image: "assets/images/product-freedom.png",
        description: "ZGMF-X09A Justice Gundam ยูนิตคู่หูของ Freedom โดดเด่นด้วยยานสนับสนุน Fatum-00 บนหลังที่สามารถแยกบินหรือกางขึ้นขี่ได้",
        details: "โทนสีชมพูอมม่วงคมชัด บาสเซลเซเบอร์ที่หัวไหล่ และกลไกล็อกฐานสำหรับขึ้นยืนบน Fatum-00",
        reference: "Bandai Hobby Site: MG 1/100 Justice Gundam - https://bandai-hobby.net"
    },
    {
        id: 9,
        name: "God GUNDAM (Burning Gundam)",
        series: "Mobile Fighter G Gundam",
        grade: "MG",
        category: "gundam",
        scale: "1/100",
        price: 1999,
        stock: 14,
        releaseDate: "2024-05-18",
        rating: 4.9,
        image: "assets/images/product-god.png",
        description: "GF13-017NJII God Gundam พร้อมโหมด Hyper Mode ปีกกางเป็นวงแหวนพลังงานแสงสีทอง มือขวา Bakunetsu God Finger ชิ้นใสสีส้มเปล่งประกาย",
        details: "โครง Fighting Action Frame สามารถเตะ ต่อย และโพสท่าศิลปะการต่อสู้ได้อย่างอิสระโดยไม่หลุดหลวม",
        reference: "Bandai Hobby Site: MG 1/100 God Gundam - https://bandai-hobby.net"
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
        rating: 4.8,
        image: "assets/images/product-freedom.png",
        description: "ร่างสุดยอดของบาร์บาตอส แขนยักษ์ทรงพลัง กรงเล็บสีทอง และหาง Tail Blade พร้อมสายเคเบิลปรับทิศทางได้",
        details: "ประกอบง่ายตามมาตรฐาน High Grade พร้อมกระบอง Ultra Large Mace ขนาดยักษ์",
        reference: "Bandai Hobby Site: HG 1/144 Gundam Barbatos Lupus Rex - https://bandai-hobby.net"
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
        image: "assets/images/hero-banner.png",
        description: "สุดยอดโมเดลสเกล 1/60 ติดตั้งแพ็คสไตรเกอร์ครบทั้ง 3 แบบ (Aile + Sword + Launcher) โครงในโลหะหล่อและระบบไฟ LED สมบูรณ์แบบ",
        details: "โครงร่าง Inner Frame รายละเอียดสูงพิเศษ ชิ้นส่วนเคลือบโครเมียม และดาบชเวิร์ดเกเบอร์ขนาดยาวกว่า 40 ซม.",
        reference: "Bandai Hobby Site: PG 1/60 Perfect Strike Gundam - https://bandai-hobby.net"
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
        description: "กันดั้มปฐมบทเวอร์ชัน The Origin เพิ่มลูกเล่นปืนวัลแคนติดหน้าอก ปืนใหญ่ Shoulder Cannon และเอฟเฟกต์ไฟปากกระบอกปืน",
        details: "สามารถเลือกประกอบได้ทั้งรูปแบบ Early Type, Middle Type และ Late Type พร้อมชิ้นส่วนเอฟเฟกต์ใส",
        reference: "Bandai Hobby Site: MG 1/100 RX-78-02 Gundam (The Origin) - https://bandai-hobby.net"
    },
    {
        id: 13,
        name: "Action Base 5 Clear Stand",
        series: "Official Display Support",
        grade: "SD",
        category: "parts",
        scale: "Universal",
        price: 350,
        stock: 25,
        releaseDate: "2024-01-01",
        rating: 4.7,
        image: "assets/images/product-freedom.png",
        description: "ฐานตั้งโมเดลสีใส เหมาะสำหรับสเกล 1/144 และ 1/100 ปรับระดับความสูงและมุมก้มเงยได้อย่างอิสระ",
        details: "มาพร้อมข้อต่อและแกนยึดหลายรูปแบบ รองรับกันพลาได้เกือบทุกรุ่น ทุกซีรีส์",
        reference: "Bandai Hobby Site: Action Base 5 Clear - https://bandai-hobby.net"
    },
    {
        id: 14,
        name: "Gundam Decal Multi-Use (White)",
        series: "Detail Up Parts",
        grade: "HG",
        category: "parts",
        scale: "Universal",
        price: 220,
        stock: 40,
        releaseDate: "2024-02-10",
        rating: 4.6,
        image: "assets/images/product-freedom.png",
        description: "สติกเกอร์ดีคอลน้ำคุณภาพสูง ลายสัญลักษณ์กองทัพ E.F.S.F., Zeon, และตัวเลขมาร์กิ้งสีขาว สำหรับเพิ่มความสมจริง",
        details: "แผ่นฟิล์มบางพิเศษ แนบสนิทกับชิ้นงานเมื่อใช้น้ำยาเคลือบดีคอล",
        reference: "Bandai Hobby Site: Gundam Decal Series - https://bandai-hobby.net"
    },
    {
        id: 15,
        name: "Bandai Spirits Entry Nipper (Blue)",
        series: "Craft Tools",
        grade: "Tools",
        category: "tools",
        scale: "N/A",
        price: 420,
        stock: 18,
        releaseDate: "2024-01-15",
        rating: 4.8,
        image: "assets/images/product-god.png",
        description: "คีมตัดพลาสติกโมเดลคุณภาพสูง ใบมีดคมบาง ช่วยให้ตัดชิ้นส่วนออกจากแผงรันเนอร์ได้เรียบเนียน ไม่ทิ้งรอยฝ้าขาว",
        details: "ด้ามจับหุ้มยางนุ่มกระชับมือ มีสปริงช่วยผ่อนแรงในการตัดต่อเนื่อง",
        reference: "Bandai Spirits Hobby Tools Catalog - https://bandai-hobby.net"
    },
    {
        id: 16,
        name: "Gundam Marker Pour-Type (Black)",
        series: "Finishing Supplies",
        grade: "Tools",
        category: "tools",
        scale: "N/A",
        price: 180,
        stock: 35,
        releaseDate: "2024-03-01",
        rating: 4.7,
        image: "assets/images/product-freedom.png",
        description: "ปากกาตัดเส้นประเภทไหลซึม (Pour Type) หมึกไหลตามร่องได้อย่างแม่นยำและรวดเร็ว เช็ดส่วนเกินออกง่ายด้วยยางลบ",
        details: "หมึกสูตรน้ำมันแห้งไว ให้ร่องลายเส้นคมชัดลึก เพิ่มมิติให้โมเดลดูสมจริงยิ่งขึ้น",
        reference: "GSI Creos Mr. Hobby Gundam Marker Series - https://www.mr-hobby.com"
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
        // เงื่อนไขที่ 1: ค้นหาคำสำคัญในชื่อสินค้า, ซีรีส์ หรือเกรด (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่)
        if (filters.keyword && filters.keyword.trim() !== "") {
            const kw = filters.keyword.toLowerCase().trim();
            const inName = product.name.toLowerCase().includes(kw);
            const inSeries = product.series.toLowerCase().includes(kw);
            const inGrade = product.grade.toLowerCase().includes(kw);
            if (!inName && !inSeries && !inGrade) return false;
        }

        // เงื่อนไขที่ 2: กรองตามเกรดโมเดลกันพลา (Grade) เช่น RG, MG, HG, PG
        if (filters.grade && filters.grade !== "") {
            if (product.grade.toUpperCase() !== filters.grade.toUpperCase()) return false;
        }

        // เงื่อนไขที่ 3: กรองตามหมวดหมู่สินค้า (Category) เช่น gundam, parts, tools
        if (filters.category && filters.category !== "") {
            if (product.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        }

        // เงื่อนไขที่ 4: กรองราคาขั้นต่ำ (Min Price)
        if (filters.minPrice && !isNaN(filters.minPrice) && filters.minPrice > 0) {
            if (product.price < filters.minPrice) return false;
        }

        // เงื่อนไขที่ 5: กรองราคาสูงสุด (Max Price)
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
            // เรียงจากราคาต่ำไปสูง
            return list.sort((a, b) => a.price - b.price);
        case 'price_desc':
            // เรียงจากราคาสูงไปต่ำ
            return list.sort((a, b) => b.price - a.price);
        case 'name_asc':
            // เรียงตามลำดับอักษร ก-ฮ และ A-Z
            return list.sort((a, b) => a.name.localeCompare(b.name));
        case 'newest':
        default:
            // เรียงจากสินค้าที่วางจำหน่ายล่าสุดไปเก่าสุด
            return list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }
}
