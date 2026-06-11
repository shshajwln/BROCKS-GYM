export default function StrataDivider({
  flip = false,
  from = "#26211C",
  className = "",
}: {
  flip?: boolean;
  from?: string;
  className?: string;
}) {
  // Layered rock strata between sections — the site's section seam.
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1200 72"
        preserveAspectRatio="none"
        className="block h-10 w-full md:h-[72px]"
      >
        <path
          d="M0,72 L0,38 L90,30 L210,42 L340,24 L470,36 L600,20 L740,34 L870,22 L1000,38 L1100,26 L1200,34 L1200,72 Z"
          fill={from}
          opacity="0.18"
        />
        <path
          d="M0,72 L0,48 L120,40 L250,52 L380,36 L520,48 L650,32 L780,46 L910,34 L1040,48 L1200,40 L1200,72 Z"
          fill={from}
          opacity="0.45"
        />
        <path
          d="M0,72 L0,58 L140,52 L280,62 L420,50 L560,60 L700,46 L840,58 L980,48 L1120,58 L1200,52 L1200,72 Z"
          fill={from}
        />
      </svg>
    </div>
  );
}
