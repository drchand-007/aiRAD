import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { parseLocalIntent } from '../lib/localIntentParser';

/**
 * Helper: Fetch with Exponential Backoff
 */
const fetchWithBackoff = async (url, options, retries = 3, initialDelay = 2000) => {
  let currentDelay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429) {
        console.warn(`Gemini API Rate Limit (429). Retrying in ${currentDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay *= 2;
        continue;
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
};

/**
 * Calls Gemini with Function Calling tools
 */
const callGeminiWithFunctions = async (transcript, geminiTools) => {
  if (!transcript || transcript.trim().length < 2) return null;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = 'gemini-2.5-flash';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
    You are a voice assistant for a radiology reporting tool.
    The user said: "${transcript}"
    Analyze the user's intent. If their request matches one of the available tools,
    call that function. If they are just dictating, do not call any function.
  `;

  const payload = {
    "contents": [{ "role": "user", "parts": [{ "text": prompt }] }],
    "tools": geminiTools,
    "tool_config": { "function_calling_config": { "mode": "AUTO" } }
  };

  try {
    const response = await fetchWithBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to call Gemini with functions:", error);
    return null;
  }
};

/**
 * Calls Gemini to format/expand shorthand medical text (Magic Mode)
 */
const callGeminiToFormat = async (rawText) => {
  if (!rawText || rawText.trim().length < 2) return rawText;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = 'gemini-2.5-flash';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
    You are a professional Radiologist's assistant.
    The user is dictating findings in rough, short-hand notes.
    
    Rule 1: Expand abbreviations and medical shorthand into full, professional sentences.
    Rule 2: Fix any potential phonetic errors in medical terms.
    Rule 3: Do NOT add introductions like "Here is the report". Just output the text.
    Rule 4: If the input is already a command or clear sentence, keep it as is.
    
    User Notes: "${rawText}"
    
    Professional Output:
  `;

  try {
    const response = await fetchWithBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || rawText;
  } catch (e) {
    console.error("Gemini Formatting Failed:", e);
    return rawText;
  }
};

/**
 * useVoiceAssistant Hook
 */
export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText, userMacros, isMagicMode = false }) => {
  const [voiceStatus, setVoiceStatus] = useState('idle'); // 'idle', 'listening', 'processing'
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isDictationSupported, setIsDictationSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isRecognitionActiveRef = useRef(false); // Tracks if the service is ACTUALLY running
  const isListeningRef = useRef(false);
  const mainBufferRef = useRef('');
  const currentSentenceRef = useRef('');
  const processingTimerRef = useRef(null);
  const lastProcessedIndexRef = useRef(-1); // Tracks which results have been processed

  const onFunctionCallRef = useRef(onFunctionCall);
  const onPlainTextRef = useRef(onPlainText);
  const userMacrosRef = useRef(userMacros || []);
  const isMagicModeRef = useRef(isMagicMode);

  useEffect(() => {
    onFunctionCallRef.current = onFunctionCall;
    onPlainTextRef.current = onPlainText;
    userMacrosRef.current = userMacros || [];
    isMagicModeRef.current = isMagicMode;
  }, [onFunctionCall, onPlainText, userMacros, isMagicMode]);

  const processBuffer = async () => {
    const fullText = mainBufferRef.current.trim();
    if (!fullText) return;

    // Reset buffer immediately
    mainBufferRef.current = '';

    try {
      setVoiceStatus('processing');
      console.log("Processing voice intent:", fullText);

      // 1. LOCAL INTENT CHECK
      const localAction = parseLocalIntent(fullText, userMacrosRef.current);
      if (localAction) {
        onFunctionCallRef.current(localAction);
      }
      // 2. CLOUD FALLBACK
      else {
        const isCommand = /^(ask|hey|perform|run|do)/i.test(fullText);
        if (isCommand) {
          const result = await callGeminiWithFunctions(fullText, geminiTools);
          const functionCall = result?.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;
          if (functionCall) {
            onFunctionCallRef.current(functionCall);
          } else {
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) onPlainTextRef.current(text);
          }
        } else {
          // Dictation
          if (isMagicModeRef.current) {
            const formatted = await callGeminiToFormat(fullText);
            onPlainTextRef.current(formatted);
          } else {
            onPlainTextRef.current(fullText);
          }
        }
      }
    } catch (e) {
      console.error("Processing error:", e);
      onPlainTextRef.current(fullText);
    } finally {
      if (isListeningRef.current) {
        setVoiceStatus('listening');
      } else {
        setVoiceStatus('idle');
      }
    }
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Web Speech API not supported.");
      setIsDictationSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    // BACK TO CONTINUOUS MODE for fluidity
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started");
      setVoiceStatus('listening');
      isListeningRef.current = true;
      isRecognitionActiveRef.current = true;
      currentSentenceRef.current = '';
      lastProcessedIndexRef.current = -1;
      setError(null);
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let newFinals = '';

      // Clear the silent timer as we have activity
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          // Only process this result if we haven't seen it before
          if (i > lastProcessedIndexRef.current) {
            newFinals += result[0].transcript;
            lastProcessedIndexRef.current = i;
          }
        } else {
          interim += result[0].transcript;
        }
      }

      if (newFinals) {
        mainBufferRef.current += ' ' + newFinals.trim();
      }

      setInterimTranscript(interim);

      // Start the "silence" timer to process what we have so far
      // Note: We don't stop the recognition here!
      if (mainBufferRef.current.trim()) {
        processingTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            processBuffer();
          }
        }, 1000); // 1 second of silence triggers processing
      }
    };

    recognitionRef.current.onerror = (e) => {
      if (e.error !== 'no-speech') {
        console.warn("Speech Error:", e.error);
        if (e.error === 'not-allowed') {
          setError('Microphone access denied');
          isListeningRef.current = false;
        }
      }
    };

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended (onend)");
      isRecognitionActiveRef.current = false;

      // If recognition ended prematurely but we still have an active user intent
      if (isListeningRef.current) {
        console.log("Restarting service to maintain continuous listening...");

        // Process any remaining buffer before restarting
        if (mainBufferRef.current.trim()) {
          processBuffer();
        }

        try {
          recognitionRef.current.start();
        } catch (e) {
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current && !isRecognitionActiveRef.current) {
              try { recognitionRef.current.start(); } catch (e) { }
            }
          }, 200);
        }
      } else {
        // Genuine stop - process final bit
        if (mainBufferRef.current.trim()) {
          processBuffer();
        }
        setVoiceStatus('idle');
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        isRecognitionActiveRef.current = false;
      }
    };
  }, []);

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListeningRef.current) {
      console.log("User requested stop via toggle");
      isListeningRef.current = false;
      if (isRecognitionActiveRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceStatus('idle');
    } else {
      console.log("User requested start via toggle");
      mainBufferRef.current = '';
      currentSentenceRef.current = '';
      lastProcessedIndexRef.current = -1;
      isListeningRef.current = true;
      setVoiceStatus('listening');

      try {
        if (!isRecognitionActiveRef.current) {
          recognitionRef.current.start();
        }
      } catch (e) {
        console.error("Mic start failed:", e);
        if (e.name === 'InvalidStateError') {
          console.warn("Recognition already starting or started.");
        } else {
          isListeningRef.current = false;
          setVoiceStatus('idle');
        }
      }
    }
  }, []);

  return {
    voiceStatus,
    interimTranscript,
    error,
    isDictationSupported,
    handleToggleListening
  };
};