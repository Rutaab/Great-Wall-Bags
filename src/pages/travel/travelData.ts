import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const duffel: CategoryConfig = {
  title: 'Duffel Bags', route: '/duffel-bag', breadcrumbLabel: 'Duffel Bags',
  description: 'Spacious cylindrical bags perfect for gym, travel, and weekend getaways. Durable materials and multiple carry options for versatile use.',
}

const weekender: CategoryConfig = {
  title: 'Weekender Bags', route: '/weekender-bag', breadcrumbLabel: 'Weekender Bags',
  description: 'Overnight bags designed for short trips. Spacious enough for 2-3 days of essentials with organized compartments and comfortable carry handles.',
}

const garment: CategoryConfig = {
  title: 'Garment Bags', route: '/garment-bag', breadcrumbLabel: 'Garment Bags',
  description: 'Protective bags for transporting suits, dresses, and formal wear. Foldable, carry-on compatible designs that keep garments wrinkle-free.',
}

const toiletry: CategoryConfig = {
  title: 'Toiletry Bags', route: '/toiletry-bag', breadcrumbLabel: 'Toiletry Bags',
  description: 'Compact organizers for toiletries and grooming essentials. Waterproof linings, hanging hooks, and TSA-compliant designs for effortless travel grooming.',
}

const makeup: CategoryConfig = {
  title: 'Makeup Bags', route: '/makeup-bag', breadcrumbLabel: 'Makeup Bags',
  description: 'Stylish cosmetic bags and makeup organizers. From compact pouches to train cases with multiple compartments for all your beauty essentials.',
}

const categories: Record<string, CategoryConfig> = {
  duffel, weekender, garment, toiletry, makeup,
}

export default categories
