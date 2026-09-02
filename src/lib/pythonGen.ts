import { Config } from './model';

export function buildPython(cfg: Config): string {
  return `# Mesa de Colagem - Renderizador Python
# Uso: pip install numpy pillow imageio imageio-ffmpeg
# Depois: python render_colagem.py

import numpy as np
from PIL import Image
import imageio.v2 as imageio

print("Script Python gerado para: ${cfg.title}")
print("Duração: ${cfg.duration.toFixed(1)}s")
print("FPS: ${cfg.fps}")
print("Elementos: ${cfg.elements.length}")
`;
}