export function RulesSection() {
  const rules = [
    'Câmera 100% travada — um único plano estático',
    'Cutting on twos: 24 fps, movimento a 12',
    'Holds de 2–3 quadros em cada assentamento',
    'Cada elemento entra uma única vez',
    'Em 4,5s o quadro fica idêntico à imagem fornecida',
    '4,5–6,0s: só respiração de papel',
    'Áudio: apenas ASMR de papel',
  ];

  return (
    <section className="relative">
      <h2 className="font-display text-3xl uppercase text-cream mb-6">Regras do Formato</h2>
      <ul className="grid sm:grid-cols-2 gap-4">
        {rules.map((r, i) => (
          <li key={i} className="flex items-center gap-3 border-b border-cream/10 pb-3">
            <span className="text-stampred font-bold text-xl">✓</span>
            <p className="text-cream/80">{r}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PipelineSection() {
  const steps = [
    { n: '01', title: 'Mapa da Mesa', body: 'A imagem final é a planta do filme.' },
    { n: '02', title: 'Gera as Saídas', body: 'Prompt para IA + script Python.' },
    { n: '03', title: 'Roda o Filme', body: 'python render_colagem.py → MP4 com ASMR.' },
  ];

  return (
    <section>
      <h2 className="font-display text-3xl uppercase text-cream mb-6">Do Quadro Final ao MP4</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="bg-paper2 text-ink p-6 shadow-lg">
            <div className="text-stampred font-display text-4xl mb-3">{s.n}</div>
            <h3 className="font-display text-xl uppercase mb-2">{s.title}</h3>
            <p className="text-ink/80">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-8 pt-6 border-t border-cream/10">
      <p className="text-center text-cream/40 text-sm font-mono">
        Mesa de Colagem · pré-produção de colagem documental
      </p>
    </footer>
  );
}