import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const diaper: CategoryConfig = {
  title: 'Diaper Bags', route: '/diaper-bags', breadcrumbLabel: 'Diaper Bags',
  description: 'Spacious and organized diaper bags designed for parents on the go. Multiple compartments, insulated pockets, and durable materials for everyday parenting.',
}

const kidsBackpack: CategoryConfig = {
  title: 'Kids Backpacks', route: '/kids-backpacks', breadcrumbLabel: 'Kids Backpacks',
  description: 'Fun and colorful backpacks designed for children. Ergonomic sizes, playful patterns, and durable construction for school and adventures.',
}

const changing: CategoryConfig = {
  title: 'Baby Changing Kits', route: '/baby-changing-kits', breadcrumbLabel: 'Baby Changing Kits',
  description: 'Compact and portable changing kits for parents. Includes changing pads, wipes cases, and organized compartments for diapering on the go.',
}

const toddler: CategoryConfig = {
  title: 'Toddler Totes', route: '/toddler-totes', breadcrumbLabel: 'Toddler Totes',
  description: 'Adorable tote bags sized just for toddlers and young children. Perfect for daycare, playdates, and carrying their favorite toys and treasures.',
}

const lunch: CategoryConfig = {
  title: 'Kids Lunch Bags', route: '/kids-lunch-bags', breadcrumbLabel: 'Kids Lunch Bags',
  description: 'Fun and functional lunch bags for kids. Insulated designs keep food fresh, while playful patterns make lunchtime exciting for little ones.',
}

const bottle: CategoryConfig = {
  title: 'Baby Bottle Carriers', route: '/baby-bottle-carriers', breadcrumbLabel: 'Baby Bottle Carriers',
  description: 'Insulated carriers designed to keep baby bottles at the perfect temperature. Portable, spill-proof, and essential for feeding on the go.',
}

const categories: Record<string, CategoryConfig> = {
  diaper, kidsBackpack, changing, toddler, lunch, bottle,
}

export default categories
