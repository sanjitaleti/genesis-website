declare module "liquid-gl" {
  interface LiquidGLOptions {
    target?: string;
    snapshot?: string;
    resolution?: number;
    refraction?: number;
    aberration?: number;
    bevelDepth?: number;
    bevelWidth?: number;
    frost?: number;
    shadow?: boolean;
    specular?: boolean;
    reveal?: "none" | "fade";
    tilt?: boolean;
    tiltFactor?: number;
    tiltEase?: number;
    magnify?: number;
    on?: { init?: () => void };
  }
  export default function liquidGL(options?: LiquidGLOptions): unknown;
}
