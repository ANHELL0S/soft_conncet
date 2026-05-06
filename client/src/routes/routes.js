import { lazy } from 'react'
import { PATH_ROUTES } from '../common/const/pauthRoute-const.js'

const lazyImport = path => lazy(() => import(path))

const routes_public = [
	{
		path: `/${PATH_ROUTES.HOME}`,
		element: lazyImport('../pages/home/Home-page.jsx'),
	},
	{
		path: `/${PATH_ROUTES.POST}/:id`,
		element: lazyImport('../pages/post/PostDetail.jsx'),
	},
]

const routes_auth = [
	{
		path: `/${PATH_ROUTES.AUTH.SIGNIN}`,
		element: lazyImport('../pages/auth/Login-page.jsx'),
	},
	{
		path: `/${PATH_ROUTES.AUTH.SIGNUP}`,
		element: lazyImport('../pages/auth/Register-page.jsx'),
	},
]

const routes_private = [
	{
		path: `/${PATH_ROUTES.ADMIN.USER}`,
		element: lazyImport('../pages/admin/User-page.jsx'),
		requiredRoles: ['admin'],
	},
	{
		path: `/${PATH_ROUTES.ADMIN.PROFILE}`,
		element: lazyImport('../pages/profile/ProfilePage.jsx'),
	},
]

export { routes_public, routes_auth, routes_private }
