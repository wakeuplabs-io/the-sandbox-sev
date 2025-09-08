import { User } from "@/domain/admin/users/types"

export interface ProfileModalProps {
	isOpen: boolean
	onClose: () => void
	user: User | null
	onLogout: () => Promise<void>
	isLoggingOut?: boolean
}
