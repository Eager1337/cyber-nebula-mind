import { Brain, Sword, DollarSign, Shield, Zap } from "lucide-react";

const modes = [
  { id: "default", label: "DEFAULT", icon: Brain, desc: "Precision & Speed" },
  { id: "machiavelli", label: "MACHIAVELLI", icon: Sword, desc: "Power Strategy" },
  { id: "shelby", label: "SHELBY", icon: Zap, desc: "Ruthless Calm" },
  { id: "wealth", label: "WEALTH", icon: DollarSign, desc: "Capital Architect" },
  { id: "cyber", label: "CYBER", icon: Shield, desc: "Intel Ops" },
] as const;

interface ModeSelectorProps {
  activeMode: string;
  onSelect: (mode: string) => void;
}

const ModeSelector = ({ activeMode, onSelect }: ModeSelectorProps) => {
  return (
    <div className="glass-panel p-4 animate-float" style={{ animationDelay: "0.5s" }}>
      <h3 className="font-display text-[10px] tracking-[0.3em] text-muted-foreground mb-3">
        PERSONALITY MODE
      </h3>
      <div className="space-y-1.5">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary/10 border border-primary/30 glow-border"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <mode.icon
                className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <div>
                <div
                  className={`font-display text-[10px] tracking-wider ${
                    isActive ? "text-primary neon-text" : "text-foreground"
                  }`}
                >
                  {mode.label}
                </div>
                <div className="text-[11px] text-muted-foreground">{mode.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
