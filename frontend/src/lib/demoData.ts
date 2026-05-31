export interface DemoCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface DemoProduct {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  supplier: {
    _id: string;
    name: string;
    companyName: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
  };
  moq: number;
  priceTiers: Array<{
    minQuantity: number;
    pricePerUnit: number;
  }>;
  specifications: Record<string, string>;
  stock: number;
  leadTime: string;
  shippingOrigin: string;
}

export interface DemoRFQ {
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  targetPrice: number;
  deliveryLocation: string;
  requiredDate: string;
  status: 'open' | 'closed';
  buyer: {
    _id: string;
    name: string;
    companyName: string;
  };
  bids: Array<{
    _id: string;
    supplier: {
      _id: string;
      name: string;
      companyName: string;
      isVerified: boolean;
    };
    offeredPrice: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

export const demoCategories: DemoCategory[] = [
  {
    _id: 'cat_fashion_123',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
    productCount: 3,
  },
  {
    _id: 'cat_home_123',
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    productCount: 3,
  },
  {
    _id: 'cat_groceries_123',
    name: 'Groceries & Spices',
    slug: 'groceries-spices',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    productCount: 3,
  },
  {
    _id: 'cat_leather_123',
    name: 'Leather Goods',
    slug: 'leather-goods',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=400&q=80',
    productCount: 3,
  },
];

export const demoProducts: DemoProduct[] = [
  {
    _id: 'prod_tshirts_123',
    title: 'Bulk Export Quality Cotton T-Shirts',
    description: 'Premium quality 100% combed cotton t-shirts suitable for printing, custom embroidery, and corporate branding. Fabric density is 170-180 GSM, providing a durable yet soft feel. Designed with double-needle stitching on shoulders, sleeves, and hem to prevent fraying. Available in modern fit sizing (S, M, L, XL, XXL) and customizable Pantone dye colors. Directly shipped from our Gazipur garment complex.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_fashion_123',
      name: 'Fashion & Apparel',
      slug: 'fashion-apparel'
    },
    supplier: {
      _id: 'sup_dhaka_123',
      name: 'Faisal Hasan',
      companyName: 'Dhaka Garments & Textiles',
      isVerified: true,
      rating: 4.5,
      reviewCount: 28
    },
    moq: 200,
    priceTiers: [
      { minQuantity: 200, pricePerUnit: 150 },
      { minQuantity: 1000, pricePerUnit: 130 },
      { minQuantity: 5000, pricePerUnit: 110 }
    ],
    specifications: {
      'Material': '100% Combed Cotton',
      'GSM': '175 GSM',
      'Origin': 'Gazipur, Bangladesh',
      'Sizes': 'S, M, L, XL, XXL',
    },
    stock: 25000,
    leadTime: '15-20 days',
    shippingOrigin: 'Gazipur'
  },
  {
    _id: 'prod_jeans_123',
    title: 'Premium Multi-Wash Men Denim Jeans (Slim Fit)',
    description: 'High-stretch corporate-grade men denim jeans. Manufactured with authentic ring-spun indigo denim yarn (12.5 oz). Features premium YKK brass zippers, reinforced rivet pockets, and triple-stitched inseams for rugged industrial wear. Offered in raw denim, light indigo wash, and classic stone-washed color sets. Perfect for retail brand resellers and corporate employee uniforms.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df43c3?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_fashion_123',
      name: 'Fashion & Apparel',
      slug: 'fashion-apparel'
    },
    supplier: {
      _id: 'sup_dhaka_123',
      name: 'Faisal Hasan',
      companyName: 'Dhaka Garments & Textiles',
      isVerified: true,
      rating: 4.5,
      reviewCount: 28
    },
    moq: 100,
    priceTiers: [
      { minQuantity: 100, pricePerUnit: 520 },
      { minQuantity: 500, pricePerUnit: 480 },
      { minQuantity: 2000, pricePerUnit: 440 }
    ],
    specifications: {
      'Fabric Weight': '12.5 oz Denim',
      'Material': '98% Cotton, 2% Spandex',
      'Finish': 'Indigo Dyed / Stone Washed',
      'Style': 'Slim-Fit Straight Leg',
    },
    stock: 15000,
    leadTime: '20-25 days',
    shippingOrigin: 'Gazipur'
  },
  {
    _id: 'prod_jute_sacks_123',
    title: 'Premium Raw Jute Sacks (Grade A Export)',
    description: 'Heavy duty, biodegradable natural jute sacking bags. Exquisite high density tight-weave pattern prevents leakage of powdered grains. Designed for agricultural bulk storage, transport of rice, potatoes, flour, grains, coffee beans, and seeds. Outfitted with strong reinforced side-seam overhead loop handles for forklift hook lifts.',
    images: [
      'https://images.unsplash.com/photo-1605000797439-7ab14340d2ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589244159943-460088ed5c92?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_fashion_123',
      name: 'Fashion & Apparel',
      slug: 'fashion-apparel'
    },
    supplier: {
      _id: 'sup_bengal_123',
      name: 'M. A. Rahman',
      companyName: 'Bengal Jute & Fiber Industries',
      isVerified: true,
      rating: 4.9,
      reviewCount: 34
    },
    moq: 500,
    priceTiers: [
      { minQuantity: 500, pricePerUnit: 85 },
      { minQuantity: 2000, pricePerUnit: 78 },
      { minQuantity: 10000, pricePerUnit: 72 }
    ],
    specifications: {
      'Material': '100% Natural Organic Jute',
      'Capacity': '50 kg & 100 kg standard sizes',
      'Splicing': 'Heavy Overlocked Side Stitches',
      'Origin': 'Narayanganj, Bangladesh',
    },
    stock: 50000,
    leadTime: '10-12 days',
    shippingOrigin: 'Narayanganj'
  },
  {
    _id: 'prod_rug_123',
    title: 'Artisan Oval Braided Jute Rug',
    description: 'Meticulously handcrafted oval jute rugs braided by certified cottage artisans in Rangpur. Uses high-luster golden jute fiber treated with natural softeners to avoid typical jute prickliness. The thick, reversible weave delivers exceptional durability under heavy foot traffic. Ideal for organic interior layouts, hotels, showrooms, and home decor retail lines.',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_home_123',
      name: 'Home & Living',
      slug: 'home-living'
    },
    supplier: {
      _id: 'sup_bengal_123',
      name: 'M. A. Rahman',
      companyName: 'Bengal Jute & Fiber Industries',
      isVerified: true,
      rating: 4.9,
      reviewCount: 34
    },
    moq: 25,
    priceTiers: [
      { minQuantity: 25, pricePerUnit: 1200 },
      { minQuantity: 100, pricePerUnit: 1050 },
      { minQuantity: 500, pricePerUnit: 900 }
    ],
    specifications: {
      'Material': '100% Golden Jute Fiber',
      'Craft': '100% Hand-braided Oval',
      'Dimensions': '4ft x 6ft standard',
      'Origin': 'Rangpur Artisan Hub',
    },
    stock: 1200,
    leadTime: '20-25 days',
    shippingOrigin: 'Narayanganj'
  },
  {
    _id: 'prod_pottery_123',
    title: 'Traditional Terracotta Pottery Pots (Set of 3)',
    description: 'Eco-friendly baked clay plant containers. Carefully fired in specialized underground mud ovens in Bijoypur, Comilla, according to heritage standards. Highly porous structure keeps soil moisture balanced. Excellent natural red terracotta finish with tribal markings. Ideal for nurseries, architectural supply vendors, and luxury home decorators.',
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595180018596-f9d2fc76ec9e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_home_123',
      name: 'Home & Living',
      slug: 'home-living'
    },
    supplier: {
      _id: 'sup_bengal_123',
      name: 'M. A. Rahman',
      companyName: 'Bengal Jute & Fiber Industries',
      isVerified: true,
      rating: 4.9,
      reviewCount: 34
    },
    moq: 50,
    priceTiers: [
      { minQuantity: 50, pricePerUnit: 350 },
      { minQuantity: 200, pricePerUnit: 300 },
      { minQuantity: 1000, pricePerUnit: 250 }
    ],
    specifications: {
      'Material': 'High-density baked riverbed clay',
      'Finishing': 'Matte Red Terracotta',
      'Packaging': 'Secure Straw-Crate Pack',
      'Average Weight': '1.5 kg per pot',
    },
    stock: 4500,
    leadTime: '15-20 days',
    shippingOrigin: 'Comilla'
  },
  {
    _id: 'prod_baskets_123',
    title: 'Woven Jute Laundry & Storage Baskets (Trio)',
    description: 'Nesting set of 3 cylindrical storage organizers woven with natural Jute and cotton thread coils. Features strong integrated carry handles that hold shape when filled. Modern minimalist look with a neutral white-jute striped pattern. Safe for nursery, clothing organization, and hotel amenities bags.',
    images: [
      'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_home_123',
      name: 'Home & Living',
      slug: 'home-living'
    },
    supplier: {
      _id: 'sup_bengal_123',
      name: 'M. A. Rahman',
      companyName: 'Bengal Jute & Fiber Industries',
      isVerified: true,
      rating: 4.9,
      reviewCount: 34
    },
    moq: 30,
    priceTiers: [
      { minQuantity: 30, pricePerUnit: 650 },
      { minQuantity: 150, pricePerUnit: 580 },
      { minQuantity: 500, pricePerUnit: 520 }
    ],
    specifications: {
      'Material': 'Coiled Jute Yarn & Cotton Rope',
      'Set Contents': 'Small, Medium, Large cylinders',
      'Height': 'S: 25cm, M: 35cm, L: 45cm',
      'Origin': 'Narsingdi, Bangladesh',
    },
    stock: 3000,
    leadTime: '12-15 days',
    shippingOrigin: 'Narayanganj'
  },
  {
    _id: 'prod_rice_123',
    title: 'Dinajpur Chinigura Aromatic Rice (Export Grade)',
    description: 'High-grade aromatic Chinigura rice harvested in the Dinajpur floodplains. Double-milled and sortex-cleaned to achieve zero husks and uniform pearl-white grain structure. Imbued with a naturally occurring sweet pandan-like fragrance that enhances pulao, biryani, and traditional desserts. Packed in heavy double-layer moisture-lock PP bags.',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_groceries_123',
      name: 'Groceries & Spices',
      slug: 'groceries-spices'
    },
    supplier: {
      _id: 'sup_spices_123',
      name: 'Kabir Chowdhury',
      companyName: 'Chittagong Spices Corporation',
      isVerified: true,
      rating: 4.7,
      reviewCount: 19
    },
    moq: 30,
    priceTiers: [
      { minQuantity: 30, pricePerUnit: 3800 },
      { minQuantity: 100, pricePerUnit: 3650 },
      { minQuantity: 500, pricePerUnit: 3500 }
    ],
    specifications: {
      'Aroma': 'Rich Natural Pandan Fragrance',
      'Grain Shape': 'Short Pearl Oval',
      'Milling Quality': 'Sortex cleaned, 100% polished',
      'Package Type': '50 kg woven double-seal bag',
    },
    stock: 5000,
    leadTime: '5-7 days',
    shippingOrigin: 'Dinajpur'
  },
  {
    _id: 'prod_chili_123',
    title: 'Sun-Dried Whole Red Chili (Bogra Grade AAA)',
    description: 'Premium red hot whole chilies dried under natural sunlight. Hand-selected from family farms in Bogra. Features a high capsaicin level for authentic spice kick, and deep red coloring for visually rich food coloring. Properly processed and steam-sterilized with zero chemical dyes or artificial additives.',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613843516091-a1e48f76632f?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_groceries_123',
      name: 'Groceries & Spices',
      slug: 'groceries-spices'
    },
    supplier: {
      _id: 'sup_spices_123',
      name: 'Kabir Chowdhury',
      companyName: 'Chittagong Spices Corporation',
      isVerified: true,
      rating: 4.7,
      reviewCount: 19
    },
    moq: 100,
    priceTiers: [
      { minQuantity: 100, pricePerUnit: 290 },
      { minQuantity: 500, pricePerUnit: 270 },
      { minQuantity: 2000, pricePerUnit: 250 }
    ],
    specifications: {
      'Origin': 'Bogra region, Bangladesh',
      'Moisture Rating': 'Below 9.5%',
      'Grade': 'Export Grade AAA',
      'Stem Type': 'With stem & stemless sorted options',
    },
    stock: 12000,
    leadTime: '4-6 days',
    shippingOrigin: 'Bogra'
  },
  {
    _id: 'prod_turmeric_123',
    title: 'Pure Turmeric Powder (Curcumin High-Yield)',
    description: 'Organic wholesale turmeric powder sourced from hilly terrains of Chittagong Hill Tracts. Highly concentrated curcumin profile (>5.2%) provides a vibrant gold hue and warm aromatic flavoring. Finely ground (100 mesh) and double-sifted for silk-like blending. Perfect for commercial food manufacturers and packaging spice distributors.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_groceries_123',
      name: 'Groceries & Spices',
      slug: 'groceries-spices'
    },
    supplier: {
      _id: 'sup_spices_123',
      name: 'Kabir Chowdhury',
      companyName: 'Chittagong Spices Corporation',
      isVerified: true,
      rating: 4.7,
      reviewCount: 19
    },
    moq: 100,
    priceTiers: [
      { minQuantity: 100, pricePerUnit: 240 },
      { minQuantity: 500, pricePerUnit: 220 },
      { minQuantity: 3000, pricePerUnit: 200 }
    ],
    specifications: {
      'Curcumin Concentration': '5.2% - 5.5% certified',
      'Grind Size': 'Fine powder 100 Mesh',
      'Adulterant levels': '0.00% chemically tested',
      'Origin': 'Chittagong Hill Canyons',
    },
    stock: 10000,
    leadTime: '6-8 days',
    shippingOrigin: 'Khatunganj'
  },
  {
    _id: 'prod_shoes_123',
    title: 'Executive Full-Grain Leather Derby Dress Shoes',
    description: 'Classic executive dress shoes handcrafted from top-layer full grain cowhide. Finished with vegetable oil polish to achieve a long-lasting semi-gloss texture. Outfitted with soft anti-fungal genuine leather inner lining, orthopedic latex support beds, and heavy Goodyear welted rubber soles for slip resistance. Essential for premium B2B shoe retailers.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_leather_123',
      name: 'Leather Goods',
      slug: 'leather-goods'
    },
    supplier: {
      _id: 'sup_apex_123',
      name: 'Nasiruddin Ahmed',
      companyName: 'Apex Leather B2B',
      isVerified: true,
      rating: 4.8,
      reviewCount: 45
    },
    moq: 15,
    priceTiers: [
      { minQuantity: 15, pricePerUnit: 2200 },
      { minQuantity: 50, pricePerUnit: 2000 },
      { minQuantity: 200, pricePerUnit: 1800 }
    ],
    specifications: {
      'Upper Material': '100% Full-Grain Cow Leather',
      'Lining Material': 'Sheepskin lining',
      'Sole Construction': 'Goodyear Welted Anti-Slip Rubber',
      'Sizes': '39, 40, 41, 42, 43, 44',
    },
    stock: 800,
    leadTime: '10-15 days',
    shippingOrigin: 'Dhaka (Hazaribagh)'
  },
  {
    _id: 'prod_wallet_123',
    title: 'Minimalist Vegetable Tanned Leather Wallets (Bi-Fold)',
    description: 'Slimline bi-fold wallet engineered from durable vegetable tanned cow leather. Incorporated internal copper mesh shield delivers 13.56 MHz RFID protection against digital scanning. Features 6 card partitions, dual full-length currency sections, and clean reinforced waxed linen nylon edge seams. Elegant look that develops a classic vintage patina over time.',
    images: [
      'https://images.unsplash.com/photo-1627124718185-614ca0fe153f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_leather_123',
      name: 'Leather Goods',
      slug: 'leather-goods'
    },
    supplier: {
      _id: 'sup_apex_123',
      name: 'Nasiruddin Ahmed',
      companyName: 'Apex Leather B2B',
      isVerified: true,
      rating: 4.8,
      reviewCount: 45
    },
    moq: 50,
    priceTiers: [
      { minQuantity: 50, pricePerUnit: 550 },
      { minQuantity: 200, pricePerUnit: 480 },
      { minQuantity: 1000, pricePerUnit: 420 }
    ],
    specifications: {
      'Leather Grade': 'Vegetable Tanned Cowhide',
      'Dimensions': '11.2 cm x 8.8 cm x 1.3 cm',
      'Security features': 'RFID protection layer built-in',
      'Colors available': 'Charcoal Black, Vintage Chocolate, Honey Tan',
    },
    stock: 5000,
    leadTime: '12-18 days',
    shippingOrigin: 'Dhaka (Hazaribagh)'
  },
  {
    _id: 'prod_duffle_123',
    title: 'Heavy Duty Leather Travel Duffle Bag',
    description: 'High capacity weekend travel duffle bag manufactured from water-resistant thick oil-waxed pull-up leather. Upgraded with heavy-duty solid brass hardware hooks, lockable double-pull YKK metal zippers, and adjustable canvas-backed shoulder straps. Structured bottom reinforced with 5 brass feet to prevent surface scuffs. A favorite premium corporate gift item.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    ],
    category: {
      _id: 'cat_leather_123',
      name: 'Leather Goods',
      slug: 'leather-goods'
    },
    supplier: {
      _id: 'sup_apex_123',
      name: 'Nasiruddin Ahmed',
      companyName: 'Apex Leather B2B',
      isVerified: true,
      rating: 4.8,
      reviewCount: 45
    },
    moq: 10,
    priceTiers: [
      { minQuantity: 10, pricePerUnit: 4200 },
      { minQuantity: 30, pricePerUnit: 3900 },
      { minQuantity: 100, pricePerUnit: 3500 }
    ],
    specifications: {
      'Material': 'Thick Waxed Pull-up Cowhide',
      'Hardware': 'Solid Brass buckles and D-Rings',
      'Volume': '45 Liters capacity',
      'Dimensions': '52 cm x 28 cm x 26 cm',
    },
    stock: 500,
    leadTime: '18-22 days',
    shippingOrigin: 'Dhaka (Hazaribagh)'
  }
];

export const demoRfqs: DemoRFQ[] = [
  {
    _id: 'rfq_jute_bags_123',
    title: 'Need 1,500 Customized Jute Shopping Bags',
    description: 'Looking for a reliable manufacturer to supply 1,500 units of custom screen-printed jute bags with cotton rope handles. Bag dimensions should be 14" width x 16" height with a 4" bottom gusset. We will provide our branding artwork. Target delivery within 30 days to our warehouse in Tejgaon.',
    category: {
      _id: 'cat_home_123',
      name: 'Home & Living'
    },
    quantity: 1500,
    targetPrice: 120,
    deliveryLocation: 'Tejgaon, Dhaka',
    requiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    buyer: {
      _id: 'buy_aarong_123',
      name: 'Tamim Iqbal',
      companyName: 'Aarong Sourcing Ltd'
    },
    bids: [
      {
        _id: 'bid_bengal_123',
        supplier: {
          _id: 'sup_bengal_123',
          name: 'M. A. Rahman',
          companyName: 'Bengal Jute & Fiber Industries',
          isVerified: true
        },
        offeredPrice: 115,
        message: 'Hello, we can easily handle this custom print. Our factory in Narayanganj has high-speed screen printing machines. We can deliver within 20 days and offer 115 BDT per unit for 1,500 bags. I have attached references to similar projects in my supplier profile.',
        status: 'pending'
      }
    ]
  },
  {
    _id: 'rfq_rice_123',
    title: 'Urgent Sourcing of 250 bags Dinajpur Miniket Rice',
    description: 'Need immediate supply of 250 bags (50kg each) of Dinajpur Miniket Rice. Must be premium quality, sorted, double-boiled, and long-grain with moisture below 12%. Required delivery in 7 days to Gulshan.',
    category: {
      _id: 'cat_groceries_123',
      name: 'Groceries & Spices'
    },
    quantity: 250,
    targetPrice: 3200,
    deliveryLocation: 'Gulshan, Dhaka',
    requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    buyer: {
      _id: 'buy_unimart_123',
      name: 'Rahim Khan',
      companyName: 'Unimart Retail Sourcing'
    },
    bids: []
  }
];

export interface DemoOrder {
  _id: string;
  buyer: {
    _id: string;
    name: string;
    companyName: string;
  };
  supplier: {
    _id: string;
    name: string;
    companyName: string;
    isVerified: boolean;
  };
  items: Array<{
    product: {
      _id: string;
      title: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  paymentStatus: 'pending' | 'paid';
  deliveryStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export const demoOrders: DemoOrder[] = [
  {
    _id: 'ord_tshirts_123',
    buyer: {
      _id: 'buy_aarong_123',
      name: 'Tamim Iqbal',
      companyName: 'Aarong Sourcing Ltd'
    },
    supplier: {
      _id: 'sup_dhaka_123',
      name: 'Faisal Hasan',
      companyName: 'Dhaka Garments & Textiles',
      isVerified: true
    },
    items: [
      {
        product: {
          _id: 'prod_tshirts_123',
          title: 'Bulk Export Quality Cotton T-Shirts'
        },
        quantity: 1000,
        price: 130
      }
    ],
    totalAmount: 130000,
    shippingAddress: 'Tejgaon Industrial Area, House 12, Road 4, Dhaka',
    phone: '+8801711223344',
    paymentStatus: 'paid',
    deliveryStatus: 'processing',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ord_shoes_123',
    buyer: {
      _id: 'buy_unimart_123',
      name: 'Rahim Khan',
      companyName: 'Unimart Retail Sourcing'
    },
    supplier: {
      _id: 'sup_apex_123',
      name: 'Nasiruddin Ahmed',
      companyName: 'Apex Leather B2B',
      isVerified: true
    },
    items: [
      {
        product: {
          _id: 'prod_shoes_123',
          title: 'Executive Full-Grain Leather Derby Dress Shoes'
        },
        quantity: 50,
        price: 2000
      }
    ],
    totalAmount: 100000,
    shippingAddress: 'Gulshan 2, Holding 45, Dhaka',
    phone: '+8801811556677',
    paymentStatus: 'pending',
    deliveryStatus: 'processing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
