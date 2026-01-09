// // src/lib/localIntentParser.js
// import Fuse from 'fuse.js';
// import { localFindings } from '../findings.js'; // Import your local data

// // 1. Configure "Smart" Fuzzy Search for your findings
// // This allows "kidny cist" to match "Renal Cortical Cyst" without AI
// const findingsFuse = new Fuse(localFindings, {
//   keys: ['findingName', 'synonyms', 'conditionName', 'organ', 'findings'],
//   threshold: 0.4, // Sensitivity: 0.0 = perfect match, 1.0 = match anything
//   ignoreLocation: true
// });

// /**
//  * Parses a transcript to find a matching local command.
//  * Returns { name, args } if found, or NULL if it needs AI.
//  */
// export const parseLocalIntent = (transcript) => {
//   const t = transcript.toLowerCase().trim();

//   // --- NEW: CO-PILOT / CHAT (Local Intercept) ---
//   // Matches: "Ask co-pilot...", "Hey AI...", "Ask assistant..."
//   // This guarantees the Co-pilot tab opens instantly.
//   const copilotMatch = t.match(/^(?:ask|hey|tell) (?:co-pilot|ai|assistant|irad)(?:\s+)(.+)/i);
//   if (copilotMatch) {
//     return {
//       name: 'askCopilot',
//       args: { question: copilotMatch[1].trim() }
//     };
//   }
  
//   // --- 1. IMAGE ANALYSIS ---
//   // Matches: "Analyze images", "Check the scan", "Read the x-ray"
//   if (/(analyze|check|read|study).*(image|scan|x-ray|dicom)/i.test(t)) {
//     return { name: 'analyzeImages', args: {} };
//   }

//   // --- 2. GENERATE REPORT ---
//   // Matches: "Generate final report", "Create PDF", "Finalize report"
//   if (/(generate|create|make|finalize).*(report|pdf)/i.test(t)) {
//     return { name: 'generateFinalReport', args: {} };
//   }

//   // --- 3. CLEAR / DELETE ---
//   // Matches: "Delete last sentence", "Undo that"
//   if (t.includes('delete last sentence') || t.includes('remove last line')) {
//     return { name: 'deleteLastSentence', args: {} };
//   }

//   // --- 4. LOCAL SEARCH (Intelligent) ---
//   // Matches: "Search findings for [query]", "Find [query]"
//   const searchMatch = t.match(/^(?:search|find|look up)(?: findings? for| local)?\s+(.+)/i);
//   if (searchMatch) {
//     const query = searchMatch[1].trim();
//     // We execute the search intent, passing the query
//     return { 
//       name: 'handleLocalSearch', 
//       args: { query: query } 
//     };
//   }

//   // --- 5. INSERT MACRO / TEMPLATE (The "Money Saver") ---
//   // Matches: "Insert normal abdomen", "Add fatty liver macro"
//   // Instead of asking AI to pick a macro, we search locally!
//   const macroMatch = t.match(/^(?:insert|add|use)(?: macro| template)?\s+(.+)/i);
//   if (macroMatch) {
//     const rawQuery = macroMatch[1].trim();
    
//     // Check if the user is explicitly asking for a known finding
//     const results = findingsFuse.search(rawQuery);
    
//     if (results.length > 0) {
//       // Direct hit! We found the data locally.
//       return { 
//         name: 'insertFindings', // We map this to a specific handler
//         args: { 
//             // We pass the actual content immediately
//             findingToInsert: results[0].item 
//         } 
//       };
//     }
//   }

//   return null; // No match? Fallback to Gemini API
// };

// src/lib/localIntentParser.js
import Fuse from 'fuse.js';
import { localFindings } from '../findings.js'; // Standard findings

// Initialize Fuse for Standard Findings once (static data)
const standardFindingsFuse = new Fuse(localFindings, {
  keys: ['findingName', 'synonyms', 'conditionName', 'organ'],
  threshold: 0.4,
  ignoreLocation: true
});

/**
 * Parses voice input to find a matching command locally.
 * @param {string} transcript - The spoken text.
 * @param {Array} userMacros - The array of user-defined macros from Firebase.
 */
export const parseLocalIntent = (transcript, userMacros = []) => {
  const t = transcript.toLowerCase().trim();

  // =========================================================================
  // 1. AI HANDOFF COMMANDS (Recognize locally -> Trigger Function -> Call API)
  //    Benefits: Zero latency to *start* the action, saves 1 "Routing" API call.
  // =========================================================================

  // Intent: AI SEARCH
  // Matches: "Perform AI search on renal calculi", "AI search for liver cyst"
  const aiSearchMatch = t.match(/^(?:perform |do |run )?(?:an )?ai search (?:for |on |about )?(.+)/i);
  if (aiSearchMatch) {
    return {
      name: 'handleAiFindingsSearch',
      args: { query: aiSearchMatch[1].trim() }
    };
  }

  // Intent: CO-PILOT / CHAT
  // Matches: "Ask co-pilot...", "Hey AI...", "Tell assistant..."
  const copilotMatch = t.match(/^(?:ask |hey |tell )(?:co-pilot|ai|assistant|irad)(?:\s+)(.+)/i);
  if (copilotMatch) {
    return {
      name: 'askCopilot',
      args: { question: copilotMatch[1].trim() }
    };
  }

  // Intent: KNOWLEDGE LOOKUP
  // Matches: "Lookup [term]", "Knowledge search for [term]"
  const knowledgeMatch = t.match(/^(?:knowledge )?lookup (?:for |on |about )?(.+)/i);
  if (knowledgeMatch) {
    return {
      name: 'handleAiKnowledgeSearch',
      args: { query: knowledgeMatch[1].trim() }
    };
  }

  // Intent: IMAGE ANALYSIS
  // Matches: "Analyze images", "Check the scan"
  if (/(analyze|check|read|study).*(image|scan|x-ray|dicom)/i.test(t)) {
    return { name: 'analyzeImages', args: {} };
  }

  // =========================================================================
  // 2. LOCAL COMMANDS (Zero API usage, Instant Execution)
  // =========================================================================

  // Intent: GENERATE REPORT
  if (/(generate|create|make|finalize).*(report|pdf)/i.test(t)) {
    return { name: 'generateFinalReport', args: {} };
  }

  // Intent: CLEAR / DELETE
  if (t.includes('delete last sentence') || t.includes('remove last line')) {
    return { name: 'deleteLastSentence', args: {} };
  }

  // Intent: LOCAL SEARCH (Manual Search Bar)
  // Matches: "Find kidney", "Search local for liver"
  const localSearchMatch = t.match(/^(?:search|find|look up)(?: findings?| local)? (?:for )?(.+)/i);
  if (localSearchMatch) {
    // Determine if user explicitly asked for "AI" (caught above) or just "Search" (Local)
    if (!t.includes('ai search')) {
        return { 
            name: 'handleLocalSearch', 
            args: { query: localSearchMatch[1].trim() } 
        };
    }
  }

  // =========================================================================
  // 3. MACRO & TEMPLATE INSERTION (Hybrid: Firebase + Local File)
  // =========================================================================
  
  const macroMatch = t.match(/^(?:insert|add|use)(?: macro| template| finding)?\s+(.+)/i);
  if (macroMatch) {
    const rawQuery = macroMatch[1].trim();

    // A. CHECK USER MACROS (Firebase) FIRST
    // We create a temporary Fuse instance for the user's specific macros
    if (userMacros && userMacros.length > 0) {
        const userMacroFuse = new Fuse(userMacros, {
            keys: ['command'], // Firebase field is 'command'
            threshold: 0.3
        });
        const userResults = userMacroFuse.search(rawQuery);
        
        if (userResults.length > 0) {
            return {
                name: 'insertMacro',
                args: {
                    macroName: userResults[0].item.command,
                    _directContent: userResults[0].item.text // Pass text directly
                }
            };
        }
    }

    // B. CHECK STANDARD FINDINGS (Local File) SECOND
    const stdResults = standardFindingsFuse.search(rawQuery);
    if (stdResults.length > 0) {
      return { 
        name: 'insertFindings', // Different handler for structured findings
        args: { 
            findingToInsert: stdResults[0].item 
        } 
      };
    }
  }

  // No match found -> Return null to trigger Cloud Fallback (or Dictation)
  return null;
};