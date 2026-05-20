import { BookOpen, Github, Mail, ExternalLink, Heart } from 'lucide-react'

const footerLinks = {
	comunidad: [
		{ label: 'Preguntas', href: '/' },
		{ label: 'Etiquetas', href: '#' },
		{ label: 'Usuarios', href: '#' },
		{ label: 'Sin responder', href: '#' },
	],
	recursos: [
		{ label: 'Guía de estudiante', href: '#' },
		{ label: 'Normas de convivencia', href: '#' },
		{ label: 'Cómo hacer buenas preguntas', href: '#' },
		{ label: 'Insignias y reputación', href: '#' },
	],
	universidad: [
		{ label: 'UEB Oficial', href: 'https://www.ueb.edu.ec', external: true },
		{ label: 'Carrera de Software', href: '#', external: true },
		{ label: 'Biblioteca Digital', href: '#', external: true },
		{ label: 'Campus Virtual', href: '#', external: true },
	],
}

export const Footer = () => {
	return (
		<footer className='border-t border-gray-200 bg-gray-50 mt-16'>
			{/* Main footer */}
			<div className='max-w-7xl mx-auto px-6 py-10'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Brand */}
					<div className='md:col-span-1'>
						<div className='flex items-center gap-2 mb-3'>
							<div className='p-1.5 bg-gray-900 rounded-lg'>
								<BookOpen className='h-4 w-4 text-white' />
							</div>
							<span className='font-bold text-gray-900 text-base'>soft-connect</span>
						</div>
						<p className='text-xs text-gray-500 leading-relaxed mb-4'>
							Foro de dudas y colaboración para estudiantes de la carrera de Software de la
							<span className='font-medium text-gray-700'> Universidad Estatal de Bolívar</span>.
						</p>
						<div className='flex items-center gap-2'>
							<a
								href='mailto:software@ueb.edu.ec'
								className='p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors'
								aria-label='Email'>
								<Mail className='h-4 w-4' />
							</a>
							<a
								href='https://github.com'
								target='_blank'
								rel='noreferrer'
								className='p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors'
								aria-label='GitHub'>
								<Github className='h-4 w-4' />
							</a>
						</div>
					</div>

					{/* Links */}
					{Object.entries(footerLinks).map(([section, links]) => (
						<div key={section}>
							<h4 className='text-xs font-bold text-gray-900 uppercase tracking-wider mb-3'>
								{section === 'comunidad' ? 'Comunidad' : section === 'recursos' ? 'Recursos' : 'Universidad'}
							</h4>
							<ul className='space-y-2'>
								{links.map(link => (
									<li key={link.label}>
										<a
											href={link.href}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noreferrer' : undefined}
											className='text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 group'>
											{link.label}
											{link.external && (
												<ExternalLink className='h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity' />
											)}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Bottom bar */}
			<div className='border-t border-gray-200 bg-gray-100'>
				<div className='max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2'>
					<p className='text-xs text-gray-500'>
						© {new Date().getFullYear()} soft-connect · Universidad Estatal de Bolívar · Carrera de Software
					</p>
					<p className='text-xs text-gray-400 flex items-center gap-1'>
						Hecho con <Heart className='h-3 w-3 text-red-400 fill-red-400' /> por estudiantes, para estudiantes
					</p>
				</div>
			</div>
		</footer>
	)
}
