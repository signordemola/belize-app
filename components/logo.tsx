interface BelizeBankLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "stacked" | "icon-only";
  className?: string;
}

export function BelizeBankLogo({
  size = "md",
  variant = "horizontal",
  className = "",
}: BelizeBankLogoProps) {
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const LogoIcon = () => (
    <div
      className={`${iconSizeClasses[size]} relative flex items-center justify-center`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer circle background */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="currentColor"
          className="text-white/70"
        />

        {/* Inner geometric pattern - properly centered */}
        <g transform="translate(32, 32)">
          {/* Central column structure */}
          <rect
            x="-2"
            y="-16"
            width="4"
            height="32"
            fill="currentColor"
            className="text-primary-600"
          />
          <rect
            x="-8"
            y="-16"
            width="4"
            height="28"
            fill="currentColor"
            className="text-primary-600"
          />
          <rect
            x="4"
            y="-16"
            width="4"
            height="28"
            fill="currentColor"
            className="text-primary-600"
          />

          {/* Top architectural element */}
          <rect
            x="-12"
            y="-20"
            width="24"
            height="4"
            fill="currentColor"
            className="text-primary-600"
          />

          {/* Growth arrow pointing up */}
          <path
            d="M0,-24 L-6,-18 L-2,-18 L-2,-12 L2,-12 L2,-18 L6,-18 Z"
            fill="currentColor"
            className="text-primary-600"
          />

          {/* Base foundation */}
          <rect
            x="-14"
            y="12"
            width="28"
            height="6"
            fill="currentColor"
            className="text-primary-600"
          />
        </g>

        {/* Subtle outer ring */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary-600"
        />
      </svg>
    </div>
  );

  if (variant === "icon-only") {
    return (
      <div className={`inline-flex ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
        <LogoIcon />
        <div className="text-center">
          <h1
            className={`font-bold tracking-tight text-gray-800 ${textSizeClasses[size]}`}
          >
            Belize Bank
          </h1>
          <p className="text-xs text-gray-600 font-medium tracking-wide">
            TRUSTED SINCE 1985
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <div className="flex flex-col">
        <h1
          className={`font-bold tracking-tight text-gray-800 leading-none ${textSizeClasses[size]}`}
        >
          Belize Bank
        </h1>
        <p className="text-xs text-gray-600 font-medium tracking-wide mt-1">
          TRUSTED SINCE 1985
        </p>
      </div>
    </div>
  );
}
