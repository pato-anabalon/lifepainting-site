import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, ogImage } from "@/lib/content";

/**
 * Shared image for every route (1200×630, also used by X as og:image). Brand composition: the wide
 * logo, the hero headline in Montserrat (TTFs + OFL licence in src/app/_og), the services line, the
 * atomic shapes graphic top right and the site's cream wave divider rising along the foot.
 * Generated at build time (no request-time APIs), so it is a static file in production.
 */
export const alt = ogImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = { forest: "#1F4A3A", cream: "#F8F0DA", azure: "#5A9CAB", yellow: "#FDD01D", mustard: "#EAA72F" };

/** The site's `waves-layered` divider (ShapeDivider), drawn rising from the bottom in cream. */
const WAVES = [
  "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
  "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
  "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z",
];

type Pt = [number, number];
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
/** Atomic shapes (LifeAtomicShapes), same geometry: two boomerang panels and two atom stars. */
const ATOMS: Array<{ c: Pt; rays: Pt[] }> = [
  { c: [113, 72], rays: [[113, 40], [113, 103], [90, 68], [131, 57], [131, 78], [92, 91]] },
  { c: [214, 100], rays: [[229, 76], [241, 93], [231, 120], [196, 101], [204, 120]] },
];

export default async function OpengraphImage() {
  const dir = join(process.cwd(), "src/app/_og");
  const [bold, medium, logo] = await Promise.all([
    readFile(join(dir, "Montserrat-Bold.ttf")),
    readFile(join(dir, "Montserrat-Medium.ttf")),
    readFile(join(process.cwd(), "public/logos/logo-wide-for-dark.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const [line1, line2] = hero.titleLines;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.forest, fontFamily: "Montserrat" }}>
        {/* Atomic shapes, top right */}
        <svg width="320" height="256" viewBox="60 8 200 160" style={{ position: "absolute", top: 52, right: 48 }}>
          <path d={poly([[115, 30], [240, 20], [232, 86], [130, 92]])} fill={C.mustard} stroke={C.mustard} strokeWidth="8" strokeLinejoin="round" />
          <path d={poly([[142, 42], [196, 38], [206, 72], [146, 75]])} fill={C.yellow} stroke={C.yellow} strokeWidth="8" strokeLinejoin="round" />
          <path d={poly([[85, 98], [190, 95], [206, 140], [78, 156]])} fill={C.azure} stroke={C.azure} strokeWidth="8" strokeLinejoin="round" />
          <path d={poly([[108, 104], [172, 103], [186, 132], [111, 136]])} fill={C.mustard} stroke={C.mustard} strokeWidth="8" strokeLinejoin="round" />
          {ATOMS.flatMap(({ c, rays }, a) =>
            rays.flatMap(([x, y], i) => [
              <line key={`l${a}-${i}`} x1={c[0]} y1={c[1]} x2={x} y2={y} stroke={C.cream} strokeWidth="2" strokeLinecap="round" />,
              <circle key={`c${a}-${i}`} cx={x} cy={y} r="3.6" fill={C.cream} />,
            ]),
          )}
        </svg>

        {/* Copy */}
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px", width: 900 }}>
          <img src={logoSrc} width={330} height={120} alt="" style={{ marginLeft: -10 }} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontSize: 62, fontWeight: 700, whiteSpace: "nowrap", lineHeight: 1.1, letterSpacing: -0.5, textTransform: "uppercase" }}>
            <span style={{ color: C.cream }}>{line1}</span>
            <span style={{ color: C.yellow }}>{line2}</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 28, fontWeight: 500, color: C.cream, lineHeight: 1.35 }}>
            {ogImage.line}
          </div>
        </div>

        {/* Cream waves rising along the foot, as between the site's sections */}
        <svg width="1200" height="96" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0, transform: "scaleY(-1)" }}>
          <path d={WAVES[0]} fill={C.cream} opacity="0.25" />
          <path d={WAVES[1]} fill={C.cream} opacity="0.5" />
          <path d={WAVES[2]} fill={C.cream} />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Montserrat", data: bold, weight: 700, style: "normal" },
        { name: "Montserrat", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
