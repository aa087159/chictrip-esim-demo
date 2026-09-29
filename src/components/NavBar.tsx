import type { ReactNode } from "react";

interface Props {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function NavBar({ title, onBack, right }: Props) {
  return (
    <div className="navbar">
      {onBack ? (
        <button className="navbar-back" onClick={onBack} aria-label="返回">
          ‹
        </button>
      ) : (
        <span className="navbar-edge" />
      )}
      <span className="navbar-title">{title}</span>
      <span className="navbar-edge navbar-right">{right}</span>
    </div>
  );
}
