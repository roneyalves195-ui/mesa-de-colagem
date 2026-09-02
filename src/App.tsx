import { useEffect, useState } from 'react';
import StagePreview from './components/StagePreview';
import TimelinePanel from './components/TimelinePanel';
import OutputTabs from './components/OutputTabs';
import { PipelineSection, RulesSection, SiteFooter } from './components/LowerSections';
import { Config, DEFAULT_CONFIG } from './lib/model';

const KEY = 'mesa-colagem-v1';

function loadConfig(): Config {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const c = JSON.parse(raw) as Config;
      if (c && Array.isArray(c.elements) && typeof c.buildEnd === 'number') return c;
    }
  } catch { /* primeiro acesso */ }
  return DEFAULT_CONFIG;
}

export default function App() {
  const [config, setConfig] = useState<Config>(loadConfig);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [seekTick, setSeekTick] = useState<{ t: number; n: number } | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(config)); } catch { /* modo privado */ }
  }, [config]);

  const onSeek = (t: number) => setSeekTick({ t, n: Date.now() });

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pb-10">
        <header className="pt-6 sm:pt-9 pb-8">
          <h1 className="font-display text-6xl text-cream">Mesa de Colagem</h1>
          <p className="text-cream/75 mt-2">Coreografe a montagem quadro a quadro</p>
        </header>

        <main>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_432px] items-start">
            <StagePreview config={config} hoverId={hoverId} seekTick={seekTick} />
            <TimelinePanel
              config={config}
              setConfig={setConfig}
              hoverId={hoverId}
              onHover={setHoverId}
              onSeek={onSeek}
              onReset={() => setConfig(DEFAULT_CONFIG)}
            />
          </div>

          <div className="mt-10 sm:mt-12">
            <OutputTabs config={config} />
          </div>

          <div className="mt-14 sm:mt-16">
            <RulesSection />
          </div>

          <div className="mt-14 sm:mt-16">
            <PipelineSection />
          </div>
        </main>

        <div className="mt-14">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}