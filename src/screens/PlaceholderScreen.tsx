interface Props {
  title: string;
  note: string;
}

// 首頁 / 探索 分頁在 demo 裡不是重點，用一個像樣的空狀態撐住「這是真的 app」的感覺。
export function PlaceholderScreen({ title, note }: Props) {
  return (
    <div className="placeholder">
      <div className="placeholder-emoji">🧳</div>
      <div className="placeholder-title">{title}</div>
      <div className="placeholder-note">{note}</div>
    </div>
  );
}
