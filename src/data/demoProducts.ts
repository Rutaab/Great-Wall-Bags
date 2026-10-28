export interface DemoProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  badge?: string
  timeLeft?: string
}

export const demoProducts: DemoProduct[] = [
  { id: 's1', name: 'Executive Premium Leather Briefcase', price: 299.00, originalPrice: 450.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.9, reviewCount: 328, badge: 'Best Seller' },
  { id: 's2', name: 'Professional Laptop Messenger Bag', price: 189.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.7, reviewCount: 512, badge: 'Verified' },
  { id: 's3', name: 'Executive Rolling Office Case', price: 245.00, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', rating: 4.8, reviewCount: 156, badge: 'Premium' },
  { id: 's4', name: 'Urban Business Backpack', price: 145.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.6, reviewCount: 892, badge: 'Trending' },
  { id: 's5', name: 'Corporate Gadget Organizer', price: 89.00, image: 'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=400&h=400&fit=crop', rating: 4.5, reviewCount: 234 },
  { id: 's6', name: 'Executive Wheeled Garment Bag', price: 320.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.9, reviewCount: 67, badge: 'Limited' },
  { id: 's7', name: 'Heritage Canvas Weekender Duffel', price: 195.00, originalPrice: 260.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.7, reviewCount: 445, badge: 'Flash Sale', timeLeft: '12h 30m' },
  { id: 's8', name: 'Aerospace Polycarbonate Carry-On', price: 380.00, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', rating: 4.8, reviewCount: 723, badge: 'Best Seller' },
  { id: 's9', name: 'Veloce Leather Tote Handbag', price: 1240.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.9, reviewCount: 189, badge: 'Luxury' },
  { id: 's10', name: 'Lavender Techwear Commuter Pack', price: 285.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.6, reviewCount: 567, badge: 'Trending' },
  { id: 's11', name: 'Prism Crossbody Saffiano Bag', price: 610.00, originalPrice: 780.00, image: 'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=400&h=400&fit=crop', rating: 4.8, reviewCount: 334, badge: '-20%' },
  { id: 's12', name: 'Kids Animal Print Backpack Set', price: 45.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.4, reviewCount: 892, badge: 'Kid Friendly' },
  { id: 's13', name: 'Minimalist School Backpack', price: 79.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.5, reviewCount: 1245 },
  { id: 's14', name: 'Travel Passport & Document Organizer', price: 34.00, image: 'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=400&h=400&fit=crop', rating: 4.3, reviewCount: 678 },
  { id: 's15', name: 'Diaper Bag with Changing Station', price: 129.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.7, reviewCount: 345, badge: 'Essential' },
  { id: 's16', name: 'Gym Duffle with Shoe Compartment', price: 89.00, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', rating: 4.6, reviewCount: 567, badge: 'Sports' },
  { id: 's17', name: 'Leather Crossbody Phone Bag', price: 55.00, image: 'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=400&h=400&fit=crop', rating: 4.4, reviewCount: 890 },
  { id: 's18', name: 'Premium Laptop Sleeve 15.6"', price: 49.00, image: 'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=400&h=400&fit=crop', rating: 4.3, reviewCount: 1234, badge: 'Accessory' },
  { id: 's19', name: 'Luxury Evening Clutch with Chain', price: 220.00, originalPrice: 320.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.8, reviewCount: 234, badge: 'Flash Sale', timeLeft: '6h 15m' },
  { id: 's20', name: 'Waterproof Hiking Backpack 40L', price: 110.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.7, reviewCount: 456, badge: 'Outdoor' },
  { id: 's21', name: 'Convertible Backpack Tote Bag', price: 135.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.5, reviewCount: 678 },
  { id: 's22', name: 'Anti-Theft Travel Backpack with USB', price: 165.00, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', rating: 4.6, reviewCount: 901, badge: 'Verified' },
  { id: 's23', name: 'Waxed Canvas Messenger Bag', price: 175.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.7, reviewCount: 345, badge: 'Artisan' },
  { id: 's24', name: 'Foldable Travel Tote Shopping Bag', price: 25.00, image: 'https://images.unsplash.com/photo-1606768666853-403c90b981ad?w=400&h=400&fit=crop', rating: 4.2, reviewCount: 1567 },
]
