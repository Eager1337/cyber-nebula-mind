import { X, Gauge, Wifi, Cpu } from "lucide-react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 glass-panel rounded-l-2xl border-l border-primary/20 transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h3 className="font-display text-xs tracking-[0.3em] text-primary neon-text">
            SYSTEM CONFIG
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Response Speed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                RESPONSE SPEED
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
              <span>Precise</span>
              <span>Rapid</span>
            </div>
          </div>

          {/* Connection */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-primary" />
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                CONNECTION
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
              <div className="w-2 h-2 rounded-full bg-primary" style={{ animation: "status-blink 2s ease-in-out infinite" }} />
              <span className="text-sm text-foreground">Neural Link Active</span>
            </div>
          </div>

          {/* System */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                SYSTEM
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between px-3 py-2 rounded-lg bg-muted/20">
                <span className="text-muted-foreground">Model</span>
                <span className="text-foreground font-display text-[10px]">EB-7.0</span>
              </div>
              <div className="flex justify-between px-3 py-2 rounded-lg bg-muted/20">
                <span className="text-muted-foreground">Memory</span>
                <span className="text-foreground font-display text-[10px]">128 TB</span>
              </div>
              <div className="flex justify-between px-3 py-2 rounded-lg bg-muted/20">
                <span className="text-muted-foreground">Version</span>
                <span className="text-accent font-display text-[10px]">2045.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
