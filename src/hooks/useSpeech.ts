import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeech({ onStart, onEnd }: UseSpeechOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        // Pick a good default English voice
        const preferred = available.find(
          (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("google")
        ) || available.find((v) => v.lang.startsWith("en")) || available[0];
        setSelectedVoice((prev) => prev || preferred?.name || "");
      }
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback(
    (text: string) => {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      utterance.onstart = () => {
        setIsSpeaking(true);
        onStart?.();
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    },
    [voices, selectedVoice, onStart, onEnd]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { voices, selectedVoice, setSelectedVoice, speak, stop, isSpeaking };
}
