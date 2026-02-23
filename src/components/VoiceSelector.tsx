import { Volume2 } from "lucide-react";

interface VoiceSelectorProps {
  voices: { name: string; lang: string }[];
  activeVoice: string;
  onSelect: (voice: string) => void;
}

const VoiceSelector = ({ voices, activeVoice, onSelect }: VoiceSelectorProps) => {
  // Show up to 8 English voices for cleanliness
  const englishVoices = voices
    .filter((v) => v.lang.startsWith("en"))
    .slice(0, 8);

  const displayVoices = englishVoices.length > 0 ? englishVoices : voices.slice(0, 8);

  return (
    <div className="glass-panel-accent p-4 animate-float" style={{ animationDelay: "1.5s" }}>
      <h3 className="font-display text-[10px] tracking-[0.3em] text-muted-foreground mb-3">
        VOICE ENGINE
      </h3>
      <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-thin">
        {displayVoices.length === 0 && (
          <p className="text-[11px] text-muted-foreground px-3 py-2">Loading voices…</p>
        )}
        {displayVoices.map((voice) => {
          const isActive = activeVoice === voice.name;
          // Short label from voice name
          const shortName = voice.name.replace(/Microsoft |Google |Apple /, "").split(" (")[0];
          return (
            <button
              key={voice.name}
              onClick={() => onSelect(voice.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-accent/10 border border-accent/30 glow-border-purple"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <Volume2
                className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-accent" : "text-muted-foreground"}`}
              />
              <div className="min-w-0">
                <div
                  className={`font-display text-[10px] tracking-wider truncate ${
                    isActive ? "text-accent neon-text-purple" : "text-foreground"
                  }`}
                >
                  {shortName}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{voice.lang}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceSelector;
