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
    const model = 'gemini-2.5-flash';
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
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceStatus('listening');
    };

    recognition.onresult = async (event) => {
      let finalTranscript = '';
      let currentInterim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.trim();
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(currentInterim);

      if (finalTranscript) {
        // We got a final result, stop the mic and process
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setVoiceStatus('processing');
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
          onPlainTextRef.current(finalTranscript); // Fallback to inserting raw text on error
        }
        setVoiceStatus('idle');
      }
    };

    recognition.onend = () => {
      setVoiceStatus('idle');
      setInterimTranscript('');
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setVoiceStatus('idle');
    };
    
    // Cleanup on unmount
    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    }
  }, [geminiTools]); // Only re-run if geminiTools (the prop) changes

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Voice dictation is not supported.");
      return;
    }
    const currentStatus = voiceStatusRef.current;
    if (currentStatus !== 'idle') {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  }, []); // Empty dependency array is fine, it only uses refs.

  return { 
    voiceStatus, 
    interimTranscript, 
    error, 
    isDictationSupported, 
    handleToggleListening 
  };
};