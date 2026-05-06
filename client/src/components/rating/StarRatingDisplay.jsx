import { Star } from 'lucide-react'

export const StarRatingDisplay = ({ rating = 0, total = 0, size = 'sm' }) => {
	const sizes = {
		sm: { star: 'h-3.5 w-3.5', text: 'text-xs' },
		md: { star: 'h-4 w-4', text: 'text-sm' },
		lg: { star: 'h-5 w-5', text: 'text-base' },
	}

	const starSize = sizes[size].star
	const textSize = sizes[size].text

	return (
		<div className='flex items-center gap-2'>
			<div className='flex items-center gap-0.5'>
				{[1, 2, 3, 4, 5].map(star => (
					<Star
						key={star}
						className={`${starSize} ${
							star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-300'
						}`}
					/>
				))}
			</div>
			{total > 0 && (
				<span className={`${textSize} text-gray-500`}>
					{rating.toFixed(1)} ({total} {total === 1 ? 'valoración' : 'valoraciones'})
				</span>
			)}
		</div>
	)
}
