import React from 'react'
import { useSearchParams } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import SearchResultsPage from './SearchResultsPage'
import { demoProducts } from '../data/demoProducts'

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const filtered = query
    ? demoProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : demoProducts

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="max-w-[1920px] mx-auto pb-16 md:pb-0">
        <SearchResultsPage
          categoryName={query ? `Results for "${query}"` : 'All Products'}
          categorySlug={query || 'all'}
          products={filtered}
          totalResults={filtered.length}
        />
      </main>
      <Footer />
    </div>
  )
}

export default SearchPage
