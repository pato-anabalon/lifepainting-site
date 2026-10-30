import type { ReactNode } from "react";

/**
 * Drawn scenes for each service and surface, in brand colours. Decorative only (aria-hidden).
 * `ink` = main shapes, `accent` = highlights. Both are passed as CSS colour values.
 */
export type ArtKind =
  | "interior" | "exterior" | "decorative" | "preparation"
  | "weatherboards" | "masonry" | "roofs" | "fences";

const scenes: Record<ArtKind, (ink: string, accent: string) => ReactNode> = {
  interior: (ink, accent) => (
    <>
      <rect x="12" y="20" width="78" height="28" rx="4" fill={ink} />
      <path d="M90 34h14v28H62v14" fill="none" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <rect x="55" y="74" width="14" height="36" rx="3" fill={ink} />
      <rect x="12" y="96" width="44" height="12" rx="6" fill={accent} />
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
  preparation: (ink, accent) => (
    <>
      <path d="M12 86 68 50l40 14-56 38z" fill={ink} />
      <path d="M72 46 100 20" stroke={accent} strokeWidth="9" strokeLinecap="round" />
      <rect x="10" y="104" width="100" height="8" rx="4" fill={accent} />
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
