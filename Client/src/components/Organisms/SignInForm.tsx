import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function SignInForm({swithMode}: {swithMode: () => void}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
          username: email,
          password: password,
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
          realm: 'Username-Password-Authentication',
          scope: 'openid profile email',
          audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (data.error === 'unauthorized') {
          throw new Error('Please verify your email before signing in.')
        } else if (data.error === 'invalid_grant') {
          throw new Error('Invalid email or password.')
        } else if (data.error === 'server_error') {
          throw new Error('Please check your email and password.')
        }
        throw new Error(data.error_description || 'Failed to sign in')
      }

      // Get user info using the access token
      const userInfoResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      })

      const userInfo = await userInfoResponse.json()

      // Store all necessary session data
      localStorage.setItem('auth0_token', data.access_token)
      localStorage.setItem('auth0_id_token', data.id_token)
      localStorage.setItem('auth0_user', JSON.stringify(userInfo))
      localStorage.setItem('auth0_expires_at', String(Date.now() + data.expires_in * 1000))

      // Force reload to update Auth0 client state
      window.location.reload()

    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    loginWithRedirect({
      authorizationParams: { 
        connection: 'google-oauth2'
      }
    })
  }

  if (isAuthenticated) {
    console.log(user)
    // const firstName = userMetadata.given_name || user?.given_name || user?.name?.split(' ')[0]
    // const lastName = userMetadata.family_name || user?.family_name || user?.name?.split(' ')[1]

    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <Card className="w-full max-w-sm shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <p className="text-center">Welcome, {firstName} {lastName}</p> */}
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
      <Card className="w-full max-w-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
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
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign In with Google
          </Button>
        </CardContent>
        <div className="pb-4">
          <p className='text-center'>Don't have an account? <u onClick={swithMode} className="cursor-pointer">Sign Up</u></p>
        </div>
      </Card>
    </div>
  )
}
