import type { Persona } from "../data/personas";

interface Props {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (persona: Persona) => void;
}

export function PersonaPicker({ personas, selectedId, onSelect }: Props) {
  return (
    <div className="persona-grid">
      {personas.map((p) => (
        <button
          key={p.id}
          className={`persona-card${selectedId === p.id ? " selected" : ""}`}
          onClick={() => onSelect(p)}
        >
          <span className="persona-emoji">{p.emoji}</span>
          <span className="persona-title">{p.title}</span>
          <span className="persona-subtitle">{p.subtitle}</span>
        </button>
      ))}
    </div>
  );
}
