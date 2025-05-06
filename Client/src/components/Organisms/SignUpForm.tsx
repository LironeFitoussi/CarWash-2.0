import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function SignUpForm({swithMode}: {swithMode: () => void}) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
    const { loginWithRedirect, isAuthenticated, user, logout } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // First create the user
      const signUpResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          email: formData.email,
          password: formData.password,
          connection: 'Username-Password-Authentication',
          user_metadata: {
            given_name: formData.first_name,
            family_name: formData.last_name
          }
        }),
      })

      const signUpData = await signUpResponse.json()

      if (!signUpResponse.ok) {
        if (signUpData.code === 'invalid_signup') {
          throw new Error('This email may already be registered. Please try signing in instead.')
        }
        throw new Error(signUpData.description || signUpData.message || 'Failed to sign up')
      }

      // Get token immediately after signup
      const tokenResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
          username: formData.email,
          password: formData.password,
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
          realm: 'Username-Password-Authentication',
          scope: 'openid profile email',
          audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Failed to authenticate')
      }

      // Get user info using the access token
      const userInfoResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      })

      const userInfo = await userInfoResponse.json()

      // Store all necessary session data
      localStorage.setItem('auth0_token', tokenData.access_token)
      localStorage.setItem('auth0_id_token', tokenData.id_token)
      localStorage.setItem('auth0_user', JSON.stringify(userInfo))
      localStorage.setItem('auth0_expires_at', String(Date.now() + tokenData.expires_in * 1000))

      // Force reload to update Auth0 client state
      window.location.reload()

    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    setIsLoading(true)
    loginWithRedirect({
      authorizationParams: { 
        connection: 'google-oauth2',
        screen_hint: 'signup',
      }
    })
  }

  if (isAuthenticated) {
    const userMetadata = user?.['https://namespace/user_metadata'] || {}
    const firstName = userMetadata.given_name || user?.given_name || formData.first_name || user?.name?.split(' ')[0]
    const lastName = userMetadata.family_name || user?.family_name || formData.last_name || user?.name?.split(' ')[1]

    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <Card className="w-full max-w-sm shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">Welcome, {firstName} {lastName}</p>
            <Button 
              className="w-full"
              onClick={() => {
                localStorage.removeItem('auth0_token')
                localStorage.removeItem('auth0_id_token')
                localStorage.removeItem('auth0_user')
                localStorage.removeItem('auth0_expires_at')
                logout({ logoutParams: { returnTo: window.location.origin } })
              }}
            >
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          {/* Space bar */}
          <div className='flex items-center justify-center py-4'>
            <hr className='w-full' />
            <span className='mx-4 text-muted-foreground'>Or</span>
            <hr className='w-full' />
          </div>

          {/* Google Sign In */}
          <Button
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign Up with Google
          </Button>
        </CardContent>
        <div className="pb-4">
          <p className='text-center'>Already have an account? <u onClick={swithMode} className="cursor-pointer">Sign In</u></p>
        </div>
      </Card>
    </div>
  )
}
