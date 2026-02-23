import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseSpeechRecognitionOptions {
  onFinalTranscript: (transcript: string) => void;
  onInterimTranscript?: (transcript: string) => void;
}

export function useSpeechRecognition({
  onFinalTranscript,
  onInterimTranscript,
}: UseSpeechRecognitionOptions) {
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const [isListening, setIsListening] = useState(false);

  const initRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onFinalTranscript(finalTranscript.trim());
      } else if (interimTranscript && onInterimTranscript) {
        onInterimTranscript(interimTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        toast.error("Microphone permission denied.");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      isListeningRef.current = false;
      setIsListening(false);
    };

    return recognition;
  }, [onFinalTranscript, onInterimTranscript]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    if (recognitionRef.current && !isListening) {
      isListeningRef.current = true;
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
        console.warn("Recognition already started");
      }
    }
  }, [initRecognition, isListening]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  return { startListening, stopListening, isListening };
}
