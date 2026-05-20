import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('\n=== INICIO DE CONFIGURACIÓN ===')

const envType = process.env.NODE_ENV || 'development'

console.log('\n🔍 Entorno detectado:', envType)
console.log('⚙️  NODE_ENV original:', process.env.NODE_ENV || 'undefined')

const envPath = path.resolve(__dirname, `../../.env.${envType}`)

const envResult = dotenv.config({ path: envPath })

if (envResult.error) {
	console.error('\n❌ ERROR cargando .env:', envResult.error)
} else {
	console.log('\n✅ Archivo .env cargado correctamente')
}

const config = {
	development: {
		requireAllVars: false,
		logEnv: true,
	},
	production: {
		requireAllVars: true,
		logEnv: false,
	},
	test: {
		requireAllVars: true,
		logEnv: true,
	},
}

const currentConfig = config[envType]

console.log('\n⚙️ Configuración aplicada:', currentConfig)

export const env = {
	NODE_ENV: envType,

	SERVER_URL: process.env.SERVER_URL,

	PREFIX: process.env.PREFIX,

	PORT: process.env.PORT || 3000,

	CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [],

	DB_MAIN: {
		DIALECT: process.env.DB_DIALECT,
		HOST: process.env.DB_HOST,
		PORT: process.env.DB_PORT,
		NAME: process.env.DB_NAME,
		USER: process.env.DB_USER,
		PASS: process.env.DB_PASSWORD,
		SSL: process.env.DB_SSL === 'true',
		logging: envType === 'development',
	},

	JWT: {
		SECRET: process.env.JWT_SECRET,
		EXPIRED: process.env.JWT_EXPIRED,
		REFRESH: process.env.JWT_REFRESH,
	},

	ADMIN_CREDENTIALS: {
		EMAIL: process.env.CREDENTIALS_ADMIN_EMAIL,
		PASS: process.env.CREDENTIALS_ADMIN_PASS,
	},
}

const validations = {
	PORT: env.PORT,

	DB_DIALECT: env.DB_MAIN.DIALECT,
	DB_HOST: env.DB_MAIN.HOST,
	DB_NAME: env.DB_MAIN.NAME,

	JWT_SECRET: env.JWT.SECRET,
	JWT_EXPIRED: env.JWT.EXPIRED,
}

if (currentConfig.requireAllVars) {
	console.log('\n🔍 Iniciando validación de variables...')

	const missingVars = Object.entries(validations)
		.filter(([_, value]) => !value)
		.map(([key]) => {
			console.log(`⚠️ Variable no encontrada: ${key}`)
			return key
		})

	if (missingVars.length > 0) {
		console.error('\n❌ Faltan variables requeridas:', missingVars)
		process.exit(1)
	} else {
		console.log('\n✅ Todas las variables requeridas están presentes')
	}
}

console.log('\n=== CONFIGURACIÓN COMPLETADA ===\n')
