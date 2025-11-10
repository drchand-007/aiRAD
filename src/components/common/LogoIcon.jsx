import React from 'react';

/**
 * A custom SVG logo for aiRAD.
 * Represents an 'A' (for AI/RAD) with a 'wave' (for a scan) as the crossbar.
 * It will inherit color and size from its parent's CSS.
 */
export const LogoIcon = ({ className, ...props }) => (
  <svg
    xmlns="src/assets/aiRAD_logo.jpg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor" // Inherits color (e.g., text-blue-500)
    strokeWidth="12"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* The 'A' shape */}
    <path d="M 10 90 L 50 10 L 90 90" />
    {/* The 'wave' crossbar */}
    <path d="M 30 65 Q 40 55, 50 65 T 70 65" />
  </svg>
);

export default LogoIcon;