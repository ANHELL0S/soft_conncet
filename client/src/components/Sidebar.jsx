import { useState } from 'react'
import {
	Home,
	TrendingUp,
	Newspaper,
	Compass,
	ChevronUp,
	ChevronDown,
	Info,
	Megaphone,
	Code2,
	Clock,
	HelpCircle,
	BookOpen,
	Briefcase,
	Pen,
	Award,
	Globe,
	Shield,
	FileText,
	Accessibility,
	Trophy,
	Star,
	Plus,
	RefreshCw,
	Database,
	Server,
	GitBranch,
	Cpu,
} from 'lucide-react'
import { mockCategories } from '../common/data/dataFake.js'

const categoryIcons = {
	Frontend: <Code2 className='h-4 w-4' />,
	Backend: <Server className='h-4 w-4' />,
	DevOps: <GitBranch className='h-4 w-4' />,
	'Bases de Datos': <Database className='h-4 w-4' />,
	'Programación General': <Cpu className='h-4 w-4' />,
}

const navItems = [
	{ icon: <Home className='h-5 w-5' />, label: 'Inicio', href: '/' },
	{ icon: <TrendingUp className='h-5 w-5' />, label: 'Popular', href: '#', active: true },
	{ icon: <Newspaper className='h-5 w-5' />, label: 'Recientes', href: '#' },
	{ icon: <Compass className='h-5 w-5' />, label: 'Explorar', href: '#' },
]

const resourceItems = [
	{ icon: <Info className='h-5 w-5' />, label: 'Acerca de soft-connect' },
	{ icon: <Megaphone className='h-5 w-5' />, label: 'Anuncios' },
	{ icon: <Code2 className='h-5 w-5' />, label: 'Plataforma del desarrollador' },
	{ icon: <Clock className='h-5 w-5' />, label: 'Novedades', badge: 'BETA' },
	{ icon: <HelpCircle className='h-5 w-5' />, label: 'Ayuda' },
	{ icon: <BookOpen className='h-5 w-5' />, label: 'Blog' },
	{ icon: <Briefcase className='h-5 w-5' />, label: 'Carreras' },
	{ icon: <Pen className='h-5 w-5' />, label: 'Prensa' },
]

const bottomItems = [
	{ icon: <Award className='h-5 w-5' />, label: 'Lo mejor de soft-connect' },
	{ icon: <Globe className='h-5 w-5' />, label: 'soft-connect en Español' },
]

const legalItems = [
	{ icon: <Shield className='h-5 w-5' />, label: 'Normas de la comunidad' },
	{ icon: <FileText className='h-5 w-5' />, label: 'Política de privacidad' },
	{ icon: <FileText className='h-5 w-5' />, label: 'Acuerdo de usuario' },
	{ icon: <Accessibility className='h-5 w-5' />, label: 'Accesibilidad' },
]

export const Sidebar = ({ onReload, onCreatePost }) => {
	const [resourcesOpen, setResourcesOpen] = useState(true)
	const [categoriesOpen, setCategoriesOpen] = useState(true)

	return (
		<aside className='w-64 flex-shrink-0 min-h-screen flex flex-col mr-8 overflow-hidden'>
			{/* Nueva pregunta */}
			<div className='px-3 space-y-2'>
				<button
					onClick={onCreatePost}
					className='w-full flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-semibold py-2 px-3 rounded-2xl transition-colors cursor-pointer'>
					<Plus className='h-4 w-4' />
					Nueva Pregunta
				</button>
			</div>

			<div className='border-t border-gray-300 mx-3 my-2' />

			{/* Nav principal */}
			<nav className='px-1'>
				{navItems.map(item => (
					<a
						key={item.label}
						href={item.href}
						className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
							item.active ? 'bg-gray-300 text-gray-600' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-100'
						}`}>
						{item.icon}
						{item.label}
					</a>
				))}
			</nav>

			<div className='border-t border-gray-300 mx-3 my-2' />

			{/* Categorías colapsables */}
			<div className='px-1'>
				<button
					onClick={() => setCategoriesOpen(v => !v)}
					className='w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors'>
					Temas
					{categoriesOpen ? <ChevronUp className='h-3.5 w-3.5' /> : <ChevronDown className='h-3.5 w-3.5' />}
				</button>
				{categoriesOpen && (
					<div className='mt-1'>
						{mockCategories.map(category => (
							<a
								key={category.id}
								href='#'
								className='flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors group'>
								<div className='flex items-center gap-3'>
									<span className='text-gray-500 group-hover:text-gray-300'>{categoryIcons[category.name]}</span>
									{category.name}
								</div>
								<span className='text-xs text-gray-600 group-hover:text-gray-400'>{category.count}</span>
							</a>
						))}
					</div>
				)}
			</div>

			<div className='border-t border-gray-300 mx-3 my-2' />

			{/* Recursos colapsables */}
			<div className='px-1'>
				<button
					onClick={() => setResourcesOpen(v => !v)}
					className='w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors'>
					Recursos
					{resourcesOpen ? <ChevronUp className='h-3.5 w-3.5' /> : <ChevronDown className='h-3.5 w-3.5' />}
				</button>
				{resourcesOpen && (
					<div className='mt-1'>
						{resourceItems.map(item => (
							<a
								key={item.label}
								href='#'
								className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors'>
								<span className='text-gray-500'>{item.icon}</span>
								{item.label}
								{item.badge && <span className='ml-1 text-xs font-bold text-orange-400'>{item.badge}</span>}
							</a>
						))}
					</div>
				)}
			</div>

			<div className='border-t border-gray-300 mx-3 my-2' />

			{/* Bottom items */}
			<div className='px-1'>
				{bottomItems.map(item => (
					<a
						key={item.label}
						href='#'
						className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors'>
						<span className='text-gray-500'>{item.icon}</span>
						{item.label}
					</a>
				))}
			</div>

			<div className='border-t border-gray-300 mx-3 my-2' />

			{/* Legal */}
			<div className='px-1'>
				{legalItems.map(item => (
					<a
						key={item.label}
						href='#'
						className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors'>
						<span className='text-gray-500'>{item.icon}</span>
						{item.label}
					</a>
				))}
			</div>

			{/* Actividad */}
			<div className='border-t border-gray-300 mx-3 my-2' />
			<div className='px-3 pb-2 space-y-2'>
				<div className='flex items-center gap-3 p-2.5 bg-gray-800 rounded-lg'>
					<Trophy className='h-4 w-4 text-orange-400 flex-shrink-0' />
					<div>
						<p className='text-xs font-semibold text-gray-200'>Top Contribuyente</p>
						<p className='text-xs text-gray-500'>+15 puntos esta semana</p>
					</div>
				</div>
				<div className='flex items-center gap-3 p-2.5 bg-gray-800 rounded-lg'>
					<Star className='h-4 w-4 text-yellow-400 flex-shrink-0' />
					<div>
						<p className='text-xs font-semibold text-gray-200'>Preguntas Resueltas</p>
						<p className='text-xs text-gray-500'>3 de 5 esta semana</p>
					</div>
				</div>
			</div>
		</aside>
	)
}
