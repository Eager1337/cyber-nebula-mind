interface VoiceOrbProps {
  isActive: boolean;
  onClick: () => void;
}

const VoiceOrb = ({ isActive, onClick }: VoiceOrbProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group cursor-pointer ${
        isActive
          ? "bg-primary/20 shadow-[0_0_30px_hsl(195_100%_50%/0.5),0_0_60px_hsl(195_100%_50%/0.2)]"
          : "bg-muted/50 hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(195_100%_50%/0.3)]"
      }`}
    >
      {/* Waveform bars */}
      <div className="flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-300 ${
              isActive ? "bg-primary" : "bg-muted-foreground group-hover:bg-primary/60"
            }`}
            style={{
              height: isActive ? undefined : "4px",
              animation: isActive
                ? `waveform 0.8s ease-in-out ${i * 0.1}s infinite`
                : "none",
            }}
          />
        ))}
      </div>

      {/* Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
          isActive ? "border-primary animate-pulse-glow" : "border-muted-foreground/30 group-hover:border-primary/40"
        }`}
      />
    </button>
  );
};

export default VoiceOrb;
