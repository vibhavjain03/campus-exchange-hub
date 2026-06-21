import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Hourglass } from 'lucide-react'

export default function ListingsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto text-center space-y-6">
      <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center animate-pulse">
        <Hourglass className="h-8 w-8" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase">
        <span>Milestone 1 Setup</span>
      </div>
      <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
        Listings Feed
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Browse and search features are planned for future milestones. The foundation and navigation structures are now configured.
      </p>
      <div className="pt-4">
        <Link href="/">
          <Button variant="secondary" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
