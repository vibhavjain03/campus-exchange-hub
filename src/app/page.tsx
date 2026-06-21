import React from 'react'
import Link from 'next/link'
import db from '@/lib/db'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, ArrowRight, Search, Laptop, BookOpen, Home as HomeIcon, Shirt, Bike, HelpCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Fallback categories in case the database is not seeded/reachable
const FALLBACK_CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: Laptop, count: 'Phones, Laptops & Gear' },
  { name: 'Textbooks & Course Materials', slug: 'textbooks', icon: BookOpen, count: 'Required course books' },
  { name: 'Dorm Essentials', slug: 'dorm-essentials', icon: HomeIcon, count: 'Fridges, rugs & lighting' },
  { name: 'Clothing & Apparel', slug: 'clothing', icon: Shirt, count: 'Gently used clothes' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: Bike, count: 'Bikes & gym gear' },
  { name: 'Miscellaneous', slug: 'misc', icon: HelpCircle, count: 'Other student goods' }
]

// Helper to map slugs to icons
function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'electronics': return Laptop
    case 'textbooks': return BookOpen
    case 'dorm-essentials': return HomeIcon
    case 'clothing': return Shirt
    case 'sports-outdoors': return Bike
    default: return HelpCircle
  }
}

export default async function Home() {
  let categories = []
  
  try {
    const dbCategories = await db.category.findMany({
      orderBy: { name: 'asc' }
    })
    
    categories = dbCategories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      icon: getCategoryIcon(cat.slug),
      count: cat.description || ''
    }))
  } catch (error) {
    console.warn('Database offline, using fallback categories display:', error)
    categories = FALLBACK_CATEGORIES
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-primary/5 via-transparent to-transparent flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase">
            <span>Verified Campus-Only Network</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            The Smart Way to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Buy & Sell on Campus
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
            Exchange dorm items, textbooks, electronics, and gear directly with fellow students. Secure, local, and hassle-free.
          </p>

          {/* Search Box Form */}
          <form action="/listings" method="GET" className="max-w-lg mx-auto w-full pt-4">
            <div className="flex items-center bg-card border border-border rounded-lg p-1.5 shadow-premium focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div className="flex items-center pl-3 pr-2 text-muted-foreground shrink-0">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search for text books, monitors, mini-fridges..."
                className="w-full bg-transparent border-none outline-none py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" size="sm" className="font-semibold text-xs shrink-0">
                Search
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 justify-center pt-4">
            <Link href="/listings">
              <Button className="flex items-center gap-1.5 shadow-md shadow-primary/10">
                Browse Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/listings/create">
              <Button variant="secondary">
                List an Item
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Browse by Category</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Find exactly what you need for the semester
            </p>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                href={`/listings?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-6 bg-card border border-border/80 hover:border-primary/30 rounded-lg shadow-premium hover:shadow-premium-hover transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-all">
                  {cat.name}
                </span>
                <span className="text-[11px] text-muted-foreground mt-1 block leading-tight truncate w-full px-1">
                  {cat.count}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Trust & Safety Features */}
      <section className="border-t border-border bg-card/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2.5">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto md:mx-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground">Verified Students Only</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Registration requires a valid campus email address. No spammers, scammers, or external sellers.
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto md:mx-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground">Cash & P2P Friendly</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero platform fees. Make and receive offers, and pay directly on pickup using cash or mobile payment apps.
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-10 w-10 rounded-full bg-violet-500/10 text-violet-600 flex items-center justify-center mx-auto md:mx-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a19.94 19.94 0 01-5-1.012V6a2 2 0 012-2h8a2 2 0 012 2v3m0 7h0" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground">WhatsApp Instant Connect</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Buyers can click to contact sellers directly on WhatsApp to coordinate questions, check items, or arrange a safe meetup.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
