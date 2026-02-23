import { Volume2 } from "lucide-react";

const voices = [
  { id: "nova", label: "NOVA", desc: "Deep & commanding" },
  { id: "echo", label: "ECHO", desc: "Smooth & precise" },
  { id: "pulse", label: "PULSE", desc: "Fast & sharp" },
  { id: "shade", label: "SHADE", desc: "Cold & strategic" },
];

interface VoiceSelectorProps {
  activeVoice: string;
  onSelect: (voice: string) => void;
}

const VoiceSelector = ({ activeVoice, onSelect }: VoiceSelectorProps) => {
  return (
    <div className="glass-panel-accent p-4 animate-float" style={{ animationDelay: "1.5s" }}>
      <h3 className="font-display text-[10px] tracking-[0.3em] text-muted-foreground mb-3">
        VOICE ENGINE
      </h3>
      <div className="space-y-1.5">
        {voices.map((voice) => {
          const isActive = activeVoice === voice.id;
          return (
            <button
              key={voice.id}
              onClick={() => onSelect(voice.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-accent/10 border border-accent/30 glow-border-purple"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <Volume2
                className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-muted-foreground"}`}
              />
              <div>
                <div
                  className={`font-display text-[10px] tracking-wider ${
                    isActive ? "text-accent neon-text-purple" : "text-foreground"
                  }`}
                >
                  {voice.label}
                </div>
                <div className="text-[11px] text-muted-foreground">{voice.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceSelector;
