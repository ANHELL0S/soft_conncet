import { useState } from 'react'
import { SiteLogo } from './Logo.jsx'
import { useAuth } from '../stores/authStore.js'
import { ChevronDown, LogOut, Plus, Search, Settings, Shield, User } from 'lucide-react'
import { PATH_ROUTES } from '../common/const/pauthRoute-const.js'
import { CreatePostModal } from './post/CreatePostModal.jsx'
import { useCreatePost } from '../common/hooks/usePosts.js'
import { useNavigate } from 'react-router-dom'

export const ForumHeader = () => {
	const navigate = useNavigate()
	const { user, isAuthenticated, isAdmin, logout } = useAuth()
	const [searchQuery, setSearchQuery] = useState('')
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [showPostModal, setShowPostModal] = useState(false)

	// Usar TanStack Query mutation para crear posts
	const createPostMutation = useCreatePost()

	const handleLogout = () => {
		logout()
		setShowUserMenu(false)
	}

	const handleCreatePost = async postData => {
		try {
			console.log('📝 Creando nuevo post:', postData)

			// Usar la mutation de TanStack Query
			const response = await createPostMutation.mutateAsync({
				title: postData.title,
				description: postData.description,
			})

			console.log('✅ Pregunta creada:', response)

			// Cerrar el modal
			setShowPostModal(false)

			// Mostrar mensaje de éxito (opcional)
			// Puedes usar un toast notification aquí
			// toast.success('Pregunta publicada correctamente')

			return response
		} catch (error) {
			console.error('❌ Error al crear la pregunta:', error)

			// Mostrar error específico al usuario
			const errorMessage = error.message || 'Hubo un error al publicar la pregunta. Por favor, intenta nuevamente.'

			// En lugar de alert, podrías usar un toast notification
			alert(errorMessage)

			throw error // Re-lanzar para que el modal maneje el estado
		}
	}

	// Manejar cierre del modal
	const handleCloseModal = () => {
		setShowPostModal(false)
	}

	return (
		<>
			<header className='sticky top-0 z-50 border-b border-gray-100 bg-white transition-colors duration-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						{/* Logo y Navegación */}
						<div className='flex items-center space-x-8'>
							<SiteLogo />

							{/* 
							{isAuthenticated && (
								<nav className='hidden md:flex space-x-1'>
									<a
										href='#'
										className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200'>
										<span>Categorías</span>
									</a>
									<a
										href='#'
										className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200'>
										<span>Mis Preguntas</span>
									</a>
								</nav>
							)}
							*/}
						</div>

						{/* Controles de usuario */}
						<div className='flex items-center space-x-4'>
							{isAuthenticated ? (
								<div className='flex items-center space-x-2'>
									<button
										onClick={() => setShowPostModal(true)}
										className='bg-gray-600 hover:bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md'>
										<Plus className='h-4 w-4' />
										<span>Preguntar</span>
									</button>

									{/* Menú de usuario */}
									<div className='relative'>
										<button
											onClick={() => setShowUserMenu(!showUserMenu)}
											className='flex items-center space-x-2 focus:outline-none p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200'>
											<div className='h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-purple-100 flex items-center justify-center border border-gray-200'>
												{user?.avatar ? (
													<img src={user.avatar} alt={user.name} className='h-8 w-8 rounded-full object-cover' />
												) : (
													<User className='h-4 w-4 text-gray-600' />
												)}
											</div>
											<ChevronDown
												className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
													showUserMenu ? 'rotate-180' : ''
												}`}
											/>
										</button>

										{showUserMenu && (
											<>
												<div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50'>
													{/* Información del usuario */}
													<div className='px-4 py-3 border-b border-gray-100'>
														<p className='text-xs font-semibold text-gray-900 truncate'>
															{user?.firstName || '-'} {user?.lastName || '-'}
														</p>
														<p className='text-xs text-gray-500 truncate mt-1'>{user?.email}</p>
													</div>

													<div className='py-0'>
														{isAdmin && (
															<a
																href={`/${PATH_ROUTES.ADMIN.USER}`}
																className='flex items-center space-x-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors group'
																onClick={() => setShowUserMenu(false)}>
																<Shield className='h-4 w-4 text-gray-400' />
																<span>Panel de Administración</span>
															</a>
														)}
														<button
															onClick={() => {
																navigate(`/${PATH_ROUTES.ADMIN.PROFILE}`)
																setShowUserMenu(false)
															}}
															className='flex items-center space-x-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50'>
															<User className='h-4 w-4 text-gray-400' />
															<span>Mi Perfil</span>
														</button>
														<a
															href='#'
															className='flex items-center space-x-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors'
															onClick={() => setShowUserMenu(false)}>
															<Settings className='h-4 w-4 text-gray-400' />
															<span>Configuración</span>
														</a>
													</div>

													<div className='border-t border-gray-100'>
														<button
															onClick={handleLogout}
															className='flex items-center space-x-2 w-full p-4 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer'>
															<LogOut className='h-4 w-4' />
															<span>Cerrar Sesión</span>
														</button>
													</div>
												</div>

												{/* Overlay para cerrar el menú */}
												<div className='fixed inset-0 z-40' onClick={() => setShowUserMenu(false)} />
											</>
										)}
									</div>
								</div>
							) : (
								<div className='flex space-x-3'>
									<a
										href={`/${PATH_ROUTES.AUTH.SIGNIN}`}
										className='text-gray-700 hover:text-gray-900 px-4 py-2 text-xs font-medium rounded-xl transition-colors hover:bg-gray-50'>
										Entrar
									</a>
									<a
										href={`/${PATH_ROUTES.AUTH.SIGNUP}`}
										className='bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md'>
										Registrarse
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Modal para crear nueva pregunta */}
			<CreatePostModal
				isOpen={showPostModal}
				onClose={handleCloseModal}
				onSubmit={handleCreatePost}
				isSubmitting={createPostMutation.isPending}
			/>
		</>
	)
}
