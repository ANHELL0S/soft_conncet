import { useState } from 'react'
import { Star } from 'lucide-react'

export const StarRatingInteractive = ({ rating = 0, onRate, size = 'md', readonly = false, showValue = false }) => {
	const [hoverRating, setHoverRating] = useState(0)

	const sizes = {
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6',
		xl: 'h-8 w-8',
	}

	const starSize = sizes[size] || sizes.md

	const handleClick = value => {
		if (!readonly && onRate) {
			onRate(value)
		}
	}

	const handleMouseEnter = value => {
		if (!readonly) {
			setHoverRating(value)
		}
	}

	const handleMouseLeave = () => {
		if (!readonly) {
			setHoverRating(0)
		}
	}

	const displayRating = hoverRating || rating

	return (
		<div className='flex items-center gap-1'>
			{[1, 2, 3, 4, 5].map(star => (
				<button
					key={star}
					type='button'
					onClick={() => handleClick(star)}
					onMouseEnter={() => handleMouseEnter(star)}
					onMouseLeave={handleMouseLeave}
					disabled={readonly}
					className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}>
					<Star
						className={`${starSize} ${
							star <= displayRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-300'
						} transition-colors duration-150`}
					/>
				</button>
			))}
			{showValue && rating > 0 && <span className='text-xs text-gray-600 ml-1'>{rating.toFixed(1)}</span>}
		</div>
	)
}
