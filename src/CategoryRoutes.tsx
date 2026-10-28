import React from 'react'
import { Routes, Route } from 'react-router-dom'
import handbagCategories from './pages/handbag/handbagData'
import backpackCategories from './pages/backpack/backpackData'
import travelCategories from './pages/travel/travelData'
import schoolCategories from './pages/school/schoolData'
import handcraftedCategories from './pages/handcrafted/handcraftedData'
import kidsCategories from './pages/kids/kidsData'
import casualCategories from './pages/casual/casualData'
import professionalCategories from './pages/professional/professionalData'
import sportsCategories from './pages/sports/sportsData'
import HandbagCategoryPage from './pages/handbag/HandbagCategoryPage'

const CategoryRoutes: React.FC = () => (
  <Routes>
    {Object.entries(handbagCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(backpackCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(travelCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(schoolCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(handcraftedCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(kidsCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(casualCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(professionalCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
    {Object.entries(sportsCategories).map(([key, config]) => (
      <Route key={key} path={config.route} element={<HandbagCategoryPage config={config} />} />
    ))}
  </Routes>
)

export default CategoryRoutes
