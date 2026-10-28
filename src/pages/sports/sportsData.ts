import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const gym: CategoryConfig = {
  title: 'Gym Bags', route: '/gym-bag', breadcrumbLabel: 'Gym Bags',
  description: 'Durable gym bags for every workout. From compact duffels to spacious backpacks with ventilated compartments for shoes and sweaty gear.',
}

const drawstring: CategoryConfig = {
  title: 'Drawstring Sack Packs', route: '/drawstring-sack-pack', breadcrumbLabel: 'Drawstring Sack Packs',
  description: 'Lightweight drawstring backpacks for casual use, sports, and events. Easy one-pull closure and packable design makes them perfect grab-and-go bags.',
}

const yoga: CategoryConfig = {
  title: 'Yoga Mat Bags', route: '/yoga-mat-bag', breadcrumbLabel: 'Yoga Mat Bags',
  description: 'Carry your yoga mat in style. Bags with padded straps, extra pockets for accessories, and durable materials for studio-to-street convenience.',
}

const swim: CategoryConfig = {
  title: 'Swim Bags', route: '/swim-bag', breadcrumbLabel: 'Swim Bags',
  description: 'Water-resistant swim bags with drainage and ventilation. Perfect for pool days, beach trips, and storing wet swimwear after a swim.',
}

const ski: CategoryConfig = {
  title: 'Ski Boot Bags', route: '/ski-boot-bag', breadcrumbLabel: 'Ski Boot Bags',
  description: 'Insulated and padded ski boot bags for winter sports. Carry boots, helmet, and gear with confidence with durable waterproof construction.',
}

const golf: CategoryConfig = {
  title: 'Golf Bags', route: '/golf-bag', breadcrumbLabel: 'Golf Bags',
  description: 'Premium golf bags for every level of player. Lightweight carry bags to full-featured carts bags with organized club protection and ample storage.',
}

const tactical: CategoryConfig = {
  title: 'Tactical Bags', route: '/tactical-bag', breadcrumbLabel: 'Tactical Bags',
  description: 'Military-grade tactical bags built for durability and utility. MOLLE webbing, rugged construction, and modular designs for professionals and enthusiasts.',
}

const hydration: CategoryConfig = {
  title: 'Hydration Packs', route: '/hydration-pack', breadcrumbLabel: 'Hydration Packs',
  description: 'Hydration packs with built-in water reservoirs for hands-free drinking during hiking, running, cycling, and outdoor activities.',
}

const cycling: CategoryConfig = {
  title: 'Cycling Bags', route: '/cycling-bag', breadcrumbLabel: 'Cycling Bags',
  description: 'Bicycle bags for commuting, touring, and racing. From saddle bags to handlebar packs and panniers, built for aerodynamic and secure bike travel.',
}

const crossfitGym: CategoryConfig = {
  title: 'Crossfit & Gym Bags', route: '/crossfit-gym', breadcrumbLabel: 'Crossfit & Gym',
  parentLabel: 'Sports',
  description: 'Competition-grade CrossFit and functional fitness bags. Barbell-ready duffels, rig packs and high-ab totes built to survive chalk, sweat and heavy loads.',
}

const running: CategoryConfig = {
  title: 'Running Bags', route: '/running', breadcrumbLabel: 'Running',
  parentLabel: 'Sports',
  description: 'Bounce-free running vests, hydration packs and race belts. Lightweight, reflective and sweat-resistant designs for road, trail and ultra distances.',
}

const swimming: CategoryConfig = {
  title: 'Swimming Bags', route: '/swimming', breadcrumbLabel: 'Swimming',
  parentLabel: 'Sports',
  description: 'Waterproof swim bags, dry sacks and competition mesh kits. Chlorine-resistant, watertight and quick-draining for pool sessions, open water and beach days.',
}

const tennis: CategoryConfig = {
  title: 'Tennis Bags', route: '/tennis', breadcrumbLabel: 'Tennis',
  parentLabel: 'Sports',
  description: 'Tennis backpacks, racquet covers and tournament totes. Padded racquet bays, ventilated shoe pockets and hard-wearing shells for match and practice days.',
}

const outdoor: CategoryConfig = {
  title: 'Outdoor & Hiking Bags', route: '/outdoor', breadcrumbLabel: 'Outdoor',
  parentLabel: 'Sports',
  description: 'Hiking, camping and expedition bags built for the trail. Weatherproof rolltops, hydration harnesses and framed trekking packs for multi-day trips.',
}

const categories: Record<string, CategoryConfig> = {
  gym, drawstring, yoga, swim, ski, golf, tactical, hydration, cycling,
  crossfitGym, running, swimming, tennis, outdoor,
}

export default categories
