// src/geminiTools.js

export const geminiTools = [
  {
    "functionDeclarations": [
      {
        "name": "askCopilot",
        "description": "Asks a general question or gives a command to the AI Co-pilot chat. Use this for follow-up questions, summarization, or anything related to the ongoing conversation.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "question": { "type": "STRING", "description": "The user's question or command for the chat (e.g., 'What are the differentials?', 'Summarize the report.')" }
          },
          "required": ["question"]
        }
      },
      {
        "name": "analyzeImages",
        "description": "Analyzes the currently uploaded radiology images to generate an AI report.",
        "parameters": { "type": "OBJECT", "properties": {} }
      },
      {
        "name": "handleAiKnowledgeSearch",
        "description": "Performs a deep knowledge search for a specific medical term, condition, or finding using an external AI knowledge base.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "query": { "type": "STRING", "description": "The medical term to search for (e.g., 'Bosniak classification', 'fatty liver')." }
          },
          "required": ["query"]
        }
      },
      {
        "name": "handleLocalSearch",
        "description": "Searches the local database of pre-defined radiology findings for a specific term.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "query": { "type": "STRING", "description": "The term to search for in local findings (e.g., 'normal chest', 'renal mass')." }
          },
          "required": ["query"]
        }
      },
      {
        "name": "handleAiFindingsSearch",
        "description": "Performs an AI-powered search for radiology findings, potentially suggesting differential diagnoses or related conditions based on the query.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "query": { "type": "STRING", "description": "The medical condition or finding to search for with AI assistance (e.g., 'hepatic lesions', 'pulmonary embolism')." }
          },
          "required": ["query"]
        }
      },
      {
        "name": "insertMacro",
        "description": "Finds a user-defined voice macro by its name and inserts its text into the editor.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "macroName": { "type": "STRING", "description": "The name or command phrase of the macro (e.g., 'normal abdomen', 'clear lungs')." }
          },
          "required": ["macroName"]
        }
      },
      {
        "name": "generateFinalReport",
        "description": "Generates the final, formatted report and shows a preview. Checks for missing fields first.",
        "parameters": { "type": "OBJECT", "properties": {} }
      },
      {
        "name": "deleteLastSentence",
        "description": "Deletes the last sentence from the report editor.",
        "parameters": { "type": "OBJECT", "properties": {} }
      }
    ]
  }
];