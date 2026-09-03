import { Config, ElementDef } from './model';

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function cropToDataUrl(
  img: HTMLImageElement,
  sx: number, sy: number, sw: number, sh: number,
  outW = 600
): string {
  const canvas = document.createElement('canvas');
  const scale = outW / sw;
  canvas.width = outW;
  canvas.height = Math.round(sh * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export async function autoGenerateConfig(dataUrl: string, theme: string): Promise<Config> {
  const img = await loadImage(dataUrl);
  const w = img.width, h = img.height;
  const title = theme.trim() || 'Cena gerada';

  const heroImg = cropToDataUrl(img, 0, 0, w, h, 700);
  const cutTL = cropToDataUrl(img, 0, 0, w * 0.5, h * 0.5, 420);
  const cutTR = cropToDataUrl(img, w * 0.5, 0, w * 0.5, h * 0.5, 420);
  const cutBL = cropToDataUrl(img, 0, h * 0.5, w * 0.5, h * 0.5, 420);

  const elements: ElementDef[] = [
    { id: 'auto-hero', name: 'Foto principal', kind: 'photo', t: 0.2, dur: 0.55, x: 0.07, y: 0.14, w: 0.42, h: 0.62, rot: -2.2, image: heroImg },
    { id: 'auto-tape1', name: 'Fita', kind: 'tape', t: 0.7, dur: 0.22, x: 0.06, y: 0.12, w: 0.1, h: 0.035, rot: -35 },
    { id: 'auto-cut1', name: 'Recorte 1', kind: 'cutout', t: 0.9, dur: 0.42, x: 0.56, y: 0.10, w: 0.30, h: 0.30, rot: 3.4, image: cutTL },
    { id: 'auto-cut2', name: 'Recorte 2', kind: 'cutout', t: 1.4, dur: 0.42, x: 0.60, y: 0.44, w: 0.28, h: 0.28, rot: -4.1, image: cutTR },
    { id: 'auto-strip', name: title.toUpperCase(), kind: 'strip', t: 1.9, dur: 0.35, x: 0.08, y: 0.05, w: 0.32, h: 0.07, rot: -1 },
    { id: 'auto-tape2', name: 'Fita', kind: 'tape', t: 2.1, dur: 0.22, x: 0.68, y: 0.38, w: 0.1, h: 0.035, rot: 42 },
    { id: 'auto-cut3', name: 'Recorte 3', kind: 'cutout', t: 2.4, dur: 0.4, x: 0.10, y: 0.60, w: 0.24, h: 0.24, rot: 5, image: cutBL },
  ];

  return { title, theme, fps: 24, duration: 6.0, buildEnd: 4.5, elements };
}