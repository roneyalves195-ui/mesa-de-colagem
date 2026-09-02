import { Config } from './model';

const STYLE_EN = `Style: hand-cut documentary paper collage in motion.`;
const STYLE_PT = `Estilo: colagem documental de papel recortado à mão, em movimento.`;
const CAMERA_EN = `CAMERA: completely locked for the entire clip. No zoom, no pan, no cuts.`;
const CAMERA_PT = `CÂMERA: completamente travada durante todo o clipe. Sem zoom, sem pan, sem cortes.`;

export function buildPrompt(cfg: Config, lang: 'en' | 'pt'): string {
  const dur = cfg.duration.toFixed(1);
  const end = cfg.buildEnd.toFixed(2);

  if (lang === 'en') {
    return `Transform the provided image into a ${dur}-second paper-collage animation. ${STYLE_EN} ${CAMERA_EN} Build from 0 to ${end}s, then hold as living poster.`;
  }

  return `Transforme a imagem fornecida numa animação de colagem de papel com ${dur} segundos. ${STYLE_PT} ${CAMERA_PT} Monte de 0 a ${end}s, depois mantenha como pôster vivo.`;
}