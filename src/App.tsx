import { useEffect, useRef, useState } from "react";
import { PERSONAS, type Persona } from "./data/personas";
import { postRecommend, type Recommendation } from "./lib/api";
import { PersonaPicker } from "./components/PersonaPicker";
import { RecommendationCard } from "./components/RecommendationCard";
import { ChatPanel } from "./components/ChatPanel";
import { StepLoader } from "./components/StepLoader";

// Keep the "AI thinking" animation visible even when the API answers instantly
// (mock / cached responses), so the reveal feels earned. Tunable for demos.
const MIN_THINKING_MS = 1400;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function App() {
  const [selected, setSelected] = useState<Persona | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recommendation) {
      recRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recommendation]);

  async function handleSelect(persona: Persona) {
    setSelected(persona);
    setRecommendation(null);
    setError(null);
    setLoading(true);
    try {
      const [rec] = await Promise.all([
        postRecommend(persona.itinerary),
        delay(MIN_THINKING_MS),
      ]);
      setRecommendation(rec);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand-lockup">
          <span className="brand-mark">▶</span>
          <span className="brand-word">
            去趣 <b>eSIM</b>
          </span>
        </div>
        <span className="appbar-tag">AI 上網管家</span>
      </header>

      <div className="hero">
        <div className="hero-kicker">GENAI · 行前上網顧問</div>
        <h1>你的行程，就是你的方案</h1>
        <p>選一位旅客，看 AI 如何推薦最適 eSIM</p>
      </div>

      <main className="content">
        <section className="section">
          <div className="section-label">
            <span className="section-num">1</span>選一位旅客
          </div>
          <PersonaPicker
            personas={PERSONAS}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
          />
        </section>

        {loading && (
          <section className="section">
            <StepLoader />
          </section>
        )}

        {error && (
          <section className="section">
            <div className="error">出錯了：{error}</div>
          </section>
        )}

        {recommendation && selected && !loading && (
          <>
            <section className="section" ref={recRef}>
              <div className="section-label">
                <span className="section-num">2</span>專屬方案推薦
              </div>
              <RecommendationCard recommendation={recommendation} persona={selected} />
            </section>

            <section className="section">
              <div className="section-label">
                <span className="section-num">3</span>還有疑問？問 AI 客服
              </div>
              <ChatPanel />
            </section>
          </>
        )}
      </main>

      <footer className="footer">Demo · 資料為模擬，未串接金鑰時顯示示範結果</footer>
    </div>
  );
}
