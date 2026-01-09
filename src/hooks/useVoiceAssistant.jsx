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


import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { parseLocalIntent } from '../lib/localIntentParser'; // Ensure path is correct

// --- Helper: Fetch with Backoff (Keep existing) ---
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
  const model = 'gemini-2.5-flash'; // Use 1.5 Flash for tools
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

const getCorrectedTranscript = async (transcript) => {
  // ... (Keep your existing implementation)
  return transcript; // Simplified for this snippet, keep your original logic
};

// --- UPDATED HOOK ---
// Added 'userMacros' to props
export const useVoiceAssistant = ({ geminiTools, onFunctionCall, onPlainText, userMacros }) => {
  const [voiceStatus, setVoiceStatus] = useState('idle'); 
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isDictationSupported, setIsDictationSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); 
  const transcriptBufferRef = useRef(''); 
  const silenceTimerRef = useRef(null); 
  const isProcessingRef = useRef(false); 

  const onFunctionCallRef = useRef(onFunctionCall);
  const onPlainTextRef = useRef(onPlainText);
  const userMacrosRef = useRef(userMacros || []); // Ref for macros

  useEffect(() => {
    onFunctionCallRef.current = onFunctionCall;
    onPlainTextRef.current = onPlainText;
    userMacrosRef.current = userMacros || []; // Update ref when props change
  }, [onFunctionCall, onPlainText, userMacros]);

  const processFinalBuffer = async () => {
    if (isProcessingRef.current) return;
    
    const fullText = transcriptBufferRef.current.trim();
    if (!fullText) return;

    isProcessingRef.current = true;
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
    
    setVoiceStatus('processing');
    setInterimTranscript('');
    transcriptBufferRef.current = '';

    try {
        // 1. LOCAL INTENT CHECK (Includes User Macros via ref)
        console.log("Checking local intents for:", fullText);
        const localAction = parseLocalIntent(fullText, userMacrosRef.current);

        if (localAction) {
            console.log("⚡ Local Action Triggered:", localAction);
            onFunctionCallRef.current(localAction);
            setVoiceStatus('idle');
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
                 // Standard Dictation
                 onPlainTextRef.current(fullText);
            }
            setVoiceStatus('idle');
        }
    } catch (e) {
        console.error("Processing error:", e);
        onPlainTextRef.current(fullText);
        setVoiceStatus('idle');
    } finally {
        isProcessingRef.current = false; 
        if (isListeningRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch(e){}
            setVoiceStatus('listening');
        }
    }
  };

  // ... (Keep existing SpeechRecognition useEffect logic exactly as is) ...
  // Ensure you include the SpeechRecognition setup here (omitted for brevity but assume it's the same as your file)
  
  // Minimal setup for context:
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setIsDictationSupported(false); return; }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => { setVoiceStatus('listening'); isListeningRef.current = true; };
    recognitionRef.current.onresult = (event) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        let chunk = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) chunk += event.results[i][0].transcript;
        }
        if (chunk) transcriptBufferRef.current += ' ' + chunk.trim();
        setInterimTranscript(transcriptBufferRef.current.slice(-100));
        silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && !isProcessingRef.current) processFinalBuffer();
        }, 1200);
    };
    recognitionRef.current.onerror = (e) => { if(e.error !== 'no-speech') console.error(e); };
    return () => { if(recognitionRef.current) recognitionRef.current.abort(); };
  }, []);

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListeningRef.current) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      processFinalBuffer();
      setVoiceStatus('idle');
    } else {
      transcriptBufferRef.current = '';
      recognitionRef.current.start();
      isListeningRef.current = true;
      setVoiceStatus('listening');
    }
  }, []);

  return { voiceStatus, interimTranscript, error, isDictationSupported, handleToggleListening };
};