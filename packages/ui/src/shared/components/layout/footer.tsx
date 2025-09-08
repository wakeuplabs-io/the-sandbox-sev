import { FaGithub, FaTwitter, FaDiscord, FaLinkedin, FaHeart } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'

export function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="footer footer-center text-base-content border-t border-base-300 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
			{/* Main Footer Content */}
			<div className="w-full max-w-4xl mx-auto px-4 py-12">
				<div className="flex flex-col items-center space-y-6">
					{/* Brand Section */}
					<div className="text-center space-y-4">
						<Link to="/" className="text-3xl font-bold text-primary hover:text-primary-focus transition-colors">
							Sandbox
						</Link>
						<p className="text-base text-base-content/70 max-w-md">
							Plataforma de verificación de tareas descentralizada construida sobre blockchain.
						</p>
						<div className="flex justify-center space-x-4">
							<a 
								href="https://github.com" 
								target="_blank" 
								rel="noopener noreferrer"
								className="group btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110 hover:shadow-lg"
								aria-label="GitHub"
							>
								<FaGithub className="w-5 h-5 group-hover:animate-pulse" />
							</a>
							<a 
								href="https://twitter.com" 
								target="_blank" 
								rel="noopener noreferrer"
								className="group btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110 hover:shadow-lg"
								aria-label="Twitter"
							>
								<FaTwitter className="w-5 h-5 group-hover:animate-pulse" />
							</a>
							<a 
								href="https://discord.com" 
								target="_blank" 
								rel="noopener noreferrer"
								className="group btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110 hover:shadow-lg"
								aria-label="Discord"
							>
								<FaDiscord className="w-5 h-5 group-hover:animate-pulse" />
							</a>
							<a 
								href="https://linkedin.com" 
								target="_blank" 
								rel="noopener noreferrer"
								className="group btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110 hover:shadow-lg"
								aria-label="LinkedIn"
							>
								<FaLinkedin className="w-5 h-5 group-hover:animate-pulse" />
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="divider my-0"></div>

			{/* Bottom Section */}
			<div className="w-full max-w-7xl mx-auto px-4 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<div className="flex items-center space-x-2 text-sm text-base-content/70">
						<span>© {currentYear} Sandbox. Todos los derechos reservados.</span>
					</div>
					<div className="flex items-center space-x-2 text-sm text-base-content/70">
						<span>{" Hecho con"}</span>
						<FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
						<span>por wakeuplabs</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
