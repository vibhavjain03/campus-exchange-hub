'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { signOutAction } from '@/app/actions/auth'
import { ShoppingBag, PlusCircle, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react'

interface NavbarProps {
  session: {
    userId: string
    email: string
    name: string
  } | null
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOutAction()
    setDropdownOpen(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-lg gradient-badge flex items-center justify-center text-white shadow-md shadow-primary/10 group-hover:scale-105 transition-all">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Campus Exchange
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-all">
              Browse Listings
            </Link>

            {session ? (
              <div className="flex items-center gap-5">
                <Link href="/listings/create">
                  <Button size="sm" className="flex items-center gap-1.5 shadow-sm shadow-primary/15 font-semibold text-xs">
                    <PlusCircle className="h-4 w-4" />
                    Sell Item
                  </Button>
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    <Avatar name={session.name} size="sm" className="border border-border/80 hover:border-primary/50 transition-all" />
                    <span className="text-sm font-bold text-foreground/90 max-w-[100px] truncate">
                      {session.name.split(' ')[0]}
                    </span>
                  </button>
                  
                  {dropdownOpen && (
                    <>
                      {/* Overlay to close dropdown */}
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      
                      <div className="absolute right-0 mt-2.5 w-48 rounded-md bg-card border border-border shadow-lg p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-all"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          My Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-all cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="font-semibold text-xs shadow-sm shadow-primary/10">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/80 hover:text-foreground focus:outline-none p-1.5 cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-foreground/80 hover:bg-secondary hover:text-foreground transition-all"
            >
              Browse Listings
            </Link>
            
            {session ? (
              <div className="border-t border-border/60 pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-3 px-3 py-1.5">
                  <Avatar name={session.name} size="sm" />
                  <div>
                    <div className="text-sm font-bold text-foreground">{session.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{session.email}</div>
                  </div>
                </div>
                
                <Link
                  href="/listings/create"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-semibold text-primary hover:bg-secondary transition-all"
                >
                  <PlusCircle className="h-5 w-5" />
                  Sell Item
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-semibold text-foreground/80 hover:bg-secondary hover:text-foreground transition-all"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-semibold text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-border/60">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-center">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
