import { Config, ElementDef, Kind, clamp } from '../lib/model';

interface Props {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSeek: (t: number) => void;
  onReset: () => void;
}

const newDefaults: Record<Kind, Partial<ElementDef>> = {
  photo: { name: 'Foto herói', w: 0.26, h: 0.4, x: 0.12, y: 0.25, dur: 0.5, rot: -2 },
  cutout: { name: 'Recorte de apoio', w: 0.2, h: 0.24, x: 0.6, y: 0.4, dur: 0.4, rot: 3 },
  strip: { name: 'LEGENDA', w: 0.28, h: 0.06, x: 0.1, y: 0.08, dur: 0.35, rot: -1 },
  tape: { name: 'Fita', w: 0.1, h: 0.035, x: 0.2, y: 0.2, dur: 0.22, rot: -40 },
  stamp: { name: 'CARIMBO', w: 0.14, h: 0.18, x: 0.65, y: 0.6, dur: 0.2, rot: -10 },
  string: { name: 'Linha', w: 0.22, h: -0.1, x: 0.3, y: 0.35, dur: 0.5, rot: 0 },
  draw: { name: 'Traço', w: 0.25, h: 0, x: 0.1, y: 0.16, dur: 0.35, rot: 0 },
};

export default function TimelinePanel({ config, setConfig, hoverId, onHover, onSeek, onReset }: Props) {
  const update = (id: string, patch: Partial<ElementDef>) =>
    setConfig((c) => ({ ...c, elements: c.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));

  const remove = (id: string) =>
    setConfig((c) => ({ ...c, elements: c.elements.filter((e) => e.id !== id) }));

  const add = (kind: Kind) =>
    setConfig((c) => {
      const end = c.elements.reduce((m, e) => Math.max(m, e.t + e.dur), 0);
      const d = newDefaults[kind];
      const el: ElementDef = {
        id: 'e' + Date.now().toString(36),
        kind,
        name: d.name!,
        t: clamp(Math.round((end + 0.12) * 20) / 20, 0, c.buildEnd - 0.2),
        dur: d.dur!, x: d.x!, y: d.y!, w: d.w!, h: d.h!, rot: d.rot!,
      };
      return { ...c, elements: [...c.elements, el] };
    });

  return (
    <section className="relative bg-paper text-ink p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl uppercase">Pauta de Montagem</h2>
        <button onClick={onReset} className="btn-paper !text-xs !px-2">
          Resetar Cena
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {config.elements.map((el, i) => (
          <div
            key={el.id}
            className={`p-3 border ${hoverId === el.id ? 'border-stampred bg-cream' : 'border-ink/25 bg-cream/50'}`}
            onMouseEnter={() => onHover(el.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-ink/60 w-6">{(i + 1).toString().padStart(2, '0')}</span>
              <input
                className="flex-1 bg-cream border border-ink/25 px-2 py-1 text-sm"
                value={el.name}
                onChange={(e) => update(el.id, { name: e.target.value })}
              />
              <button onClick={() => remove(el.id)} className="text-stampred font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-ink/60">Tempo (s)</label>
                <input
                  type="number"
                  step={0.05}
                  className="w-full bg-cream border border-ink/25 px-2 py-1 mt-1"
                  value={el.t}
                  onChange={(e) => update(el.id, { t: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-ink/60">Duração (s)</label>
                <input
                  type="number"
                  step={0.05}
                  className="w-full bg-cream border border-ink/25 px-2 py-1 mt-1"
                  value={el.dur}
                  onChange={(e) => update(el.id, { dur: parseFloat(e.target.value) || 0.1 })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-ink/60 text-xs mb-2 uppercase font-bold">Adicionar elemento:</p>
        <div className="flex flex-wrap gap-2">
          {(['photo', 'cutout', 'strip', 'tape', 'stamp', 'string', 'draw'] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => add(k)}
              className="btn-paper !text-xs !px-2"
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}