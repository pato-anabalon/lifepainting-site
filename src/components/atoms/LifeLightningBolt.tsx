/**
 * Lightning bolt (owner's graphic elements, redrawn in brand colours): a yellow bolt with a forest
 * outline and two stepped offset shadows (azure, then mustard) like a sign-painter's drop shadow.
 * Every few seconds it gives a short "zap" (CSS, `.lp-zap`; still with reduced motion). Decorative SVG.
 */

const BOLT = "M14 4 L76 4 L54 80 L92 80 L14 204 L30 118 L4 118 Z";

export function LifeLightningBolt({
  body = "var(--lp-yellow)",
  outline = "var(--lp-forest)",
  shadowNear = "var(--lp-azure)",
  shadowFar = "var(--lp-mustard)",
  className,
}: {
  body?: string;
  outline?: string;
  shadowNear?: string;
  shadowFar?: string;
  className?: string;
}) {
  const line = { stroke: outline, strokeWidth: 2.5, strokeLinejoin: "miter" as const };
  return (
    <svg viewBox="0 0 116 218" aria-hidden focusable="false" className={className}>
      <g className="lp-zap">
        <path d={BOLT} transform="translate(16 6)" fill={shadowFar} {...line} />
        <path d={BOLT} transform="translate(8 3)" fill={shadowNear} {...line} />
        <path d={BOLT} fill={body} {...line} />
      </g>
    </svg>
  );
}
