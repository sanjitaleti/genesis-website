"use client";

import { useEffect, useRef } from "react";

/**
 * Raw-WebGL ambient backdrop. A domain-warped fbm field drives two opposed
 * masks: high field → cyan, low field → pink, with a black gap between them.
 * Because the colours never occupy the same region, the blend never passes
 * through purple. Mouse adds a soft cyan light. Falls back to a single static
 * frame under prefers-reduced-motion.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0));
  float d = hash(i+vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;
  float t = u_time * 0.06;

  // domain warp for that liquid, flowing feel
  vec2 q = vec2(fbm(p*2.0 + t), fbm(p*2.0 + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p*2.0 + q*1.6 + vec2(1.7,9.2) + t*1.2),
                fbm(p*2.0 + q*1.6 + vec2(8.3,2.8) - t*0.8));
  float f = fbm(p*2.0 + r*1.8);

  // opposed masks -> separate cyan & pink territories, black between (no purple)
  float cyanMask = smoothstep(0.55, 0.95, f);
  float pinkMask = smoothstep(0.55, 0.95, 1.0 - f);

  vec3 cyan = vec3(0.0, 0.9, 1.0);
  vec3 pink = vec3(1.0, 0.30, 0.55);

  vec3 col = vec3(0.0);
  col += cyan * cyanMask * 0.55;
  col += pink * pinkMask * 0.42;

  // soft interactive cyan light following the cursor
  vec2 m = u_mouse;
  m.x *= u_res.x / u_res.y;
  float d = distance(p, m);
  col += cyan * smoothstep(0.6, 0.0, d) * 0.10;

  // keep it murdered-out: low overall energy + vignette
  float vig = smoothstep(1.25, 0.2, length(uv - 0.5));
  col *= vig;
  col *= 0.85;

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(render);
    };
    render(start);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}
