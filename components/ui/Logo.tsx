import Image from "next/image";

interface LogoProps {
  /** Display variant:
   *  - "mark": icon only (3D orbital 'N')
   *  - "horizontal": icon + "Nexora" text + optional subtitle
   *  - "full": complete official badge emblem
   */
  variant?: "mark" | "horizontal" | "full";
  /** Size preset or custom pixel number */
  size?: "sm" | "md" | "lg" | "xl" | number;
  /** Optional subtitle below Nexora brand name (e.g. "Admin Panel", "Client Portal") */
  subtitle?: string;
  /** Show dot after Nexora text in horizontal variant */
  showDot?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Priority loading for above-the-fold brand images */
  priority?: boolean;
}

const sizeMap = {
  sm: { box: 28, img: 26, text: "text-base", sub: "text-[9px]" },
  md: { box: 34, img: 32, text: "text-lg sm:text-xl", sub: "text-[10px]" },
  lg: { box: 44, img: 40, text: "text-2xl", sub: "text-xs" },
  xl: { box: 56, img: 52, text: "text-3xl", sub: "text-xs" },
};

export function Logo({
  variant = "horizontal",
  size = "md",
  subtitle,
  showDot = false,
  className = "",
  priority = true,
}: LogoProps) {
  const isCustomSize = typeof size === "number";
  const sizeConfig = isCustomSize
    ? {
        box: size,
        img: Math.max(16, size - 4),
        text: "text-lg",
        sub: "text-[10px]",
      }
    : sizeMap[size];

  if (variant === "full") {
    const fullWidth = isCustomSize ? size * 3.5 : size === "sm" ? 120 : size === "lg" ? 220 : 160;
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        <Image
          src="/images/logo/nexora-full-logo.png"
          alt="Nexora Agency"
          width={fullWidth}
          height={fullWidth}
          priority={priority}
          className="w-auto h-auto object-contain rounded-2xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
        />
      </div>
    );
  }

  // Mark & Horizontal
  const markElement = (
    <div
      style={{ width: `${sizeConfig.box}px`, height: `${sizeConfig.box}px` }}
      className="relative shrink-0 rounded-xl overflow-hidden bg-[#060b17] border border-blue-500/20 shadow-[0_0_18px_rgba(37,99,235,0.35)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.55)] group-hover:border-blue-400/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center"
    >
      <div className="relative w-full h-full p-0.5">
        <Image
          src="/images/logo/nexora-icon.png"
          alt="Nexora Icon"
          fill
          sizes={`${sizeConfig.box}px`}
          priority={priority}
          className="object-contain p-0.5 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
        />
      </div>
    </div>
  );

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        {markElement}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 select-none ${className}`}>
      {markElement}
      <div className="flex flex-col leading-none">
        <span
          className={`font-heading font-bold tracking-tight text-foreground group-hover:text-blue-400 transition-colors ${sizeConfig.text}`}
        >
          Nexora
          {showDot && <span className="text-primary-400">.</span>}
        </span>
        {subtitle && (
          <span
            className={`font-mono font-medium text-primary-400/90 tracking-wide mt-0.5 ${sizeConfig.sub}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
