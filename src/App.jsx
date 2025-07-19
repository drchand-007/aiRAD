import React, { lazy, Suspense, useState, useCallback } from "react";
import Button from "./components/Button.jsx";
import SearchPanel from "./components/SearchPanel.jsx";
import ImageDropZone from "./components/ImageDropZone.jsx";
import { toastDone } from "./lib/notifications.js";

// Lazy‑load heavy chunks so the shell stays tiny
const EditorPane = lazy(() => import("./components/EditorPane.jsx"));
const ReportPane = lazy(() => import("./components/ReportPane.jsx"));

export default function App() {
  /* --------------------------------------------------------------------- */
  /*  Local state
  /* --------------------------------------------------------------------- */
  const [editorHtml, setEditorHtml] = useState("");
  const [reportHtml, setReportHtml] = useState("");

  /* --------------------------------------------------------------------- */
  /*  Callbacks
  /* --------------------------------------------------------------------- */
  const handleGenerate = useCallback(() => {
    setReportHtml(editorHtml);
    toastDone("Report generated ✅");
  }, [editorHtml]);

  const insertSnippet = useCallback(
    /** @param {string} html */ (html) =>
      setEditorHtml((prev) => `${prev}\n${html}`),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* a11y skip‑link */}
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      {/* ----------------------------------------------------------------- */}
      {/*  Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <header className="py-6 text-center bg-white shadow-sm">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brandNavy">
          AI‑Assisted Radiology Reporting
        </h1>
        <p className="text-brandTeal mt-2">
          Streamline your workflow with built‑in AI tools
        </p>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/*  Main two‑column layout                                            */}
      {/* ----------------------------------------------------------------- */}
      <main
        id="main"
        className="container mx-auto p-4 lg:p-8 grid gap-8 lg:grid-cols-2"
      >
        {/* -------------- LEFT panel – controls -------------------------- */}
        <section aria-label="Controls & inputs" className="space-y-8">
          {/* Search / AI findings */}
          <SearchPanel insertFindings={insertSnippet} />

          {/* Image upload / analyse */}
          <ImageDropZone onInsertFinding={insertSnippet} />

          {/* Generate report */}
          <Button onClick={handleGenerate} className="w-full text-lg">
            Generate Report
          </Button>
        </section>

        {/* -------------- RIGHT panel – editor + report ------------------ */}
        <Suspense fallback={<div className="p-8">Loading editor…</div>}>
          <section aria-label="Editor & output" className="space-y-8">
            {/* Rich‑text editor */}
            <EditorPane
              content={editorHtml}
              onUpdate={(html) => setEditorHtml(html)}
            />

            {/* Generated report */}
            <ReportPane generatedHtml={reportHtml} />
          </section>
        </Suspense>
      </main>

      {/* ----------------------------------------------------------------- */}
      {/*  Footer                                                           */}
      {/* ----------------------------------------------------------------- */}
      <footer className="text-xs text-center text-gray-500 py-4">
        © {new Date().getFullYear()} – Built with ❤ for radiologists
      </footer>
    </div>
  );
}
