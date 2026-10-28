import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const camera: CategoryConfig = {
  title: 'Camera Bags', route: '/camera-bag', breadcrumbLabel: 'Camera Bags',
  description: 'Protective camera bags with padded dividers and quick-access compartments. Designed for photographers who need to carry and protect valuable gear.',
}

const drone: CategoryConfig = {
  title: 'Drone Bags', route: '/drone-bag', breadcrumbLabel: 'Drone Bags',
  description: 'Purpose-built bags for drones and accessories. Padded compartments protect your drone, controller, batteries, and propellers during transport.',
}

const tool: CategoryConfig = {
  title: 'Tool Bags', route: '/tool-bag', breadcrumbLabel: 'Tool Bags',
  description: 'Heavy-duty tool bags and organizers built for professionals. Durable construction with multiple pockets and compartments for all your tools.',
}

const firstAid: CategoryConfig = {
  title: 'First Aid Bags', route: '/first-aid-bag', breadcrumbLabel: 'First Aid Bags',
  description: 'Organized first aid bags and trauma kits for medical professionals, outdoor enthusiasts, and workplace safety. Keep supplies ready and accessible.',
}

const craft: CategoryConfig = {
  title: 'Craft Bags / Knitting Bags', route: '/craft-bag', breadcrumbLabel: 'Craft & Knitting Bags',
  description: 'Specialty bags for crafters, knitters, and makers. Organized storage for yarn, needles, hooks, scissors, and all your creative supplies.',
}

const cash: CategoryConfig = {
  title: 'Cash Bags', route: '/cash-bag', breadcrumbLabel: 'Cash Bags',
  description: 'Secure cash handling bags for businesses, banks, and retail. Tamper-evident designs with locks and RFID protection for safe money transport.',
}

const security: CategoryConfig = {
  title: 'Security Bags', route: '/security-bag', breadcrumbLabel: 'Security Bags',
  description: 'High-security bags with anti-theft features. RFID blocking, cut-resistant straps, hidden zippers, and locking mechanisms for peace of mind.',
}

const lunch: CategoryConfig = {
  title: 'Lunch Bags', route: '/lunch-bag', breadcrumbLabel: 'Lunch Bags',
  description: 'Insulated lunch bags and coolers for work, school, and picnics. Keep meals fresh with thermal insulation and leak-proof linings.',
}

const categories: Record<string, CategoryConfig> = {
  camera, drone, tool, firstAid, craft, cash, security, lunch,
}

export default categories
