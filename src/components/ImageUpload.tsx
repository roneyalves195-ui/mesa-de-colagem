import { useRef, useState } from 'react';

interface Props {
  onImage: (dataUrl: string) => void;
  busy?: boolean;
}

export default function ImageUpload({ onImage, busy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [thumb, setThumb] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setThumb(dataUrl);
      onImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="paper-card flex flex-wrap items-center gap-4 p-4">
      <button onClick={() => inputRef.current?.click()} disabled={busy} className="btn-primary">
        {busy ? 'Montando a cena...' : thumb ? 'Trocar imagem' : '📷 Subir imagem e gerar movimentos'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {thumb ? (
        <img src={thumb} alt="Imagem enviada" className="h-14 w-24 object-cover border-2 border-cream/20" />
      ) : (
        <span className="text-cream/50 text-sm">
          Suba a foto que você quer transformar em colagem animada
        </span>
      )}
    </div>
  );
}