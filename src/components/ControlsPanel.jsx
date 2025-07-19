/* --------------------------------------------------------------------------
   src/components/ControlsPanel.jsx
   -------------------------------------------------------------------------- */

import React from "react";
import SearchPanel from "./SearchPanel.jsx";
import ImageDropZone from "./ImageDropZone.jsx";
import EditorPane from "./EditorPane.jsx";
import SuggestionsModal from "./SuggestionsModal.jsx";
import MacroModal from "./MacroModal.jsx";
import VoiceToggle from "./VoiceToggle.jsx";
import Button from "./Button.jsx";
import Loader from "./Loader.jsx";

/**
 * Props – all state & callbacks are hoisted into App and
 * passed down as a single object each to keep this component lean.
 *
 * @param {object} state
 * @param {object} actions
 */
export default function ControlsPanel({ state, actions }) {
  const {
    /* plain state */
    patientName,
    patientAge,
    examDate,
    modality,
    template,
    images,
    userFindings,
    aiSuggestions,
    isSuggestionOpen,
    isMacroOpen,
    interimTranscript,
    voiceStatus,
    /* booleans */
    isLoading,
    isAiLoading,
    /* arrays */
    macros,
    /* extracted data */
  } = state;

  const {
    /* setters & handlers */
    setPatientName,
    setPatientAge,
    setExamDate,
    setModality,
    setTemplate,
    addImages,
    removeImage,
    insertFindings,
    toggleVoice,
    openMacro,
    closeMacro,
    setMacros,
    closeSuggest,
    appendSuggest,
    /* ... plus everything SearchPanel / ImageDropZone / Editor need */
  } = actions;

  /* ───────────────────────────── render ─────────────────────────────────── */
  return (
    <section aria-label="Controls" className="space-y-6">
      {/* 1. AI / local search */}
      <SearchPanel insertFindings={insertFindings} />

      {/* 2. Patient demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Patient Name</label>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Patient Age</label>
          <input
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Exam Date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* 3. Modality / template */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Modality</label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            className="input bg-white"
          >
            {/* options populated higher up */}
            <option>Ultrasound</option>
            <option>X-Ray</option>
          </select>
        </div>
        <div>
          <label className="label">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="input bg-white"
          >
            {/* options likewise */}
            <option>Abdomen</option>
            <option>Pelvis</option>
            <option>Scrotum</option>
          </select>
        </div>
      </div>

      {/* 4. Image upload */}
      <ImageDropZone
        images={images}
        onAdd={addImages}
        onRemove={removeImage}
      />

      {/* 5. Findings editor */}
      <div>
        <label className="label mb-2 block">Findings &amp; Measurements</label>
        {isLoading ? (
          <Loader rows={6} />
        ) : (
          <EditorPane content={userFindings} onUpdate={actions.updateFindings} />
        )}
      </div>

      {/* voice toggle floating button */}
      <VoiceToggle
        status={voiceStatus}
        onToggle={toggleVoice}
        supported={actions.dictationSupported}
        interim={interimTranscript}
      />

      {/* suggestions modal */}
      <SuggestionsModal
        isOpen={isSuggestionOpen}
        onClose={closeSuggest}
        heading="AI Suggestions"
        content={aiSuggestions}
        onAppend={appendSuggest}
        loading={isAiLoading}
      />

      {/* macro modal */}
      <MacroModal
        open={isMacroOpen}
        onClose={closeMacro}
        macros={macros}
        setMacros={setMacros}
      />

      {/* manage-macro shortcut */}
      <Button variant="ghost" onClick={openMacro} className="mt-4">
        Manage Voice Macros
      </Button>
    </section>
  );
}
