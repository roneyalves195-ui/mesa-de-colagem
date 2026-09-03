import { useRef, useState } from 'react';

interface Props {
  onImage: (dataUrl: string, theme: string) => void;
  busy?: boolean;
}

export default function ImageUpload({ onImage, busy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const readAndSend = (file: File, themeValue: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setThumb(dataUrl);
      onImage(dataUrl, themeValue);
    };
    reader.readAsDataURL(file);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPendingFile(file);
    readAndSend(file, theme);
  };

  const handleThemeBlur = () => {
    if (pendingFile) readAndSend(pendingFile, theme);
  };

  return (
    <div className="paper-card flex flex-wrap items-center gap-4 p-4">
      <button onClick={() => inputRef.current?.click()} disabled={busy} className="btn-primary">
        {busy ? 'Montando a cena...' : thumb ? 'Trocar imagem' : '📷 Subir imagem'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex flex-col gap-1">
        <label className="text-cream/50 text-xs">Tema da imagem (mapa, retrato, prédio, documento...)</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          onBlur={handleThemeBlur}
          placeholder="ex: mapa do Mediterrâneo"
          className="bg-desk2 border border-cream/20 px-3 py-1.5 text-sm text-cream w-64"
        />
      </div>

      {thumb ? (
        <img src={thumb} alt="Imagem enviada" className="h-14 w-24 object-cover border-2 border-cream/20" />
      ) : (
        <span className="text-cream/50 text-sm">
          Suba a foto e descreva o tema pra gerar um prompt sob medida
        </span>
      )}
    </div>
  );
}