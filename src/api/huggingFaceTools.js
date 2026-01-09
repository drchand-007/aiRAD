// src/api/huggingFaceTools.js

// --- CONFIGURATION ---
// Since you are testing from a specific local IP/HTTPS, it's best to use the DEPLOYED Production URL 
// to avoid mixed-content (HTTP vs HTTPS) or cert errors.

// TODO: Replace 'drchand-007' with your exact Firebase Project ID if different.
const PROJECT_ID = "airad-app"; 
const REGION = "us-central1";
const FUNCTION_NAME = "runHuggingFacePrompt";

// Construct the Production URL
const FIREBASE_PROXY_URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`;

export const runHuggingFacePrompt = async (promptText) => {
  // TODO: Paste your Hugging Face Token here
  const apiKey = ""; 

  if (!apiKey) {
      console.warn("Hugging Face API Key is missing.");
      return new Promise(resolve => {
          setTimeout(() => {
            // Simulated JSON response for testing without a key
            if (promptText.includes("valid JSON")) {
               resolve(JSON.stringify({
                  queryType: "knowledgeLookup",
                  conditionName: "Simulated Result (Missing API Key)",
                  summary: "This is a placeholder because the Hugging Face API Key is missing in src/api/huggingFaceTools.js. Please add your key.",
                  keyImagingFeatures: ["Check Code", "Add Key"],
                  differentialDiagnosis: ["Config Error"],
                  sources: [{ name: "System", url: "#" }]
               }));
            } else {
               resolve("Simulated response: Please add your Hugging Face API Key.");
            }
          }, 800);
      });
  }

  try {
    console.log("Calling Proxy URL:", FIREBASE_PROXY_URL); // Debug log

    const response = await fetch(FIREBASE_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptText,
        apiKey: apiKey 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Proxy Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.text ? data.text.trim() : null;

  } catch (error) {
    console.error("AI Proxy call failed:", error);
    throw error;
  }
};

export const handleAiKnowledgeSearchHF = async (query) => {
  const systemContext = `You are an AI medical knowledge assistant for a radiologist. 
  Provide a concise, accurate, and professional explanation for: "${query}".
  
  IMPORTANT: Return ONLY a valid JSON object. No markdown formatting.
  Schema:
  {
    "queryType": "knowledgeLookup",
    "conditionName": "string",
    "summary": "string",
    "keyImagingFeatures": ["string"],
    "differentialDiagnosis": ["string"],
    "sources": [{ "name": "string", "url": "string" }]
  }`;

  return await runHuggingFacePrompt(`${systemContext}`);
};