import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const daypack: CategoryConfig = {
  title: 'Daypacks', route: '/daypack', breadcrumbLabel: 'Daypacks',
  description: 'Compact lightweight backpacks designed for daily adventures, short hikes, and everyday carry. Comfortable, streamlined, and effortlessly practical.',
}

const laptopBackpack: CategoryConfig = {
  title: 'Laptop Backpacks', route: '/laptop-backpack', breadcrumbLabel: 'Laptop Backpacks',
  description: 'Padded backpacks with dedicated laptop sleeves for safe transport of your devices. Perfect for professionals, students, and digital nomads.',
}

const rucksack: CategoryConfig = {
  title: 'Rucksacks', route: '/rucksack', breadcrumbLabel: 'Rucksacks',
  description: 'Traditional drawstring-closure backpacks with a classic outdoor aesthetic. Roomy, durable, and built for adventure.',
}

const drawstring: CategoryConfig = {
  title: 'Drawstring Backpacks', route: '/drawstring-backpack', breadcrumbLabel: 'Drawstring Backpacks',
  description: 'Ultra-lightweight sack packs with simple drawstring closure. Perfect for gym, sports, and casual carry when you want to travel light.',
}

const miniBackpack: CategoryConfig = {
  title: 'Mini Backpacks', route: '/mini-backpack', breadcrumbLabel: 'Mini Backpacks',
  description: 'Compact scaled-down backpacks that combine style with convenience. Ideal for nights out, festivals, and carrying just the essentials.',
}

const antiTheft: CategoryConfig = {
  title: 'Anti-Theft Backpacks', route: '/anti-theft-backpack', breadcrumbLabel: 'Anti-Theft Backpacks',
  description: 'Security-focused backpacks with hidden zippers, cut-resistant materials, and RFID-blocking pockets. Peace of mind for urban travel and crowded spaces.',
}

const clearBackpack: CategoryConfig = {
  title: 'Clear Backpacks', route: '/clear-backpack', breadcrumbLabel: 'Clear Backpacks',
  description: 'Transparent backpacks perfect for stadium events, school, and venues with strict bag policies. Durable PVC construction with stylish designs.',
}

const travelBackpack: CategoryConfig = {
  title: 'Travel Backpacks', route: '/travel-backpack', breadcrumbLabel: 'Travel Backpacks',
  description: 'Versatile backpacks designed for travel with multiple compartments, luggage pass-through, and comfort features for long days of exploration.',
}

const rollingBackpack: CategoryConfig = {
  title: 'Rolling Backpacks', route: '/rolling-backpack', breadcrumbLabel: 'Rolling Backpacks',
  description: 'Hybrid backpacks with built-in wheels and telescopic handles. Roll through airports and train stations, then carry like a backpack when needed.',
}

const hikingBackpack: CategoryConfig = {
  title: 'Hiking Backpacks', route: '/hiking-backpack', breadcrumbLabel: 'Hiking Backpacks',
  description: 'Technical backpacks designed for the trail. Featuring hydration systems, hip belts, and ergonomic frames for comfortable backcountry carry.',
}

const categories: Record<string, CategoryConfig> = {
  daypack, laptopBackpack, rucksack, drawstring, miniBackpack, antiTheft, clearBackpack, travelBackpack, rollingBackpack, hikingBackpack,
}

export default categories
