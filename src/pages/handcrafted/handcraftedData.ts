import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const handwoven: CategoryConfig = {
  title: 'Handwoven Bags', route: '/handwoven-bags', breadcrumbLabel: 'Handwoven Bags',
  description: 'Artisan-crafted bags made using traditional weaving techniques. Each piece showcases unique patterns passed down through generations of skilled weavers.',
}

const embroidered: CategoryConfig = {
  title: 'Embroidered Totes', route: '/embroidered-totes', breadcrumbLabel: 'Embroidered Totes',
  description: 'Beautifully embellished tote bags featuring intricate embroidery, beadwork, and decorative stitching. Each piece is a wearable work of art.',
}

const leatherCraft: CategoryConfig = {
  title: 'Leather Craft', route: '/leather-craft', breadcrumbLabel: 'Leather Craft',
  description: 'Handcrafted leather bags made by skilled artisans using traditional techniques. Premium hides, hand-stitched details, and heirloom-quality construction.',
}

const beaded: CategoryConfig = {
  title: 'Beaded Clutches', route: '/beaded-clutches', breadcrumbLabel: 'Beaded Clutches',
  description: 'Exquisite clutches adorned with hand-beaded details. From subtle pearl accents to fully embellished statement pieces for special occasions.',
}

const macrame: CategoryConfig = {
  title: 'Macramé & Knotwork', route: '/macrame-knotwork', breadcrumbLabel: 'Macramé & Knotwork',
  description: 'Bags crafted using macramé knotting techniques. Bohemian-inspired designs with intricate rope work, fringe details, and natural fiber textures.',
}

const patchwork: CategoryConfig = {
  title: 'Artisan Patchwork', route: '/artisan-patchwork', breadcrumbLabel: 'Artisan Patchwork',
  description: 'Vibrant patchwork bags created from fabric scraps and offcuts. Each piece is a unique collage of colors, patterns, and textures.',
}

const categories: Record<string, CategoryConfig> = {
  handwoven, embroidered, leatherCraft, beaded, macrame, patchwork,
}

export default categories
