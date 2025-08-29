export const seedConfig = {
	// Número de usuarios a generar por defecto
	defaultUserCount: 25,
	
	// Configuración de roles
	roles: {
		ADMIN: {
			weight: 1, // 1 en 10 usuarios será admin
			maxCount: 3
		},
		CONSULTANT: {
			weight: 2, // 2 en 10 usuarios serán consultants
			maxCount: 8
		},
		MEMBER: {
			weight: 7, // 7 en 10 usuarios serán members
			maxCount: 20
		}
	},
	
	// Configuración de datos generados
	data: {
		// Dominios de email disponibles
		emailDomains: [
			'gmail.com',
			'yahoo.com', 
			'hotmail.com',
			'outlook.com',
			'protonmail.com',
			'icloud.com',
			'fastmail.com'
		],
		
		// Nombres para generar emails
		names: [
			'alice', 'bob', 'charlie', 'diana', 'eve', 'frank', 'grace', 'henry',
			'iris', 'jack', 'kate', 'leo', 'maya', 'nathan', 'olivia', 'paul',
			'quinn', 'rachel', 'sam', 'tina', 'uma', 'victor', 'willa', 'xander',
			'yara', 'zoe', 'alex', 'blake', 'casey', 'drew', 'emery', 'finley',
			'jordan', 'taylor', 'morgan', 'riley', 'avery', 'quinn', 'cameron'
		],
		
		// Prefijos para nicknames
		nicknamePrefixes: [
			'Crypto', 'NFT', 'DeFi', 'Web3', 'Blockchain', 'Meta', 'Digital', 'Future',
			'Smart', 'Quantum', 'Neural', 'Cyber', 'Virtual', 'Augmented', 'Mixed'
		],
		
		// Sufijos para nicknames
		nicknameSuffixes: [
			'Master', 'Pro', 'Guru', 'Expert', 'Trader', 'Artist', 'Collector', 'Builder',
			'Developer', 'Architect', 'Engineer', 'Designer', 'Analyst', 'Strategist'
		]
	},
	
	// Configuración de limpieza
	cleanup: {
		// Si es true, borra todos los usuarios existentes antes de crear nuevos
		clearExistingUsers: false,
		
		// Si es true, borra también las tareas relacionadas
		clearRelatedTasks: false
	}
}
