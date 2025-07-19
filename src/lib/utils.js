// Shared tiny helpers

/** Normalises grade keywords to number form for robust search */
export const normalizeSearchTerm = (text) => {
  let normalized = text.toLowerCase();
  const gradeMap = {
    one: "1",
    i: "1",
    two: "2",
    ii: "2",
    three: "3",
    iii: "3",
    four: "4",
    iv: "4",
    five: "5",
    v: "5",
  };
  normalized = normalized.replace(
    /\bgrade\s+(one|two|three|four|five|i|ii|iii|iv|v)\b/gi,
    (_, p1) => `grade ${gradeMap[p1.toLowerCase()]}`
  );
  return normalized;
};

export const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};
