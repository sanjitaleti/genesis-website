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
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 30,
              height: 30,
              display: "flex",
              background: "#fafafa",
              clipPath:
                "polygon(50% 0%, 58% 38%, 100% 50%, 58% 62%, 50% 100%, 42% 62%, 0% 50%, 42% 38%)",
            }}
          />
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
