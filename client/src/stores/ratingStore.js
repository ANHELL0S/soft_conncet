import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useRatingStore = create(
	persist((set, get) => ({
		fakeRatings: {},
		userRatings: {},

		generateFakeRating: postId => {
			const existing = get().fakeRatings[postId]
			if (existing) return existing

			// Total de valoraciones
			const total = Math.floor(Math.random() * 98) + 3

			// Generar distribución aleatoria
			let distribution = {
				5: Math.floor(Math.random() * (total * 0.6)) + 1,
				4: Math.floor(Math.random() * (total * 0.3)) + 1,
				3: Math.floor(Math.random() * (total * 0.2)) + 1,
				2: Math.floor(Math.random() * (total * 0.1)) + 1,
				1: Math.floor(Math.random() * (total * 0.1)) + 1,
			}

			// Normalizar para que sume total
			let sum = Object.values(distribution).reduce((a, b) => a + b, 0)
			if (sum !== total) {
				const diff = total - sum
				distribution[5] += diff
			}

			// Calcular promedio
			let totalScore = 0
			Object.entries(distribution).forEach(([stars, count]) => {
				totalScore += parseInt(stars) * count
			})
			const average = totalScore / total

			const fakeData = {
				average: parseFloat(average.toFixed(1)),
				total: total,
				distribution: distribution,
				generatedAt: Date.now(),
			}

			set(state => ({
				fakeRatings: {
					...state.fakeRatings,
					[postId]: fakeData,
				},
			}))

			return fakeData
		},

		getFakeRating: postId => {
			const fake = get().fakeRatings[postId]
			if (!fake) {
				return get().generateFakeRating(postId)
			}
			return fake
		},

		getUserRating: postId => {
			return get().userRatings[postId] || null
		},

		ratePost: (postId, rating) => {
			const userRating = get().userRatings[postId]
			const fakeRating = get().getFakeRating(postId)

			let newDistribution = { ...fakeRating.distribution }
			let newTotal = fakeRating.total
			let newAverage = fakeRating.average

			if (userRating) {
				newDistribution[userRating.rating] = Math.max(0, newDistribution[userRating.rating] - 1)
				newTotal = fakeRating.total
				const totalScore = fakeRating.average * fakeRating.total
				const newTotalScore = totalScore - userRating.rating + rating
				newAverage = newTotalScore / newTotal
				newDistribution[rating] = (newDistribution[rating] || 0) + 1
			} else {
				newDistribution[rating] = (newDistribution[rating] || 0) + 1
				newTotal = fakeRating.total + 1
				const totalScore = fakeRating.average * fakeRating.total
				const newTotalScore = totalScore + rating
				newAverage = newTotalScore / newTotal
			}

			newAverage = parseFloat(newAverage.toFixed(1))

			set(state => ({
				fakeRatings: {
					...state.fakeRatings,
					[postId]: {
						...fakeRating,
						average: newAverage,
						total: newTotal,
						distribution: newDistribution,
					},
				},
				userRatings: {
					...state.userRatings,
					[postId]: {
						rating: rating,
						timestamp: Date.now(),
					},
				},
			}))
		},

		getFullRatingData: postId => {
			const fake = get().getFakeRating(postId)
			const user = get().getUserRating(postId)

			return {
				average: fake.average,
				total: fake.total,
				distribution: fake.distribution,
				userRating: user?.rating || null,
				hasUserRated: !!user,
			}
		},
	})),
	{
		name: 'post-ratings-storage',
		getStorage: () => localStorage,
	}
)

export default useRatingStore
