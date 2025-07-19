import clsx from "clsx";

/**
 * Accessible button with brand‑aware variants.
 *
 * @param {"primary" | "secondary" | "ghost"} variant
 * @param {boolean} icon – Rendered icon‑only? (padding tweaks)
 */
export default function Button({
  variant = "primary",
  icon = false,
  className = "",
  children,
  ...rest
}) {
  const palette = {
    primary: "bg-brandNavy text-white hover:bg-brandNavy-surf",
    secondary: "bg-brandTeal text-white hover:bg-brandTeal-surf",
    ghost: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-brandTeal",
        icon ? "p-2" : "px-4 py-2",
        palette[variant],
        rest.disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
