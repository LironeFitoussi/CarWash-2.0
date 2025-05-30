import { useLocation, Link } from 'react-router-dom'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'

export default function AdminNavbar() {
  const location = useLocation()

  const routes = [
    { name: 'Dashboard', path: '' },
    { name: 'Categories', path: 'categories' },
    { name: 'Accounts', path: 'accounts' },
    { name: 'Users', path: 'users' },
    { name: 'Analytics', path: 'analytics' },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-30 max-w-6xl mx-auto px-4 py-6 flex items-center justify-center my-4">
    
        <NavigationMenu>
          <NavigationMenuList className="flex md:flex-row gap-2 md:gap-4 w-full md:w-auto sticky top-0 z-30">
            {routes.map((route) => (
              <NavigationMenuItem key={route.path} className="flex items-center justify-center">
                <Link
                  to={`/admin/${route.path}`}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition ${
                    route.path === '' 
                      ? location.pathname === '/admin/'
                        ? 'bg-gray-700 text-white'
                        : 'hover:bg-muted'
                      : location.pathname.includes(`/admin/${route.path}`)
                        ? 'bg-gray-700 text-white'
                        : 'hover:bg-muted'
                  }`}
                >
                  {route.name}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>   
    </header>
  )
}
