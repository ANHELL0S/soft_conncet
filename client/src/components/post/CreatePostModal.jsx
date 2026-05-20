import { useState, useEffect } from 'react'
import { X, Loader2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'

const PreviewPanel = ({ title, description, isAnswerMode }) => {
	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 overflow-y-auto p-4'>
				{!isAnswerMode && (
					<h1 className='text-xl font-bold text-gray-900 mb-4 break-words'>
						{title || <span className='text-gray-400'>Título de tu pregunta</span>}
					</h1>
				)}
				{description ? (
					<MDEditor.Markdown source={description} style={{ background: 'transparent', color: '#374151' }} />
				) : (
					<p className='text-gray-400 text-sm italic'>La vista previa del contenido aparecerá aquí...</p>
				)}
			</div>
		</div>
	)
}

export function CreatePostModal({
	isOpen,
	onClose,
	onSubmit,
	initialData = null,
	isEditMode = false,
	isAnswerMode = false,
}) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errors, setErrors] = useState({})
	const [isExpanded, setIsExpanded] = useState(false)

	useEffect(() => {
		if (isOpen && initialData && isEditMode) {
			setTitle(initialData.title || '')
			setDescription(initialData.description || '')
		}
	}, [isOpen, initialData, isEditMode])

	useEffect(() => {
		if (!isOpen) resetForm()
	}, [isOpen])

	const validateForm = () => {
		const newErrors = {}

		if (!isAnswerMode) {
			if (!title.trim()) {
				newErrors.title = 'El título es requerido'
			} else if (title.trim().length < 10) {
				newErrors.title = 'El título debe tener al menos 10 caracteres'
			} else if (title.trim().length > 200) {
				newErrors.title = 'El título no puede exceder 200 caracteres'
			}
		}

		if (!description?.trim()) {
			newErrors.description = isAnswerMode ? 'El contenido de la respuesta es requerido' : 'La descripción es requerida'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (!validateForm()) return
		setIsSubmitting(true)
		try {
			const submitData = isAnswerMode ? { description } : { title: title.trim(), description }
			await onSubmit(submitData)
			resetForm()
			onClose()
		} catch (error) {
			console.error(
				`Error al ${isEditMode ? 'actualizar' : 'crear'} ${isAnswerMode ? 'la respuesta' : 'la pregunta'}:`,
				error
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const resetForm = () => {
		if (!isEditMode) {
			setTitle('')
			setDescription('')
		}
		setErrors({})
		setIsExpanded(false)
	}

	const handleClose = () => {
		if (!isSubmitting) {
			resetForm()
			onClose()
		}
	}

	if (!isOpen) return null

	const modalConfig = {
		title: isAnswerMode ? 'Nueva Respuesta' : isEditMode ? 'Editar Pregunta' : 'Nueva Pregunta',
		subtitle: isAnswerMode
			? 'Comparte tu solución o conocimiento'
			: isEditMode
				? 'Actualiza tu pregunta'
				: 'Comparte tu pregunta con la comunidad',
		submitLabel: isAnswerMode ? 'Publicar Respuesta' : isEditMode ? 'Actualizar Pregunta' : 'Publicar Pregunta',
		submittingLabel: isAnswerMode ? 'Publicando...' : isEditMode ? 'Actualizando...' : 'Publicando...',
	}

	return (
		<div className='fixed inset-0 z-50 overflow-y-auto'>
			<div className='fixed inset-0 bg-black/50 transition-opacity' onClick={handleClose} />

			<div
				className={`flex ${isExpanded ? 'items-center justify-center min-h-screen' : 'items-end justify-center min-h-screen'} p-4`}>
				<div
					className={`relative bg-white flex flex-col transition-all duration-300 ${isExpanded ? 'w-full max-w-full h-[95vh] rounded-2xl' : 'w-full max-w-6xl rounded-2xl max-h-[70vh]'}`}>
					{/* Header */}
					<div className='flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0'>
						<div className='flex-1'>
							<h2 className='font-bold text-gray-900'>{modalConfig.title}</h2>
							<p className='text-xs text-gray-500'>{modalConfig.subtitle}</p>
						</div>
						<div className='flex items-center space-x-2'>
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								disabled={isSubmitting}
								className='text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'
								aria-label={isExpanded ? 'Contraer' : 'Expandir'}>
								{isExpanded ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
							</button>
							<button
								onClick={handleClose}
								disabled={isSubmitting}
								className='text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'
								aria-label='Cerrar modal'>
								<X className='h-4 w-4' />
							</button>
						</div>
					</div>

					{/* Body */}
					<div className='flex-1 overflow-y-auto'>
						<div className='flex h-full'>
							{/* Editor */}
							<div className='flex-1 border-r border-gray-200'>
								<div className='p-6 space-y-6'>
									{!isAnswerMode && (
										<div>
											<label className='block text-sm font-semibold text-gray-700 mb-2'>
												Título<span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												value={title}
												onChange={e => {
													setTitle(e.target.value)
													if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
												}}
												placeholder='Ej: ¿Cómo puedo optimizar mi código React?'
												maxLength={200}
												className={`w-full p-2 px-0 text-sm border-b text-gray-900 border-gray-300 placeholder-gray-400 transition-colors duration-200 focus:outline-none ${errors.title ? 'border-red-400 focus:border-red-600' : 'focus:border-gray-600'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
												disabled={isSubmitting}
											/>
											<div className='flex justify-between items-start mt-2'>
												{errors.title && (
													<div className='flex items-center space-x-1 text-red-600 text-xs'>
														<AlertCircle className='h-4 w-4' />
														<span>{errors.title}</span>
													</div>
												)}
												<span className='text-xs text-gray-400 ml-auto'>{title.length}/200</span>
											</div>
										</div>
									)}

									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											{isAnswerMode ? 'Contenido' : 'Descripción'}
											<span className='text-red-500'>*</span>
										</label>
										<p className='text-xs text-gray-500 mb-2'>
											{isAnswerMode
												? 'Explica tu solución de forma clara y detallada. Soporta Markdown.'
												: 'Explica tu problema con el mayor detalle posible. Soporta Markdown.'}
										</p>
										<div data-color-mode='light' className={errors.description ? 'border border-red-300 rounded' : ''}>
											<MDEditor
												value={description}
												onChange={val => {
													setDescription(val || '')
													if (errors.description) setErrors(prev => ({ ...prev, description: '' }))
												}}
												height={250}
												preview='edit'
											/>
										</div>
										{errors.description && (
											<div className='flex items-center space-x-1 mt-2 text-red-600 text-xs'>
												<AlertCircle className='h-4 w-4' />
												<span>{errors.description}</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Preview */}
							<div className='flex-1 flex flex-col bg-gray-50'>
								<div className='px-4 py-3 border-b border-gray-200 bg-white'>
									<h3 className='text-sm font-semibold text-gray-700'>Vista Previa</h3>
								</div>
								<PreviewPanel title={title} description={description} isAnswerMode={isAnswerMode} />
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className='px-6 py-3 border-t border-gray-200 flex-shrink-0'>
						<div className='flex items-center justify-between'>
							<p className='text-xs text-gray-500'>
								<span className='text-red-500'>*</span> Campos obligatorios
							</p>
							<div className='flex space-x-3'>
								<button
									type='button'
									onClick={handleClose}
									disabled={isSubmitting}
									className='px-6 py-2.5 cursor-pointer text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs'>
									Cancelar
								</button>
								<button
									type='button'
									onClick={handleSubmit}
									disabled={isSubmitting}
									className='px-6 py-2.5 bg-gray-600 cursor-pointer text-white rounded-xl font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm hover:shadow-md text-xs'>
									{isSubmitting ? (
										<>
											<Loader2 className='h-4 w-4 animate-spin' />
											<span>{modalConfig.submittingLabel}</span>
										</>
									) : (
										<span>{modalConfig.submitLabel}</span>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
