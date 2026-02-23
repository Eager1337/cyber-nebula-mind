interface StatusIndicatorProps {
  status: "idle" | "listening" | "thinking" | "speaking";
}

const statusConfig = {
  idle: { label: "STANDBY", color: "bg-muted-foreground", textClass: "text-muted-foreground" },
  listening: { label: "LISTENING", color: "bg-primary", textClass: "text-primary neon-text" },
  thinking: { label: "THINKING", color: "bg-accent", textClass: "text-accent neon-text-purple" },
  speaking: { label: "SPEAKING", color: "bg-neon-cyan", textClass: "text-primary neon-text" },
};

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const { label, color, textClass } = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${color}`}
        style={{ animation: status !== "idle" ? "status-blink 1.2s ease-in-out infinite" : "none" }}
      />
      <span className={`font-display text-xs tracking-[0.3em] ${textClass}`}>
        {label}
      </span>
    </div>
  );
};

export default StatusIndicator;
