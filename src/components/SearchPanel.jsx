import React from "react";
import { Search } from "lucide-react";
import Button from "./Button.jsx";
import useFindingsSearch from "../hooks/useFindingsSearch.js";

export default function SearchPanel({ insertFindings }) {
  const {
    searchQuery,
    setSearchQuery,
    handleLocalSearch,
    localResults,
    isAiLoading,
    aiResults,
    currentPage,
    nextPage,
    prevPage,
    triggerAiSearch,
  } = useFindingsSearch();

  return (
    <section className="space-y-3 p-4 bg-gray-100 rounded-lg" aria-label="Search block">
      <label className="font-semibold text-gray-700 flex items-center">
        <Search className="mr-2" />AI Knowledge Search
      </label>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLocalSearch()}
          placeholder="e.g., Cholelithiasis or USG Scrotum report"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brandTeal transition"
        />
        <Button
          onClick={handleLocalSearch}
          aria-label="Search in local library"
          icon
          variant="secondary"
        >
          <Search size={20} />
        </Button>
      </div>

      {/* Local results render */}
      {localResults.length > 0 && (
        <div className="mt-3 space-y-3" aria-live="polite">
          {localResults.map((r, i) => (
            <div
              key={i}
              className="p-4 bg-brandTeal/5 border border-brandTeal rounded-lg"
            >
              <h4 className="font-bold text-brandTeal">{r.findingName}</h4>
              <p className="text-sm">
                <strong>Organ:</strong> {r.organ}
              </p>
              <Button
                variant="ghost"
                onClick={() => insertFindings(r)}
                className="mt-2"
              >
                Insert
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* AI button */}
      <Button
        variant="primary"
        onClick={() => triggerAiSearch(false)}
        disabled={!searchQuery || isAiLoading}
        className="w-full"
      >
        {isAiLoading ? "Searching…" : "Search with AI"}
      </Button>

      {/* Paginated AI results */}
      {aiResults.length > 0 && (
        <div className="mt-3" aria-live="polite">
          {aiResults[currentPage].map((r, i) => (
            <div
              key={i}
              className="p-4 bg-brandNavy/5 border border-brandNavy rounded-lg mb-3"
            >
              <h4 className="font-bold text-brandNavy">{r.findingName}</h4>
              <Button variant="ghost" onClick={() => insertFindings(r)}>
                Insert
              </Button>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={prevPage} disabled={currentPage === 0}>
              Prev
            </Button>
            <Button variant="ghost" onClick={nextPage}>
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
