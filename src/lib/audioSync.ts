import { Config } from './model';

export function rescaleConfigToDuration(config: Config, newDuration: number): Config {
  const oldDuration = config.duration || 1;
  const scale = newDuration / oldDuration;

  return {
    ...config,
    duration: newDuration,
    buildEnd: Math.min(newDuration - 0.3, Math.max(0.5, config.buildEnd * scale)),
    elements: config.elements.map((el) => ({
      ...el,
      t: el.t * scale,
      dur: Math.max(0.15, el.dur * scale),
    })),
  };
}