export const Avatar = ({
  src,
  name,
  onClick,
}: {
  src?: string;
  name: string;
  onClick?: () => void;
}) => {
  if (!name) {
    return null;
  }

  const getDisplayName = (name: string) => {
    if (name.length > 2) {
      return name.slice(0, 2);
    }
    return name;
  };

  const displayName = getDisplayName(name);
  if (src) {
    return (
      <div className="avatar avatar-placeholder" onClick={onClick}>
        <img src={src} alt={name} />
      </div>
    );
  }
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <span className="text-xl font-bold placeholder bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
        {displayName.toUpperCase()}
      </span>
    </div>
  );
};
