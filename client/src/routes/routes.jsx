import { lazy } from 'react'
import { PATH_ROUTES } from '../common/const/pauthRoute-const.js'

const HomePage = lazy(() => import('../pages/home/Home-page.jsx'))
const PostDetail = lazy(() => import('../pages/post/PostDetail.jsx'))

const LoginPage = lazy(() => import('../pages/auth/Login-page.jsx'))
const RegisterPage = lazy(() => import('../pages/auth/Register-page.jsx'))

const UserPage = lazy(() => import('../pages/admin/User-page.jsx'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage.jsx'))

const routes_public = [
	{
		path: `/${PATH_ROUTES.HOME}`,
		element: HomePage,
	},
	{
		path: `/${PATH_ROUTES.POST}/:id`,
		element: PostDetail,
	},
]

const routes_auth = [
	{
		path: `/${PATH_ROUTES.AUTH.SIGNIN}`,
		element: LoginPage,
	},
	{
		path: `/${PATH_ROUTES.AUTH.SIGNUP}`,
		element: RegisterPage,
	},
]

const routes_private = [
	{
		path: `/${PATH_ROUTES.ADMIN.USER}`,
		element: UserPage,
		requiredRoles: ['admin'],
	},
	{
		path: `/${PATH_ROUTES.ADMIN.PROFILE}`,
		element: ProfilePage,
	},
]

export { routes_public, routes_auth, routes_private }
