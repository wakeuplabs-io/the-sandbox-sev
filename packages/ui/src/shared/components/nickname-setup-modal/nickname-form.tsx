import { NicknameFormProps } from "./types";
import { useNicknameValidation } from "@/hooks/use-nickname-validation";

export function NicknameForm({ onSubmit, isLoading, error }: NicknameFormProps) {
  const {
    nickname,
    setNickname,
    isValidating,
    isLengthValid,
    isFormValid,
    error: validationError,
  } = useNicknameValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nickname Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Choose how you'll appear to others in SEV
          </label>

          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Type here..."
            className="input input-bordered w-full pr-12"
            disabled={isLoading || isValidating}
            maxLength={50}
          />

          <div className="flex justify-between text-xs text-base-content/60 mt-1">
            <span>{nickname.length}/50 characters</span>
            {nickname && !isLengthValid && (
              <span className="text-error">Nickname must be 2-50 characters</span>
            )}
            {/* Validation Messages */}
            {validationError && (
              <div className="text-error">
                <span>{validationError}</span>
              </div>
            )}

            {isValidating && (
              <div className="">
                <span>Checking availability...</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          disabled={!isFormValid || isLoading || isValidating}
        >
          {isLoading ? "Saving..." : isValidating ? "Checking..." : "Save"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-error">
          <span>Error saving nickname. Please try again.</span>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-base-200 rounded-lg p-4">
        <h4 className="font-semibold text-base-content mb-2">What is this?</h4>
        <p className="text-sm text-base-content/70">
          Your address and nickname are your unique identifiers within SEV. They allow the system to
          securely link your uploaded instructions and on-chain validations to your identity.
        </p>
      </div>
    </form>
  );
}
