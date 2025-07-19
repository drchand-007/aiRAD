import { useEffect } from "react";

/**
 * Focus‑trap for modals / drawers.
 * Call inside the component and pass a ref of the backdrop / sheet.
 */
export default function useFocusTrap(ref, isOpen) {
  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const el = ref.current;
    const focusable = el.querySelectorAll(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", handleKey);
    first?.focus();

    return () => el.removeEventListener("keydown", handleKey);
  }, [isOpen, ref]);
}
