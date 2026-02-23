import { memo } from "react";

interface AICoreProps {
  status: "idle" | "listening" | "thinking" | "speaking";
}

const AICore = memo(({ status }: AICoreProps) => {
  const ringColor = {
    idle: "border-primary/30",
    listening: "border-primary",
    thinking: "border-accent",
    speaking: "border-neon-cyan",
  }[status];

  const glowStyle = {
    idle: "shadow-[0_0_30px_hsl(195_100%_50%/0.15)]",
    listening: "shadow-[0_0_40px_hsl(195_100%_50%/0.4),0_0_80px_hsl(195_100%_50%/0.15)]",
    thinking: "shadow-[0_0_40px_hsl(270_95%_65%/0.4),0_0_80px_hsl(270_95%_65%/0.15)]",
    speaking: "shadow-[0_0_50px_hsl(195_100%_50%/0.5),0_0_100px_hsl(195_100%_50%/0.2)]",
  }[status];

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating ring */}
      <div
        className={`absolute w-44 h-44 md:w-56 md:h-56 rounded-full border-2 border-dashed ${ringColor} animate-core-rotate opacity-40`}
      />
      {/* Middle ring */}
      <div
        className={`absolute w-36 h-36 md:w-44 md:h-44 rounded-full border ${ringColor} opacity-60`}
        style={{ animation: "core-rotate 15s linear infinite reverse" }}
      />
      {/* Core orb */}
      <div
        className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center transition-all duration-700 ${glowStyle}`}
      >
        {/* Inner glow */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
});

AICore.displayName = "AICore";
export default AICore;
