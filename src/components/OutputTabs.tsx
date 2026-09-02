import { useMemo, useState } from 'react';
import { Config } from '../lib/model';
import { buildPrompt } from '../lib/promptGen';
import { buildPython } from '../lib/pythonGen';

type Tab = 'prompt' | 'python' | 'uso' | 'github';

export default function OutputTabs({ config }: { config: Config }) {
  const [tab, setTab] = useState<Tab>('prompt');
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const prompt = useMemo(() => buildPrompt(config, lang), [config, lang]);
  const python = useMemo(() => buildPython(config), [config]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'prompt', label: '01 · Prompt' },
    { id: 'python', label: '02 · Python' },
    { id: 'uso', label: '03 · Como usar' },
    { id: 'github', label: '04 · GitHub' },
  ];

  return (
    <section className="relative">
      <div className="flex gap-1 mb-4">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`px-4 py-2 font-bold text-sm ${
              tab === tb.id
                ? 'bg-desk2 text-cream border-b-2 border-stampred'
                : 'bg-desk3/60 text-cream/50 hover:text-cream'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="bg-desk2 border border-black/60 p-6">
        {tab === 'prompt' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-cream font-bold text-lg">Prompt para IA de Vídeo</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-sm ${lang === 'en' ? 'bg-stampred text-cream' : 'bg-desk3 text-cream/60'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('pt')}
                  className={`px-3 py-1 text-sm ${lang === 'pt' ? 'bg-stampred text-cream' : 'bg-desk3 text-cream/60'}`}
                >
                  PT
                </button>
              </div>
            </div>
            <pre className="bg-ink/60 text-cream p-4 rounded text-sm whitespace-pre-wrap font-mono">
              {prompt}
            </pre>
          </div>
        )}

        {tab === 'python' && (
          <div>
            <h3 className="text-cream font-bold text-lg mb-4">Script Python</h3>
            <pre className="bg-ink/60 text-cream p-4 rounded text-sm whitespace-pre-wrap font-mono">
              {python}
            </pre>
          </div>
        )}

        {tab === 'uso' && (
          <div className="text-cream/80">
            <h3 className="font-bold text-lg mb-4">Como Usar</h3>
            <ol className="space-y-3 list-decimal list-inside">
              <li>Prepare sua imagem final (1280x720px)</li>
              <li>Monte a cena na pauta ao lado</li>
              <li>Copie o prompt da aba 01 para uma IA de vídeo</li>
              <li>Ou use o script Python da aba 02 para renderizar localmente</li>
            </ol>
          </div>
        )}

        {tab === 'github' && (
          <div className="text-cream/80">
            <h3 className="font-bold text-lg mb-4">Deploy no GitHub</h3>
            <p className="mb-4">Use estes comandos para enviar ao GitHub:</p>
            <pre className="bg-ink/60 text-cream p-4 rounded text-sm font-mono">
              {`git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/mesa-de-colagem.git
git push -u origin main`}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}