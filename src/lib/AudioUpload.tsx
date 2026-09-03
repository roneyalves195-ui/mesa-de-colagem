import { useRef, useState } from 'react';

interface Props {
  onAudio: (dataUrl: string, duration: number) => void;
  onRemove: () => void;
  hasAudio: boolean;
}

export default function AudioUpload({ onAudio, onRemove, hasAudio }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const audio = new Audio();
      audio.src = dataUrl;
      audio.addEventListener('loadedmetadata', () => {
        const dur = Number.isFinite(audio.duration) ? audio.duration : 6;
        onAudio(dataUrl, Math.min(30, Math.max(3, dur)));
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="paper-card flex flex-wrap items-center gap-4 p-4">
      <button onClick={() => inputRef.current?.click()} className="btn-paper">
        {hasAudio ? 'Trocar áudio' : '🎵 Subir áudio (narração ou música)'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {hasAudio ? (
        <>
          <span className="text-cream/70 text-sm">{fileName || 'áudio carregado'}</span>
          <button onClick={onRemove} className="text-stampred text-xs font-bold">
            remover
          </button>
        </>
      ) : (
        <span className="text-cream/50 text-sm">
          Opcional — a animação se ajusta pra durar o mesmo tempo do áudio (máx. 30s)
        </span>
      )}
    </div>
  );
}