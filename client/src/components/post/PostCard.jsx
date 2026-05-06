import { Heart, MessageSquare, Share2, Star } from 'lucide-react'
import { Badge } from '../ui/StatusBadge.jsx'
import { PATH_ROUTES } from '../../common/const/pauthRoute-const.js'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useToggleLike } from '../../common/hooks/usePosts.js'
import { useAuth } from '../../stores/authStore.js'
import useRatingStore from '../../stores/ratingStore.js'
import { SpinnerLoading } from '../SpinnerLoading.jsx'

export const PostCard = ({ post, onLikeUpdate, onShare }) => {
	const [imageError, setImageError] = useState(false)
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	// Rating store - usando el ID del post para persistencia
	const getFullRatingData = useRatingStore(state => state.getFullRatingData)
	const ratePost = useRatingStore(state => state.ratePost)
	const getUserRating = useRatingStore(state => state.getUserRating)
	const [ratingData, setRatingData] = useState(null)
	const [hoverRating, setHoverRating] = useState(0)
	const [localUserRating, setLocalUserRating] = useState(null)

	// Cargar rating del post usando su ID
	useEffect(() => {
		if (post?.id) {
			const data = getFullRatingData(post.id)
			setRatingData(data)

			// Cargar la valoración específica del usuario para este post
			const userRatingValue = getUserRating(post.id)
			setLocalUserRating(userRatingValue?.rating || null)
		}
	}, [post?.id, getFullRatingData, getUserRating])

	// Estado optimista para el like
	const [optimisticLikes, setOptimisticLikes] = useState(post.likesCount || 0)
	const [optimisticHasLiked, setOptimisticHasLiked] = useState(post.hasLiked || false)

	const toggleLikeMutation = useToggleLike()

	const formatTimeAgo = dateString => {
		const date = new Date(dateString)
		const now = new Date()
		const diffInMinutes = Math.floor((now - date) / (1000 * 60))

		if (diffInMinutes < 60) return `${diffInMinutes}m`
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
		return `${Math.floor(diffInMinutes / 1440)}d`
	}

	// Función para extraer imágenes base64 del HTML
	const extractBase64Images = htmlContent => {
		const imgRegex = /<img[^>]+src="data:image\/([a-zA-Z]*);base64,([^">]*)"/g
		const images = []
		let match

		while ((match = imgRegex.exec(htmlContent)) !== null) {
			images.push(`data:image/${match[1]};base64,${match[2]}`)
		}

		return images
	}

	// Función para eliminar imágenes del contenido HTML
	const removeImagesFromHTML = htmlContent => {
		return htmlContent.replace(/<img[^>]*>/g, '')
	}

	// Función para limpiar HTML y obtener texto plano limitado
	const getPlainTextExcerpt = (htmlContent, maxLines = 3) => {
		const tempDiv = document.createElement('div')
		tempDiv.innerHTML = htmlContent
		const text = tempDiv.textContent || tempDiv.innerText || ''

		const lines = text.split('\n').filter(line => line.trim() !== '')
		const limitedLines = lines.slice(0, maxLines)

		return limitedLines.join(' ')
	}

	// Manejador de like
	const handleLike = async e => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			navigate('/auth/signin')
			return
		}

		const newLikesCount = optimisticHasLiked ? optimisticLikes - 1 : optimisticLikes + 1
		setOptimisticLikes(newLikesCount)
		setOptimisticHasLiked(!optimisticHasLiked)

		try {
			await toggleLikeMutation.mutateAsync(post.id)
			if (onLikeUpdate) {
				onLikeUpdate(post.id, !optimisticHasLiked)
			}
		} catch (error) {
			setOptimisticLikes(optimisticLikes)
			setOptimisticHasLiked(optimisticHasLiked)
			console.error('Error al dar like:', error)
		}
	}

	// Manejador de share
	const handleShare = async e => {
		e.preventDefault()
		e.stopPropagation()

		if (onShare) {
			onShare(post)
		} else {
			const url = `${window.location.origin}/post/${post.id}`
			try {
				await navigator.clipboard.writeText(url)
				alert('Link copiado al portapapeles')
			} catch (err) {
				console.error('Error al copiar:', err)
			}
		}
	}

	// Manejador de calificación con estrellas - guarda usando el ID del post
	const handleRate = async (rating, e) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			navigate('/auth/signin')
			return
		}

		// Guardar valoración en el store con el ID del post
		ratePost(post.id, rating)

		// Actualizar UI local inmediatamente
		setLocalUserRating(rating)

		// Actualizar datos completos
		const updatedData = getFullRatingData(post.id)
		setRatingData(updatedData)
	}

	// Navegar al detalle del post
	const handleCardClick = () => {
		navigate(`/${PATH_ROUTES.POST}/${post.id}`)
	}

	// Manejador para el contador de respuestas
	const handleAnswersClick = e => {
		e.preventDefault()
		e.stopPropagation()
		navigate(`/${PATH_ROUTES.POST}/${post.id}?openAnswer=true`)
	}

	const {
		id,
		title,
		description,
		answersCount = 0,
		sharesCount = 0,
		isSolved = false,
		status,
		createdAt,
		deletedAt,
		author,
	} = post

	const images = extractBase64Images(description)
	const cleanDescription = removeImagesFromHTML(description)
	const descriptionExcerpt = getPlainTextExcerpt(cleanDescription, 3)
	const hasImages = images.length > 0
	const firstImage = images[0]
	const remainingImages = Math.max(0, images.length - 1)

	// Rating a mostrar (usuario o 0)
	const displayRating = hoverRating || localUserRating || 0
	const averageRating = ratingData?.average || 0
	const totalRatings = ratingData?.total || 0

	return (
		<div
			className='bg-gray-50 p-4 rounded-2xl hover:border-gray-300 transition-colors cursor-pointer'
			onClick={handleCardClick}>
			<div className='flex gap-4'>
				<div className='flex-1 min-w-0'>
					<div className='flex gap-4'>
						<div className='flex-1 min-w-0'>
							{/* Título */}
							<h3 className='text-base font-semibold text-gray-600 transition-all duration-500 line-clamp-2 mb-2'>
								{title}
							</h3>

							{/* Rating promedio (solo lectura - fake) */}
							{averageRating > 0 && (
								<div className='flex items-center gap-2 mb-2'>
									<div className='flex items-center gap-0.5'>
										{[1, 2, 3, 4, 5].map(star => (
											<Star
												key={star}
												className={`h-3 w-3 ${
													star <= Math.round(averageRating)
														? 'fill-yellow-400 text-yellow-400'
														: 'fill-gray-200 text-gray-300'
												}`}
											/>
										))}
									</div>
									<span className='text-xs text-gray-500'>
										{averageRating.toFixed(1)} ({totalRatings})
									</span>
								</div>
							)}

							{/* Descripción limpia */}
							{descriptionExcerpt && (
								<div className='mb-4'>
									<p className='text-gray-500 text-xs line-clamp-3 leading-relaxed'>{descriptionExcerpt}</p>
								</div>
							)}
						</div>

						{/* Imagen */}
						{hasImages && (
							<div className='flex-shrink-0'>
								<div className='relative'>
									<img
										src={firstImage}
										alt='Imagen del post'
										className='w-20 h-14 object-cover rounded-lg border border-gray-200 bg-gray-100'
										onError={() => setImageError(true)}
									/>
									{remainingImages > 0 && (
										<div className='absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold'>
											+{remainingImages}
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Badges */}
					<div className='flex items-center gap-2 mb-4'>
						{deletedAt ? (
							<Badge label='Removido' variant='error' />
						) : (
							<div className='flex items-center gap-2'>
								{isSolved && <Badge label='Solucionado' variant='success' />}
								{!isSolved && (
									<>
										{status === 'closed' && <Badge label='Cerrado' variant='warning' />}
										{status === 'active' && <Badge label='Abierto' variant='info' />}
									</>
								)}
							</div>
						)}
					</div>

					{/* Meta información con contadores interactivos */}
					<div className='flex justify-between items-center pt-4 border-t border-gray-200'>
						<div className='flex items-center gap-4 text-xs'>
							{/* Botón de Like */}
							<button
								onClick={handleLike}
								disabled={toggleLikeMutation.isPending}
								className={`flex items-center gap-1 transition-colors ${
									optimisticHasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
								}`}>
								{toggleLikeMutation.isPending ? (
									<SpinnerLoading showText={false} size='sm' />
								) : (
									<Heart className={`h-4 w-4 ${optimisticHasLiked ? 'fill-red-500' : ''}`} />
								)}
								<span className='font-medium'>{optimisticLikes}</span>
							</button>

							{/* Respuestas */}
							<button
								onClick={handleAnswersClick}
								className='flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors'>
								<MessageSquare className='h-4 w-4' />
								<span className='font-medium'>{answersCount}</span>
							</button>
						</div>

						{/* Autor y fecha */}
						<div className='flex items-center gap-2 text-xs text-gray-500'>
							<div className='flex items-center gap-1'>
								Hace
								<span>{formatTimeAgo(createdAt)}</span>
							</div>
							<span>•</span>
							<span className='text-gray-700 font-medium'>
								Por {author?.email?.split('@')[0] || author?.email || 'Usuario'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
