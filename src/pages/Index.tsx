import { useState, useCallback, useRef } from "react";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import AICore from "@/components/AICore";
import StatusIndicator from "@/components/StatusIndicator";
import VoiceOrb from "@/components/VoiceOrb";
import ModeSelector from "@/components/ModeSelector";
import ChatPanel from "@/components/ChatPanel";
import VoiceSelector from "@/components/VoiceSelector";
import SettingsDrawer from "@/components/SettingsDrawer";
import { useSpeech } from "@/hooks/useSpeech";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { streamChat } from "@/lib/streamChat";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

let msgCounter = 0;

const Index = () => {
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [mode, setMode] = useState("default");
  const [messages, setMessages] = useState<Message[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const chatHistoryRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const speech = useSpeech({
    onStart: () => setStatus("speaking"),
    onEnd: () => setStatus("idle"),
  });

  const sendToAI = useCallback(
    async (userText: string) => {
      const userId = ++msgCounter;
      setMessages((prev) => [...prev, { id: userId, role: "user", content: userText }]);
      chatHistoryRef.current.push({ role: "user", content: userText });
      setStatus("thinking");

      let assistantContent = "";
      const assistantId = ++msgCounter;

      try {
        await streamChat({
          messages: chatHistoryRef.current,
          mode,
          onDelta: (chunk) => {
            assistantContent += chunk;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && last.id === assistantId) {
                return prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { id: assistantId, role: "assistant", content: assistantContent }];
            });
          },
          onDone: () => {
            chatHistoryRef.current.push({ role: "assistant", content: assistantContent });
            if (assistantContent) {
              speech.speak(assistantContent);
            } else {
              setStatus("idle");
            }
          },
        });
      } catch (e: any) {
        console.error("AI error:", e);
        toast.error(e.message || "Failed to get AI response");
        setStatus("idle");
      }
    },
    [mode, speech]
  );

  const { startListening, stopListening, isListening } = useSpeechRecognition({
    onFinalTranscript: (transcript) => {
      sendToAI(transcript);
    },
  });

  const handleVoice = useCallback(() => {
    if (status === "idle") {
      startListening();
      setStatus("listening");
    } else if (status === "listening") {
      stopListening();
      setStatus("idle");
    } else {
      speech.stop();
      setStatus("idle");
    }
  }, [status, startListening, stopListening, speech]);

  const handleSend = useCallback(
    (text: string) => {
      sendToAI(text);
    },
    [sendToAI]
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h1 className="font-display text-sm md:text-base tracking-[0.2em] text-primary neon-text">
            EAGERBEAVER
          </h1>
          <span className="font-display text-[9px] tracking-[0.15em] text-accent/70 hidden sm:inline">
            v2045.1
          </span>
        </div>
        <div className="flex items-center gap-4">
          <StatusIndicator status={status} />
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-8 h-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-[0_0_10px_hsl(195_100%_50%/0.2)] transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="relative z-10 flex h-[calc(100vh-49px)]">
        {/* Left panel */}
        <div
          className={`hidden md:flex flex-col gap-4 p-4 transition-all duration-500 ${
            leftOpen ? "w-64" : "w-0 p-0 overflow-hidden"
          }`}
        >
          {leftOpen && (
            <>
              <ModeSelector activeMode={mode} onSelect={setMode} />
              <VoiceSelector
                voices={speech.voices}
                activeVoice={speech.selectedVoice}
                onSelect={speech.setSelectedVoice}
              />
            </>
          )}
        </div>

        {/* Left toggle */}
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-5 h-12 items-center justify-center bg-muted/40 border border-border/30 rounded-r-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          style={{ left: leftOpen ? "256px" : 0 }}
        >
          {leftOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        {/* Center – AI Core */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <AICore status={status} />
          <VoiceOrb isActive={status === "listening" || status === "speaking"} onClick={handleVoice} />
          <p className="font-display text-[9px] tracking-[0.3em] text-muted-foreground">
            {status === "idle"
              ? "TAP TO ACTIVATE VOICE"
              : status === "listening"
              ? "LISTENING — TAP TO STOP"
              : status === "speaking"
              ? "SPEAKING — TAP TO STOP"
              : "PROCESSING…"}
          </p>

          {/* Mobile mode pills */}
          <div className="flex md:hidden gap-2 flex-wrap justify-center">
            {["default", "machiavelli", "shelby", "wealth", "cyber"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-full font-display text-[9px] tracking-wider border transition-all cursor-pointer ${
                  mode === m
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/30 text-muted-foreground"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Right toggle */}
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-5 h-12 items-center justify-center bg-muted/40 border border-border/30 rounded-l-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          style={{ right: rightOpen ? "352px" : 0 }}
        >
          {rightOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Right panel – Chat */}
        <div
          className={`hidden md:flex flex-col transition-all duration-500 ${
            rightOpen ? "w-[352px] p-4" : "w-0 p-0 overflow-hidden"
          }`}
        >
          {rightOpen && <ChatPanel messages={messages} onSend={handleSend} />}
        </div>
      </div>

      {/* Mobile chat */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[45vh] glass-panel rounded-t-2xl z-20 flex flex-col">
        <ChatPanel messages={messages} onSend={handleSend} />
      </div>

      <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Index;
