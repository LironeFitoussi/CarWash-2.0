import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const auth0 = useAuth0()
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  useEffect(() => {
    if (hasCheckedStorage) return

    const token = localStorage.getItem('auth0_token')
    const idToken = localStorage.getItem('auth0_id_token')
    const user = localStorage.getItem('auth0_user')
    const expiresAt = localStorage.getItem('auth0_expires_at')

    // console.log(JSON.parse(user || '{}'));
    
    if (token && idToken && user && expiresAt) {
      if (Date.now() > parseInt(expiresAt)) {
        // Clear expired tokens
        localStorage.removeItem('auth0_token')
        localStorage.removeItem('auth0_id_token')
        localStorage.removeItem('auth0_user')
        localStorage.removeItem('auth0_expires_at')
      }
    }

    setHasCheckedStorage(true)
  }, [hasCheckedStorage])

  return {
    ...auth0,
    isAuthenticated: auth0.isAuthenticated || (hasCheckedStorage && !!localStorage.getItem('auth0_token'))
  }
} 