export interface NicknameSetupModalProps {
  isOpen: boolean;
  user: {
    id: number;
    address: string;
    email?: string | null;
  } | undefined;
  onSave: (nickname: string) => Promise<void>;
  isLoading?: boolean;
  isUpdating?: boolean;
  error?: Error | null;
}

export interface NicknameFormProps {
  onSubmit: (nickname: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}
