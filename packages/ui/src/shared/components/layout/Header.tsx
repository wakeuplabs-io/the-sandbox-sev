import React from 'react'
import { Link } from '@tanstack/react-router'
import { MobileMenu } from './MobileMenu'
import { DesktopNav } from './DesktopNav'

interface HeaderProps {
	links: Array<{ to: string; label: string; icon?: React.ReactNode }>
	onSidebarToggle?: () => void
	showSidebarToggle?: boolean
}

export function Header({ links, onSidebarToggle, showSidebarToggle }: HeaderProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

	const handleMobileMenuToggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen)
	}

	return (
		<div className="navbar bg-base-100 border-b border-base-300 shadow-lg">
			<div className="navbar-start">
				{/* Sidebar Toggle for Mobile */}
				{showSidebarToggle && (
					<button
						className="btn btn-ghost btn-sm p-2 lg:hidden"
						onClick={onSidebarToggle}
						aria-label="Toggle sidebar"
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
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				)}
				
				{/* Logo */}
				<Link to="/" className="btn btn-ghost text-xl">
					<div className="avatar placeholder">
						<div className="bg-primary text-primary-content rounded-full w-10">
							<span className="text-xl font-bold">S</span>
						</div>
					</div>
					<span className="hidden sm:block ml-2 font-bold">Sandbox</span>
				</Link>
			</div>

			{/* Center Navigation - Desktop */}
			<div className="navbar-center hidden lg:flex">
				<DesktopNav links={links} />
			</div>

			{/* Right side - Mobile Menu */}
			<div className="navbar-end">
				<MobileMenu
					isOpen={isMobileMenuOpen}
					onToggle={handleMobileMenuToggle}
					links={links}
				/>
			</div>
		</div>
	)
}
