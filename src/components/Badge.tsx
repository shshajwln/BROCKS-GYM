export default function Badge({
  size = 44,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // The Brock's Gym mark: an eight-sided stone with a carved "B".
  return (
    <span
      className={`octagon inline-flex items-center justify-center bg-ember font-display text-chalk ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      B
    </span>
  );
}
