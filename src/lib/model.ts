export type Kind = 'photo' | 'cutout' | 'strip' | 'tape' | 'stamp' | 'string' | 'draw';

export interface ElementDef {
  id: string;
  name: string;
  kind: Kind;
  t: number;
  dur: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  image?: string;
}

export interface Config {
  title: string;
  theme?: string;
  fps: number;
  duration: number;
  buildEnd: number;
  elements: ElementDef[];
}

export const DEFAULT_CONFIG: Config = {
  title: 'Caso Nº 47 — Arquivo Aberto',
  theme: '',
  fps: 24,
  duration: 6.0,
  buildEnd: 4.5,
  elements: [
    { id: 'e01', name: 'Foto do porto', kind: 'photo', t: 0.20, dur: 0.55, x: 0.055, y: 0.17, w: 0.33, h: 0.55, rot: -2.4 },
    { id: 'e02', name: 'Mapa da costa', kind: 'cutout', t: 0.90, dur: 0.42, x: 0.565, y: 0.13, w: 0.30, h: 0.32, rot: 2.8 },
  ],
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const seedOf = (id: string) => {
  let s = 0;
  for (let i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) >>> 0;
  return s || 7;
};

export const quantize = (t: number) => Math.floor(t * 12 + 1e-6) / 12;

export function steppedEase(p: number, steps: number, overshoot = 1.70158): number {
  if (p >= 1) return 1;
  const q = steps <= 0 ? 1 : Math.min(1, Math.floor(p * steps) / steps);
  const c1 = overshoot;
  const c3 = c1 + 1;
  const q1 = q - 1;
  return 1 + c3 * q1 * q1 * q1 + c1 * q1 * q1;
}

export interface Pose {
  visible: boolean;
  dx: number;
  dy: number;
  scale: number;
  rot: number;
  alpha: number;
  prog: number;
  landed: boolean;
  lift: number;
}

export function poseOf(el: ElementDef, t: number, buildEnd: number): Pose {
  const seed = seedOf(el.id);
  const parity = Math.floor(t * 12 + seed) % 2 === 0 ? 1 : -1;
  const base: Pose = { visible: false, dx: 0, dy: 0, scale: 1, rot: 0, alpha: 1, prog: 0, landed: false, lift: 0 };

  if (t < el.t - 1e-6) return base;

  const p = clamp((t - el.t) / Math.max(0.001, el.dur), 0, 1);
  const steps = Math.max(3, Math.round(el.dur * 6));
  const landT = el.t + el.dur;
  const landed = p >= 1;

  base.visible = true;
  base.landed = landed;

  switch (el.kind) {
    case 'photo':
    case 'cutout':
    case 'strip': {
      const overshoot = el.kind === 'cutout' ? 2.1 : 1.45;
      const e = steppedEase(p, steps, overshoot);
      if (el.kind === 'cutout') {
        base.dy = (1 - e) * -(el.y + el.h + 0.14);
        base.dx = (1 - e) * parity * 0.012;
      } else {
        base.dx = (1 - e) * -(el.x + el.w + 0.14);
        base.dy = !landed ? parity * 0.0045 : 0;
        base.rot = !landed ? parity * 1.3 : 0;
      }
      base.lift = clamp(1 - e, 0, 1.2);
      break;
    }
    case 'stamp': {
      const e = steppedEase(p, Math.max(3, steps), 2.3);
      base.scale = 1 + (1 - e) * 0.55;
      base.alpha = p >= 0.34 ? 1 : 0;
      base.lift = (1 - clamp(e, 0, 1)) * 0.9;
      break;
    }
    case 'tape': {
      base.prog = steppedEase(p, steps, 0);
      base.scale = 1 + (1 - base.prog) * 0.1;
      break;
    }
    case 'string':
    case 'draw': {
      base.prog = steppedEase(p, steps, 0);
      break;
    }
  }

  if (landed && t < landT + 1 / 12 && el.kind !== 'tape' && el.kind !== 'string' && el.kind !== 'draw') {
    base.dy -= 0.006;
  }

  if (landed && t >= buildEnd) {
    if (el.kind === 'photo' || el.kind === 'cutout' || el.kind === 'strip' || el.kind === 'tape') {
      base.rot += (Math.floor(t * 3 + seed) % 2) * 0.45;
    }
  }

  return base;
}