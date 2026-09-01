import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Genesis LP - never miss another call";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#060809",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* the open-line mark, drawn flat for Satori */}
          <svg width="38" height="38" viewBox="0 0 48 48">
            <path
              d="M 33.85 11.4 A 16 16 0 1 0 40 24 L 28 24"
              fill="none"
              stroke="#f72585"
              strokeWidth="5.5"
              strokeLinecap="round"
            /></svg>
          <div style={{ fontSize: 26, letterSpacing: "0.02em", opacity: 0.75 }}>
            Genesis LP
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.08,
            marginTop: 32,
            maxWidth: 980,
          }}
        >
          Never miss another call.
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.7, marginTop: 26 }}>
          An AI receptionist that answers 24/7 and books the job.
        </div>
      </div>
    ),
    size
  );
}
