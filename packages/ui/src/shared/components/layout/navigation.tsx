import { Link } from '@tanstack/react-router'
import React from 'react'

interface NavigationLink {
	to: string
	label: string
	icon?: React.ReactNode
	exact?: boolean
}

interface NavigationProps {
	links: NavigationLink[]
	className?: string
	onLinkClick?: () => void
}

export function Navigation({ links, className = '', onLinkClick }: NavigationProps) {
	const handleLinkClick = () => {
		if (onLinkClick) {
			onLinkClick()
		}
	}

	return (
		<ul className={`menu menu-horizontal ${className}`}>
			{links.map((link) => (
				<li key={link.to}>
					<Link
						to={link.to}
						activeOptions={{ exact: link.exact || false }}
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-base-200 [&.active]:bg-primary [&.active]:text-primary-content [&.active]:font-semibold [&.active]:shadow-lg"
						onClick={handleLinkClick}
					>
						{link.icon && <span className="text-lg [&.active]:text-primary-content">{link.icon}</span>}
						<span className="[&.active]:text-primary-content">{link.label}</span>
					</Link>
				</li>
			))}
		</ul>
	)
}
