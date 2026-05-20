import { Outlet } from 'react-router-dom'
import { useAuth } from '../stores/authStore.js'
import { ForumHeader } from './Header.jsx'
import { Footer } from './Footer.jsx'

export const Layout = () => {
	const { user, logout } = useAuth()
	return (
		<div className='min-h-screen bg-white flex flex-col'>
			<ForumHeader onLogout={logout} user={user} />
			<div className='flex-1 max-w-7xl container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
				<Outlet />
			</div>
			<Footer />
		</div>
	)
}
