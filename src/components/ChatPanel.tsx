import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSend: (text: string) => void;
}

const ChatPanel = ({ messages, onSend }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="glass-panel flex flex-col h-full animate-float" style={{ animationDelay: "1s" }}>
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">
          NEURAL LINK
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <p className="font-display text-[10px] tracking-[0.2em]">AWAITING INPUT</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-primary/10 border border-primary/20 text-foreground"
                : "bg-muted/40 border border-accent/10 text-foreground"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border/30 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_10px_hsl(195_100%_50%/0.15)] transition-all"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_hsl(195_100%_50%/0.3)] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
