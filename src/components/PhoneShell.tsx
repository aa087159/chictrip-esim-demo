import type { ReactNode } from "react";

export type Tab = "home" | "explore" | "trip" | "me";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "首頁" },
  { id: "explore", icon: "🧭", label: "探索" },
  { id: "trip", icon: "🗺️", label: "行程" },
  { id: "me", icon: "👤", label: "會員" },
];

interface Props {
  tab: Tab;
  onTab: (tab: Tab) => void;
  children: ReactNode;
}

export function PhoneShell({ tab, onTab, children }: Props) {
  return (
    <div className="device">
      <div className="screen">
        <div className="statusbar">
          <span className="sb-time">9:41</span>
          <span className="sb-right">
            <span className="sb-signal">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span className="sb-5g">5G</span>
            <span className="sb-batt">
              <b></b>
            </span>
          </span>
        </div>

        <div className="screen-body">{children}</div>

        <nav className="tabbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab${tab === t.id ? " active" : ""}`}
              onClick={() => onTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
