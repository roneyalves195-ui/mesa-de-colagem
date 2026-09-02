import { useRef, useState } from 'react';
import { Config, poseOf } from '../lib/model';

interface Props {
  config: Config;
}

const CANVAS_W = 1280;
const CANVAS_H = 720;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function VideoExporter({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dlRef = useRef<HTMLAnchorElement>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    images: Record<string, HTMLImageElement | null>,
    t: number
  ) => {
    ctx.fillStyle = '#211e18';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    config.elements.forEach((el) => {
      const pose = poseOf(el, t, config.buildEnd);
      if (!pose.visible) return;

      const x = (el.x + pose.dx) * CANVAS_W;
      const y = (el.y + pose.dy) * CANVAS_H;
      const w = el.w * CANVAS_W;
      const h = Math.abs(el.h) * CANVAS_H;
      const cx = x + w / 2;
      const cy = y + h / 2;

      ctx.save();
      ctx.globalAlpha = pose.alpha;
      ctx.translate(cx, cy);
      ctx.rotate(((el.rot + pose.rot) * Math.PI) / 180);
      ctx.scale(pose.scale, pose.scale);

      const img = images[el.id];
      if (img) {
        ctx.fillStyle = '#faf8f0';
        ctx.fillRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else if (el.kind === 'tape') {
        ctx.fillStyle = 'rgba(227, 212, 156, 0.75)';
        ctx.fillRect(-w / 2, -h / 2, w, h);
      } else if (el.kind === 'strip') {
        ctx.fillStyle = '#ece3cd';
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillStyle = '#26221a';
        ctx.font = 'bold 20px monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.name, -w / 2 + 10, 0);
      } else {
        ctx.fillStyle = '#e3d7ba';
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillStyle = '#26221a';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.name, 0, 0);
      }
      ctx.restore();
    });
  };

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setBusy(true);
    setStatus('Carregando imagens...');

    const images: Record<string, HTMLImageElement | null> = {};
    await Promise.all(
      config.elements.map(async (el) => {
        images[el.id] = el.image ? await loadImage(el.image).catch(() => null) : null;
      })
    );

    if (!window.MediaRecorder) {
      setStatus('Seu navegador não suporta gravação. Tente Chrome ou Edge.');
      setBusy(false);
      return;
    }

    const stream = canvas.captureStream(config.fps);
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      if (dlRef.current) {
        dlRef.current.href = url;
        dlRef.current.click();
      }
      setStatus('Vídeo pronto! Se o download não começou, use o link abaixo.');
      setBusy(false);
    };

    setStatus('Gravando...');
    recorder.start();

    const holdTime = 1.2;
    const totalTime = config.duration + holdTime;
    const startedAt = performance.now();

    const step = (now: number) => {
      const t = (now - startedAt) / 1000;
      drawFrame(ctx, images, Math.min(t, config.duration));
      if (t < totalTime) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => recorder.stop(), 150);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="paper-card p-4 flex flex-col gap-2">
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="hidden" />
      <button onClick={handleExport} disabled={busy} className="btn-primary">
        {busy ? 'Gerando vídeo...' : '⬇ Baixar vídeo'}
      </button>
      {status && <span className="text-xs text-cream/60">{status}</span>}
      <a ref={dlRef} download="mesa-de-colagem.webm" className="hidden">baixar</a>
    </div>
  );
}