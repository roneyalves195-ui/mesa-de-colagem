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

  // foto inteira (a imagem que o usuário subiu, sem cortes)
  const heroImg = cropToDataUrl(img, 0, 0, w, h, 700);

  // um único "detalhe": zoom no centro da mesma imagem, não um quadrante bruto
  const zoom = 0.45;
  const dw = w * zoom;
  const dh = h * zoom;
  const detailImg = cropToDataUrl(img, (w - dw) / 2, (h - dh) / 2, dw, dh, 420);

  const elements: ElementDef[] = [
    { id: 'auto-hero', name: 'Foto principal', kind: 'photo', t: 0.2, dur: 0.55, x: 0.06, y: 0.14, w: 0.48, h: 0.68, rot: -1.8, image: heroImg },
    { id: 'auto-tape1', name: 'Fita', kind: 'tape', t: 0.7, dur: 0.22, x: 0.08, y: 0.12, w: 0.1, h: 0.035, rot: -35 },
    { id: 'auto-strip', name: title.toUpperCase(), kind: 'strip', t: 1.0, dur: 0.35, x: 0.08, y: 0.03, w: 0.34, h: 0.07, rot: -1 },
    { id: 'auto-detail', name: 'Detalhe', kind: 'cutout', t: 1.35, dur: 0.42, x: 0.60, y: 0.22, w: 0.32, h: 0.42, rot: 3.8, image: detailImg },
    { id: 'auto-tape2', name: 'Fita', kind: 'tape', t: 1.85, dur: 0.22, x: 0.62, y: 0.20, w: 0.1, h: 0.035, rot: 30 },
  ];

  return { title, theme, fps: 24, duration: 6.0, buildEnd: 4.5, elements };
}