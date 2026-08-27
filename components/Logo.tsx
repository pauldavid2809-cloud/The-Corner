"use client";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withText?: boolean;
  textClassName?: string;
  subtext?: string;
};

export function Logo({
  size = "md",
  className = "",
  withText = false,
  textClassName = "",
  subtext = "DRINKS & ENTERTAINMENT",
}: LogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8", text: "text-base", sub: "text-[8px]" },
    md: { box: "w-10 h-10", text: "text-lg sm:text-xl", sub: "text-[9px]" },
    lg: { box: "w-14 h-14", text: "text-2xl", sub: "text-[11px]" },
    xl: { box: "w-20 h-20", text: "text-3xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Isotipo Oficial The Corner */}
      <div
        className={`relative ${currentSize.box} rounded-2xl overflow-hidden bg-black border border-orange-500/40 shadow-lg shadow-orange-500/20 shrink-0 flex items-center justify-center p-0.5 group-hover:border-orange-400 group-hover:shadow-orange-500/40 transition-all duration-200`}
      >
        <img
          src="/logo.png"
          alt="The Corner Logo"
          className="w-full h-full object-contain rounded-xl"
        />
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tighter text-white uppercase group-hover:text-orange-400 transition-colors ${currentSize.text} ${textClassName}`}
            >
              THE CORNER.
            </span>
          </div>
          {subtext && (
            <span
              className={`font-bold tracking-widest text-zinc-400 uppercase mt-0.5 ${currentSize.sub}`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
