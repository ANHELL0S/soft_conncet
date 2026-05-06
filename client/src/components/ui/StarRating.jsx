import { useState } from 'react'
import { Star } from 'lucide-react'

export const StarRating = ({ rating = 0, onRate, size = 'md', readonly = false, showValue = false, maxStars = 5 }) => {
	const [hoverRating, setHoverRating] = useState(0)

	const sizes = {
		sm: 'h-3 w-3',
		md: 'h-4 w-4',
		lg: 'h-5 w-5',
		xl: 'h-6 w-6',
	}

	const starSize = sizes[size] || sizes.md

	const handleClick = value => {
		if (!readonly && onRate) onRate(value)
	}

	const handleMouseEnter = value => {
		if (!readonly) setHoverRating(value)
	}

	const handleMouseLeave = () => {
		if (!readonly) setHoverRating(0)
	}

	const displayRating = hoverRating || rating

	return (
		<div className='flex items-center gap-1'>
			<div className='flex items-center gap-0.5'>
				{[...Array(maxStars)].map((_, index) => {
					const starValue = index + 1
					const isFilled = starValue <= displayRating

					return (
						<button
							key={index}
							type='button'
							onClick={() => handleClick(starValue)}
							onMouseEnter={() => handleMouseEnter(starValue)}
							onMouseLeave={handleMouseLeave}
							disabled={readonly}
							className={`transition-all duration-150 ${
								readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
							}`}>
							<Star
								className={`${starSize} ${
									isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-300'
								} transition-colors duration-150`}
							/>
						</button>
					)
				})}
			</div>
			{showValue && rating > 0 && <span className='text-xs text-gray-600 ml-1'>{rating.toFixed(1)}</span>}
		</div>
	)
}

// Versión con texto (para mostrar calificación promedio)
export const StarRatingDisplay = ({ averageRating = 0, totalRatings = 0, size = 'sm' }) => {
	return (
		<div className='flex items-center gap-2'>
			<StarRating rating={averageRating} readonly={true} size={size} />
			{totalRatings > 0 && (
				<span className='text-xs text-gray-500'>
					({totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})
				</span>
			)}
		</div>
	)
}
