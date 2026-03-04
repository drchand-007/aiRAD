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
        "name": "createMacro",
        "description": "Creates and saves a new voice macro to the user's database.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "macroName": { "type": "STRING", "description": "The short command or name for the macro (e.g., 'Normal Appendix', 'Clear Lungs')." },
            "macroText": { "type": "STRING", "description": "The full text content that should be inserted when the macro is triggered." }
          },
          "required": ["macroName", "macroText"]
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
        "name": "insertTemplate",
        "description": "Finds a report template by its name and inserts its text into the editor.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "templateName": { "type": "STRING", "description": "The name or command phrase of the template (e.g., 'normal abdomen', 'clear lungs')." }
          },
          "required": ["templateName"]
        }
      },
      {
        "name": "deleteLastSentence",
        "description": "Deletes the last sentence from the report editor.",
        "parameters": { "type": "OBJECT", "properties": {} }
      },
      {
        "name": "clearEditor",
        "description": "Clears all text from the report editor, leaving it completely blank.",
        "parameters": { "type": "OBJECT", "properties": {} }
      },
      {
        "name": "formatText",
        "description": "Applies formatting (bold, italic, underline) to specific text in the editor.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "targetText": { "type": "STRING", "description": "The exact word or phrase in the editor to format." },
            "format": { "type": "STRING", "description": "The type of formatting: 'bold', 'italic', or 'underline'." }
          },
          "required": ["targetText", "format"]
        }
      },
      {
        "name": "replaceText",
        "description": "Replaces a specific word or phrase in the editor with new text.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "targetText": { "type": "STRING", "description": "The exact word or phrase currently in the editor to replace." },
            "replacementText": { "type": "STRING", "description": "The new text to insert in its place." }
          },
          "required": ["targetText", "replacementText"]
        }
      },
      {
        "name": "updatePatientInfo",
        "description": "Updates patient demograpics or exam details in the sidebar form.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "field": {
              "type": "STRING",
              "description": "The exact field to update: 'PatientName', 'PatientAge', 'PatientGender', 'ReferringPhysician', 'ExamDate'"
            },
            "value": { "type": "STRING", "description": "The new value for the field." }
          },
          "required": ["field", "value"]
        }
      },
      {
        "name": "changeReportTemplate",
        "description": "Changes the radiology modality and/or the specific report template to load into the editor.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "modality": { "type": "STRING", "description": "Optional. The clinical modality (e.g., 'Ultrasound', 'X-Ray', 'CT', 'MRI')." },
            "template": { "type": "STRING", "description": "Optional. The body part or exam template (e.g., 'Chest', 'Abdomen', 'Pelvis')." }
          }
        }
      },
      {
        "name": "changeTab",
        "description": "Switches the active tab in the AI Tools sidebar.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "tabName": {
              "type": "STRING",
              "description": "The name of the tab to switch to: 'copilot', 'search', 'knowledge', 'measurements'"
            }
          },
          "required": ["tabName"]
        }
      },
      {
        "name": "toggleSidebar",
        "description": "Opens or closes the left (Patient Info) or right (AI Tools) sidebars.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "side": { "type": "STRING", "description": "Which side: 'left' or 'right'" },
            "action": { "type": "STRING", "description": "Action: 'open', 'close', 'toggle'" }
          },
          "required": ["side", "action"]
        }
      },
      {
        "name": "insertSearchResult",
        "description": "Inserts a specific search result or knowledge lookup into the editor based on its number.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "resultIndex": { "type": "INTEGER", "description": "The number of the result to insert (e.g., 1 for the first result, 2 for the second)." }
          },
          "required": ["resultIndex"]
        }
      },
      {
        "name": "insertMeasurements",
        "description": "Inserts one or more measurements for specific organs or findings into the report editor.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "measurements": {
              "type": "ARRAY",
              "description": "A list of measurements to insert.",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "finding": { "type": "STRING", "description": "The organ or finding name (e.g., 'Liver', 'Gallbladder', 'Right Kidney')." },
                  "value": { "type": "STRING", "description": "The measurement value with units (e.g., '10.5 cm', '5 x 4 mm')." }
                },
                "required": ["finding", "value"]
              }
            }
          },
          "required": ["measurements"]
        }
      },
      {
        "name": "clearMeasurements",
        "description": "Clears all AI suggested measurements from the measurements panel.",
        "parameters": { "type": "OBJECT", "properties": {} }
      }
    ]
  }
];