import { useWeb3Auth } from "@/context/web3auth";
import { useGetUser } from "./use-get-user";
import { useUser } from "./use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useNicknameSetup = () => {
  const { account, email, isAuthenticated } = useWeb3Auth();
  const { user, isLoading: isLoadingUser } = useGetUser(account || "", email || "");
  const { updateUser } = useUser();
  const queryClient = useQueryClient();

  // Determinar si debe mostrar el modal
  const shouldShowModal = Boolean(isAuthenticated && account && user && !user.nickname);

  // Mutation para actualizar el nickname
  const updateNicknameMutation = useMutation({
    mutationFn: async (nickname: string) => {
      if (!user?.id) throw new Error("User ID not available");
      return await updateUser({ nickname });
    },
    onSuccess: () => {
      // Invalidar la query del usuario para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["user", account, email] });
    },
  });

  const updateNickname = async (nickname: string): Promise<void> => {
    await updateNicknameMutation.mutateAsync(nickname);
  };

  return {
    shouldShowModal,
    isLoading: isLoadingUser,
    isUpdating: updateNicknameMutation.isPending,
    user,
    updateNickname,
    error: updateNicknameMutation.error,
  };
};
