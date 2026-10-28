import type { CategoryConfig } from './HandbagCategoryPage'

const tote: CategoryConfig = {
  title: 'Tote Bags', route: '/tote-bag', breadcrumbLabel: 'Tote Bags',
  description: 'Spacious open-top bags with parallel handles. Perfect for daily carry, shopping, and office essentials. Available in leather, canvas, and sustainable materials.',
}

const shoulder: CategoryConfig = {
  title: 'Shoulder Bags', route: '/shoulder-bag', breadcrumbLabel: 'Shoulder Bags',
  description: 'Elegant bags designed to hang from the shoulder. From chic chain-strap styles to classic leather silhouettes for everyday sophistication.',
}

const crossbody: CategoryConfig = {
  title: 'Crossbody Bags', route: '/crossbody-bag', breadcrumbLabel: 'Crossbody Bags',
  description: 'Hands-free bags with long straps worn diagonally across the body. Compact, secure, and perfect for travel and everyday errands.',
}

const satchel: CategoryConfig = {
  title: 'Satchel Bags', route: '/satchel', breadcrumbLabel: 'Satchel Bags',
  description: 'Structured, flat-bottomed bags with a top handle and optional long strap. A timeless silhouette that blends professional polish with everyday practicality.',
}

const bucket: CategoryConfig = {
  title: 'Bucket Bags', route: '/bucket-bag', breadcrumbLabel: 'Bucket Bags',
  description: 'Cylindrical or bucket-shaped bags with drawstring closure. Relaxed yet refined, these bags offer surprising capacity with a fashionable edge.',
}

const clutch: CategoryConfig = {
  title: 'Clutch Bags', route: '/clutch', breadcrumbLabel: 'Clutch Bags',
  description: 'Small, handheld bags with no strap. From sleek evening minaudières to decorative styles perfect for weddings, galas, and special occasions.',
}

const wristlet: CategoryConfig = {
  title: 'Wristlet Bags', route: '/wristlet', breadcrumbLabel: 'Wristlet Bags',
  description: 'Mini clutches with a convenient wrist strap. Ideal for carrying just the essentials — phone, cards, and keys — with hands-free ease.',
}

const envelope: CategoryConfig = {
  title: 'Envelope Bags', route: '/envelope-bag', breadcrumbLabel: 'Envelope Bags',
  description: 'Flat, fold-over bags that resemble a classic envelope. Sleek, minimal, and perfect for both day and evening occasions.',
}

const box: CategoryConfig = {
  title: 'Box Bags', route: '/box-bag', breadcrumbLabel: 'Box Bags',
  description: 'Hard, structured case bags inspired by classic vanity cases. Rigid silhouettes that make a bold style statement with architectural precision.',
}

const saddle: CategoryConfig = {
  title: 'Saddle Bags', route: '/saddle-bag', breadcrumbLabel: 'Saddle Bags',
  description: 'Rounded bags with a flap and long strap, inspired by equestrian saddle design. Distinctive curved silhouettes with heritage charm.',
}

const baguette: CategoryConfig = {
  title: 'Baguette Bags', route: '/baguette-bag', breadcrumbLabel: 'Baguette Bags',
  description: 'Small, long horizontal bags designed to be worn under the arm. A iconic 90s-inspired silhouette that remains a street-style staple.',
}

const camera: CategoryConfig = {
  title: 'Camera Bags (Fashion)', route: '/camera-bag-fashion', breadcrumbLabel: 'Camera Bags',
  description: 'Rectangular bags with top zipper and front pocket, inspired by classic camera cases. A perfect blend of utility and street-ready style.',
}

const kisslock: CategoryConfig = {
  title: 'Kiss-Lock Bags', route: '/kiss-lock-bag', breadcrumbLabel: 'Kiss-Lock Bags',
  description: 'Charming vintage-inspired bags with a metal clasp closure. The distinctive kiss-lock hardware adds a nostalgic, romantic touch to any outfit.',
}

const categories: Record<string, CategoryConfig> = {
  tote, shoulder, crossbody, satchel, bucket, clutch, wristlet, envelope, box, saddle, baguette, camera, kisslock,
}

export default categories
