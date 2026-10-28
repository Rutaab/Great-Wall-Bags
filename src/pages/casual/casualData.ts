import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const waist: CategoryConfig = {
  title: 'Waist Bags', route: '/waist-bag', breadcrumbLabel: 'Waist Bags',
  description: 'Hands-free waist bags for active lifestyles. Wear around the waist or as a crossbody — perfect for travel, festivals, and everyday essentials.',
}

const sling: CategoryConfig = {
  title: 'Sling Bags', route: '/sling-bag', breadcrumbLabel: 'Sling Bags',
  description: 'Compact single-strap bags worn across the body. Modern, minimalist, and perfect for carrying essentials with quick access on the move.',
}

const chestRig: CategoryConfig = {
  title: 'Chest Rigs', route: '/chest-rig', breadcrumbLabel: 'Chest Rigs',
  description: 'Tactical-style chest packs worn across the torso. Modular, secure, and built for outdoor adventures, photography, and gear-heavy activities.',
}

const canvasTote: CategoryConfig = {
  title: 'Canvas Totes', route: '/canvas-tote', breadcrumbLabel: 'Canvas Totes',
  description: 'Classic canvas tote bags for everyday carry. Durable cotton canvas construction with reinforced stitching and comfortable shoulder straps.',
}

const string: CategoryConfig = {
  title: 'String Bags', route: '/string-bag', breadcrumbLabel: 'String Bags',
  description: 'Lightweight mesh string bags that pack down to nothing. Perfect for beach days, market shopping, or as a backup bag in your daypack.',
}

const cooler: CategoryConfig = {
  title: 'Cooler Bags', route: '/cooler-bag', breadcrumbLabel: 'Cooler Bags',
  description: 'Insulated cooler bags for keeping food and drinks cold. Perfect for picnics, beach days, grocery runs, and outdoor dining.',
}

const foldable: CategoryConfig = {
  title: 'Foldable Bags', route: '/foldable-bag', breadcrumbLabel: 'Foldable Bags',
  description: 'Ultra-compact bags that fold into their own pocket. Always have an extra bag ready for spontaneous shopping, travel, or storage needs.',
}

const categories: Record<string, CategoryConfig> = {
  waist, sling, chestRig, canvasTote, string, cooler, foldable,
}

export default categories
