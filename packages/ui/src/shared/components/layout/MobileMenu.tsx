import React from 'react'
import { Navigation } from './Navigation'

interface MobileMenuProps {
	isOpen: boolean
	onToggle: () => void
	links: Array<{ to: string; label: string; icon?: React.ReactNode }>
}

export function MobileMenu({ isOpen, onToggle, links }: MobileMenuProps) {
	return (
		<div className="lg:hidden">
			{/* Hamburger Button */}
			<button
				className="btn btn-ghost btn-sm"
				onClick={onToggle}
				aria-label="Toggle mobile menu"
				aria-expanded={isOpen}
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					{isOpen ? (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					) : (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					)}
				</svg>
			</button>

			{/* Mobile Menu using DaisyUI Drawer */}
			<div className={`drawer drawer-end ${isOpen ? 'drawer-open' : ''}`}>
				<input
					id="mobile-menu-drawer"
					type="checkbox"
					className="drawer-toggle"
					checked={isOpen}
					onChange={onToggle}
				/>
				
				<div className="drawer-side z-50">
					<label
						htmlFor="mobile-menu-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
						onClick={onToggle}
					></label>
					
					<div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-primary">Menu</h2>
							<button
								className="btn btn-ghost btn-sm"
								onClick={onToggle}
								aria-label="Close menu"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						
						{/* Navigation */}
						<div className="flex-1">
							<Navigation
								links={links}
								className="flex flex-col gap-2"
								onLinkClick={onToggle}
							/>
						</div>
						
						{/* Footer */}
						<div className="divider"></div>
						<div className="text-sm text-base-content/70 text-center">
							<p>Sandbox App</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
