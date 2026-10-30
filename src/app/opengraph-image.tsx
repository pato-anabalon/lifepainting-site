import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = `${site.legalName} – ${site.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: 80, background: "#1F4A3A", color: "#F8F0DA", fontFamily: "sans-serif", position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, background: "#FDD01D", display: "flex" }} />
        <div style={{ position: "absolute", right: 160, top: 0, bottom: 0, width: 40, background: "#EAA72F", display: "flex" }} />
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#FDD01D", display: "flex" }}>PAINTING &amp; DECORATING · AUCKLAND NZ</div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 24, display: "flex" }}>Life Painting</div>
        <div style={{ fontSize: 44, marginTop: 16, maxWidth: 800, display: "flex" }}>{site.slogan}</div>
      </div>
    ),
    size,
  );
}
