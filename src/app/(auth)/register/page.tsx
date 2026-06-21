'use client'

import React, { useActionState, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signUpAction } from '@/app/actions/auth'
import { UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(signUpAction, null)

  React.useEffect(() => {
    if (state?.success) {
      router.push('/')
      router.refresh()
    }
  }, [state, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
      <Card className="w-full max-w-md shadow-premium border-border bg-card/70 backdrop-blur-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full gradient-badge flex items-center justify-center text-white mb-3 shadow-md shadow-primary/20">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join Campus Exchange Hub to start trading items
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            {state?.message && !state.success && (
              <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                {state.message}
              </div>
            )}

            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              placeholder="Alex Smith"
              required
              error={state?.errors?.name?.[0]}
              disabled={isPending}
            />

            <Input
              label="College Email"
              id="email"
              name="email"
              type="email"
              placeholder="alex@college.edu"
              required
              error={state?.errors?.email?.[0]}
              disabled={isPending}
            />

            <Input
              label="WhatsApp Number"
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              placeholder="+919876543210"
              required
              error={state?.errors?.whatsappNumber?.[0]}
              disabled={isPending}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              error={state?.errors?.password?.[0]}
              disabled={isPending}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" isLoading={isPending}>
              Sign Up
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
