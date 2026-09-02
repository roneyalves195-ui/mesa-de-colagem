import { useState } from 'react';
import StagePreview from './components/StagePreview';
import TimelinePanel from './components/TimelinePanel';
import OutputTabs from './components/OutputTabs';
import ImageUpload from './components/ImageUpload';
import VideoExporter from './components/VideoExporter';
import { PipelineSection, RulesSection, SiteFooter } from './components/LowerSections';
import { Config, DEFAULT_CONFIG } from './lib/model';
import { autoGenerateConfig } from './lib/imageSlicer';

export default function App() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [seekTick, setSeekTick] = useState<{ t: number; n: number } | null>(null);
  const [generating, setGenerating] = useState(false);

  const onSeek = (t: number) => setSeekTick({ t, n: Date.now() });

  const handleImage = async (dataUrl: string) => {
    setGenerating(true);
    try {
      const generated = await autoGenerateConfig(dataUrl, 'Cena gerada');
      setConfig(generated);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pb-10">
        <header className="pt-10 sm:pt-14 pb-10 border-b border-cream/10">
          <p className="font-type text-stampred text-sm tracking-wide mb-3">Caso Nº 47 · Pré-produção</p>
          <h1 className="font-display text-5xl sm:text-7xl text-cream leading-[0.95]">
            Mesa de<br />Colagem
          </h1>
          <p className="text-cream/60 mt-4 max-w-md">
            Suba uma foto, veja a animação de colagem se montar sozinha, e baixe o vídeo pronto.
          </p>
        </header>

        <main className="pt-8">
          <div className="mb-6">
            <ImageUpload onImage={handleImage} busy={generating} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_432px] items-start">
            <div className="flex flex-col gap-4">
              <StagePreview config={config} hoverId={hoverId} seekTick={seekTick} />
              <VideoExporter config={config} />
            </div>
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