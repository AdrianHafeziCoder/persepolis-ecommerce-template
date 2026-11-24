export const Faravahar = ({ s = 90 }) => (
  <svg
    width={s}
    viewBox="0 0 120 70"
    fill="none"
    stroke="#d4a84b"
    strokeWidth="2.5"
  >
    <circle cx="60" cy="34" r="9" />
    <path d="M51 34H4q10 6 22 6t25-6M69 34h47q-10 6-22 6t-25-6M8 30q20-10 43 0M112 30q-20-10-43 0M60 43v22M52 66l8-8 8 8" />
  </svg>
);
export const Rosette = () => (
  <svg
    width="64"
    viewBox="0 0 64 64"
    fill="none"
    stroke="#d4a84b"
    strokeWidth="2"
  >
    <circle cx="32" cy="32" r="10" />
    <circle cx="32" cy="32" r="28" />
    {[...Array(12)].map((_, i) => (
      <ellipse
        key={i}
        cx="32"
        cy="12"
        rx="4"
        ry="9"
        transform={`rotate(${i * 30} 32 32)`}
      />
    ))}
  </svg>
);
