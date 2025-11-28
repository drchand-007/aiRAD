// // src/hooks/useVoiceAssistant.jsx

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { toast } from 'react-hot-toast';

// /**
//  * Calls the Gemini API with the user's transcript and our list of tools.
//  */
// const callGeminiWithFunctions = async (transcript, geminiTools) => {
//   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   const model = 'gemini-2.5-flash';
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//   const prompt = `
//     You are a voice assistant for a radiology reporting tool.
//     The user said: "${transcript}"
//     Analyze the user's intent. If their request matches one of the available tools,
//     call that function. If they are just dictating, do not call any function.
//   `;

//   const payload = {
//     "contents": [
//       { "role": "user", "parts": [{ "text": prompt }] }
//     ],
//     "tools": geminiTools
//   };

//   try {
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} ${response.statusText}`);
//     }
//     return await response.json();

//   } catch (error) {
//     console.error("Failed to call Gemini:", error);
//     toast.error("Voice intent recognition failed.");
//     return null;
//   }
// };

// /**
//  * Gets a corrected transcript from the AI.
//  */
// const getCorrectedTranscript = async (transcript) => {
//   const prompt = `You are an expert medical transcriptionist. Correct any spelling or grammatical errors in the following text, paying close attention to radiological and medical terminology. Return only the corrected text. Text to correct: '${transcript}'`;
//   try {
//     const payload = { contents: [{ role: "user", parts: [{ "text": prompt }] }] };
//     const model = 'gemini-2.5-flash';
//     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//     const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//     if (!response.ok) {
//       console.error("API Error, falling back to original transcript");
//       return transcript;
//     }
//     const result = await response.json();
//     const correctedText = result.candidates?.[0]?.content.parts?.[0]?.text;
//     return correctedText || transcript;
//   } catch (error) {
//     console.error("Failed to get corrected transcript:", error);
//     return transcript;
//   }
// };


// /**
//  * A headless React hook to manage all voice assistant logic.
//  * @param {object} props
//  * @param {Array} props.geminiTools - The list of functions for Gemini to call.
//  * @param {Function} props.onFunctionCall - Callback to execute a function (e.g., analyzeImages).
//  * @param {Function} props.onPlainText - Callback to insert plain text into the editor.
//  */
// export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText }) => {
//   const [voiceStatus, setVoiceStatus] = useState('idle'); // 'idle', 'listening', 'processing'
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [error, setError] = useState(null);
//   const [isDictationSupported, setIsDictationSupported] = useState(true);

//   const recognitionRef = useRef(null);
//   const voiceStatusRef = useRef('idle');

//   // Use refs for callbacks to prevent stale closures in SpeechRecognition event handlers
//   const onFunctionCallRef = useRef(onFunctionCall);
//   const onPlainTextRef = useRef(onPlainText);

//   useEffect(() => {
//     onFunctionCallRef.current = onFunctionCall;
//     onPlainTextRef.current = onPlainText;
//   }, [onFunctionCall, onPlainText]);

//   // Update voiceStatusRef whenever voiceStatus changes
//   useEffect(() => {
//     voiceStatusRef.current = voiceStatus;
//   }, [voiceStatus]);

//   // Setup SpeechRecognition on mount
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setIsDictationSupported(false);
//       setError("Voice dictation is not supported by your browser.");
//       return;
//     }

//     recognitionRef.current = new SpeechRecognition();
//     const recognition = recognitionRef.current;
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onstart = () => {
//       setVoiceStatus('listening');
//     };

//     recognition.onresult = async (event) => {
//       let finalTranscript = '';
//       let currentInterim = '';
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) {
//           finalTranscript += event.results[i][0].transcript.trim();
//         } else {
//           currentInterim += event.results[i][0].transcript;
//         }
//       }
//       setInterimTranscript(currentInterim);

//       if (finalTranscript) {
//         // We got a final result, stop the mic and process
//         if (recognitionRef.current) {
//           recognitionRef.current.stop();
//         }
//         setVoiceStatus('processing');
//         setInterimTranscript('');

//         try {
//           const result = await callGeminiWithFunctions(finalTranscript, geminiTools);
//           if (!result) throw new Error("AI call returned null");

//           const functionCall = result.candidates?.[0]?.content.parts.find(p => p.functionCall)?.functionCall;

//           if (functionCall) {
//             onFunctionCallRef.current(functionCall);
//           } else {
//             const correctedText = await getCorrectedTranscript(finalTranscript);
//             onPlainTextRef.current(correctedText);
//           }
//         } catch (err) {
//           console.error("Error processing voice command:", err);
//           toast.error("Voice command failed.");
//           onPlainTextRef.current(finalTranscript); // Fallback to inserting raw text on error
//         }
//         setVoiceStatus('idle');
//       }
//     };

//     recognition.onend = () => {
//       setVoiceStatus('idle');
//       setInterimTranscript('');
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error", event.error);
//       setError(`Speech recognition error: ${event.error}`);
//       setVoiceStatus('idle');
//     };
    
//     // Cleanup on unmount
//     return () => {
//       if(recognitionRef.current) {
//         recognitionRef.current.stop();
//         recognitionRef.current = null;
//       }
//     }
//   }, [geminiTools]); // Only re-run if geminiTools (the prop) changes

//   const handleToggleListening = useCallback(() => {
//     if (!recognitionRef.current) {
//       toast.error("Voice dictation is not supported.");
//       return;
//     }
//     const currentStatus = voiceStatusRef.current;
//     if (currentStatus !== 'idle') {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//     }
//   }, []); // Empty dependency array is fine, it only uses refs.

//   return { 
//     voiceStatus, 
//     interimTranscript, 
//     error, 
//     isDictationSupported, 
//     handleToggleListening 
//   };
// };


// src/hooks/useVoiceAssistant.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Calls the Gemini API with the user's transcript and our list of tools.
 */
const callGeminiWithFunctions = async (transcript, geminiTools) => {
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
    "contents": [
      { "role": "user", "parts": [{ "text": prompt }] }
    ],
    "tools": geminiTools
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();

  } catch (error) {
    console.error("Failed to call Gemini:", error);
    toast.error("Voice intent recognition failed.");
    return null;
  }
};

/**
 * Gets a corrected transcript from the AI.
 */
const getCorrectedTranscript = async (transcript) => {
  const prompt = `You are an expert medical transcriptionist. Correct any spelling or grammatical errors in the following text, paying close attention to radiological and medical terminology. Return only the corrected text. Text to correct: '${transcript}'`;
  try {
    const payload = { contents: [{ role: "user", parts: [{ "text": prompt }] }] };
    const model = 'gemini-2.5-flash-native-audio';
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
      console.error("API Error, falling back to original transcript");
      return transcript;
    }
    const result = await response.json();
    const correctedText = result.candidates?.[0]?.content.parts?.[0]?.text;
    return correctedText || transcript;
  } catch (error) {
    console.error("Failed to get corrected transcript:", error);
    return transcript;
  }
};


/**
 * A headless React hook to manage all voice assistant logic.
 * @param {object} props
 * @param {Array} props.geminiTools - The list of functions for Gemini to call.
 * @param {Function} props.onFunctionCall - Callback to execute a function (e.g., analyzeImages).
 * @param {Function} props.onPlainText - Callback to insert plain text into the editor.
 */
export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText }) => {
  const [voiceStatus, setVoiceStatus] = useState('idle'); // 'idle', 'listening', 'processing'
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isDictationSupported, setIsDictationSupported] = useState(true);

  const recognitionRef = useRef(null);
  const voiceStatusRef = useRef('idle');
  
  // --- MOBILE OPTIMIZATION REFS ---
  const isListeningRef = useRef(false); // Tracks if user WANTS to listen
  const restartTimerRef = useRef(null); // Debounces restarts

  // Use refs for callbacks to prevent stale closures in SpeechRecognition event handlers
  const onFunctionCallRef = useRef(onFunctionCall);
  const onPlainTextRef = useRef(onPlainText);

  useEffect(() => {
    onFunctionCallRef.current = onFunctionCall;
    onPlainTextRef.current = onPlainText;
  }, [onFunctionCall, onPlainText]);

  // Update voiceStatusRef whenever voiceStatus changes
  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  // Setup SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsDictationSupported(false);
      setError("Voice dictation is not supported by your browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    // MOBILE OPTIMIZATION: Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // On mobile, 'continuous' can sometimes cause issues. 
    // If it fails repeatedly, consider setting this to false and restarting manually.
    recognition.continuous = true; 
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("Mic Started");
      setVoiceStatus('listening');
      isListeningRef.current = true;
      setError(null);
    };

    recognition.onresult = async (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.trim();
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);

      if (finalTranscript) {
        // On mobile, do NOT stop the mic. Just process text.
        // Stopping and restarting is expensive and error-prone on mobile.
        // We let the Keep-Alive handle the lifecycle.
        
        // Optionally pause UI feedback, but keep mic open
        // setVoiceStatus('processing'); 
        setInterimTranscript('');

        try {
          const result = await callGeminiWithFunctions(finalTranscript, geminiTools);
          if (!result) throw new Error("AI call returned null");

          const functionCall = result.candidates?.[0]?.content.parts.find(p => p.functionCall)?.functionCall;

          if (functionCall) {
            onFunctionCallRef.current(functionCall);
          } else {
            const correctedText = await getCorrectedTranscript(finalTranscript);
            onPlainTextRef.current(correctedText);
          }
        } catch (err) {
          console.error("Error processing voice command:", err);
          toast.error("Voice command failed.");
          onPlainTextRef.current(finalTranscript);
        }
        // Reset status to listening (visual feedback only)
        setVoiceStatus('listening');
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      
      // MOBILE FIX: Ignore 'no-speech' and 'network' errors to prevent stoppage
      if (event.error === 'no-speech') {
          return; 
      }
      if (event.error === 'network') {
          // Network flaky? Log it but let Keep-Alive restart
          console.warn("Network error detected. Attempting auto-restart.");
      }

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isListeningRef.current = false; // Hard stop
        setVoiceStatus('idle');
        setError("Microphone access denied.");
        toast.error("Mic access denied.");
      }
    };

    recognition.onend = () => {
      console.log("Mic Stopped. Intent:", isListeningRef.current);
      
      // --- MOBILE OPTIMIZATION: ROBUST KEEP-ALIVE ---
      if (isListeningRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        
        // Increase delay for mobile to prevent "rapid fire" restart crashes
        const restartDelay = isMobile ? 300 : 100;

        restartTimerRef.current = setTimeout(() => {
            try {
                // Check if already started to avoid "already started" error
                if (voiceStatus !== 'listening') {
                    console.log("Auto-restarting mic...");
                    recognition.start();
                }
            } catch (e) {
                console.warn("Restart failed:", e);
                // If it fails, try one more time with a longer delay, or reset
                // setVoiceStatus('idle'); 
                // isListeningRef.current = false; 
            }
        }, restartDelay); 
      } else {
        setVoiceStatus('idle');
        setInterimTranscript('');
      }
    };

    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, [geminiTools]);

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Voice dictation not initialized.");
      return;
    }

    // Toggle based on INTENT (ref), not just status
    if (isListeningRef.current) {
      // User wants to STOP
      isListeningRef.current = false;
      recognitionRef.current.stop();
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      setVoiceStatus('idle');
    } else {
      // User wants to START
      try {
        recognitionRef.current.start();
        isListeningRef.current = true;
        setVoiceStatus('listening'); 
      } catch (e) {
        console.error("Start Error:", e);
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

