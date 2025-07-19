import { useEffect, useRef, useState } from "react";

export default function useDictation({ onFinal }) {
  const [status, setStatus] = useState("idle"); // idle | listening
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => setStatus("listening");
    rec.onend = () => {
      setStatus("idle");
      setInterim("");
    };
    rec.onerror = () => setStatus("idle");

    rec.onresult = (evt) => {
      let finalT = "";
      let interimT = "";
      for (let i = evt.resultIndex; i < evt.results.length; i++) {
        const res = evt.results[i];
        if (res.isFinal) finalT += res[0].transcript;
        else interimT += res[0].transcript;
      }
      setInterim(interimT);
      if (finalT) onFinal(finalT);
    };

    recognitionRef.current = rec;
  }, [onFinal]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    status === "idle"
      ? recognitionRef.current.start()
      : recognitionRef.current.stop();
  };

  return { status, interim, toggle };
}
