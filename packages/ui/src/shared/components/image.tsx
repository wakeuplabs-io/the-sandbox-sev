import { useEffect, useState } from "react";
import { FaImage, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import clsx from "clsx";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image?: string;
  fallbackIcon?: React.ReactNode;
  showLoadingSpinner?: boolean;
  aspectRatio?: "square" | "video" | "wide";
}

function Image({ 
  image, 
  alt, 
  className, 
  fallbackIcon,
  showLoadingSpinner = true,
  aspectRatio = "video",
  ...rest 
}: ImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [image]);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video", 
    wide: "aspect-[16/9]"
  };

  const defaultFallback = (
    <div className="w-full h-full flex items-center justify-center bg-base-200 rounded-lg">
      {showLoadingSpinner ? (
        <FaSpinner className="loading loading-spinner loading-sm animate-spin" />
      ) : (
        <FaImage className="h-8 w-8 text-base-content/40" />
      )}
    </div>
  );

  const errorFallback = (
    <div className="w-full h-full flex items-center justify-center bg-error/10 rounded-lg">
      <FaExclamationTriangle className="h-8 w-8 text-error/60" />
    </div>
  );

  return (
    <div className={clsx("relative w-full", aspectRatioClasses[aspectRatio])}>
      {/* Placeholder con blur */}
      {(!isLoaded || hasError) && (
        <div
          className={clsx(
            "absolute inset-0 w-full h-full object-cover rounded-lg select-none transition-opacity duration-300 blur-sm bg-base-200",
            className
          )}
          style={{
            opacity: isLoaded && !hasError ? 0 : 1,
            zIndex: 1,
          }}
        >
          {hasError ? errorFallback : defaultFallback}
        </div>
      )}
      
      {/* Imagen real */}
      <img
        src={image}
        alt={alt}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        {...rest}
        className={clsx(
          "transition-opacity duration-300 w-full h-full object-cover",
          {
            "opacity-100": isLoaded && !hasError,
            "opacity-0": !isLoaded || hasError,
          },
          className
        )}
        style={{
          zIndex: 2,
          ...(rest.style || {}),
        }}
      />
    </div>
  );
}

export { Image };