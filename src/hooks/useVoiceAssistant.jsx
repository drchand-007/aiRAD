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
  
//   // --- MOBILE OPTIMIZATION REFS ---
//   const isListeningRef = useRef(false); // Tracks if user WANTS to listen
//   const restartTimerRef = useRef(null); // Debounces restarts

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
//     recognition.lang = 'en-US'; // Explicitly set language

//     recognition.onstart = () => {
//       setVoiceStatus('listening');
//       isListeningRef.current = true; // Mark intent as active
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
//         // We got a final result. 
//         // Stop the mic briefly to process. This helps delineate commands on mobile.
//         // The 'onend' handler will restart it immediately because isListeningRef is true.
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
        
//         // We do NOT set 'idle' here because we want to keep listening.
//         // 'onend' will trigger and restart the mic, setting status back to 'listening'.
//         // If we set 'idle' here, it might flash 'idle' before 'listening' comes back.
//       }
//     };

//     recognition.onend = () => {
//       // --- MOBILE OPTIMIZATION: AUTO-RESTART ---
//       if (isListeningRef.current) {
//         console.log("Mic ended but intent is active. Restarting...");
//         if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        
//         // Small delay to prevent CPU thrashing if mic fails instantly
//         restartTimerRef.current = setTimeout(() => {
//             try {
//                 if (recognitionRef.current) recognitionRef.current.start();
//             } catch (e) {
//                 console.warn("Restart failed:", e);
//                 setVoiceStatus('idle');
//                 isListeningRef.current = false; // Give up if hard fail
//             }
//         }, 100);
//       } else {
//         // Genuine stop
//         setVoiceStatus('idle');
//         setInterimTranscript('');
//       }
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error", event.error);
      
//       // Ignore 'no-speech' as it happens frequently on mobile silence
//       if (event.error === 'no-speech') {
//           return;
//       }

//       if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//           setError(`Microphone access denied.`);
//           isListeningRef.current = false; // Stop trying to restart
//           setVoiceStatus('idle');
//       } else {
//           // For network or other errors, let onend handle the restart
//           setError(`Speech error: ${event.error}`);
//       }
//     };
    
//     // Cleanup on unmount
//     return () => {
//       isListeningRef.current = false; // Stop auto-restart loop
//       if(recognitionRef.current) {
//         recognitionRef.current.stop();
//         // We don't nullify immediately to avoid race conditions in timeouts
//       }
//       if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
//     }
//   }, [geminiTools]); // Only re-run if geminiTools (the prop) changes

//   const handleToggleListening = useCallback(() => {
//     if (!recognitionRef.current) {
//       toast.error("Voice dictation is not supported.");
//       return;
//     }
    
//     if (isListeningRef.current) {
//       // User explicitly wants to STOP
//       isListeningRef.current = false;
//       recognitionRef.current.stop();
//       if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
//       setVoiceStatus('idle');
//     } else {
//       // User explicitly wants to START
//       try {
//         recognitionRef.current.start();
//         isListeningRef.current = true;
//         setVoiceStatus('listening'); // Immediate feedback
//       } catch (e) {
//         console.error("Start Error:", e);
//       }
//     }
//   }, []);

//   return { 
//     voiceStatus, 
//     interimTranscript, 
//     error, 
//     isDictationSupported, 
//     handleToggleListening 
//   };
// };


// src/hooks/useVoiceAssistant.jsx
// src/hooks/useVoiceAssistant.jsx
// src/hooks/useVoiceAssistant.jsx


//    2.

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { toast } from 'react-hot-toast';
// import { parseLocalIntent } from '../lib/localIntentParser'; // Add this

// // --- HELPER: EXPONENTIAL BACKOFF FETCH ---
// const fetchWithBackoff = async (url, options, retries = 3, initialDelay = 2000) => {
//   let currentDelay = initialDelay;

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, options);

//       if (response.ok) return response;

//       if (response.status === 429) {
//         console.warn(`Hit Rate Limit (429). Retrying in ${currentDelay}ms... (Attempt ${i + 1}/${retries})`);
//         await new Promise(resolve => setTimeout(resolve, currentDelay));
//         currentDelay *= 2; 
//         continue; 
//       }

//       throw new Error(`API Error: ${response.status} ${response.statusText}`);

//     } catch (error) {
//       if (i === retries - 1) throw error; 
//       if (error.message.includes('API Error')) throw error; 
//     }
//   }
// };

// /**
//  * Calls the Gemini API with the user's transcript and our list of tools.
//  */
// const callGeminiWithFunctions = async (transcript, geminiTools) => {
//   if (!transcript || transcript.trim().length < 2) return null;

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
//     const response = await fetchWithBackoff(apiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     const data = await response.json();

//     // --- TOKEN TRACKING LOGIC ---
//     if (data.usageMetadata) {
//         const { promptTokenCount, candidatesTokenCount, totalTokenCount } = data.usageMetadata;
//         console.log("📊 Token Usage (Function Check):", {
//             input: promptTokenCount,
//             output: candidatesTokenCount,
//             total: totalTokenCount
//         });
//         // Optional: Show toast for visibility during dev
//         // toast.success(`Tokens used: ${totalTokenCount}`); 
//     }

//     return data;

//   } catch (error) {
//     console.error("Failed to call Gemini after retries:", error);
//     toast.error("System busy. Please try again in a moment.");
//     return null;
//   }
// };

// const getCorrectedTranscript = async (transcript) => {
//   const prompt = `You are an expert medical transcriptionist. Correct any spelling or grammatical errors in the following text, paying close attention to radiological and medical terminology. Return only the corrected text. Text to correct: '${transcript}'`;
  
//   const payload = { contents: [{ role: "user", parts: [{ "text": prompt }] }] };
//   const model = 'gemini-flash-latest';
//   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//   try {
//     const response = await fetchWithBackoff(apiUrl, { 
//       method: 'POST', 
//       headers: { 'Content-Type': 'application/json' }, 
//       body: JSON.stringify(payload) 
//     });
    
//     const data = await response.json();

//     // --- TOKEN TRACKING LOGIC ---
//     if (data.usageMetadata) {
//         const { promptTokenCount, candidatesTokenCount, totalTokenCount } = data.usageMetadata;
//         console.log("📊 Token Usage (Dictation):", {
//             input: promptTokenCount,
//             output: candidatesTokenCount,
//             total: totalTokenCount
//         });
//         toast('Tokens: ' + totalTokenCount, { icon: '🪙', duration: 2000 });
//     }
    
//     const correctedText = data.candidates?.[0]?.content.parts?.[0]?.text;
//     return correctedText || transcript;
//   } catch (error) {
//     console.warn("Correction failed, using original text:", error);
//     return transcript; 
//   }
// };


// export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText }) => {
//   const [voiceStatus, setVoiceStatus] = useState('idle'); 
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [error, setError] = useState(null);
//   const [isDictationSupported, setIsDictationSupported] = useState(true);

//   const recognitionRef = useRef(null);
  
//   const isListeningRef = useRef(false); 
//   const transcriptBufferRef = useRef(''); 
//   const silenceTimerRef = useRef(null); 
//   const restartTimerRef = useRef(null); 
//   const isProcessingRef = useRef(false); 

//   const onFunctionCallRef = useRef(onFunctionCall);
//   const onPlainTextRef = useRef(onPlainText);

//   useEffect(() => {
//     onFunctionCallRef.current = onFunctionCall;
//     onPlainTextRef.current = onPlainText;
//   }, [onFunctionCall, onPlainText]);

//   const processFinalBuffer = async () => {
//     if (isProcessingRef.current) return;
    
//     const fullText = transcriptBufferRef.current.trim();
//     if (!fullText) return;

//     console.log("Processing full text:", fullText);
//     isProcessingRef.current = true; 
//     isListeningRef.current = false; 
    
//     if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
//     if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

//     if (recognitionRef.current) {
//         try { recognitionRef.current.abort(); } catch (e) { }
//     }
    
//     setVoiceStatus('processing');
//     setInterimTranscript('');
//     transcriptBufferRef.current = '';

//   try {
//         // ============================================================
//         // 🚀 OPTIMIZATION: LOCAL FIRST
//         // ============================================================
//         console.log("⚡ Checking local intents for:", fullText);
//         const localAction = parseLocalIntent(fullText);

//         if (localAction) {
//             console.log("⚡ Local Intent Matched:", localAction);
            
//             // Execute locally immediately
//             onFunctionCallRef.current(localAction);
            
//             setVoiceStatus('idle');
//             isProcessingRef.current = false;
//             return; // STOP HERE! No API call made.
//         }
//         // ============================================================

//         // If no local command matched, THEN we call Gemini
//         // We can also optimize Dictation here:
//         const isCommand = fullText.startsWith("ask") || fullText.startsWith("hey");
        
//         if (isCommand) {
//              const result = await callGeminiWithFunctions(fullText, geminiTools);
//              // ... existing result handling ...
//              if (result && result.candidates) {
//                  // ... handle tool call ...
//              }
//         } else {
//              // Pure Dictation Fallback - Uses pure AI correction (optional)
//              // Or skip AI entirely for simple dictation to save money:
//              // onPlainTextRef.current(fullText); 
             
//              // Current Logic:
//              const correctedText = await getCorrectedTranscript(fullText);
//              onPlainTextRef.current(correctedText);
//         }
//         setVoiceStatus('idle');

//     } catch (e) {
//         console.error("Processing error:", e);
//         // Fallback to plain text if everything fails
//         onPlainTextRef.current(fullText);
//         setVoiceStatus('idle');
//     } finally {
//         isProcessingRef.current = false; 
//     }
//   };

//   useEffect(() => {
//     if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
//       setError("Microphone requires HTTPS.");
//       setIsDictationSupported(false);
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setIsDictationSupported(false);
//       setError("Browser not supported.");
//       return;
//     }

//     recognitionRef.current = new SpeechRecognition();
//     const recognition = recognitionRef.current;
    
//     recognition.continuous = true; 
//     recognition.interimResults = true;
//     recognition.lang = 'en-US'; 
//     recognition.maxAlternatives = 1; 

//     recognition.onstart = () => {
//       console.log("Mic started");
//       setVoiceStatus('listening');
//       isListeningRef.current = true; 
//       setError(null);
//     };

//     recognition.onresult = (event) => {
//       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

//       let finalChunk = '';
//       let currentInterim = '';

//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) {
//           finalChunk += event.results[i][0].transcript;
//         } else {
//           currentInterim += event.results[i][0].transcript;
//         }
//       }

//       if (finalChunk) {
//           transcriptBufferRef.current += ' ' + finalChunk.trim();
//       }

//       const displayObj = (transcriptBufferRef.current + ' ' + currentInterim).trim();
//       setInterimTranscript(displayObj.slice(-50)); 

//       silenceTimerRef.current = setTimeout(() => {
//           if (isListeningRef.current && !isProcessingRef.current) { 
//               processFinalBuffer();
//           }
//       }, 1200); 
//     };

//     recognition.onend = () => {
//       if (transcriptBufferRef.current.trim().length > 2 && isListeningRef.current && !isProcessingRef.current) {
//           processFinalBuffer();
//           return;
//       }

//       if (isListeningRef.current && !isProcessingRef.current) {
//         if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
//         restartTimerRef.current = setTimeout(() => {
//             try {
//                 if (recognitionRef.current && isListeningRef.current && !isProcessingRef.current) {
//                     recognitionRef.current.start();
//                 }
//             } catch (e) {}
//         }, 100); 
//       } else {
//         setVoiceStatus('idle');
//         setInterimTranscript('');
//       }
//     };

//     recognition.onerror = (event) => {
//       if (event.error === 'no-speech') return; 
//       if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//           setError(`Mic access blocked.`);
//           isListeningRef.current = false; 
//           setVoiceStatus('idle');
//       } 
//     };
    
//     return () => {
//       isListeningRef.current = false; 
//       if(recognitionRef.current) {
//           try { recognitionRef.current.abort(); } catch(e){}
//       }
//       if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
//       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
//     }
//   }, [geminiTools]); 

//   const handleToggleListening = useCallback(() => {
//     if (!recognitionRef.current) {
//       toast.error(error || "Voice dictation is not supported.");
//       return;
//     }
    
//     if (isListeningRef.current) {
//       console.log("User clicked STOP");
//       isListeningRef.current = false; 
      
//       if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
//       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
//       try { recognitionRef.current.stop(); } catch (e) {}
//       processFinalBuffer();
      
//     } else {
//       console.log("User clicked START");
//       transcriptBufferRef.current = ''; 
//       isProcessingRef.current = false; 
//       setError(null);
      
//       try { recognitionRef.current.abort(); } catch (e) { }

//       setTimeout(() => {
//           try {
//             recognitionRef.current.start();
//             isListeningRef.current = true;
//             setVoiceStatus('listening'); 
//           } catch (e) {
//             isListeningRef.current = true;
//             setVoiceStatus('listening');
//           }
//       }, 50);
//     }
//   }, [error]);

//   return { 
//     voiceStatus, 
//     interimTranscript, 
//     error, 
//     isDictationSupported, 
//     handleToggleListening 
//   };
// };




//3.....

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { toast } from 'react-hot-toast';
// import { parseLocalIntent } from '../lib/localIntentParser'; // Ensure path is correct

// // --- Helper: Fetch with Backoff (Keep existing) ---
// const fetchWithBackoff = async (url, options, retries = 3, initialDelay = 2000) => {
//   let currentDelay = initialDelay;
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, options);
//       if (response.ok) return response;
//       if (response.status === 429) {
//         await new Promise(resolve => setTimeout(resolve, currentDelay));
//         currentDelay *= 2; 
//         continue; 
//       }
//       throw new Error(`API Error: ${response.status} ${response.statusText}`);
//     } catch (error) {
//       if (i === retries - 1) throw error; 
//     }
//   }
// };

// const callGeminiWithFunctions = async (transcript, geminiTools) => {
//   if (!transcript || transcript.trim().length < 2) return null;
//   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   const model = 'gemini-2.5-flash'; // Use 1.5 Flash for tools
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//   const prompt = `
//     You are a voice assistant for a radiology reporting tool.
//     The user said: "${transcript}"
//     Analyze the user's intent. If their request matches one of the available tools,
//     call that function. If they are just dictating, do not call any function.
//   `;

//   const payload = {
//     "contents": [{ "role": "user", "parts": [{ "text": prompt }] }],
//     "tools": geminiTools,
//     "tool_config": { "function_calling_config": { "mode": "AUTO" } }
//   };

//   try {
//     const response = await fetchWithBackoff(apiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
//     return await response.json();
//   } catch (error) {
//     console.error("Failed to call Gemini:", error);
//     return null;
//   }
// };

// const getCorrectedTranscript = async (transcript) => {
//   // ... (Keep your existing implementation)
//   return transcript; // Simplified for this snippet, keep your original logic
// };

// // --- UPDATED HOOK ---
// // Added 'userMacros' to props
// export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText, userMacros }) => {
//   const [voiceStatus, setVoiceStatus] = useState('idle'); 
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [error, setError] = useState(null);
//   const [isDictationSupported, setIsDictationSupported] = useState(true);

//   const recognitionRef = useRef(null);
//   const isListeningRef = useRef(false); 
//   const transcriptBufferRef = useRef(''); 
//   const silenceTimerRef = useRef(null); 
//   const isProcessingRef = useRef(false); 

//   const onFunctionCallRef = useRef(onFunctionCall);
//   const onPlainTextRef = useRef(onPlainText);
//   const userMacrosRef = useRef(userMacros || []); // Ref for macros
//   const processedChunksRef = useRef(0); // <--- ADD THIS LINE
//   const sessionTextRef = useRef(''); // <--- ADD THIS: Tracks text for the current mic session

//   useEffect(() => {
//     onFunctionCallRef.current = onFunctionCall;
//     onPlainTextRef.current = onPlainText;
//     userMacrosRef.current = userMacros || []; // Update ref when props change
//   }, [onFunctionCall, onPlainText, userMacros]);

//   const processFinalBuffer = async () => {
//     if (isProcessingRef.current) return;
    
//     const fullText = transcriptBufferRef.current.trim();
//     if (!fullText) return;

//     isProcessingRef.current = true;
//     if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
    
//     setVoiceStatus('processing');
//     setInterimTranscript('');
//     transcriptBufferRef.current = '';

//     try {
//         // 1. LOCAL INTENT CHECK (Includes User Macros via ref)
//         console.log("Checking local intents for:", fullText);
//         const localAction = parseLocalIntent(fullText, userMacrosRef.current);

//         if (localAction) {
//             console.log("⚡ Local Action Triggered:", localAction);
//             onFunctionCallRef.current(localAction);
//             setVoiceStatus('idle');
//         } 
//         // 2. CLOUD FALLBACK
//         else {
//             const isCommand = /^(ask|hey|perform|run|do)/i.test(fullText);
            
//             if (isCommand) {
//                  const result = await callGeminiWithFunctions(fullText, geminiTools);
//                  const functionCall = result?.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;
                 
//                  if (functionCall) {
//                      onFunctionCallRef.current(functionCall);
//                  } else {
//                      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
//                      if(text) onPlainTextRef.current(text);
//                  }
//             } else {
//                  // Standard Dictation
//                  onPlainTextRef.current(fullText);
//             }
//             setVoiceStatus('idle');
//         }
//     } catch (e) {
//         console.error("Processing error:", e);
//         onPlainTextRef.current(fullText);
//         setVoiceStatus('idle');
//     } finally {
//         isProcessingRef.current = false; 
//         if (isListeningRef.current && recognitionRef.current) {
//             try { recognitionRef.current.start(); } catch(e){}
//             setVoiceStatus('listening');
//         }
//     }
//   };

//   // ... (Keep existing SpeechRecognition useEffect logic exactly as is) ...
//   // Ensure you include the SpeechRecognition setup here (omitted for brevity but assume it's the same as your file)
  
//   // Minimal setup for context:
//   // useEffect(() => {
//   //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   //   if (!SpeechRecognition) { setIsDictationSupported(false); return; }
//   //   recognitionRef.current = new SpeechRecognition();
//   //   recognitionRef.current.continuous = true;
//   //   recognitionRef.current.interimResults = true;
//   //   recognitionRef.current.lang = 'en-US';

//   //   recognitionRef.current.onstart = () => { 
//   //     setVoiceStatus('listening'); 
//   //     isListeningRef.current = true; 
//   //   processedChunksRef.current = 0; // <--- ADD THIS: Reset index on every start
//   //   sessionTextRef.current = ''; // Reset deduplication tracker
//   //   };
//   // recognitionRef.current.onresult = (event) => {
//   //     if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

//   //     // 1. Reconstruct the full text the browser *currently* sees for this session
//   //     // We loop from 0 to capture everything, ignoring the buggy resultIndex
//   //     let currentSessionFinal = '';
//   //     let currentInterim = '';

//   //     for (let i = 0; i < event.results.length; ++i) {
//   //       if (event.results[i].isFinal) {
//   //         currentSessionFinal += event.results[i][0].transcript;
//   //       } else {
//   //         currentInterim += event.results[i][0].transcript;
//   //       }
//   //     }

//   //     // 2. Calculate the "New" text by comparing it to what we processed last time
//   //     // This works even if Android sends the whole string again (the "Echo" bug)
//   //     if (currentSessionFinal.length > sessionTextRef.current.length) {
//   //         const newText = currentSessionFinal.slice(sessionTextRef.current.length);
          
//   //         if (newText.trim().length > 0) {
//   //            transcriptBufferRef.current += ' ' + newText.trim();
//   //         }
          
//   //         // Update our tracker so we know we've processed this part
//   //         sessionTextRef.current = currentSessionFinal;
//   //     }

//   //     // 3. Update UI
//   //     const displayObj = (transcriptBufferRef.current + ' ' + currentInterim).trim();
//   //     setInterimTranscript(displayObj.slice(-100)); 

//   //     // 4. Silence Timer
//   //     silenceTimerRef.current = setTimeout(() => {
//   //         if (isListeningRef.current && !isProcessingRef.current) { 
//   //             processFinalBuffer();
//   //         }
//   //     }, 1200); 
//   //   };
//   //   recognitionRef.current.onerror = (e) => { if(e.error !== 'no-speech') console.error(e); };
//   //   return () => { if(recognitionRef.current) recognitionRef.current.abort(); };
//   // }, []);
//   // Replace the LAST useEffect in src/hooks/useVoiceAssistant.jsx with this:

//   // Replace the LAST useEffect in src/hooks/useVoiceAssistant.jsx with this:

//   useEffect(() => {
//     // 1. Check Browser Support
//     if (!('webkitSpeechRecognition' in window)) {
//       console.error("Web Speech API not supported.");
//       return;
//     }

//     const SpeechRecognition = window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = true;
//     recognitionRef.current.interimResults = true;
//     recognitionRef.current.lang = 'en-US';

//     // TRACKER: Stores the last text we processed to detect duplicates
//     let lastSeenSessionText = "";

//     recognitionRef.current.onstart = () => {
//       console.log("Mic started");
//       setVoiceStatus('listening');
//       isListeningRef.current = true;
//       lastSeenSessionText = ""; // RESET tracker on start
//       setError(null);
//     };

//     recognitionRef.current.onresult = (event) => {
//       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

//       let currentSessionTranscript = "";
//       let currentInterim = "";

//       // 1. EXTRACT: Get the full text currently in the browser's buffer
//       for (let i = 0; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) {
//           currentSessionTranscript += event.results[i][0].transcript;
//         } else {
//           currentInterim += event.results[i][0].transcript;
//         }
//       }

//       // 2. NORMALIZE: Clean spaces for comparison
//       // We compare the raw strings to catch the "Laddering" bug
//       const normalizedCurrent = currentSessionTranscript.trim();
//       const normalizedLast = lastSeenSessionText.trim();

//       // 3. DEDUPLICATE: Check if the new text is just an extension of the old text
//       if (normalizedCurrent.length > normalizedLast.length) {
        
//         // Check if the NEW text starts with the OLD text (e.g. "Hi this" starts with "Hi")
//         if (normalizedCurrent.startsWith(normalizedLast)) {
//            // YES: It's the Android Ladder Bug. 
//            // We only want the *new* part (the suffix).
//            const newPart = normalizedCurrent.slice(normalizedLast.length);
//            if (newPart.trim()) {
//              transcriptBufferRef.current += ' ' + newPart.trim();
//            }
//         } else {
//            // NO: The browser reset its buffer (New sentence). 
//            // We append the whole thing.
//            transcriptBufferRef.current += ' ' + normalizedCurrent;
//         }

//         // Update the tracker so we don't add this part again
//         lastSeenSessionText = normalizedCurrent;
//       }

//       // 4. UPDATE UI
//       const displayObj = (transcriptBufferRef.current + ' ' + currentInterim).trim();
//       setInterimTranscript(displayObj.slice(-100));

//       // 5. SILENCE TIMER
//       silenceTimerRef.current = setTimeout(() => {
//         if (isListeningRef.current && !isProcessingRef.current) {
//           processFinalBuffer();
//           // Optional: Reset tracker after processing (depends on flow preference)
//           // lastSeenSessionText = ""; 
//         }
//       }, 1200);
//     };

//     recognitionRef.current.onerror = (e) => {
//       if (e.error !== 'no-speech') {
//         console.error("Speech Error:", e);
//       }
//     };

//     recognitionRef.current.onend = () => {
//       // Auto-restart logic for mobile which often kills the mic automatically
//       if (isListeningRef.current) {
//         try {
//             recognitionRef.current.start();
//         } catch(e) { /* ignore */ }
//       } else {
//         setVoiceStatus('idle');
//       }
//     };

//     return () => {
//       if (recognitionRef.current) recognitionRef.current.abort();
//     };
//   }, []);

//   const handleToggleListening = useCallback(() => {
//     if (!recognitionRef.current) return;
//     if (isListeningRef.current) {
//       isListeningRef.current = false;
//       recognitionRef.current.stop();
//       processFinalBuffer();
//       setVoiceStatus('idle');
//     } else {
//       transcriptBufferRef.current = '';
//       recognitionRef.current.start();
//       isListeningRef.current = true;
//       setVoiceStatus('listening');
//     }
//   }, []);

//   return { voiceStatus, interimTranscript, error, isDictationSupported, handleToggleListening };
// };



//4.... Mobile Repetetion fixed...

// src/hooks/useVoiceAssistant.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { parseLocalIntent } from '../lib/localIntentParser'; 

// --- Helper: Fetch with Backoff ---
const fetchWithBackoff = async (url, options, retries = 3, initialDelay = 2000) => {
  let currentDelay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429) {
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
    console.error("Failed to call Gemini:", error);
    return null;
  }
};

export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText, userMacros }) => {
  const [voiceStatus, setVoiceStatus] = useState('idle'); 
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isDictationSupported, setIsDictationSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); // User's intent to keep mic open
  const mainBufferRef = useRef(''); // Stores commited text from previous sentences
  const currentSentenceRef = useRef(''); // Stores the result of the *current* mic session
  const processingTimerRef = useRef(null);

  const onFunctionCallRef = useRef(onFunctionCall);
  const onPlainTextRef = useRef(onPlainText);
  const userMacrosRef = useRef(userMacros || []); 

  useEffect(() => {
    onFunctionCallRef.current = onFunctionCall;
    onPlainTextRef.current = onPlainText;
    userMacrosRef.current = userMacros || []; 
  }, [onFunctionCall, onPlainText, userMacros]);

  // --- PROCESSING LOGIC ---
  const processBuffer = async () => {
    const fullText = mainBufferRef.current.trim();
    if (!fullText) return;

    // Reset buffer immediately to prevent double-processing
    mainBufferRef.current = '';

    try {
        setVoiceStatus('processing');
        
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
                     if(text) onPlainTextRef.current(text);
                 }
            } else {
                 onPlainTextRef.current(fullText);
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
    // 1. Check Browser Support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Web Speech API not supported.");
      setIsDictationSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // === CRITICAL FIX: DISABLE CONTINUOUS MODE ===
    // This forces the browser to finalize and stop after every sentence (silence).
    // This physically prevents the buffer from accumulating duplicates ("laddering").
    // We will manually restart it in 'onend' to emulate a continuous experience.
    recognitionRef.current.continuous = false; 
    
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setVoiceStatus('listening');
      isListeningRef.current = true;
      currentSentenceRef.current = ''; // Reset current sentence buffer
      setError(null);
    };

    recognitionRef.current.onresult = (event) => {
      // With continuous=false, we usually get index 0. We take the latest.
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      // If we got a final result, store it
      if (final) {
          currentSentenceRef.current = final;
      }

      setInterimTranscript(interim);
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
      // 1. COMMIT: If we caught a sentence, add it to main buffer
      if (currentSentenceRef.current) {
          const text = currentSentenceRef.current.trim();
          if (text) {
             mainBufferRef.current += ' ' + text;
             
             // Debounce processing slightly so we can batch if needed, 
             // but usually we process immediately on silence.
             if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
             processingTimerRef.current = setTimeout(processBuffer, 100);
          }
          currentSentenceRef.current = ''; // Clear for next sentence
      }

      // 2. RESTART: If user still wants to listen, start again immediately
      if (isListeningRef.current) {
        try {
            recognitionRef.current.start();
        } catch(e) { 
            // Ignored: sometimes browser fires onend before it's fully ready to restart
            setTimeout(() => {
                if(isListeningRef.current && recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch(e){}
                }
            }, 100);
        }
      } else {
        setVoiceStatus('idle');
      }
    };

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListeningRef.current) {
      // Stop
      isListeningRef.current = false;
      recognitionRef.current.stop(); // This triggers onend -> commits text -> stops loop
    } else {
      // Start
      mainBufferRef.current = '';
      currentSentenceRef.current = '';
      recognitionRef.current.start();
      isListeningRef.current = true;
      setVoiceStatus('listening');
    }
  }, []);

  return { voiceStatus, interimTranscript, error, isDictationSupported, handleToggleListening };
};




//5. Whisper Model Trial - Working.
// src/hooks/useVoiceAssistant.jsx

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { parseLocalIntent } from '../lib/localIntentParser'; 

// export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText, userMacros }) => {
//   const [voiceStatus, setVoiceStatus] = useState('loading'); // loading -> idle -> listening -> processing
//   const [interimTranscript, setInterimTranscript] = useState('');
  
//   const workerRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);
//   const chunksRef = useRef([]);

//   const onFunctionCallRef = useRef(onFunctionCall);
//   const onPlainTextRef = useRef(onPlainText);
//   const userMacrosRef = useRef(userMacros || []);

//   useEffect(() => {
//     onFunctionCallRef.current = onFunctionCall;
//     onPlainTextRef.current = onPlainText;
//     userMacrosRef.current = userMacros || [];
//   }, [onFunctionCall, onPlainText, userMacros]);

//   // --- 1. INITIALIZE WORKER ---
//   useEffect(() => {
//     workerRef.current = new Worker(new URL('../workers/whisper.worker.js', import.meta.url), {
//       type: 'module'
//     });

//     workerRef.current.onmessage = (event) => {
//       const { status, text, error } = event.data;

//       if (status === 'ready') {
//         setVoiceStatus('idle');
//         console.log("✅ Whisper Model Ready");
//       }
      
//       if (status === 'complete') {
//         console.log("✅ AI Output:", text);
//         if (!text || text.trim() === '') {
//            console.warn("⚠️ AI returned empty text. (Audio might be silent)");
//         }
//         handleFinalText(text);
//         setVoiceStatus('idle');
//       }

//       if (status === 'error') {
//         console.error("❌ Worker Error:", error);
//         setVoiceStatus('error');
//       }
//     };

//     workerRef.current.postMessage({ type: 'load' });

//     return () => workerRef.current.terminate();
//   }, []);

//   // --- 2. HANDLE RESULTS ---
//   const handleFinalText = (text) => {
//     const cleanText = text ? text.trim() : "";
//     if (!cleanText) return;

//     // A. Check Local Macros
//     const localAction = parseLocalIntent(cleanText, userMacrosRef.current);
//     if (localAction) {
//         onFunctionCallRef.current(localAction);
//     } else {
//         // B. Standard Dictation
//         onPlainTextRef.current(cleanText);
//     }
//   };

//   // --- 3. START RECORDING ---
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream; // Store stream to stop it later

//       // Detect supported mime type
//       const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      
//       mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
//       chunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (e) => {
//         if (e.data.size > 0) chunksRef.current.push(e.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         // --- CRITICAL FIX START ---
//         // 1. Create Blob from captured chunks
//         const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current.mimeType });
//         console.log(`🎤 Audio Captured: ${blob.size} bytes`);

//         if (blob.size < 1000) {
//             console.warn("⚠️ Audio file too small, possible silence.");
//         }

//         // 2. Process the blob
//         processAudioBlob(blob);
        
//         // 3. NOW it is safe to kill the microphone
//         if (streamRef.current) {
//             streamRef.current.getTracks().forEach(track => track.stop());
//             streamRef.current = null;
//         }
//         // --- CRITICAL FIX END ---
//       };

//       mediaRecorderRef.current.start();
//       setVoiceStatus('listening');
//     } catch (err) {
//       console.error("Mic access denied", err);
//       setVoiceStatus('error');
//     }
//   };

//   // --- 4. STOP RECORDING ---
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop(); // This triggers onstop above
//       setVoiceStatus('processing');
//     }
//   };

//   // --- 5. ROBUST AUDIO PROCESSING (Resampling Fix) ---
//   const processAudioBlob = async (blob) => {
//     try {
//         // 1. Decode the audio at its native rate (e.g., 44k or 48k)
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const arrayBuffer = await blob.arrayBuffer();
//         const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);

//         // 2. Calculate the Ratio to target 16kHz
//         const targetSampleRate = 16000;
//         const offlineContext = new OfflineAudioContext(
//             1, // Mono
//             decodedAudio.duration * targetSampleRate,
//             targetSampleRate
//         );

//         // 3. Render the audio into the Offline Context (resampling happens here)
//         const source = offlineContext.createBufferSource();
//         source.buffer = decodedAudio;
//         source.connect(offlineContext.destination);
//         source.start(0);

//         const resampledBuffer = await offlineContext.startRendering();
        
//         // 4. Extract the resampled PCM data
//         const audioData = resampledBuffer.getChannelData(0);

//         console.log(`original rate: ${decodedAudio.sampleRate}, new rate: ${resampledBuffer.sampleRate}`);
//         console.log(`📡 Sending ${audioData.length} samples to Worker...`);

//         workerRef.current.postMessage({
//             type: 'transcribe',
//             audio: audioData
//         });

//     } catch (e) {
//         console.error("Audio Processing Failed:", e);
//         setVoiceStatus('error');
//     }
//   };

//   const handleToggleListening = useCallback(() => {
//     if (voiceStatus === 'listening') {
//       stopRecording();
//     } else if (voiceStatus === 'idle') {
//       startRecording();
//     }
//   }, [voiceStatus]);

//   return { 
//     voiceStatus, 
//     interimTranscript: voiceStatus === 'processing' ? 'Processing on device...' : '', 
//     isDictationSupported: true, 
//     handleToggleListening 
//   };
// };


//6. Qur like Voice

// src/hooks/useVoiceAssistant.jsx

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { parseLocalIntent } from '../lib/localIntentParser'; 

// // --- GEMINI HELPER (The "Brain" for Magic Mode) ---
// const callGeminiToFormat = async (rawText) => {
//   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   if (!apiKey) return rawText;

//   const prompt = `
//     You are a professional Radiologist's assistant.
//     The user is dictating findings in rough, short-hand notes.
    
//     Rule 1: Expand abbreviations and medical shorthand into full, professional sentences.
//     Rule 2: Fix any potential phonetic errors in medical terms.
//     Rule 3: Do NOT add introductions like "Here is the report". Just output the text.
//     Rule 4: If the input is already a command or clear sentence, keep it as is.
    
//     User Notes: "${rawText}"
    
//     Professional Output:
//   `;

//   try {
//     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
//     });
//     const data = await response.json();
//     return data?.candidates?.[0]?.content?.parts?.[0]?.text || rawText;
//   } catch (e) {
//     console.error("Gemini Formatting Failed:", e);
//     return rawText; 
//   }
// };

// export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText, userMacros, isMagicMode = false }) => {
//   const [voiceStatus, setVoiceStatus] = useState('loading'); 
//   const [interimTranscript, setInterimTranscript] = useState('');
  
//   const workerRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);
//   const chunksRef = useRef([]);

//   const onFunctionCallRef = useRef(onFunctionCall);
//   const onPlainTextRef = useRef(onPlainText);
//   const userMacrosRef = useRef(userMacros || []);
//   const isMagicModeRef = useRef(isMagicMode);

//   useEffect(() => {
//     onFunctionCallRef.current = onFunctionCall;
//     onPlainTextRef.current = onPlainText;
//     userMacrosRef.current = userMacros || [];
//     isMagicModeRef.current = isMagicMode;
//   }, [onFunctionCall, onPlainText, userMacros, isMagicMode]);

//   // --- 1. INITIALIZE WHISPER WORKER ---
//   useEffect(() => {
//     workerRef.current = new Worker(new URL('../workers/whisper.worker.js', import.meta.url), {
//       type: 'module'
//     });

//     workerRef.current.onmessage = async (event) => {
//       const { status, text, error } = event.data;

//       if (status === 'ready') {
//         setVoiceStatus('idle');
//         console.log("✅ Whisper Model Ready");
//       }
      
//       if (status === 'complete') {
//         const cleanText = text ? text.trim() : "";
//         console.log("✅ Whisper Output:", cleanText);

//         if (cleanText) {
//             // --- QUILLR LOGIC ---
//             if (isMagicModeRef.current) {
//                 setVoiceStatus('processing_ai');
//                 const formattedText = await callGeminiToFormat(cleanText);
//                 handleFinalResult(formattedText);
//             } else {
//                 handleFinalResult(cleanText);
//             }
//         } else {
//             console.warn("⚠️ AI returned empty text. (Audio might have been too quiet)");
//             setVoiceStatus('idle');
//         }
//       }

//       if (status === 'error') {
//         console.error("❌ Worker Error:", error);
//         setVoiceStatus('error');
//       }
//     };

//     workerRef.current.postMessage({ type: 'load' });

//     return () => workerRef.current.terminate();
//   }, []);

//   const handleFinalResult = (text) => {
//     const localAction = parseLocalIntent(text, userMacrosRef.current);
//     if (localAction) {
//         onFunctionCallRef.current(localAction);
//     } else {
//         onPlainTextRef.current(text);
//     }
//     setVoiceStatus('idle');
//   };

//   // --- 2. START RECORDING ---
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream; 

//       // Prefer standard webm
//       const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      
//       mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
//       chunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (e) => {
//         if (e.data.size > 0) chunksRef.current.push(e.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current.mimeType });
//         console.log(`🎤 Captured ${blob.size} bytes`);
//         processAudioBlob(blob);
        
//         // Cleanup stream
//         if (streamRef.current) {
//             streamRef.current.getTracks().forEach(track => track.stop());
//             streamRef.current = null;
//         }
//       };

//       mediaRecorderRef.current.start();
//       setVoiceStatus('listening');
//     } catch (err) {
//       console.error("Mic access denied", err);
//       setVoiceStatus('error');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setVoiceStatus('processing');
//     }
//   };

//   // --- 3. ROBUST AUDIO PROCESSING (The Fix) ---
//   const processAudioBlob = async (blob) => {
//     try {
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const arrayBuffer = await blob.arrayBuffer();
//         const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);

//         // === BUG FIX: Handle Infinity Duration ===
//         // On Android/Chrome, decodedAudio.duration is often 'Infinity'.
//         // We must calculate it manually: length / sampleRate
//         let duration = decodedAudio.duration;
//         if (!duration || duration === Infinity) {
//              duration = decodedAudio.length / decodedAudio.sampleRate;
//              console.log("⚠️ Fixed Infinity Duration:", duration);
//         }

//         const targetSampleRate = 16000;
//         const offlineContext = new OfflineAudioContext(
//             1, // Mono
//             duration * targetSampleRate,
//             targetSampleRate
//         );

//         const source = offlineContext.createBufferSource();
//         source.buffer = decodedAudio;
//         source.connect(offlineContext.destination);
//         source.start(0);

//         const resampledBuffer = await offlineContext.startRendering();
//         const audioData = resampledBuffer.getChannelData(0);

//         // === VOLUME CHECK ===
//         // Calculate RMS (Root Mean Square) to see if it's silent
//         let sum = 0;
//         for (let i = 0; i < audioData.length; i++) {
//             sum += audioData[i] * audioData[i];
//         }
//         const rms = Math.sqrt(sum / audioData.length);
//         console.log(`🔊 Audio RMS Level: ${rms.toFixed(5)}`);

//         if (rms < 0.001) {
//             console.warn("⚠️ Audio is extremely quiet (Silent). Check microphone.");
//         }

//         workerRef.current.postMessage({ type: 'transcribe', audio: audioData });

//     } catch (e) {
//         console.error("Audio Processing Failed:", e);
//         setVoiceStatus('error');
//     }
//   };

//   const handleToggleListening = useCallback(() => {
//     if (voiceStatus === 'listening') {
//       stopRecording();
//     } else if (voiceStatus === 'idle') {
//       startRecording();
//     }
//   }, [voiceStatus]);

//   return { 
//     voiceStatus, 
//     interimTranscript: voiceStatus === 'processing' ? 'Transcribing...' : (voiceStatus === 'processing_ai' ? 'Refining with AI...' : ''), 
//     isDictationSupported: true, 
//     handleToggleListening 
//   };
// };