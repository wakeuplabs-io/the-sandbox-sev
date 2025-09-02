export const Avatar = ({ src, name }: { src?: string; name: string }) => {
  if (!name) {
    return null;
  }

  return (
    <div className="">
      <div className="avatar avatar-placeholder w-24 rounded-full">
        {src ? (
          <img src={src} alt={name} />
        ) : (
          <span className="text-xl font-bold avatar placeholder bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
