import { Config } from './model';

type StyleBlock = { en: string; pt: string };

const STYLES: { keywords: string[]; block: StyleBlock }[] = [
  {
    keywords: ['mapa', 'map', 'costa', 'território', 'territorio', 'região', 'regiao', 'geografia'],
    block: {
      en: `Cinematic macro shot of an antique parchment map. The paper is torn and weathered, revealing an intricate brass clockwork mechanism underneath — golden gears of different sizes slowly rotating and interlocking, catching warm rim light. Shallow depth of field, dust particles floating in the light, slow push-in camera movement. Blue/teal ink illustrates coastlines and sea on the paper layer above the gears.`,
      pt: `Plano macro cinematográfico de um mapa antigo em pergaminho. O papel está rasgado e desgastado, revelando por baixo um mecanismo de relojoaria em latão — engrenagens douradas de tamanhos variados girando lentamente e se encaixando, com luz quente refletindo nas bordas. Profundidade de campo rasa, partículas de poeira flutuando na luz, câmera se aproximando lentamente. Tinta azul/verde-água ilustra litorais e mar na camada de papel acima das engrenagens.`,
    },
  },
  {
    keywords: ['retrato', 'rosto', 'pessoa', 'família', 'familia', 'portrait', 'face', 'person'],
    block: {
      en: `Cinematic macro shot of a vintage sepia photograph inside an old family album. The photo paper has a torn, deckled edge revealing a warm glowing light source behind it, with fine dust and film grain in the air. Slow, gentle push-in camera movement, shallow depth of field keeping the photograph's subject in soft focus while the torn edges stay sharp.`,
      pt: `Plano macro cinematográfico de uma fotografia antiga em tom sépia dentro de um álbum de família. O papel da foto tem uma borda rasgada e irregular revelando uma luz quente por trás, com poeira fina e granulado de filme no ar. Câmera se aproximando lenta e suavemente, profundidade de campo rasa mantendo o sujeito da foto em foco suave enquanto as bordas rasgadas ficam nítidas.`,
    },
  },
  {
    keywords: ['prédio', 'predio', 'cidade', 'arquitetura', 'construção', 'construcao', 'building', 'city', 'architecture'],
    block: {
      en: `Cinematic macro shot of an architectural blueprint drawn on aged tracing paper. The paper is torn, revealing a miniature brass and wood mechanical model of the building underneath, with tiny gears and moving parts. Warm dramatic side lighting, shallow depth of field, slow camera push-in, dust particles catching the light.`,
      pt: `Plano macro cinematográfico de uma planta arquitetônica desenhada em papel vegetal envelhecido. O papel está rasgado, revelando por baixo uma maquete mecânica em latão e madeira do prédio, com engrenagens pequenas e peças em movimento. Luz lateral quente e dramática, profundidade de campo rasa, câmera se aproximando lentamente, partículas de poeira na luz.`,
    },
  },
  {
    keywords: ['documento', 'carta', 'jornal', 'document', 'letter', 'newspaper', 'arquivo'],
    block: {
      en: `Cinematic macro shot of an aged document or newspaper clipping with torn, deckled edges. Warm directional light rakes across the paper texture, revealing fine fibers and creases. Slow, deliberate camera push-in with shallow depth of field, dust motes drifting through the light.`,
      pt: `Plano macro cinematográfico de um documento ou recorte de jornal envelhecido, com bordas rasgadas e irregulares. Luz direcional quente incide rente ao papel, revelando fibras finas e vincos. Câmera se aproximando de forma lenta e deliberada, profundidade de campo rasa, partículas de poeira flutuando na luz.`,
    },
  },
];

const FALLBACK: StyleBlock = {
  en: `Cinematic macro shot of an aged paper surface, torn and weathered, revealing an intricate mechanism of fine gears and moving parts underneath, catching warm rim light. Shallow depth of field, dust particles floating in the light, slow push-in camera movement.`,
  pt: `Plano macro cinematográfico de uma superfície de papel envelhecido, rasgado e desgastado, revelando por baixo um mecanismo detalhado de engrenagens finas e peças em movimento, com luz quente refletindo nas bordas. Profundidade de campo rasa, partículas de poeira flutuando na luz, câmera se aproximando lentamente.`,
};

function pickStyle(theme: string): StyleBlock {
  const t = theme.toLowerCase();
  for (const s of STYLES) {
    if (s.keywords.some((k) => t.includes(k))) return s.block;
  }
  return FALLBACK;
}

export function buildPrompt(cfg: Config, lang: 'en' | 'pt'): string {
  const dur = cfg.duration.toFixed(1);
  const theme = cfg.theme?.trim() || '';
  const style = pickStyle(theme || cfg.title);

  const subject = theme
    ? lang === 'en'
      ? ` The subject is: ${theme}.`
      : ` O tema é: ${theme}.`
    : '';

  if (lang === 'en') {
    return `${style.en}${subject} Warm sepia and gold color grade, high detail, photorealistic 3D render style, ${dur} seconds, no text overlays besides what is already drawn on the paper.`;
  }

  return `${style.pt}${subject} Cor quente em tons de sépia e dourado, alto nível de detalhe, estilo de render 3D fotorrealista, ${dur} segundos, sem textos sobrepostos além do que já está desenhado no papel.`;
}