import { useState } from "react";
import { PERSONAS, type Persona } from "./data/personas";
import { postRecommend, type Recommendation } from "./lib/api";
import { PhoneShell, type Tab } from "./components/PhoneShell";
import { TripScreen } from "./screens/TripScreen";
import { PlanScreen } from "./screens/PlanScreen";
import { CheckoutScreen } from "./screens/CheckoutScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { MeScreen } from "./screens/MeScreen";
import { PlaceholderScreen } from "./screens/PlaceholderScreen";
import { CompanionScreen } from "./screens/CompanionScreen";
import { getCompanionScenario } from "./data/companion-scenarios";

// Keep the "AI thinking" animation visible even when the API answers instantly
// (mock / cached responses), so the reveal feels earned. Tunable for demos.
const MIN_THINKING_MS = 1400;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Screens pushed within the 行程 tab's navigation stack.
type TripView = "trip" | "plan" | "checkout" | "success" | "chat" | "companion";

export function App() {
  const [tab, setTab] = useState<Tab>("trip");
  const [stack, setStack] = useState<TripView[]>(["trip"]);
  const [personaId, setPersonaId] = useState(PERSONAS[0].id);

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickedPlanId, setPickedPlanId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const persona = PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];
  const activePlanId = pickedPlanId ?? recommendation?.recommendedPlanId ?? "";
  const activePlan =
    recommendation?.plans.find((p) => p.id === activePlanId) ?? recommendation?.plan ?? null;

  const view = stack[stack.length - 1];

  function push(v: TripView) {
    setStack((s) => [...s, v]);
  }
  function back() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }

  async function fetchRecommendation(target: Persona) {
    setLoading(true);
    setError(null);
    try {
      const [rec] = await Promise.all([
        postRecommend(target.itinerary),
        delay(MIN_THINKING_MS),
      ]);
      setRecommendation(rec);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function openNetwork() {
    push("plan");
    if (!recommendation && !loading) void fetchRecommendation(persona);
  }

  function pickPersona(p: Persona) {
    setPersonaId(p.id);
    setRecommendation(null);
    setPickedPlanId(null);
    setError(null);
    setStack(["trip"]);
    setTab("trip");
  }

  function renderTripStack() {
    switch (view) {
      case "plan":
        return (
          <PlanScreen
            itinerary={persona.itinerary}
            recommendation={recommendation}
            activePlan={activePlan}
            loading={loading}
            error={error}
            selectedPlanId={activePlanId}
            isSubscribed={isSubscribed}
            onSelect={setPickedPlanId}
            onBack={back}
            onCheckout={() => push("checkout")}
            onOpenChat={() => push("chat")}
          />
        );
      case "checkout":
        return activePlan ? (
          <CheckoutScreen
            plan={activePlan}
            itinerary={persona.itinerary}
            isSubscribed={isSubscribed}
            onSubscribe={() => setIsSubscribed(true)}
            onBack={back}
            onConfirm={() => push("success")}
          />
        ) : (
          <div className="error">找不到方案，無法結帳</div>
        );
      case "success":
        return (
          <SuccessScreen
            travelers={persona.itinerary.travelers}
            companions={persona.itinerary.companions}
            planName={activePlan?.name ?? "去趣 eSIM"}
            onDone={() => setStack(["trip"])}
          />
        );
      case "chat":
        return <ChatScreen onBack={back} />;
      case "companion":
        return (
          <CompanionScreen
            scenario={getCompanionScenario(persona.id)}
            companions={persona.itinerary.companions}
            onBack={back}
            onDone={() => setStack(["trip"])}
          />
        );
      case "trip":
      default:
        return (
          <TripScreen
            itinerary={persona.itinerary}
            networkPlanName={recommendation ? (activePlan?.name ?? null) : null}
            onOpenNetwork={openNetwork}
            onOpenCompanion={() => push("companion")}
          />
        );
    }
  }

  function renderTab() {
    switch (tab) {
      case "home":
        return <PlaceholderScreen title="首頁" note="探索靈感、熱門行程與優惠都在這（Demo 略）" />;
      case "explore":
        return <PlaceholderScreen title="探索" note="景點、攻略與美食清單（Demo 略）" />;
      case "me":
        return (
          <MeScreen
            currentId={personaId}
            onPick={pickPersona}
            isSubscribed={isSubscribed}
            onToggleSubscription={() => setIsSubscribed((v) => !v)}
          />
        );
      case "trip":
      default:
        return renderTripStack();
    }
  }

  // Key the screen so each push/tab-switch replays the slide-in transition.
  const viewKey = tab === "trip" ? `trip:${view}` : tab;

  return (
    <PhoneShell tab={tab} onTab={setTab}>
      <div className="screen-view" key={viewKey}>
        {renderTab()}
      </div>
    </PhoneShell>
  );
}
