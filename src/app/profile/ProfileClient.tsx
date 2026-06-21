'use client'

import React, { useActionState, startTransition, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { updateProfileAction, signOutAction } from '@/app/actions/auth'
import { Phone, Mail, FileText, LogOut, Edit2, X, Check, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  id: string
  email: string
  name: string
  whatsappNumber: string | null
  bio: string | null
}

interface ProfileClientProps {
  profile: ProfileData
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'listings'>('profile')
  const [state, formAction, isPending] = useActionState(updateProfileAction, null)

  const handleSignOut = async () => {
    await signOutAction()
    router.push('/login')
    router.refresh()
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  React.useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setIsEditing(false)
      }, 0)
      router.refresh()
      return () => clearTimeout(timer)
    }
  }, [state, router])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side Profile Card */}
        <Card className="w-full md:w-80 shadow-premium border-border shrink-0">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar name={profile.name} size="lg" className="mb-4 shadow-sm" />
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
            
            {profile.bio && (
              <p className="text-sm text-foreground/80 mt-4 px-2 italic line-clamp-3">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}

            <hr className="w-full my-5 border-border" />

            <div className="w-full space-y-3.5 text-left text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4.5 w-4.5 text-primary/70 shrink-0" />
                <span className="text-foreground truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4.5 w-4.5 text-primary/70 shrink-0" />
                <span className="text-foreground">
                  {profile.whatsappNumber || 'No WhatsApp set'}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="mt-6 w-full text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/15 flex items-center gap-2 justify-center"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Right Side Tabs / Dashboard */}
        <div className="flex-1 w-full space-y-6">
          {/* Tabs Navigation */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all flex items-center gap-2 ${
                activeTab === 'listings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              My Listings
            </button>
          </div>

          {activeTab === 'profile' && (
            <Card className="shadow-premium border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
                  <CardDescription>
                    Update your account details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                {state?.message && (
                  <div
                    className={`p-3.5 mb-5 rounded-md text-sm font-medium border animate-in fade-in slide-in-from-top-1 duration-200 ${
                      state.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-destructive/10 border-destructive/20 text-destructive'
                    }`}
                  >
                    {state.message}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <Input
                      label="Full Name"
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      required
                      error={state?.errors?.name?.[0]}
                      disabled={isPending}
                    />

                    <Input
                      label="WhatsApp Number (e.g. +919876543210)"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      type="tel"
                      defaultValue={profile.whatsappNumber || ''}
                      required
                      error={state?.errors?.whatsappNumber?.[0]}
                      disabled={isPending}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="bio" className="text-sm font-semibold text-foreground/80">
                        Short Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        defaultValue={profile.bio || ''}
                        placeholder="Tell students about yourself..."
                        rows={3}
                        disabled={isPending}
                        className="w-full px-3.5 py-2.5 bg-card text-foreground border border-border rounded-md shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                      {state?.errors?.bio?.[0] && (
                        <span className="text-xs text-destructive font-medium mt-0.5">
                          {state.errors.bio[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1.5"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        isLoading={isPending}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block">Display Name</span>
                        <span className="text-sm font-semibold text-foreground">{profile.name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">College Email</span>
                        <span className="text-sm font-semibold text-foreground">{profile.email}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">WhatsApp Number</span>
                        <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          {profile.whatsappNumber ? (
                            <>
                              <Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                              {profile.whatsappNumber}
                            </>
                          ) : (
                            <span className="text-muted-foreground italic">Not set</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">About Me / Bio</span>
                      {profile.bio ? (
                        <p className="text-sm text-foreground/90 bg-secondary/30 p-3 rounded-md border border-border/50">
                          {profile.bio}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic bg-secondary/20 p-3 rounded-md border border-border/50">
                          No bio added yet. Click edit to tell buyers about yourself!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'listings' && (
            <Card className="shadow-premium border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">My Active Items</CardTitle>
                <CardDescription>
                  Listings you are currently selling on the hub
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 min-h-[200px] flex flex-col items-center justify-center text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/60 mb-3" />
                <p className="text-sm font-semibold text-foreground/80">No active listings yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Ready to declutter? Click the button below to create your first marketplace item.
                </p>
                <Button
                  onClick={() => router.push('/listings/create')}
                  size="sm"
                  className="mt-5"
                >
                  Create A Listing
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
