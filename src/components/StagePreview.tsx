import { useEffect, useRef, useState } from 'react';
import { Config, poseOf, quantize } from '../lib/model';

interface Props {
  config: Config;
  hoverId: string | null;
  seekTick: { t: number; n: number } | null;
}

export default function StagePreview({ config, hoverId, seekTick }: Props) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const tRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tq = quantize(t);
  const frame = Math.min(config.duration * config.fps, Math.floor(t * config.fps) + 1);

  useEffect(() => {
    if (seekTick) {
      tRef.current = seekTick.t;
      setT(seekTick.t);
      if (audioRef.current) audioRef.current.currentTime = seekTick.t;
    }
  }, [seekTick]);

  useEffect(() => {
    if (!playing) {
      audioRef.current?.pause();
      return;
    }
    audioRef.current?.play().catch(() => {});
    lastTsRef.current = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min(0.1, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      let nt = audioRef.current ? audioRef.current.currentTime : tRef.current + dt;

      if (nt >= config.duration) {
        nt = nt % config.duration;
        if (audioRef.current) audioRef.current.currentTime = 0;
      }

      tRef.current = nt;
      const q = quantize(nt);
      setT((prev) => (quantize(prev) === q ? prev : nt));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, config.duration]);

  const restart = () => {
    tRef.current = 0;
    setT(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlaying(true);
  };

  return (
    <section aria-label="Palco de pré-visualização">
      {config.audioUrl && <audio ref={audioRef} src={config.audioUrl} preload="auto" />}

      <div className="relative bg-desk3 border border-black/50 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-cream font-bold">Prévia Stop-Motion</h3>
          <div className="flex gap-2">
            <button onClick={restart} className="btn-paper !px-3">
              Reiniciar
            </button>
            <button onClick={() => setPlaying(!playing)} className="btn-paper !px-3">
              {playing ? 'Pausar' : 'Rodar'}
            </button>
          </div>
        </div>

        <div className="relative aspect-video bg-desk2 rounded overflow-hidden">
          {config.elements.map((el, i) => {
            const pose = poseOf(el, tq, config.buildEnd);
            if (!pose.visible) return null;

            return (
              <div
                key={el.id}
                className={`absolute overflow-hidden ${
                  el.image
                    ? 'bg-cream border-4 border-cream shadow-lg'
                    : el.kind === 'strip'
                    ? 'bg-paper'
                    : el.kind === 'tape'
                    ? 'bg-tapec/70'
                    : 'bg-paper2 border border-ink/30'
                }`}
                style={{
                  left: `${(el.x + pose.dx) * 100}%`,
                  top: `${(el.y + pose.dy) * 100}%`,
                  width: `${el.w * 100}%`,
                  height: `${Math.abs(el.h) * 100}%`,
                  transform: `rotate(${el.rot + pose.rot}deg) scale(${pose.scale})`,
                  zIndex: i + 1,
                  opacity: pose.alpha,
                }}
              >
                {el.image ? (
                  <img src={el.image} alt={el.name} className="w-full h-full object-cover" draggable={false} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-2 text-ink text-xs font-bold">
                    {el.name}
                  </div>
                )}
              </div>
            );
          })}

          <div className="absolute bottom-2 left-2 text-xs text-cream/60 font-mono">
            Frame: {frame} / {config.duration * config.fps}
          </div>
        </div>

        <div className="mt-4">
          <input
            type="range"
            className="w-full"
            min={0}
            max={config.duration}
            step={1 / config.fps}
            value={t}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              tRef.current = v;
              setT(v);
              if (audioRef.current) audioRef.current.currentTime = v;
            }}
          />
          <div className="text-center text-sm text-cream/60 mt-1 font-mono">
            {t.toFixed(2)}s / {config.duration.toFixed(1)}s
          </div>
        </div>
      </div>
    </section>
  );
}