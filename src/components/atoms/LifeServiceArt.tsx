import type { ReactNode } from "react";

/**
 * Drawn scenes for each service and surface, in brand colours. Decorative only (aria-hidden).
 * `ink` = main shapes, `accent` = highlights. Both are passed as CSS colour values.
 */
export type ArtKind =
  | "interior" | "exterior" | "decorative" | "preparation"
  | "weatherboards" | "masonry" | "roofs" | "fences";

const scenes: Record<ArtKind, (ink: string, accent: string) => ReactNode> = {
  // A roller on the wall, with the band of fresh paint it has just rolled above it.
  interior: (ink, accent) => (
    <>
      <rect x="14" y="6" width="74" height="34" rx="3" fill={accent} />
      <rect x="12" y="34" width="78" height="24" rx="4" fill={ink} />
      <path d="M90 46h14v26H62v12" fill="none" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <rect x="55" y="82" width="14" height="32" rx="3" fill={ink} />
    </>
  ),
  exterior: (ink, accent) => (
    <>
      <path d="M10 62 60 20l50 42z" fill={ink} />
      <rect x="22" y="62" width="76" height="48" fill={ink} />
      <rect x="52" y="76" width="16" height="34" fill={accent} />
      <rect x="29" y="74" width="15" height="15" fill={accent} />
      <rect x="76" y="74" width="15" height="15" fill={accent} />
    </>
  ),
  decorative: (ink, accent) => (
    <>
      <circle cx="60" cy="60" r="50" fill={ink} />
      <circle cx="60" cy="60" r="36" fill={accent} />
      <circle cx="60" cy="60" r="22" fill={ink} />
      <rect x="50" y="50" width="20" height="20" fill={accent} transform="rotate(45 60 60)" />
    </>
  ),
  // A filling knife (handle, ferrule, blade) smoothing a bead of filler, a crack still open beside it.
  preparation: (ink, accent) => (
    <>
      <path d="M96 30l-6 9 6 7-6 9 5 8-5 9" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="rotate(14 45 50)">
        <rect x="38" y="6" width="14" height="40" rx="7" fill={accent} />
        <rect x="35" y="44" width="20" height="9" rx="2" fill={ink} />
        <path d="M35 53h20l18 38H17z" fill={ink} />
      </g>
      <path d="M8 98q22-8 52-4t50 0v12q-40 4-102 4z" fill={accent} />
    </>
  ),
  weatherboards: (ink, accent) => (
    <>
      {[10, 34, 58, 82].map((y) => (
        <g key={y}>
          <rect x="6" y={y} width="108" height="20" fill={ink} />
          <rect x="6" y={y + 20} width="108" height="4" fill={accent} />
        </g>
      ))}
    </>
  ),
  masonry: (ink, accent) => (
    <>
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect key={`${row}-${col}`} x={(row % 2 ? -14 : 0) + col * 32 + 4} y={10 + row * 21} width="28" height="17" fill={row === 2 && col === 1 ? accent : ink} />
        )),
      )}
    </>
  ),
  roofs: (ink, accent) => (
    <>
      {[34, 58, 82].map((y, i) => (
        <path key={y} d={`M4 ${y}l14-16 14 16 14-16 14 16 14-16 14 16 14-16 14 16`} fill="none" stroke={i === 1 ? accent : ink} strokeWidth="8" strokeLinejoin="round" />
      ))}
    </>
  ),
  fences: (ink, accent) => (
    <>
      <rect x="6" y="44" width="108" height="9" fill={accent} />
      <rect x="6" y="78" width="108" height="9" fill={accent} />
      {[10, 34, 58, 82].map((x) => (
        <path key={x} d={`M${x} 34 ${x + 10} 16l10 18v78H${x}z`} fill={ink} />
      ))}
    </>
  ),
};

export function LifeServiceArt({ kind, ink, accent, className }: { kind: ArtKind; ink: string; accent: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden focusable="false" className={className}>
      {scenes[kind](ink, accent)}
    </svg>
  );
}
