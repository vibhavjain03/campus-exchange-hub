import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Tag } from 'lucide-react'

interface ListingDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { id } = await params
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto text-center space-y-6">
      <div className="h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center">
        <Tag className="h-8 w-8" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/15 text-accent text-xs font-semibold tracking-wide uppercase">
        <span>Milestone 1 Setup</span>
      </div>
      <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
        Listing Details
      </h1>
      <p className="text-sm font-semibold text-muted-foreground">
        Viewing Listing ID: <span className="font-mono text-accent">{id}</span>
      </p>
      <p className="text-muted-foreground max-w-md mx-auto">
        Listing details viewing is planned for future milestones. The routing structures and layout are fully verified.
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
