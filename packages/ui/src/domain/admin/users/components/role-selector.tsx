import { UserRoleEnum } from "@/shared/constants";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaTimes } from "react-icons/fa";

interface RoleSelectorProps {
  currentRole: UserRoleEnum;
  onChange: (newRole: UserRoleEnum) => void;
  onRemoveRole: () => void;
}

const roleOptions = [
  { value: UserRoleEnum.ADMIN, label: "Admin", color: "error" },
  { value: UserRoleEnum.CONSULTANT, label: "Consultant", color: "warning" },
];

export function RoleSelector({ currentRole, onChange, onRemoveRole }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getRoleColor = (role: string) => {
    return roleOptions.find(option => option.value === role)?.color || "neutral";
  };

  const getRoleLabel = (role: string) => {
    return roleOptions.find(option => option.value === role)?.label || "No Role";
  };

  const handleRoleChange = (newRole: UserRoleEnum) => {
    console.log("RoleSelector - handleRoleChange called with:", newRole);
    console.log("RoleSelector - current role was:", currentRole);
    onChange(newRole);
    setIsOpen(false);
  };

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 128, // 128px es el ancho del dropdown
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  return (
    <div className="flex items-center gap-2 w-[200px]">
      {/* Role Selector */}
      <div className="relative w-full">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-sm btn-outline w-[150px] h-8"
        >
          <span className={` ${getRoleColor(currentRole)}`}>
            {getRoleLabel(currentRole)}
          </span>
          <FaChevronDown className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && createPortal(
          <>
            {/* Overlay para cerrar al hacer click fuera */}
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown renderizado en el body */}
            <div 
              className="fixed z-[9999] bg-base-100 rounded-lg shadow-xl border border-base-300 min-w-[8rem]"
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRoleChange(option.value)}
                  className={`w-full text-left px-3 py-2 hover:bg-base-200 transition-colors ${
                    currentRole === option.value ? 'bg-base-200' : ``
                  }`}
                >
                  <span className={``}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
      </div>

      {/* Remove Role Button - solo mostrar si tiene un rol asignado */}
      {currentRole !== UserRoleEnum.MEMBER && (
        <button
          onClick={onRemoveRole}
          className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content min-h-8 h-8 px-2"
          title="Remove Role"
        >
          <FaTimes className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
