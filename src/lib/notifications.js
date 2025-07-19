import { toast } from "react-hot-toast";

export const toastDone = (msg) =>
  toast(msg, {
    duration: 2500,
    ariaProps: { role: "status", "aria-live": "polite" },
    style: { background: "#111827", color: "#fff" },
  });
