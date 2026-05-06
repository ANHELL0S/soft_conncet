import { useEffect, useState } from 'react'
import { useAuth } from '../../stores/authStore'
import { User, Mail, Shield, Calendar, Lock, Edit, Check, X, Key, Save } from 'lucide-react'

const ProfilePage = () => {
	const { user, isAuthenticated, loading, isInitialized, getUserFullName, getUserEmail, getUserRole } = useAuth()

	const [tab, setTab] = useState('profile')
	const [editing, setEditing] = useState(false)
	const [saveSuccess, setSaveSuccess] = useState(false)
	const [saveError, setSaveError] = useState('')

	// Estado local para el formulario de perfil
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
	})

	// Estado local para el formulario de cambio de contraseña
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [passwordError, setPasswordError] = useState('')
	const [passwordSuccess, setPasswordSuccess] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	// Sincronizar form con user cuando cambie
	useEffect(() => {
		if (user) {
			setForm({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
			})
		}
	}, [user])

	// SIMULACIÓN: Guardar cambios del perfil (falso)
	const handleSaveProfile = async () => {
		setSaveSuccess(false)
		setSaveError('')

		// Simular carga
		await new Promise(resolve => setTimeout(resolve, 1000))

		// Validaciones falsas
		if (!form.firstName.trim()) {
			setSaveError('El nombre es requerido')
			return
		}

		if (!form.email.includes('@')) {
			setSaveError('Email inválido')
			return
		}

		// SIMULACIÓN: Actualizar el usuario localmente (falso)
		// En un caso real, aquí llamarías a updateUser(form)
		if (user) {
			user.firstName = form.firstName
			user.lastName = form.lastName
			user.email = form.email
		}

		// Mostrar éxito
		setSaveSuccess(true)
		setEditing(false)

		// Ocultar mensaje de éxito después de 3 segundos
		setTimeout(() => setSaveSuccess(false), 3000)
	}

	// SIMULACIÓN: Cambiar contraseña (falso)
	const handleChangePassword = async () => {
		setPasswordError('')
		setPasswordSuccess(false)

		// Simular carga
		await new Promise(resolve => setTimeout(resolve, 1000))

		// Validaciones falsas
		if (!passwordForm.currentPassword) {
			setPasswordError('Ingresa tu contraseña actual')
			return
		}

		if (passwordForm.newPassword.length < 6) {
			setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
			return
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setPasswordError('Las contraseñas no coinciden')
			return
		}

		// SIMULACIÓN: Verificar que la contraseña actual sea "fake123" (solo para demostración)
		if (passwordForm.currentPassword !== 'fake123') {
			setPasswordError('Contraseña actual incorrecta (pista: fake123)')
			return
		}

		// SIMULACIÓN: Cambio exitoso
		setPasswordSuccess(true)
		setPasswordForm({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		})

		// Ocultar mensaje de éxito después de 3 segundos
		setTimeout(() => setPasswordSuccess(false), 3000)
	}

	// Cancelar edición
	const handleCancelEdit = () => {
		// Restaurar valores originales
		if (user) {
			setForm({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
			})
		}
		setEditing(false)
		setSaveError('')
	}

	if (!isInitialized || loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
					<p className='mt-4 text-sm text-gray-500'>Cargando...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<div className='text-center'>
					<Shield className='h-12 w-12 text-red-500 mx-auto' />
					<p className='mt-4 text-red-500'>No autenticado</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6'>
				{/* HEADER - Estilo Notion */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
					<div className='flex items-center justify-between flex-wrap gap-4'>
						<div className='flex items-center space-x-4'>
							<div className='h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
								<User className='h-8 w-8 text-gray-600' />
							</div>
							<div>
								<h1 className='text-xl font-semibold text-gray-900'>{getUserFullName()}</h1>
								<p className='text-sm text-gray-500'>{getUserEmail()}</p>
								<div className='flex items-center gap-2 mt-1'>
									<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700'>
										{getUserRole()}
									</span>
								</div>
							</div>
						</div>

						{tab === 'profile' && (
							<button
								onClick={() => (editing ? handleCancelEdit() : setEditing(true))}
								className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
								{editing ? <X className='h-4 w-4' /> : <Edit className='h-4 w-4' />}
								<span>{editing ? 'Cancelar' : 'Editar perfil'}</span>
							</button>
						)}
					</div>
				</div>

				{/* TABS - Estilo Notion */}
				<div className='border-b border-gray-200 mb-6'>
					<nav className='flex gap-8'>
						<button
							onClick={() => {
								setTab('profile')
								setEditing(false)
							}}
							className={`pb-3 text-sm font-medium transition-colors ${
								tab === 'profile' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
							}`}>
							Información personal
						</button>
						<button
							onClick={() => {
								setTab('security')
								setEditing(false)
							}}
							className={`pb-3 text-sm font-medium transition-colors ${
								tab === 'security' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
							}`}>
							Seguridad y contraseña
						</button>
					</nav>
				</div>

				{/* TAB: PERFIL */}
				{tab === 'profile' && (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
						<h2 className='text-base font-semibold text-gray-900 mb-4'>Información personal</h2>

						{/* Mensajes de feedback */}
						{saveSuccess && (
							<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
								<p className='text-sm text-green-700 flex items-center gap-2'>
									<Check className='h-4 w-4' />
									¡Perfil actualizado correctamente! (simulado)
								</p>
							</div>
						)}

						{saveError && (
							<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
								<p className='text-sm text-red-700'>{saveError}</p>
							</div>
						)}

						{editing ? (
							// MODO EDICIÓN
							<div className='space-y-4'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div>
										<label className='block text-xs font-medium text-gray-700 mb-1'>Nombre</label>
										<input
											value={form.firstName}
											onChange={e => setForm({ ...form, firstName: e.target.value })}
											className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400'
											placeholder='Tu nombre'
										/>
									</div>
									<div>
										<label className='block text-xs font-medium text-gray-700 mb-1'>Apellido</label>
										<input
											value={form.lastName}
											onChange={e => setForm({ ...form, lastName: e.target.value })}
											className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400'
											placeholder='Tu apellido'
										/>
									</div>
								</div>
								<div>
									<label className='block text-xs font-medium text-gray-700 mb-1'>Correo electrónico</label>
									<input
										value={form.email}
										onChange={e => setForm({ ...form, email: e.target.value })}
										className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400'
										placeholder='correo@ejemplo.com'
										type='email'
									/>
								</div>
								<div className='flex gap-3 pt-2'>
									<button
										onClick={handleSaveProfile}
										className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors'>
										<Save className='h-4 w-4' />
										Guardar cambios
									</button>
								</div>
							</div>
						) : (
							// MODO VISUALIZACIÓN
							<div className='space-y-3'>
								<div className='flex items-center gap-3 py-2 border-b border-gray-100'>
									<User className='h-4 w-4 text-gray-400' />
									<div>
										<p className='text-xs text-gray-500'>Nombre completo</p>
										<p className='text-sm text-gray-900'>{getUserFullName()}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 py-2 border-b border-gray-100'>
									<Mail className='h-4 w-4 text-gray-400' />
									<div>
										<p className='text-xs text-gray-500'>Correo electrónico</p>
										<p className='text-sm text-gray-900'>{getUserEmail()}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 py-2 border-b border-gray-100'>
									<Shield className='h-4 w-4 text-gray-400' />
									<div>
										<p className='text-xs text-gray-500'>Rol</p>
										<p className='text-sm text-gray-900'>{getUserRole()}</p>
									</div>
								</div>
								{user?.createdAt && (
									<div className='flex items-center gap-3 py-2'>
										<Calendar className='h-4 w-4 text-gray-400' />
										<div>
											<p className='text-xs text-gray-500'>Miembro desde</p>
											<p className='text-sm text-gray-900'>{new Date(user.createdAt).toLocaleDateString()}</p>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{/* TAB: SEGURIDAD */}
				{tab === 'security' && (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
						<h2 className='text-base font-semibold text-gray-900 mb-4'>Cambiar contraseña</h2>

						{/* Mensajes de feedback */}
						{passwordSuccess && (
							<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
								<p className='text-sm text-green-700 flex items-center gap-2'>
									<Check className='h-4 w-4' />
									¡Contraseña cambiada exitosamente! (simulado)
								</p>
							</div>
						)}

						{passwordError && (
							<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
								<p className='text-sm text-red-700'>{passwordError}</p>
							</div>
						)}

						<div className='max-w-md space-y-4'>
							<div>
								<label className='block text-xs font-medium text-gray-700 mb-1'>Contraseña actual</label>
								<input
									type={showPassword ? 'text' : 'password'}
									value={passwordForm.currentPassword}
									onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
									className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400'
									placeholder='Ingresa tu contraseña actual'
								/>
								<p className='text-xs text-gray-400 mt-1'>Pista: usa "fake123" para probar</p>
							</div>

							<div>
								<label className='block text-xs font-medium text-gray-700 mb-1'>Nueva contraseña</label>
								<input
									type={showPassword ? 'text' : 'password'}
									value={passwordForm.newPassword}
									onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
									className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400'
									placeholder='Mínimo 6 caracteres'
								/>
							</div>

							<div>
								<label className='block text-xs font-medium text-gray-700 mb-1'>Confirmar nueva contraseña</label>
								<input
									type={showPassword ? 'text' : 'password'}
									value={passwordForm.confirmPassword}
									onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
									className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400'
									placeholder='Repite la nueva contraseña'
								/>
							</div>

							<div className='flex items-center gap-3 pt-2'>
								<button
									onClick={() => setShowPassword(!showPassword)}
									className='text-xs text-gray-500 hover:text-gray-700'>
									{showPassword ? 'Ocultar' : 'Mostrar'} contraseñas
								</button>

								<button
									onClick={handleChangePassword}
									className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors'>
									<Key className='h-4 w-4' />
									Cambiar contraseña
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProfilePage
