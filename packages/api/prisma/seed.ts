import { PrismaClient, Role } from '../src/generated/prisma'
import { seedConfig } from './seed.config'

const prisma = new PrismaClient()

// Función para generar direcciones Ethereum aleatorias
function generateRandomAddress(): string {
	const chars = '0123456789abcdef'
	let result = '0x'
	for (let i = 0; i < 40; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

// Función para generar emails aleatorios
function generateRandomEmail(): string {
	const randomName = seedConfig.data.names[Math.floor(Math.random() * seedConfig.data.names.length)]
	const randomNumber = Math.floor(Math.random() * 1000)
	const randomDomain = seedConfig.data.emailDomains[Math.floor(Math.random() * seedConfig.data.emailDomains.length)]
	
	return `${randomName}${randomNumber}@${randomDomain}`
}

// Función para generar nicknames aleatorios
function generateRandomNickname(): string {
	const randomPrefix = seedConfig.data.nicknamePrefixes[Math.floor(Math.random() * seedConfig.data.nicknamePrefixes.length)]
	const randomSuffix = seedConfig.data.nicknameSuffixes[Math.floor(Math.random() * seedConfig.data.nicknameSuffixes.length)]
	const randomNumber = Math.floor(Math.random() * 999)
	
	return `${randomPrefix}${randomSuffix}${randomNumber}`
}

// Función para seleccionar un rol aleatorio con distribución ponderada
function generateRandomRole(): Role {
	const totalWeight = seedConfig.roles.ADMIN.weight + seedConfig.roles.CONSULTANT.weight + seedConfig.roles.MEMBER.weight
	const random = Math.random() * totalWeight
	
	if (random < seedConfig.roles.ADMIN.weight) {
		return Role.ADMIN
	} else if (random < seedConfig.roles.ADMIN.weight + seedConfig.roles.CONSULTANT.weight) {
		return Role.CONSULTANT
	} else {
		return Role.MEMBER
	}
}

// Función para generar usuarios aleatorios
async function generateRandomUsers(count: number) {
	console.log(`Generando ${count} usuarios aleatorios...`)
	
	const users = []
	
	for (let i = 0; i < count; i++) {
		const user = await prisma.user.create({
			data: {
				email: generateRandomEmail(),
				nickname: generateRandomNickname(),
				address: generateRandomAddress(),
				role: generateRandomRole(),
			},
		})
		
		users.push(user)
		console.log(`Usuario creado: ${user.nickname} (${user.email}) - Rol: ${user.role}`)
	}
	
	return users
}

// Función principal del seed
async function main() {
	console.log('🌱 Iniciando seed de la base de datos...')
	
	try {
		// Limpiar usuarios existentes según configuración
		if (seedConfig.cleanup.clearExistingUsers) {
			console.log('🧹 Limpiando usuarios existentes...')
			await prisma.user.deleteMany({})
		}
		
		// Generar usuarios aleatorios
		const userCount = seedConfig.defaultUserCount
		const users = await generateRandomUsers(userCount)
		
		console.log(`✅ Seed completado exitosamente!`)
		console.log(`📊 Total de usuarios creados: ${users.length}`)
		
		// Mostrar estadísticas por rol
		const roleStats = users.reduce((acc, user) => {
			acc[user.role] = (acc[user.role] || 0) + 1
			return acc
		}, {} as Record<Role, number>)
		
		console.log('📈 Distribución por roles:')
		Object.entries(roleStats).forEach(([role, count]) => {
			console.log(`   ${role}: ${count} usuarios`)
		})
		
	} catch (error) {
		console.error('❌ Error durante el seed:', error)
		throw error
	} finally {
		await prisma.$disconnect()
	}
}

// Ejecutar el seed si el archivo se ejecuta directamente
if (require.main === module) {
	main()
		.then(() => {
			console.log('🎉 Seed ejecutado exitosamente!')
			process.exit(0)
		})
		.catch((error) => {
			console.error('💥 Error fatal durante el seed:', error)
			process.exit(1)
		})
}

export { main as seed }
