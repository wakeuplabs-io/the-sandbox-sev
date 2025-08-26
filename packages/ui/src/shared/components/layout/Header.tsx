import React from 'react'
import { Link } from '@tanstack/react-router'
import { MobileMenu } from './MobileMenu'
import { DesktopNav } from './DesktopNav'
import { FaHamburger } from 'react-icons/fa'
import { LoginButton } from '../login-button'
import { useLayout } from '@/context/layout-context'
interface HeaderProps {
	links: Array<{ to: string; label: string; icon?: React.ReactNode }>
	onSidebarToggle?: () => void
	showSidebarToggle?: boolean
}

export function Header({ links, onSidebarToggle, showSidebarToggle }: HeaderProps) {
	const { isLoading, isMobileMenuOpen, setIsMobileMenuOpen } = useLayout();
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
						<FaHamburger />
					</button>
				)}
				
				{/* Logo */}
				<Link to="/" className="btn btn-ghost text-xl">
					<div className="avatar placeholder bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
						<span className="text-xl font-bold">S</span>
					</div>
					<span className="hidden sm:block ml-2 font-bold">Sandbox</span>
				</Link>
			</div>

			{/* Center Navigation - Desktop */}
			<div className="navbar-center hidden lg:flex">
				<DesktopNav links={links} />
			</div>

			<div className="navbar-end">
				<LoginButton isLoading={isLoading} />
			</div>

			{/* Right side - Mobile Menu */}
			<div className="navbar-end lg:hidden">
				<MobileMenu
					isOpen={isMobileMenuOpen}
					onToggle={handleMobileMenuToggle}
					links={links}
				/>
			</div>
		</div>
	)
}
