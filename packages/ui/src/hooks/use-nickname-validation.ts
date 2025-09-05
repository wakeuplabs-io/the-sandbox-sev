import { useState, useEffect, useRef } from "react";
import { useDebounce } from "./use-debounce";
import { useUser } from "./use-user";

interface UseNicknameValidationOptions {
  debounceMs?: number;
}

export const useNicknameValidation = (options: UseNicknameValidationOptions = {}) => {
  const { debounceMs = 500 } = options;
  const { getUserByNickname } = useUser();
  const [nickname, setNickname] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastValidatedNicknameRef = useRef<string>("");
  const getUserByNicknameRef = useRef(getUserByNickname);

  useEffect(() => {
    getUserByNicknameRef.current = getUserByNickname;
  }, [getUserByNickname]);

  const debouncedNickname = useDebounce(nickname, debounceMs);

  useEffect(() => {
    const validateNickname = async () => {
      if (lastValidatedNicknameRef.current === debouncedNickname) {
        return;
      }

      if (abortControllerRef.current) {
        console.log(`❌ Cancelling previous request`);
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      if (!debouncedNickname.trim()) {
        setIsValid(false);
        setError(null);
        setIsValidating(false);
        lastValidatedNicknameRef.current = "";
        return;
      }

      lastValidatedNicknameRef.current = debouncedNickname;
      console.log(`🔍 Validating nickname: "${debouncedNickname}"`);
      setIsValidating(true);
      setError(null);

      try {
        const user = await getUserByNicknameRef.current(debouncedNickname.trim());
        if (abortController.signal.aborted) {
          return;
        }

        if (user) {
          setIsValid(false);
          setError("Nickname already taken");
        } else {
          setIsValid(true);
          setError(null);
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }

        setIsValid(true);
        setError(null);
        console.warn("Error validating nickname:", err);
      } finally {
        if (!abortController.signal.aborted) {
          setIsValidating(false);
        }
      }
    };

    validateNickname();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedNickname]);

  const isLengthValid = nickname.trim().length >= 2 && nickname.trim().length <= 50;
  const isFormValid = isLengthValid && isValid && !isValidating;

  return {
    nickname,
    setNickname,
    isValidating,
    isValid,
    isLengthValid,
    isFormValid,
    error,
    debouncedNickname,
  };
};
