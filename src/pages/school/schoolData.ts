import type { CategoryConfig } from '../handbag/HandbagCategoryPage'

const briefcase: CategoryConfig = {
  title: 'Briefcases', route: '/briefcase', breadcrumbLabel: 'Briefcases',
  description: 'Professional briefcases for the modern workplace. Classic silhouettes with modern organization — from traditional leather to lightweight technical materials.',
}

const messenger: CategoryConfig = {
  title: 'Messenger Bags', route: '/messenger-bag', breadcrumbLabel: 'Messenger Bags',
  description: 'Crossbody messenger bags with a classic flap design. Spacious, organized, and perfect for commuting, school, or casual daily carry.',
}

const laptopBag: CategoryConfig = {
  title: 'Laptop Bags', route: '/laptop-bag', breadcrumbLabel: 'Laptop Bags',
  description: 'Dedicated laptop carrying solutions with maximum protection. From padded sleeves to multi-compartment bags designed specifically for your devices.',
}

const portfolio: CategoryConfig = {
  title: 'Portfolio Bags', route: '/portfolio', breadcrumbLabel: 'Portfolio Bags',
  description: 'Slim document carriers and folio cases for meetings, interviews, and professional presentations. Keep your papers, tablet, and essentials organized.',
}

const backpackSchool: CategoryConfig = {
  title: 'Backpacks for School', route: '/backpack-school', breadcrumbLabel: 'School Backpacks',
  description: 'Durable backpacks designed for students of all ages. Ergonomic support, multiple compartments, and styles that transition from class to campus.',
}

const teacher: CategoryConfig = {
  title: 'Teacher Bags', route: '/teacher-bag', breadcrumbLabel: 'Teacher Bags',
  description: 'Functional bags designed for educators. Roomy enough for lesson plans, grading papers, and personal items with comfortable carry for busy school days.',
}

const categories: Record<string, CategoryConfig> = {
  briefcase, messenger, laptopBag, portfolio, backpackSchool, teacher,
}

export default categories
