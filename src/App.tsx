import { useState } from "react";
import { PERSONAS, type Persona } from "./data/personas";
import { postRecommend, type Recommendation } from "./lib/api";
import { PersonaPicker } from "./components/PersonaPicker";
import { RecommendationCard } from "./components/RecommendationCard";
import { ChatPanel } from "./components/ChatPanel";

export function App() {
  const [selected, setSelected] = useState<Persona | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(persona: Persona) {
    setSelected(persona);
    setRecommendation(null);
    setError(null);
    setLoading(true);
    try {
      const rec = await postRecommend(persona.itinerary);
      setRecommendation(rec);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <span className="brand">去趣 eSIM</span>
        <h1>AI 上網管家</h1>
        <p className="tagline">你的行程，就是你的方案</p>
      </header>

      <section className="panel">
        <h2 className="step">① 選一個旅客，看 AI 怎麼推薦</h2>
        <PersonaPicker
          personas={PERSONAS}
          selectedId={selected?.id ?? null}
          onSelect={handleSelect}
        />
      </section>

      {loading && (
        <div className="loading">AI 正在讀你的行程、推估流量…</div>
      )}
      {error && <div className="error">出錯了：{error}</div>}

      {recommendation && selected && (
        <>
          <section className="panel">
            <h2 className="step">② 專屬方案推薦</h2>
            <RecommendationCard recommendation={recommendation} persona={selected} />
          </section>

          <section className="panel">
            <h2 className="step">③ 還有疑問？問問 AI 客服</h2>
            <ChatPanel />
          </section>
        </>
      )}

      <footer className="footer">
        Demo · 資料為模擬，未串接金鑰時顯示示範結果
      </footer>
    </div>
  );
}
