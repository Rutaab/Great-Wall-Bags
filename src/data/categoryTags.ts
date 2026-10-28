export interface CategoryTag {
  name: string
  route: string
}

export interface TagGroup {
  key: string
  label: string
  /**
   * Where a "view all" link for the whole group points. The per-category hub pages
   * were removed, so this is derived from the group's first subcategory instead of
   * a hardcoded hub route - it is always a live route.
   */
  route: string
  items: CategoryTag[]
}

const handbagRoutes: Record<string, string> = {
  'Tote bag': '/tote-bag',
  'Shoulder bag': '/shoulder-bag',
  'Crossbody bag': '/crossbody-bag',
  'Satchel': '/satchel',
  'Bucket bag': '/bucket-bag',
  'Clutch': '/clutch',
  'Wristlet': '/wristlet',
  'Envelope bag': '/envelope-bag',
  'Box bag': '/box-bag',
  'Saddle bag': '/saddle-bag',
  'Baguette bag': '/baguette-bag',
  'Camera bag (fashion)': '/camera-bag-fashion',
  'Kiss-lock bag': '/kiss-lock-bag',
}

const backpackRoutes: Record<string, string> = {
  'Daypack': '/daypack',
  'Laptop backpack': '/laptop-backpack',
  'Rucksack': '/rucksack',
  'Drawstring backpack': '/drawstring-backpack',
  'Mini backpack': '/mini-backpack',
  'Anti-theft backpack': '/anti-theft-backpack',
  'Clear backpack': '/clear-backpack',
  'Travel backpack': '/travel-backpack',
  'Rolling backpack': '/rolling-backpack',
  'Hiking backpack': '/hiking-backpack',
}

const travelRoutes: Record<string, string> = {
  'Duffel bag': '/duffel-bag',
  'Weekender bag': '/weekender-bag',
  'Garment bag': '/garment-bag',
  'Toiletry bag': '/toiletry-bag',
  'Makeup bag': '/makeup-bag',
}

const schoolRoutes: Record<string, string> = {
  'Briefcase': '/briefcase',
  'Messenger bag': '/messenger-bag',
  'Laptop bag': '/laptop-bag',
  'Portfolio': '/portfolio',
  'Backpack (for school)': '/backpack-school',
  'Teacher bag': '/teacher-bag',
}

const handcraftedRoutes: Record<string, string> = {
  'Handwoven Bags': '/handwoven-bags',
  'Embroidered Totes': '/embroidered-totes',
  'Leather Craft': '/leather-craft',
  'Beaded Clutches': '/beaded-clutches',
  'Macramé & Knotwork': '/macrame-knotwork',
  'Artisan Patchwork': '/artisan-patchwork',
}

const kidsRoutes: Record<string, string> = {
  'Diaper Bags': '/diaper-bags',
  'Kids Backpacks': '/kids-backpacks',
  'Baby Changing Kits': '/baby-changing-kits',
  'Toddler Totes': '/toddler-totes',
  'Kids Lunch Bags': '/kids-lunch-bags',
  'Baby Bottle Carriers': '/baby-bottle-carriers',
}

const casualRoutes: Record<string, string> = {
  'Waist bag': '/waist-bag',
  'Sling bag': '/sling-bag',
  'Chest rig': '/chest-rig',
  'Canvas tote': '/canvas-tote',
  'String bag': '/string-bag',
  'Cooler bag': '/cooler-bag',
  'Foldable bag': '/foldable-bag',
}

const professionalRoutes: Record<string, string> = {
  'Camera bag': '/camera-bag',
  'Drone bag': '/drone-bag',
  'Tool bag': '/tool-bag',
  'First aid bag': '/first-aid-bag',
  'Craft bag / Knitting bag': '/craft-bag',
  'Cash bag': '/cash-bag',
  'Security bag': '/security-bag',
  'Lunch bag': '/lunch-bag',
}

const sportsRoutes: Record<string, string> = {
  'Crossfit & Gym': '/crossfit-gym',
  'Running': '/running',
  'Swimming': '/swimming',
  'Tennis': '/tennis',
  'Outdoor': '/outdoor',
  'Gym bag': '/gym-bag',
  'Drawstring sack pack': '/drawstring-sack-pack',
  'Yoga mat bag': '/yoga-mat-bag',
  'Swim bag': '/swim-bag',
  'Ski boot bag': '/ski-boot-bag',
  'Golf bag': '/golf-bag',
  'Tactical bag': '/tactical-bag',
  'Hydration pack': '/hydration-pack',
  'Cycling bag': '/cycling-bag',
}

const extraRoutes: Record<string, string> = {
  'Suitcase': '/suitcase',
}

function resolveRoute(name: string): string | undefined {
  return handbagRoutes[name] || backpackRoutes[name] || travelRoutes[name]
    || schoolRoutes[name] || handcraftedRoutes[name] || kidsRoutes[name]
    || casualRoutes[name] || professionalRoutes[name] || sportsRoutes[name]
    || extraRoutes[name]
}

function buildTagGroup(key: string, label: string, itemNames: string[]): TagGroup {
  const items = itemNames.map(name => ({
    name,
    route: resolveRoute(name) || '#',
  }))
  return {
    key,
    label,
    // No hub page per category any more; fall back to the first subcategory so
    // "view all" links in the AddProduct screens never point at a deleted route.
    route: items[0]?.route || '#',
    items,
  }
}

export const tagGroups: TagGroup[] = [
  buildTagGroup('luxury', 'Handbags & Purses', [
    'Tote bag', 'Shoulder bag', 'Crossbody bag', 'Satchel', 'Bucket bag',
    'Clutch', 'Wristlet', 'Envelope bag', 'Box bag', 'Saddle bag',
    'Baguette bag', 'Camera bag (fashion)', 'Kiss-lock bag',
  ]),
  buildTagGroup('backpack', 'Backpacks', [
    'Daypack', 'Laptop backpack', 'Rucksack', 'Drawstring backpack',
    'Mini backpack', 'Anti-theft backpack', 'Clear backpack',
    'Travel backpack', 'Rolling backpack', 'Hiking backpack',
  ]),
  buildTagGroup('travel', 'Luggage & Travel Bags', [
    'Suitcase', 'Duffel bag', 'Weekender bag', 'Garment bag',
    'Toiletry bag', 'Makeup bag',
  ]),
  buildTagGroup('school', 'Bags for Work & School', [
    'Briefcase', 'Messenger bag', 'Laptop bag', 'Portfolio',
    'Backpack (for school)', 'Teacher bag',
  ]),
  buildTagGroup('casual-utility', 'Casual & Utility Bags', [
    'Waist bag', 'Sling bag', 'Chest rig', 'Canvas tote', 'String bag',
    'Cooler bag', 'Foldable bag',
  ]),
  buildTagGroup('professional-bags', 'Professional Bags', [
    'Camera bag', 'Drone bag', 'Tool bag', 'First aid bag',
    'Craft bag / Knitting bag', 'Cash bag', 'Security bag', 'Lunch bag',
  ]),
  buildTagGroup('sports', 'Sports', [
    'Crossfit & Gym', 'Running', 'Swimming', 'Tennis', 'Outdoor',
    'Gym bag', 'Drawstring sack pack', 'Yoga mat bag', 'Swim bag',
    'Ski boot bag', 'Golf bag', 'Tactical bag', 'Hydration pack',
    'Cycling bag',
  ]),
  buildTagGroup('handcrafted', 'Handcrafted', [
    'Handwoven Bags', 'Embroidered Totes', 'Leather Craft',
    'Beaded Clutches', 'Macramé & Knotwork', 'Artisan Patchwork',
  ]),
  buildTagGroup('kids-baby', 'Kids & Baby', [
    'Diaper Bags', 'Kids Backpacks', 'Baby Changing Kits',
    'Toddler Totes', 'Kids Lunch Bags', 'Baby Bottle Carriers',
  ]),
]

export function getRouteForTag(tagName: string): string | undefined {
  return resolveRoute(tagName)
}

export function getAllTags(): { name: string; route: string }[] {
  const tags: { name: string; route: string }[] = []
  for (const group of tagGroups) {
    for (const item of group.items) {
      tags.push(item)
    }
  }
  return tags
}

/**
 * Main menu entries. `route` is intentionally absent for the category groups:
 * their hub pages were deleted, so the header renders them as dropdown-only
 * toggles instead of links. Only entries that still have a real page (Accessories)
 * carry a `route`.
 */
export interface NavItem {
  route?: string
  label: string
  key: string
}

export const desktopNavItems: NavItem[] = [
  { label: 'Handbags & Purses', key: 'luxury' },
  { label: 'Backpacks', key: 'backpack' },
  { label: 'Travel & Luggage', key: 'travel' },
  { label: 'Work & School', key: 'school' },
  { label: 'Handcrafted', key: 'handcrafted' },
  { label: 'Kids & Baby', key: 'kids-baby' },
  { label: 'Casual & Utility Bags', key: 'casual-utility' },
  { label: 'Professional Bags', key: 'professional-bags' },
  { label: 'Sports', key: 'sports' },
  { route: '/accessories', label: 'Accessories', key: '' },
]

export interface MobileNavItem extends NavItem {
  icon: string
}

export const mobileNavItems: MobileNavItem[] = [
  { label: 'Handbags & Purses', icon: 'shopping_bag', key: 'luxury' },
  { label: 'Backpacks', icon: 'backpack', key: 'backpack' },
  { label: 'Travel & Luggage', icon: 'luggage', key: 'travel' },
  { label: 'Work & School', icon: 'school', key: 'school' },
  { label: 'Casual & Utility', icon: 'checkroom', key: 'casual-utility' },
  { label: 'Professional', icon: 'work', key: 'professional-bags' },
  { label: 'Sports', icon: 'exercise', key: 'sports' },
  { label: 'Handcrafted', icon: 'handyman', key: 'handcrafted' },
  { label: 'Kids & Baby', icon: 'child_care', key: 'kids-baby' },
]

export function getTagGroupByKey(key: string): TagGroup | undefined {
  return tagGroups.find(g => g.key === key)
}
