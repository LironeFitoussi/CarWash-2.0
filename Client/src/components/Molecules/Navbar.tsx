import { useLocation, useNavigate } from 'react-router-dom'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Cars', path: '/cars' },
  { name: 'Appointments', path: '/appointments' },
]

export default function Navbar() {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth() // `login` and `logout` must be exposed
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    // clear cookies
    localStorage.removeItem('auth0_token')
    localStorage.removeItem('auth0_id_token')
    localStorage.removeItem('auth0_user')
    localStorage.removeItem('auth0_expires_at')
  }
  return (
    <header className="w-full border-b shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">
          CarWash 🚗
        </span>

        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex gap-4">
            {routes.map((route) => (
              <NavigationMenuItem key={route.path}>
                <a
                  href={route.path}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition ${
                    location.pathname === route.path
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  {route.name}
                </a>
              </NavigationMenuItem>
            ))}
            {/* Admin Dashboard */}
            {/* <NavigationMenuItem>
              <a href="/admin" className="text-sm font-medium px-3 py-2 rounded-md transition hover:bg-muted">
                Admin Dashboard
              </a>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>

        {!isAuthenticated ? (
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Log In
          </Button>
        ) : (
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        )}
      </div>
    </header>
  )
}
