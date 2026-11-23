'use client';

import {useEffect, useRef} from 'react';
import {useMotionOn} from './context';

const MOODS: Record<string, number> = {
  grain: 0,
  grid: 1,
  zustmed: 1,
  soft: 2,
  omviraa: 2,
  lines: 3,
  'shahi-estate': 3,
  sweep: 4,
  'shahi-world': 4,
  particles: 5,
  'emerging-ventures': 5,
};

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_mood;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec3 gold = vec3(0.765, 0.643, 0.420);
  float alpha = 0.0;
  vec3 col = gold;
  if (u_mood < 0.5) {
    float n = hash(floor(uv * 90.0) + floor(u_time * 8.0));
    alpha = n * 0.22;
  } else if (u_mood < 1.5) {
    float gx = step(0.965, fract(uv.x * 28.0));
    float gy = step(0.965, fract(uv.y * 16.0));
    alpha = max(gx, gy) * 0.55;
  } else if (u_mood < 2.5) {
    float b = sin(uv.x * 5.0 + u_time * 0.25) * sin(uv.y * 3.5 - u_time * 0.18);
    alpha = 0.08 + 0.16 * (b * 0.5 + 0.5);
    col = vec3(0.93, 0.86, 0.72);
  } else if (u_mood < 3.5) {
    float h = step(0.975, fract(uv.y * 11.0));
    float v = step(0.988, fract(uv.x * 7.0));
    alpha = max(h, v) * 0.5;
  } else if (u_mood < 4.5) {
    float sweep = fract(uv.x * 0.35 + u_time * 0.04);
    float band = smoothstep(0.42, 0.5, sweep) * smoothstep(0.68, 0.55, sweep);
    alpha = band * 0.42;
    col = vec3(1.0, 0.92, 0.75);
  } else {
    vec2 cell = floor(uv * 16.0);
    vec2 gv = fract(uv * 16.0) - 0.5;
    float id = hash(cell);
    vec2 drift = vec2(sin(u_time * 0.6 + id * 6.2), cos(u_time * 0.45 + id * 4.1)) * 0.22;
    float d = length(gv - drift);
    alpha = smoothstep(0.08, 0.0, d) * (0.35 + id * 0.65);
  }
  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ShaderField({mood = 'grain'}: {mood?: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = useMotionOn();
  const moodValue = MOODS[mood] ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const fine = window.matchMedia('(min-width: 760px)');
    if (!fine.matches) return;
    const gl = canvas.getContext('webgl', {alpha: true, antialias: false, premultipliedAlpha: false});
    if (!gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const resolution = gl.getUniformLocation(program, 'u_res');
    const time = gl.getUniformLocation(program, 'u_time');
    const moodLocation = gl.getUniformLocation(program, 'u_mood');
    let frame = 0;
    let running = true;
    const started = performance.now();

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function draw(now: number) {
      if (!running) return;
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, (now - started) / 1000);
      gl.uniform1f(moodLocation, moodValue);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    }

    resize();
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      if (visible && !frame) frame = requestAnimationFrame(draw);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [active, moodValue]);

  if (!active) return null;
  return <canvas ref={canvasRef} className={'shader-field shader-' + mood} aria-hidden="true"/>;
}
