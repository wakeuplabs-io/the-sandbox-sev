import React from 'react'
import { Navigation } from './Navigation'

interface DesktopNavProps {
	links: Array<{ to: string; label: string; icon?: React.ReactNode }>
}

export function DesktopNav({ links }: DesktopNavProps) {
	return (
		<div className="hidden lg:block">
			<Navigation
				links={links}
				className="flex items-center gap-2"
			/>
		</div>
	)
}
