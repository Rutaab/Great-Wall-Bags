export interface VariantOption {
  value: string
  label: string
  priceModifier?: number
  available?: boolean
  image?: string
}

export interface VariantGroup {
  name: string
  options: VariantOption[]
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: string
  avatar?: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  details: string[]
  images: string[]
  rating: number
  reviewCount: number
  reviews?: Review[]
  stock: number
  badge?: string
  badgeColor?: string
  variants?: VariantGroup[]
  material?: string
  origin?: string
  weight?: string
  dimensions?: string
  features?: string[]
  minOrder?: number
  verified?: boolean
  model?: string
  timeLeft?: string
  isFlashSale?: boolean
  isBestSeller?: boolean
  subtitle?: string
  bulk?: string
  bulkQty?: string
  image?: string
  gallery?: string[]
  createdAt?: string
}

const allProducts: Product[] = [
  // === FlashDealsHub - Trending Now ===
  {
    id: 'fd-1',
    name: 'Veloce Leather Tote',
    category: 'Luxury',
    price: 1240,
    description: 'Hand-stitched calfskin tote bag crafted in Milan. Features a spacious interior with multiple pockets, magnetic closure, and reinforced leather handles. Perfect for the discerning professional who values timeless elegance.',
    details: [
      'Hand-stitched Italian calfskin leather',
      'Gold-plated hardware with engraved logo',
      'Interior zip pocket and two slip pockets',
      'Magnetic snap closure',
      'Reinforced top handles with 12cm drop',
      'Detachable shoulder strap (110cm)',
      'Comes with dust bag and authenticity card'
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=1000&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 1240,
    stock: 25,
    badge: 'Limited Edition',
    badgeColor: 'tertiary',
    origin: 'Milan, Italy',
    material: 'Hand-stitched Calfskin',
    weight: '1.2 kg',
    dimensions: '38 x 30 x 12 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'cognac', label: 'Cognac Brown', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
          { value: 'black', label: 'Jet Black', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=100&h=100&fit=crop' },
          { value: 'burgundy', label: 'Burgundy', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop' }
        ]
      },
      {
        name: 'Size',
        options: [
          { value: 'sm', label: 'Small (30cm)', priceModifier: -100 },
          { value: 'md', label: 'Medium (38cm)' },
          { value: 'lg', label: 'Large (45cm)', priceModifier: 150 }
        ]
      }
    ],
    features: ['Gold-plated hardware', 'Dust bag included', 'Authenticity card'],
    isBestSeller: true
  },
  {
    id: 'fd-2',
    name: 'Aero-Commute Pack',
    category: 'Backpack',
    price: 285,
    originalPrice: 350,
    description: 'Japanese-engineered commuter backpack made from waterproof Cordura fabric. Features a padded laptop compartment, ergonomic shoulder straps, and reflective safety elements. Built for the urban professional.',
    details: [
      'Waterproof Cordura fabric (PU coated)',
      'Padded 15.6" laptop compartment',
      'Ergonomic S-curve shoulder straps',
      'Hidden anti-theft pocket',
      'Reflective strips for night visibility',
      'USB charging port built-in',
      'YKK zippers throughout'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1631281677471-75c0cb1b4ab1?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 843,
    stock: 120,
    badge: 'Bestseller',
    badgeColor: 'secondary',
    origin: 'Tokyo, Japan',
    material: 'Waterproof Cordura',
    weight: '0.95 kg',
    dimensions: '46 x 32 x 18 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Midnight Black' },
          { value: 'olive', label: 'Olive Green' },
          { value: 'grey', label: 'Titanium Grey' }
        ]
      },
      {
        name: 'Capacity',
        options: [
          { value: '28l', label: '28L (Daily)', priceModifier: -30 },
          { value: '35l', label: '35L (Standard)' },
          { value: '42l', label: '42L (Extended)', priceModifier: 40 }
        ]
      }
    ],
    features: ['USB Charging', 'Anti-theft', 'Reflective'],
    isBestSeller: true
  },
  {
    id: 'fd-3',
    name: 'Heritage Duffel XL',
    category: 'Travel',
    price: 450,
    originalPrice: 550,
    description: 'British-made waxed canvas duffel bag with genuine leather trim. Spacious main compartment with shoe compartment, wet pocket, and multiple organizer panels. A timeless travel companion.',
    details: [
      'Waxed cotton canvas (Scottish mill)',
      'Genuine bridle leather trim and handles',
      'Brass hardware and YKK zippers',
      'Separate shoe compartment',
      'Water-resistant lining',
      'Padded removable shoulder strap',
      'Monogramming available'
    ],
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1571956088475-b2f18c072e8e?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 567,
    stock: 45,
    origin: 'London, UK',
    material: 'Waxed Canvas',
    weight: '2.1 kg',
    dimensions: '60 x 35 x 28 cm',
    variants: [
      {
        name: 'Finish',
        options: [
          { value: 'tan', label: 'Tan Canvas / Brown Leather' },
          { value: 'navy', label: 'Navy Canvas / Black Leather' },
          { value: 'olive', label: 'Olive Canvas / Tan Leather' }
        ]
      }
    ],
    features: ['Water-resistant', 'Shoe compartment', 'Monogramming']
  },
  {
    id: 'fd-4',
    name: 'Prism Crossbody',
    category: 'Accessories',
    price: 610,
    originalPrice: 760,
    description: 'Parisian-designed Saffiano leather crossbody bag with adjustable strap, multiple card slots, and a zippered compartment. Compact yet surprisingly spacious for daily essentials.',
    details: [
      'Saffiano leather (Italy)',
      'Adjustable crossbody strap (90-130cm)',
      '6 card slots and 2 bill compartments',
      'Zip-around main compartment',
      'Interior zip pocket',
      'Silver-tone hardware',
      'Protective metal feet'
    ],
    images: [
      'https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1562457347-3a1a5a9b5b5b?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 312,
    stock: 78,
    badge: '-20% Flash Sale',
    badgeColor: 'tertiary',
    origin: 'Paris, France',
    material: 'Saffiano Leather',
    weight: '0.45 kg',
    dimensions: '22 x 16 x 7 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'blush', label: 'Blush Pink' },
          { value: 'black', label: 'Black' },
          { value: 'taupe', label: 'Taupe' }
        ]
      }
    ],
    features: ['Adjustable strap', 'Multiple card slots', 'Zip-around']
  },

  // === BackpackPage - Flash Deals ===
  {
    id: 'bp-fd-1',
    name: 'Tech-Ready Commuter Bag',
    category: 'Backpack',
    price: 24.50,
    originalPrice: 42.00,
    description: 'Compact and feature-packed commuter backpack with dedicated laptop sleeve, front organizer panel, and breathable mesh back panel. Ideal for daily urban commutes.',
    details: [
      '600D polyester with water-resistant coating',
      'Padded laptop compartment (fits 13")',
      'Front organizer with pen loops and key clip',
      'Breathable mesh back panel',
      'Adjustable sternum strap',
      'Luggage pass-through',
      'Side water bottle pockets'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 234,
    stock: 340,
    badge: '-45% OFF',
    badgeColor: 'tertiary',
    weight: '0.6 kg',
    dimensions: '42 x 28 x 15 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'grey', label: 'Charcoal Grey' },
          { value: 'blue', label: 'Navy Blue' },
          { value: 'green', label: 'Forest Green' }
        ]
      }
    ],
    features: ['Laptop sleeve', 'Water-resistant', 'Luggage pass-through']
  },
  {
    id: 'bp-fd-2',
    name: 'Luxury Vanity Case',
    category: 'Accessories',
    price: 18.90,
    originalPrice: 27.00,
    description: 'Stylish and organized vanity case with multiple compartments, a removable divider, and a water-resistant lining. Perfect for toiletries, makeup, or tech accessories.',
    details: [
      'PU leather exterior with pebbled texture',
      'Water-resistant interior lining',
      'Removable padded divider',
      'Zip-around closure',
      'Carry handle and detachable wrist strap',
      'Multiple mesh and zippered pockets'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 189,
    stock: 215,
    badge: '-30% OFF',
    badgeColor: 'tertiary',
    weight: '0.35 kg',
    dimensions: '25 x 18 x 12 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'pink', label: 'Rose Pink' },
          { value: 'black', label: 'Black' },
          { value: 'beige', label: 'Beige' }
        ]
      },
      {
        name: 'Size',
        options: [
          { value: 'sm', label: 'Small (25cm)' },
          { value: 'md', label: 'Medium (32cm)', priceModifier: 5 }
        ]
      }
    ],
    features: ['Removable divider', 'Water-resistant', 'Detachable strap']
  },
  {
    id: 'bp-fd-3',
    name: 'Executive Briefcase',
    category: 'Business',
    price: 55.00,
    description: 'Professional-grade executive briefcase with padded laptop compartment, organizer panel, and combination lock. Made from durable ballistic nylon with leather trim.',
    details: [
      '1680D ballistic nylon body',
      'Genuine leather trim and handles',
      'Padded 15.6" laptop compartment',
      'Combination lock security',
      'Removable padded shoulder strap',
      'Expandable file section',
      'Front zip and slip pockets'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 98,
    stock: 67,
    weight: '1.1 kg',
    dimensions: '42 x 32 x 10 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'brown', label: 'Chestnut Brown' },
          { value: 'black', label: 'Black' }
        ]
      }
    ],
    features: ['Combination lock', 'Laptop compartment', 'Expandable']
  },
  {
    id: 'bp-fd-4',
    name: 'Waterproof Trail Pack',
    category: 'Backpack',
    price: 32.10,
    description: 'Rugged trail backpack with roll-top closure, fully taped seams, and daisy chain webbing. Designed for outdoor adventures and wet weather conditions.',
    details: [
      'TPU-coated nylon (IPX6 rated)',
      'Roll-top waterproof closure',
      'Fully taped welded seams',
      'Daisy chain external attachment system',
      'Padded back panel with ventilation channel',
      'Compression straps',
      'Removable hip belt and sternum strap'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 156,
    stock: 89,
    weight: '0.85 kg',
    dimensions: '50 x 30 x 20 cm',
    features: ['IPX6 waterproof', 'Roll-top', 'Hip belt']
  },
  {
    id: 'bp-fd-5',
    name: 'Urban Core Sling',
    category: 'Accessories',
    price: 9.99,
    description: 'Compact and lightweight sling bag perfect for carrying essentials during short trips, commutes, or night outs. Multiple pockets keep items organized.',
    details: [
      '210D ripstop nylon',
      'Adjustable webbing strap',
      'Main zip compartment',
      'Front quick-access pocket',
      'Interior organizer slots',
      'Lightweight and packable'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'
    ],
    rating: 4.2,
    reviewCount: 423,
    stock: 500,
    weight: '0.2 kg',
    dimensions: '22 x 15 x 6 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'grey', label: 'Grey' },
          { value: 'teal', label: 'Teal' }
        ]
      }
    ],
    features: ['Lightweight', 'Quick-access', 'Adjustable strap']
  },

  // === BackpackPage - New Arrivals ===
  {
    id: 'bp-na-1',
    name: 'Minimalist Eco-Canvas Tote Series',
    category: 'Tote',
    price: 12.00,
    originalPrice: 8.50,
    description: 'Eco-friendly canvas tote bag made from organic cotton. Available in multiple sizes with reinforced stitching and extra-long handles for shoulder carry.',
    details: [
      '100% organic cotton canvas',
      'Reinforced cross-stitched handles',
      'Internal hanging pocket',
      'Flat bottom with gussets',
      'Eco-friendly water-based print',
      'Machine washable'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 312,
    stock: 1000,
    badge: 'Eco-Friendly',
    badgeColor: 'primary',
    weight: '0.3 kg',
    dimensions: '40 x 35 x 10 cm',
    minOrder: 50,
    verified: true,
    features: ['Organic cotton', 'Machine washable', 'Reinforced']
  },
  {
    id: 'bp-na-2',
    name: 'Polycarbonate Aero Suitcase',
    category: 'Travel',
    price: 85.00,
    originalPrice: 32.00,
    description: 'Lightweight polycarbonate hardshell suitcase with spinner wheels, TSA lock, and a scratch-resistant textured surface. Perfect for business and leisure travel.',
    details: [
      '100% virgin polycarbonate shell',
      'TSA-approved combination lock',
      'Dual spinner wheels (360° silent)',
      'Multi-stage telescopic handle',
      'Full interior lining with compression straps',
      'Scratch-resistant textured finish'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 89,
    stock: 340,
    minOrder: 10,
    verified: true,
    weight: '2.8 kg',
    dimensions: '55 x 38 x 22 cm',
    variants: [
      {
        name: 'Size',
        options: [
          { value: 'carry', label: 'Carry-on (55cm)', priceModifier: 0 },
          { value: 'check', label: 'Check-in (68cm)', priceModifier: 30 },
          { value: 'xl', label: 'XL (76cm)', priceModifier: 55 }
        ]
      },
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'silver', label: 'Silver' },
          { value: 'navy', label: 'Navy Blue' }
        ]
      }
    ],
    features: ['TSA Lock', 'Spinner wheels', 'Scratch-resistant']
  },
  {
    id: 'bp-na-3',
    name: 'Geometric Party Crossbody',
    category: 'Accessories',
    price: 22.00,
    originalPrice: 12.50,
    description: 'Trendy geometric-patterned crossbody bag with chain strap and magnetic flap closure. Compact design fits phone, cards, and lipstick for a night out.',
    details: [
      'Vegan leather with embossed geometric pattern',
      'Gold-tone chain strap (adjustable)',
      'Magnetic snap flap closure',
      'Interior zip pocket and 4 card slots',
      'Detachable chain and leather strap included'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 234,
    stock: 500,
    minOrder: 100,
    verified: true,
    weight: '0.3 kg',
    dimensions: '20 x 13 x 5 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'gold', label: 'Gold/Black' },
          { value: 'silver', label: 'Silver/White' },
          { value: 'rose', label: 'Rose Gold/Blush' }
        ]
      }
    ],
    features: ['Chain strap', 'Vegan leather', 'Magnetic closure']
  },
  {
    id: 'bp-na-4',
    name: 'Heavy Duty Canvas Duffel',
    category: 'Travel',
    price: 35.00,
    originalPrice: 18.00,
    description: 'Military-grade canvas duffel bag with reinforced stress points, padded shoulder strap, and multiple external pockets. Built to last for years of heavy use.',
    details: [
      '24oz waxed canvas (US mill)',
      'Reinforced bar-tacked stress points',
      'Padded removable shoulder strap',
      'Large external zip pocket',
      'Internal shoe compartment',
      'Leather handle wrap'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 178,
    stock: 200,
    minOrder: 25,
    verified: true,
    weight: '1.8 kg',
    dimensions: '55 x 30 x 30 cm',
    features: ['Waxed canvas', 'Shoe compartment', 'Reinforced']
  },
  {
    id: 'bp-na-5',
    name: 'Character Series Kids Pack',
    category: 'Kids',
    price: 8.90,
    originalPrice: 5.20,
    description: 'Fun and colorful character-themed backpack for children. Lightweight design with padded back, adjustable straps, and a name tag window.',
    details: [
      'Lightweight polyester construction',
      'Padded back panel',
      'Adjustable padded shoulder straps',
      'Name tag window on back',
      'Side mesh pocket for water bottle',
      'Fun character print (multiple designs)'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 567,
    stock: 2000,
    minOrder: 200,
    verified: true,
    badge: 'Best Seller',
    badgeColor: 'secondary',
    weight: '0.35 kg',
    dimensions: '35 x 25 x 12 cm',
    variants: [
      {
        name: 'Design',
        options: [
          { value: 'dino', label: 'Dinosaur' },
          { value: 'uni', label: 'Unicorn' },
          { value: 'space', label: 'Space Rocket' }
        ]
      }
    ],
    features: ['Lightweight', 'Name tag', 'Padded back']
  },
  {
    id: 'bp-na-6',
    name: 'Ultra-Shock Laptop Sleeve',
    category: 'Accessories',
    price: 4.50,
    originalPrice: 2.10,
    description: 'Ultra-protective laptop sleeve with shock-absorbing foam, water-resistant exterior, and soft fleece lining. Fits laptops up to 15.6 inches.',
    details: [
      'Neoprene + EVA foam padding',
      'Water-resistant exterior shell',
      'Soft fleece interior lining',
      'Smooth zip-around closure',
      'Slim profile fits in any bag',
      'Available in multiple sizes'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 890,
    stock: 5000,
    minOrder: 500,
    verified: true,
    weight: '0.15 kg',
    dimensions: '36 x 26 x 2 cm',
    variants: [
      {
        name: 'Size',
        options: [
          { value: '13', label: '13" Laptop' },
          { value: '14', label: '14" Laptop' },
          { value: '15', label: '15.6" Laptop' }
        ]
      },
      {
        name: 'Color',
        options: [
          { value: 'grey', label: 'Grey' },
          { value: 'black', label: 'Black' },
          { value: 'blue', label: 'Navy' }
        ]
      }
    ],
    features: ['Shock-absorbing', 'Water-resistant', 'Fleece lining']
  },

  // === LuxuryPage - Best Sellers ===
  {
    id: 'lx-1',
    name: 'Kinetic Modular Voyager',
    category: 'Luxury',
    price: 45.50,
    originalPrice: 89.00,
    description: 'A modular travel bag system made from recycled ocean plastic with IPX7 waterproof rating. Detachable components let you customize carry configuration.',
    details: [
      'Recycled ocean plastic (rPET) fabric',
      'IPX7 waterproof rating (submersible)',
      'Modular attach/detach system',
      'TSA-friendly laptop compartment',
      'Hidden security pocket',
      'Reflective safety elements',
      'Includes detachable sling pouch'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=1000&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 3400,
    stock: 150,
    badge: 'Flash Sale',
    badgeColor: 'tertiary',
    subtitle: 'IPX7 Waterproof | Recycled Ocean Plastic',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    isFlashSale: true,
    features: ['IPX7', 'Modular', 'Recycled materials']
  },
  {
    id: 'lx-2',
    name: 'Artisan Leather Satchel',
    category: 'Luxury',
    price: 32.10,
    description: 'Handcrafted leather satchel with antique brass hardware, adjustable shoulder strap, and a spacious interior with multiple pockets. Each piece is unique.',
    details: [
      'Full-grain leather, vegetable-tanned',
      'Antique brass hardware',
      'Adjustable shoulder strap (100-140cm)',
      'Top zip closure with leather pull',
      'Interior zip pocket and slip pocket',
      'Leather bottom with metal feet',
      'Hand-burnished edges'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 1200,
    stock: 85,
    weight: '0.9 kg',
    dimensions: '32 x 24 x 12 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'brown', label: 'Russet Brown' },
          { value: 'tan', label: 'Honey Tan' },
          { value: 'black', label: 'Black' }
        ]
      }
    ],
    features: ['Full-grain leather', 'Brass hardware', 'Handcrafted']
  },
  {
    id: 'lx-3',
    name: 'Tech Organizers',
    category: 'Accessories',
    price: 15.99,
    description: 'Compact tech organizer with multiple elastic loops, mesh pockets, and a padded tablet sleeve. Keeps cables, chargers, and gadgets neatly organized.',
    details: [
      'Ripstop nylon exterior',
      'Elastic retention loops for cables',
      'Mesh zip pockets for small items',
      'Padded tablet sleeve (up to 11")',
      'Detachable wrist strap',
      'Compact 3-fold design'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.2,
    reviewCount: 856,
    stock: 420,
    weight: '0.18 kg',
    dimensions: '26 x 18 x 3 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Stealth Black' },
          { value: 'grey', label: 'Wolf Grey' },
          { value: 'coyote', label: 'Coyote Brown' }
        ]
      }
    ],
    features: ['Cable loops', 'Tablet sleeve', 'Compact']
  },
  {
    id: 'lx-4',
    name: 'Water-Resistant Weekender',
    category: 'Travel',
    price: 38.80,
    description: 'Stylish and practical weekender bag with water-resistant exterior, multiple compartments, and a padded laptop sleeve. Perfect for short trips and gym sessions.',
    details: [
      '600D polyester with PVC backing',
      'Padded 15" laptop compartment',
      'Separate shoe compartment',
      'Front zip pocket with organizer',
      'Adjustable and removable shoulder strap',
      'Top handles with snap closure'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 2100,
    stock: 280,
    weight: '0.75 kg',
    dimensions: '50 x 30 x 25 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'charcoal', label: 'Charcoal' },
          { value: 'olive', label: 'Olive' },
          { value: 'burgundy', label: 'Burgundy' }
        ]
      }
    ],
    features: ['Water-resistant', 'Shoe compartment', 'Laptop sleeve']
  },

  // === SchoolPage ===
  {
    id: 'sc-1',
    name: 'AeroStream Ergonomic Series X-1',
    category: 'School',
    price: 18.45,
    description: 'Ultra-light ergonomic school backpack with ventilated back system, padded straps, and multiple organizing compartments. Designed for student comfort.',
    details: [
      '1680D Ballistic Nylon construction',
      'Airmesh ventilated back panel',
      'Ergonomic S-curve padded straps',
      'Padded 15.6" laptop compartment',
      'Front organizer with pen holders',
      'Side water bottle pockets',
      'Reflective safety strips'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 128,
    stock: 4200,
    model: 'KS-2024-PRM',
    weight: '0.85 kg (Ultra-light)',
    dimensions: '45 x 32 x 15 cm',
    material: '1680D Ballistic Nylon',
    verified: true,
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'blue', label: 'Navy' },
          { value: 'red', label: 'Burgundy' }
        ]
      },
      {
        name: 'Size',
        options: [
          { value: 'jr', label: 'Junior (35L)' },
          { value: 'sr', label: 'Senior (42L)', priceModifier: 3 }
        ]
      }
    ],
    features: ['Ergonomic', 'Ballistic Nylon', 'Laptop compartment']
  },
  {
    id: 'sc-2',
    name: 'EcoGuard Recycled Junior Pack',
    category: 'School',
    price: 12.90,
    description: 'Eco-friendly school backpack made from recycled polyester (rPET). Lightweight, durable, and available in fun colors for younger students.',
    details: [
      '100% rPET (recycled polyester) fabric',
      'Lightweight design under 0.6 kg',
      'Padded back and shoulder straps',
      'Main compartment with internal sleeve',
      'Front zip pocket',
      'Side mesh bottle holders',
      'Reflective logo for safety'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 342,
    stock: 500,
    model: 'ECO-JNR-04',
    weight: '0.60 kg',
    dimensions: '38 x 28 x 12 cm',
    material: 'rPET (Recycled Poly)',
    minOrder: 500,
    isBestSeller: true,
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'green', label: 'Ocean Teal' },
          { value: 'purple', label: 'Lavender' },
          { value: 'orange', label: 'Tangerine' }
        ]
      }
    ],
    features: ['Recycled materials', 'Lightweight', 'Reflective']
  },
  {
    id: 'sc-3',
    name: 'TitanShell Anti-Theft Campus Pro',
    category: 'School',
    price: 24.50,
    description: 'Advanced anti-theft campus backpack with carbon-fiber weave, hidden zip compartments, and RFID-blocking pocket. Maximum security for student essentials.',
    details: [
      'Carbon-fiber weave exterior',
      'Anti-theft hidden back zipper',
      'RFID-blocking pocket',
      'Cut-resistant shoulder strap',
      'Padded 15.6" laptop compartment',
      'TSA-friendly lay-flat design',
      'USB charging port'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 5.0,
    reviewCount: 56,
    stock: 1800,
    model: 'TS-900-SEC',
    weight: '1.10 kg (Reinforced)',
    dimensions: '48 x 34 x 18 cm',
    material: 'Carbon-Fiber Weave',
    verified: true,
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Stealth Black' },
          { value: 'grey', label: 'Titanium Grey' }
        ]
      }
    ],
    features: ['Anti-theft', 'RFID blocking', 'Carbon-fiber']
  },

  // === TravelPage ===
  {
    id: 'tr-1',
    name: 'LuxeTravel 20" Spinner Hardside Carry-On',
    category: 'Travel',
    price: 124.50,
    description: 'Premium hardside carry-on spinner with polycarbonate shell, silent dual wheels, and a TSA-approved lock. Meets most airline carry-on size requirements.',
    details: [
      '100% polycarbonate hardshell',
      'TSA-approved combination lock',
      'Dual 360° spinner wheels',
      'Multi-stage locking handle',
      'Interior compression straps',
      'Full-lined interior with zip divider',
      'Scratch-resistant textured surface'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 890,
    stock: 200,
    badge: 'Free Shipping',
    weight: '2.5 kg',
    dimensions: '55 x 35 x 20 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'silver', label: 'Silver' },
          { value: 'rose', label: 'Rose Gold' }
        ]
      }
    ],
    features: ['TSA Lock', 'Spinner wheels', 'Polycarbonate']
  },
  {
    id: 'tr-2',
    name: 'AeroLite Magnesium Alloy Ultra-Light Suite',
    category: 'Travel',
    price: 410.00,
    description: 'Ultra-premium magnesium alloy luggage suite. Aerospace-grade materials make this the lightest and strongest hardshell suitcase on the market.',
    details: [
      'Aerospace-grade magnesium alloy frame',
      'Integrated TSA-approved lock',
      'Self-lubricating bearing wheels',
      'Ergonomic leather-wrapped handle',
      'Microfiber interior with garment straps',
      'Expandable 2" gusset',
      'Includes premium dust cover and luggage tag'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 5.0,
    reviewCount: 234,
    stock: 35,
    badge: 'New Arrival',
    weight: '2.1 kg',
    dimensions: '55 x 38 x 22 cm',
    variants: [
      {
        name: 'Size',
        options: [
          { value: 'carry', label: 'Carry-on (55cm)', priceModifier: 0 },
          { value: 'check', label: 'Check-in (69cm)', priceModifier: 150 }
        ]
      }
    ],
    features: ['Magnesium alloy', 'Ultra-light', 'TSA lock']
  },
  {
    id: 'tr-3',
    name: 'Heritage Canvas & Leather Weekender Duffle',
    category: 'Travel',
    price: 89.00,
    description: 'Classic canvas and leather weekender duffle with spacious main compartment, shoe bag, and water-resistant lining. Vintage style meets modern functionality.',
    details: [
      'Waxed cotton canvas with leather trim',
      'Brass YKK zippers',
      'Detachable padded shoulder strap',
      'Shoe bag included',
      'Interior zip pocket',
      'Water-resistant lining',
      'Leather luggage tag'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=1000&fit=crop'
    ],
    rating: 4.2,
    reviewCount: 445,
    stock: 78,
    badge: 'Limited Stock',
    weight: '1.5 kg',
    dimensions: '55 x 30 x 25 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'brown', label: 'Brown/Tan' },
          { value: 'black', label: 'Black/Black' },
          { value: 'olive', label: 'Olive/Brown' }
        ]
      }
    ],
    features: ['Canvas & leather', 'Shoe bag', 'Water-resistant']
  },
  {
    id: 'tr-4',
    name: 'Kids Explorer Series: 18" Character Hardshell',
    category: 'Kids',
    price: 65.00,
    description: 'Fun character-themed hardshell carry-on for kids. Lightweight polypropylene construction with cartoon graphics, quiet wheels, and easy-grip handle.',
    details: [
      'Polypropylene hardshell (lightweight)',
      'Fun licensed character graphics',
      'Single front pocket',
      'Quiet spinner wheels',
      'Easy-grip telescopic handle',
      'Interior compression straps',
      'Name tag included'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 312,
    stock: 180,
    badge: 'Global Shipping',
    weight: '1.8 kg',
    dimensions: '45 x 30 x 18 cm',
    features: ['Character design', 'Spinner wheels', 'Lightweight']
  },
  {
    id: 'tr-5',
    name: 'Stealth Series: Midnight Matte 24" Check-In',
    category: 'Travel',
    price: 215.00,
    description: 'Sleek matte-black hardshell check-in suitcase with brushed metal hardware, silent dual wheels, and a expandable capacity. The ultimate style statement.',
    details: [
      'Brushed polycarbonate matte finish',
      'TSA-approved lock',
      'Silent dual spinner wheels',
      'Expandable 2.5" gusset',
      'Full-lined interior with zip divider',
      'Padded handle grip',
      'Scuff-resistant corners'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 567,
    stock: 95,
    weight: '3.2 kg',
    dimensions: '65 x 42 x 26 cm',
    variants: [
      {
        name: 'Size',
        options: [
          { value: '24', label: '24" Check-in' },
          { value: '28', label: '28" XL', priceModifier: 60 }
        ]
      }
    ],
    features: ['Matte finish', 'Expandable', 'TSA lock']
  },
  {
    id: 'tr-6',
    name: 'Business Elite: Tech-Integrated 2-Wheeler',
    category: 'Business',
    price: 345.99,
    description: 'Business-class 2-wheeler with integrated tech panel, USB charging, garment compartment, and laptop section. Perfect for the modern road warrior.',
    details: [
      'Ballistic nylon exterior with leather trim',
      'Integrated USB charging (power bank not incl.)',
      'Garment compartment with suit folder',
      'Padded 17" laptop section',
      'Front tech organizer panel',
      'Inline skate wheels with silent bearings',
      'Retractable trolley handle with lock'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 189,
    stock: 42,
    weight: '3.5 kg',
    dimensions: '50 x 38 x 24 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'brown', label: 'Cognac' }
        ]
      }
    ],
    features: ['USB charging', 'Garment compartment', 'Laptop section']
  },

  // === BusinessPage ===
  {
    id: 'bs-1',
    name: 'Executive Premium Leather Briefcase',
    category: 'Business',
    price: 299.00,
    originalPrice: 450.00,
    description: 'Italian full-grain leather executive briefcase with combination lock, padded laptop compartment, and multiple organizer pockets. The pinnacle of professional carry.',
    details: [
      'Italian full-grain leather (Pebbled finish)',
      'Combination lock with leather tab',
      'Padded 15" laptop compartment',
      'Front organizer with pen loops and card slots',
      'Expandable file section',
      'Removable padded shoulder strap',
      'Brass feet for desk protection'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=1000&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 328,
    stock: 156,
    model: 'EXEC-BRF-001',
    weight: '1.8 kg',
    dimensions: '40 x 30 x 10 cm',
    material: 'Italian Full-Grain Leather',
    verified: true,
    isBestSeller: true,
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'brown', label: 'Chestnut Brown' },
          { value: 'black', label: 'Black' },
          { value: 'tan', label: 'Tan' }
        ]
      }
    ],
    features: ['Laptop 15"', 'TSA Lock', 'Waterproof']
  },
  {
    id: 'bs-2',
    name: 'Professional Laptop Messenger Bag',
    category: 'Business',
    price: 189.00,
    description: 'Sleek ballistic nylon messenger bag with padded laptop compartment, USB charging port, and anti-theft back pocket. Designed for the modern professional.',
    details: [
      '1680D ballistic nylon body',
      'Padded 14" laptop compartment',
      'USB charging port (power bank not incl.)',
      'Anti-theft back zip pocket',
      'Quick-access front pocket',
      'Adjustable crossbody strap with pad',
      'YKK zippers with lockable pulls'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 512,
    stock: 320,
    model: 'MSG-PRO-2024',
    weight: '1.2 kg',
    dimensions: '38 x 28 x 8 cm',
    material: 'Ballistic Nylon',
    verified: true,
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'grey', label: 'Grey' }
        ]
      }
    ],
    features: ['Laptop 14"', 'USB Port', 'Anti-theft']
  },
  {
    id: 'bs-3',
    name: 'Executive Rolling Office Case',
    category: 'Business',
    price: 245.00,
    description: 'Professional rolling case with ABS polycarbonate shell, telescopic handle, and organized interior for documents, laptop, and business essentials.',
    details: [
      'ABS polycarbonate hardshell',
      'TSA-approved combination lock',
      'Telescopic trolley handle',
      'Quiet roller wheels',
      'Padded 17" laptop compartment',
      'File organization section',
      'Front quick-access pocket'
    ],
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 156,
    stock: 78,
    model: 'OFF-ROLL-001',
    weight: '3.2 kg',
    dimensions: '55 x 40 x 25 cm',
    material: 'ABS polycarbonate',
    features: ['Laptop 17"', 'Wheels', 'TSA Lock']
  },
  {
    id: 'bs-4',
    name: 'Urban Business Backpack',
    category: 'Business',
    price: 145.00,
    description: 'Waterproof canvas business backpack with padded laptop compartment, USB charging, and a sleek urban design. The ideal everyday carry for city professionals.',
    details: [
      'Waterproof waxed canvas exterior',
      'Padded 15" laptop compartment',
      'USB charging port (power bank not incl.)',
      'Front organizer panel',
      'Side water bottle pocket',
      'Breathable mesh back panel',
      'Luggage pass-through'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 892,
    stock: 500,
    model: 'URB-BIZ-001',
    weight: '0.95 kg',
    dimensions: '42 x 30 x 15 cm',
    material: 'Waterproof Canvas',
    verified: true,
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'brown', label: 'Waxed Brown' },
          { value: 'black', label: 'Black' }
        ]
      }
    ],
    features: ['Laptop 15"', 'USB Port', 'Backpack']
  },
  {
    id: 'bs-5',
    name: 'Corporate Gadget Organizer',
    category: 'Accessories',
    price: 89.00,
    description: 'Premium PU leather gadget organizer with wireless charging pass-through, multiple cable management loops, and dedicated slots for all your tech accessories.',
    details: [
      'PU leather exterior with stitched detailing',
      'Wireless charging compatible pass-through',
      'Elastic cable management loops',
      'Dedicated power bank slot with cutout',
      'Padded tablet sleeve (up to 10")',
      'Zip-around closure with lockable zipper',
      'Slim profile fits in any bag'
    ],
    images: [
      'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=800&h=1000&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 234,
    stock: 800,
    model: 'GAD-ORG-001',
    weight: '0.4 kg',
    dimensions: '30 x 22 x 8 cm',
    material: 'PU Leather',
    features: ['Tech Organizer', 'Wireless Charging']
  },
  {
    id: 'bs-6',
    name: 'Executive Wheeled Garment Bag',
    category: 'Business',
    price: 320.00,
    description: 'Professional wheeled garment bag with high-denier nylon construction, built-in suit compartment, and multiple accessory pockets for business travel.',
    details: [
      'High-denier nylon with water-resistant coating',
      'Foldable garment compartment (2 suits)',
      'Removable zip-out shoe bag',
      'Front accessory organizer',
      'Inline skate wheels',
      'Locking telescopic handle',
      'Carry handles top and side'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 67,
    stock: 45,
    model: 'WHL-GAR-001',
    weight: '4.5 kg',
    dimensions: '60 x 45 x 30 cm',
    material: 'High-Denier Nylon',
    features: ['Garment compartment', 'Wheels', 'Shoe bag']
  },

  // === KidsBabyPage ===
  {
    id: 'kb-1',
    name: 'Colorful Junior Backpack Set',
    category: 'Kids',
    price: 14.50,
    description: 'Vibrant and durable junior backpack set with matching lunch bag and pencil case. Perfectly sized for preschool and elementary school children.',
    details: [
      'Lightweight polyester construction',
      'Padded back and adjustable straps',
      'Matching lunch bag with insulation',
      'Matching pencil case included',
      'Fun colorful print (multiple designs)',
      'Name tag on back panel',
      'Easy-clean lining'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 234,
    stock: 600,
    badge: 'Best Seller',
    weight: '0.4 kg',
    dimensions: '32 x 25 x 10 cm',
    variants: [
      {
        name: 'Design',
        options: [
          { value: 'rainbow', label: 'Rainbow' },
          { value: 'dino', label: 'Dinosaur' },
          { value: 'space', label: 'Space' }
        ]
      }
    ],
    features: ['Set includes lunch bag', 'Pencil case', 'Lightweight']
  },
  {
    id: 'kb-2',
    name: 'Animal Print Diaper Bag',
    category: 'Kids',
    price: 22.00,
    description: 'Stylish and practical diaper bag with multiple compartments, insulated bottle pockets, changing pad, and stroller straps. Perfect for parents on the go.',
    details: [
      'Premium fabric with animal print design',
      'Insulated bottle pockets (2 sides)',
      'Includes waterproof changing pad',
      'Stroller attachment straps included',
      'Multiple interior organizers',
      'Wipe-clean interior lining',
      'Padded shoulder strap and carry handles'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 189,
    stock: 180,
    badge: 'New Arrival',
    weight: '0.55 kg',
    dimensions: '38 x 28 x 14 cm',
    variants: [
      {
        name: 'Pattern',
        options: [
          { value: 'leo', label: 'Leopard' },
          { value: 'zebra', label: 'Zebra' },
          { value: 'giraffe', label: 'Giraffe' }
        ]
      }
    ],
    features: ['Insulated pockets', 'Changing pad', 'Stroller straps']
  },
  {
    id: 'kb-3',
    name: 'Insulated Kids Lunch Tote',
    category: 'Kids',
    price: 8.99,
    description: 'Fun and functional insulated lunch tote for kids. Eco-friendly materials keep food fresh for hours with a leak-proof interior and easy-clean surface.',
    details: [
      'Eco-friendly PEVA insulation',
      'Leak-proof aluminum foil interior',
      'Front zip pocket for napkin/utensils',
      'Adjustable shoulder strap',
      'Carry handle on top',
      'Name tag window',
      'Machine washable exterior'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 312,
    stock: 900,
    badge: 'Eco-Friendly',
    weight: '0.15 kg',
    dimensions: '22 x 16 x 12 cm',
    variants: [
      {
        name: 'Design',
        options: [
          { value: 'dino', label: 'Dinosaur' },
          { value: 'floral', label: 'Garden Floral' },
          { value: 'ocean', label: 'Ocean Blue' }
        ]
      }
    ],
    features: ['Insulated', 'Leak-proof', 'Eco-friendly']
  },
  {
    id: 'kb-4',
    name: 'Baby Essentials Organizer',
    category: 'Kids',
    price: 18.50,
    description: 'Comprehensive baby bag organizer with removable pouches, insulated bottle holder, and multiple compartments. Keeps all baby essentials neatly arranged.',
    details: [
      'Organizer insert fits any diaper bag',
      '4 removable pouches (various sizes)',
      'Insulated bottle holder (removable)',
      'Diaper changing pad included',
      'Wipe-clean lining',
      'Elastic retention bands'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 98,
    stock: 250,
    weight: '0.3 kg',
    dimensions: '30 x 20 x 10 cm',
    features: ['Removable pouches', 'Insulated', 'Changing pad']
  },
  {
    id: 'kb-5',
    name: 'Cartoon Character Backpack',
    category: 'Kids',
    price: 12.00,
    description: 'Officially licensed cartoon character backpack for kids. Lightweight, durable, and machine washable with padded straps for comfort.',
    details: [
      'Officially licensed character design',
      'Lightweight polyester fabric',
      'Padded adjustable shoulder straps',
      'Top carry handle',
      'Front zip pocket',
      'Wipe-clean exterior',
      'Multiple character designs available'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 567,
    stock: 1500,
    weight: '0.3 kg',
    dimensions: '30 x 22 x 10 cm',
    features: ['Licensed character', 'Lightweight', 'Padded straps']
  },
  {
    id: 'kb-6',
    name: 'Mommy & Me Matching Set',
    category: 'Kids',
    price: 28.00,
    description: 'Adorable matching backpack set for mom and child. Both bags feature the same design in different sizes with coordinating details and quality construction.',
    details: [
      'Set includes adult (28L) and child (12L) bags',
      'Matching design and colorway',
      'Padded back panels on both sizes',
      'Adjustable straps on both',
      'Front organizer pockets',
      'Name tag in child backpack',
      'Water-resistant exterior'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 145,
    stock: 90,
    weight: '0.7 kg (set)',
    dimensions: 'Adult: 42x28x14cm, Child: 30x22x10cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'pink', label: 'Rose Pink' },
          { value: 'blue', label: 'Sky Blue' },
          { value: 'green', label: 'Mint Green' }
        ]
      }
    ],
    features: ['Matching set', 'Two sizes', 'Water-resistant']
  },

  // === AccessoriesPage ===
  {
    id: 'ac-1',
    name: 'Premium Leather Wallet',
    category: 'Accessories',
    price: 24.50,
    description: 'Slim premium leather wallet with RFID blocking technology, multiple card slots, and a bill compartment. Crafted from full-grain leather with minimal stitching.',
    details: [
      'Full-grain cowhide leather',
      'RFID-blocking lining',
      '6 card slots',
      '2 hidden slip pockets',
      'Bill compartment',
      'Slim profile (fits front or back pocket)',
      'Handcrafted'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 456,
    stock: 800,
    badge: 'Best Seller',
    weight: '0.08 kg',
    dimensions: '11 x 9 x 1 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'brown', label: 'Brown' },
          { value: 'black', label: 'Black' },
          { value: 'tan', label: 'Tan' }
        ]
      }
    ],
    features: ['RFID blocking', 'Full-grain leather', 'Slim']
  },
  {
    id: 'ac-2',
    name: 'Travel Passport Holder',
    category: 'Accessories',
    price: 12.99,
    description: 'Compact travel passport holder with multiple card slots, boarding pass pocket, and RFID protection. Keeps all travel documents organized and secure.',
    details: [
      'RFID-blocking material',
      'Holds passport + 4 cards',
      'Boarding pass / ticket pocket',
      'Embossed travel motif design',
      'Slim and lightweight',
      'Elastic closure band'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 234,
    stock: 1200,
    badge: 'New',
    weight: '0.05 kg',
    dimensions: '14 x 10 x 0.5 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'brown', label: 'Brown' },
          { value: 'navy', label: 'Navy' }
        ]
      }
    ],
    features: ['RFID protection', 'Multiple slots', 'Lightweight']
  },
  {
    id: 'ac-3',
    name: 'Luggage Tag Set (4 Pack)',
    category: 'Accessories',
    price: 6.50,
    description: 'Set of 4 premium leather luggage tags with clear ID windows and detachable strap. Assorted colors make it easy to identify your luggage.',
    details: [
      'Genuine leather front, clear PVC window',
      'Detachable strap with buckle',
      'Assorted colors (4 different)',
      'ID card insert included',
      'Sturdy stitching',
      'Fits most luggage handles'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 789,
    stock: 3000,
    badge: 'Hot Deal',
    weight: '0.04 kg each',
    dimensions: '8 x 5 cm each',
    features: ['Set of 4', 'Leather', 'ID window']
  },
  {
    id: 'ac-4',
    name: 'Premium TSA Lock Combo',
    category: 'Accessories',
    price: 9.99,
    description: 'TSA-approved combination lock with visible indicator, resettable code, and sturdy zinc alloy construction. Airport security can open without damaging.',
    details: [
      'TSA-approved (allows security inspection)',
      'Zinc alloy construction',
      'Resettable 3-digit combination',
      'Visible open/close indicator',
      'Dual locking loops',
      'Fits most luggage zippers',
      'Set of 2 locks'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 345,
    stock: 2500,
    weight: '0.06 kg each',
    dimensions: '6 x 4 x 2 cm each',
    features: ['TSA approved', 'Set of 2', 'Combination']
  },
  {
    id: 'ac-5',
    name: 'Packing Cubes Set (6 Pieces)',
    category: 'Accessories',
    price: 18.00,
    description: 'Complete set of 6 packing cubes in assorted sizes for organized travel. Mesh tops let you see contents while compression zippers save space.',
    details: [
      'Ripstop nylon fabric',
      'Mesh top panel for visibility',
      'Compression zipper on large cubes',
      'Assorted sizes: 2 large, 2 medium, 2 small',
      'Reinforced zippers',
      'Stainless steel pull tabs',
      'Color-coded for easy identification'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 567,
    stock: 1800,
    weight: '0.25 kg (set)',
    dimensions: 'Large: 45x30x10cm, Med: 35x25x8cm, Small: 25x18x6cm',
    features: ['6 pieces', 'Compression', 'Mesh top']
  },
  {
    id: 'ac-6',
    name: 'Shoe Bags Travel Set',
    category: 'Accessories',
    price: 11.50,
    description: 'Set of 2 shoe bags in different sizes for travel. Water-resistant fabric keeps dirty shoes separate from your clean clothes.',
    details: [
      'Water-resistant nylon fabric',
      'Set includes 1 large + 1 medium bag',
      'Drawstring closure',
      'Ventilation mesh panel',
      'Folds flat when not in use',
      'Machine washable'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 198,
    stock: 1500,
    weight: '0.1 kg (set)',
    dimensions: 'Large: 35x25cm, Medium: 28x20cm',
    features: ['Set of 2', 'Water-resistant', 'Drawstring']
  },
  {
    id: 'ac-7',
    name: 'Crossbody Phone Wallet',
    category: 'Accessories',
    price: 15.99,
    description: 'Hands-free crossbody phone wallet with detachable strap, card slots, and cash pocket. Compact design fits most smartphones while keeping essentials close.',
    details: [
      'Vegan leather with trendy texture',
      'Fits most phones up to 6.9"',
      '3 card slots + 1 cash pocket',
      'Detachable crossbody strap (80-130cm)',
      'Magnetic snap closure',
      'RFID-blocking layer'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 432,
    stock: 650,
    weight: '0.12 kg',
    dimensions: '18 x 10 x 2 cm',
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'beige', label: 'Beige' },
          { value: 'pink', label: 'Blush Pink' }
        ]
      }
    ],
    features: ['Phone fit', 'Crossbody', 'RFID']
  },
  {
    id: 'ac-8',
    name: 'Cosmetic Travel Organizer',
    category: 'Accessories',
    price: 21.00,
    description: 'Hanging cosmetic organizer with multiple compartments, waterproof lining, and a sturdy hook. Unzips and hangs for easy access to all your beauty essentials.',
    details: [
      'Water-resistant nylon exterior',
      'Waterproof interior lining (spill-proof)',
      'Sturdy metal hanging hook',
      'Multiple mesh and clear pockets',
      'Large main compartment',
      'Compact when zipped (folds flat)',
      'Removable makeup brush holder'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 267,
    stock: 320,
    weight: '0.2 kg',
    dimensions: '28 x 20 x 8 cm (open: 45cm hang)',
    features: ['Hanging design', 'Spill-proof', 'Multiple pockets']
  },
  // === SuitcasePage ===
  {
    id: 'st-1', name: 'AeroGlide Carry-On Pro', category: 'Travel',
    price: 345.00, description: 'Lightweight polycarbonate carry-on with smooth spinner wheels and TSA-approved lock. Perfect for quick business trips and weekend getaways.',
    details: ['TSA-approved combination lock', 'Dual spinner wheels (360° silent)', 'Multi-stage telescopic handle', 'Expandable zipper for extra capacity', 'Full interior lining with compression straps', 'Scratch-resistant textured finish'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCNRks9WOaL8UciXawKPnQTBa97T7aLaBRn5OmH8TC8Mgx_5yYiZQapkrwK6Q0dltmlMoDkzM_pD1z4mYCnAFNDxk72XGmnt_DNDy_iNCT5Jkvt4jqIIu3R3LjnziMXDnzMmVlD2pjk7wVcItC-QgPV9Tsy78i7QAYuLXOLkAtDxpCCQv6D494kSUoKlbSvcGPe35xJH28JhoXM-QHVfEuLmeHKnt32EBp4dxUGGOU_Mo800wb4S2UlBnvdCHrGVO7KUGD-0rWUZaCe'],
    rating: 4.8, reviewCount: 214, stock: 200, badge: 'TSA Approved', badgeColor: 'secondary',
    material: 'Polycarbonate Shell', weight: '2.8 kg', dimensions: '55 x 38 x 22 cm',
    model: 'AG-22-CRN', verified: true, features: ['TSA Lock', 'Spinner wheels', 'Expandable']
  },
  {
    id: 'st-2', name: 'TitanRoll Medium Case', category: 'Travel',
    price: 495.00, description: 'Premium brushed aluminum medium suitcase with superior durability and smooth-rolling wheels. Ideal for longer journeys requiring robust protection.',
    details: ['Brushed aluminum hardshell', 'TSA-approved combination lock', 'Dual spinner wheels', 'Telescopic handle with ergonomic grip', 'Luxury interior lining', 'Corner protective bumpers'],
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=1000&fit=crop'],
    rating: 4.9, reviewCount: 342, stock: 150, badge: 'Best Seller', badgeColor: 'primary',
    material: 'Brushed Aluminum', weight: '3.6 kg', dimensions: '65 x 44 x 26 cm',
    model: 'TR-MD-28', verified: true, features: ['TSA Lock', 'Premium aluminum', 'Protective bumpers']
  },
  {
    id: 'st-3', name: 'GlideMax Large Check-In', category: 'Travel',
    price: 425.00, description: 'Spacious large check-in suitcase with ABS + PC composite shell. Expandable design gives you up to 20% more packing space when you need it.',
    details: ['ABS + PC composite shell', 'TSA-approved lock', 'Expandable zipper (20% extra space)', 'Dual spinner wheels', 'Packed interior with multiple compartments', 'Reinforced top and side handles'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDWGFSZPp5zWdPjIHYVLOVquxw3dL5bDPlVpzK5x6YRogWUppxwq8nwl7so-Dcoz9UcPeCXiOAb16pruM3WzmX3rn1f9roZLsZFH5GbQGR94-IUkU_QXekkqyEVwtaQkv4AyJpRoxl79GkI5dMPOfTOq21ch40NIlxSkG02QCAYQ2_FVQHdBfXmfA4am0-lhVRIN7tUFzoIVMlCvg4dL3uqPgL_QnRGKqr-9klQbDy_xbQd0H82obrKzSulPa8r3qXtDaoZB24K0L1w'],
    rating: 4.7, reviewCount: 156, stock: 180, badge: 'Expandable', badgeColor: 'secondary',
    material: 'ABS + PC Composite', weight: '4.2 kg', dimensions: '75 x 50 x 30 cm',
    model: 'GM-LG-32', verified: true, features: ['Expandable', 'TSA Lock', 'Spinner wheels']
  },
  {
    id: 'st-4', name: 'SwiftCab Triple Combo Set', category: 'Travel',
    price: 795.00, description: 'Complete 3-piece luggage set including carry-on, medium, and large suitcases. Save big while getting the full range for every trip type.',
    details: ['Durable ABS hardshell', '3-piece set (carry-on / medium / large)', 'TSA locks on all pieces', 'Spinner wheels on all sizes', 'Nesting design for compact storage', 'Matching interior linings'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC-B41FVQK5YPqysQSNiWU_5LuypGIZ_5bPXNpQcHAkMwaWRZh1hsFUwr4Gtidob1q3wEXIhsDLNzh1qn83EBdZg4u9C1p20qnZXDfslrbAZeD5IrykCz9m049FlB7uTjr0nIYGvO7Twleo_0WvixAvayVx_K59X9PmqRW2n8tVZPUk0L9ywvmUN40GFanE-OpH7hj1vNVkeVphkcyc2Pazf2l1DDix8vtLZ7bzmn0o9EHvds2zdPz-5BAwMHwT44oM5gaPwUevo0jM'],
    rating: 4.6, reviewCount: 89, stock: 75, badge: 'Best Value', badgeColor: 'tertiary',
    material: 'Durable ABS', weight: '2.6 / 3.4 / 4.0 kg', dimensions: '55 / 65 / 75 cm',
    model: 'SC-SET-3PC', verified: true, features: ['3-piece set', 'TSA Lock', 'Nesting design']
  },
  {
    id: 'st-5', name: 'VeloSpin Lightweight Carry-On', category: 'Travel',
    price: 295.00, description: 'Ultra-light polycarbonate carry-on weighing just 2.3 kg. Glides effortlessly through airports with smooth 360° spinner wheels.',
    details: ['Ultra-light polycarbonate shell (2.3 kg)', 'TSA-approved combination lock', 'Smooth spinner wheels', 'Telescopic aluminum handle', 'Interior organization pockets', 'Durable corner guards'],
    images: ['https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=1000&fit=crop'],
    rating: 4.7, reviewCount: 178, stock: 220, badge: 'Ultra-Light', badgeColor: 'secondary',
    material: 'Polycarbonate', weight: '2.3 kg', dimensions: '55 x 38 x 20 cm',
    model: 'VS-20-CRN', verified: true, features: ['Ultra-light', 'TSA Lock', 'Spinner wheels']
  },
  {
    id: 'st-6', name: 'ArmorShield Medium Case', category: 'Travel',
    price: 375.00, description: 'Shockproof ABS hardshell medium suitcase built to withstand rough handling. Reinforced corners and impact-resistant shell keep your belongings safe.',
    details: ['Impact-resistant ABS hardshell', 'TSA-approved combination lock', 'Reinforced corner protectors', 'Dual spinner wheels', 'Deep interior with cross straps', 'Scuff-resistant texture'],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop'],
    rating: 4.5, reviewCount: 203, stock: 160, badge: 'Shockproof', badgeColor: 'secondary',
    material: 'ABS Hardshell', weight: '4.0 kg', dimensions: '65 x 44 x 26 cm',
    model: 'AS-MD-26', verified: true, features: ['Shockproof', 'TSA Lock', 'Impact-resistant']
  },
  {
    id: 'st-7', name: 'TrailBlazer Large Duffel', category: 'Travel',
    price: 195.00, description: 'Waterproof fabric duffel with massive 85L capacity. Collapses flat when not in use. Ideal for road trips, camping, and adventure travel.',
    details: ['Waterproof ripstop fabric', '85L large capacity', 'Padded shoulder strap', 'Daisy chain webbing for attaching gear', 'Internal mesh pockets', 'Folds flat for storage'],
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=1000&fit=crop'],
    rating: 4.4, reviewCount: 267, stock: 300, badge: 'Softside', badgeColor: 'primary',
    material: 'Waterproof Fabric', weight: '1.8 kg', dimensions: '70 x 35 x 35 cm',
    model: 'TB-LG-30', verified: true, features: ['Waterproof', 'Collapsible', '85L capacity']
  },
  {
    id: 'st-8', name: 'MetroLite Cabin Spinner', category: 'Travel',
    price: 265.00, description: 'Compact cabin-sized spinner with PC + ABS blend construction. Meets most airline carry-on requirements while offering maximum internal capacity.',
    details: ['PC + ABS blend shell', 'Airline cabin-size compliant', 'TSA-approved lock', 'Smooth spinner wheels', 'Quick-access front pocket', 'Packed interior with compression straps'],
    images: ['https://images.unsplash.com/photo-1606046604972-77cc76aee944?w=800&h=1000&fit=crop'],
    rating: 4.6, reviewCount: 134, stock: 190, badge: 'Cabin Size', badgeColor: 'secondary',
    material: 'PC + ABS Blend', weight: '2.5 kg', dimensions: '50 x 36 x 22 cm',
    model: 'ML-CB-18', verified: true, features: ['Cabin size', 'TSA Lock', 'Spinner wheels']
  },
  {
    id: 'st-9', name: 'GlobalHauler Check-In XL', category: 'Travel',
    price: 595.00, description: 'Extra-large brushed aluminum check-in suitcase with 110L capacity. The ultimate choice for long-haul travel and family trips.',
    details: ['Brushed aluminum hardshell', '110L extra-large capacity', 'TSA-approved combination lock', 'Dual spinner wheels with ball bearings', 'Multi-compartment interior', 'Built-in ID tag and TSA lock'],
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=1000&fit=crop'],
    rating: 4.8, reviewCount: 98, stock: 85, badge: 'Premium', badgeColor: 'primary',
    material: 'Brushed Aluminum', weight: '4.8 kg', dimensions: '78 x 52 x 32 cm',
    model: 'GH-XL-34', verified: true, features: ['Premium', '110L capacity', 'TSA Lock']
  }
]

export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId)
  if (!product) return []
  return allProducts
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit)
}

export function getAllProducts(): Product[] {
  return allProducts
}

export default allProducts
