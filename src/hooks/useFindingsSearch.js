import { useState } from "react";
import { normalizeSearchTerm } from "../lib/utils.js";
import { localFindings } from "../findings.js";

export default function useFindingsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [localResults, setLocalResults] = useState([]);
  const [aiResults, setAiResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleLocalSearch = () => {
    const norm = normalizeSearchTerm(searchQuery);
    setLocalResults(
      localFindings.filter((f) =>
        normalizeSearchTerm(f.findingName).includes(norm)
      )
    );
    setAiResults([]);
    setCurrentPage(0);
  };

  // stub for AI search – inject your existing fetch
  const triggerAiSearch = async () => {
    setIsAiLoading(true);
    /**
     * fetch AI → setAiResults([[{findingName, organ, …}]])
     * call setCurrentPage(aiResults.length)
     */
    setIsAiLoading(false);
  };

  const nextPage = () =>
    setCurrentPage((p) => Math.min(aiResults.length - 1, p + 1));
  const prevPage = () => setCurrentPage((p) => Math.max(0, p - 1));

  return {
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
  };
}
