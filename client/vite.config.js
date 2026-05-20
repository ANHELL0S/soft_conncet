import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: '/',
	resolve: {
		alias: {
			'@': '/src',
		},
	},
	optimizeDeps: {
		include: ['quill', 'react-quilljs'],
	},
	build: {
		commonjsOptions: {
			include: [/quill/, /react-quilljs/, /node_modules/],
		},
	},
})
