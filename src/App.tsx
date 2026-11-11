import { useState } from "react";
import { PERSONAS, type Persona } from "./data/personas";
import { postRecommend, type Plan, type Recommendation } from "./lib/api";
import { PhoneShell, type Tab } from "./components/PhoneShell";
import { TripScreen } from "./screens/TripScreen";
import { PlanScreen } from "./screens/PlanScreen";
import { HandoffScreen, type HandoffItem } from "./screens/HandoffScreen";
import { TeamScreen, type TeamCard } from "./screens/TeamScreen";
import { ActivationScreen } from "./screens/ActivationScreen";
import { TopUpScreen } from "./screens/TopUpScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { MeScreen } from "./screens/MeScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import type { DemoAction, DemoPhase } from "./data/demo-phase";
import { CompanionScreen } from "./screens/CompanionScreen";
import { getCompanionScenario } from "./data/companion-scenarios";

// Keep the "AI thinking" animation visible even when the API answers instantly
// (mock / cached responses), so the reveal feels earned. Tunable for demos.
const MIN_THINKING_MS = 1400;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Screens pushed within the 行程 tab's navigation stack.
type TripView =
  | "trip"
  | "plan"
  | "handoff"
  | "team"
  | "activation"
  | "topup"
  | "chat"
  | "companion";

interface Handoff {
  kind: "trip" | "topup";
  items: HandoffItem[];
}

export function App() {
  const [tab, setTab] = useState<Tab>("trip");
  const [stack, setStack] = useState<TripView[]>(["trip"]);
  const [personaId, setPersonaId] = useState(PERSONAS[0].id);

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 使用者手動換掉的方案（memberId → planId）；沒換的就用 AI 推薦。
  const [planOverrides, setPlanOverrides] = useState<Record<string, string>>({});
  // 購買完成當下的方案快照，之後再換方案也不影響已買的卡。
  const [purchased, setPurchased] = useState<Record<string, Plan> | null>(null);
  const [addOnsBought, setAddOnsBought] = useState<Record<string, Plan> | null>(null);
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  // Demo 時間切換器的目前時間點，驅動首頁狀態卡、通知中心與全團安裝進度
  const [phase, setPhase] = useState<DemoPhase>("planned");

  const persona = PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];
  const { itinerary } = persona;
  const view = stack[stack.length - 1];

  const selectedPlans: Record<string, Plan> = {};
  for (const pick of recommendation?.members ?? []) {
    const planId = planOverrides[pick.memberId] ?? pick.planId;
    const plan = recommendation?.plans.find((p) => p.id === planId);
    if (plan) selectedPlans[pick.memberId] = plan;
  }

  const teamCards: TeamCard[] = itinerary.members.flatMap((member) => {
    const plan = purchased?.[member.id];
    if (!plan) return [];
    const pick = recommendation?.members.find((p) => p.memberId === member.id);
    const reason = pick && pick.planId === plan.id ? pick.reason : `依你的選擇買了${plan.name}。`;
    return [{ member, plan, reason, addOn: addOnsBought?.[member.id] }];
  });

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
      const [rec] = await Promise.all([postRecommend(target.itinerary), delay(MIN_THINKING_MS)]);
      setRecommendation(rec);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  // 行程頁「上網」：還沒買就看推薦，買了就看全團網卡。
  function openNetwork() {
    if (purchased) {
      push("team");
      return;
    }
    push("plan");
    if (!recommendation && !loading) void fetchRecommendation(persona);
  }

  // 從首頁 / 探索跳進行程分頁的入口：先回到行程頁，讓返回鍵落在行程上。
  function openInTrip(v: TripView) {
    setStack(v === "trip" ? ["trip"] : ["trip", v]);
    setTab("trip");
  }
  function goToNetwork() {
    if (purchased) {
      openInTrip("team");
      return;
    }
    openInTrip("plan");
    if (!recommendation && !loading) void fetchRecommendation(persona);
  }

  function runAction(action: Exclude<DemoAction, "coupon">) {
    const needsPurchase = action === "team" || action === "activation" || action === "topup";
    if (action === "network" || (needsPurchase && !purchased)) goToNetwork();
    else openInTrip(action);
  }

  function startHandoff(next: Handoff) {
    setHandoff(next);
    push("handoff");
  }

  function finishHandoff() {
    if (!handoff) return;
    const bought = Object.fromEntries(handoff.items.map((i) => [i.memberId, i.plan]));
    if (handoff.kind === "trip") setPurchased(bought);
    else setAddOnsBought(bought);
    setHandoff(null);
    setStack(["trip", "team"]);
  }

  function pickPersona(p: Persona) {
    setPersonaId(p.id);
    setRecommendation(null);
    setPlanOverrides({});
    setPurchased(null);
    setAddOnsBought(null);
    setHandoff(null);
    setError(null);
    setStack(["trip"]);
    setTab("trip");
  }

  function renderTripStack() {
    switch (view) {
      case "plan":
        return (
          <PlanScreen
            itinerary={itinerary}
            recommendation={recommendation}
            loading={loading}
            error={error}
            selectedPlans={selectedPlans}
            onSelect={(memberId, planId) =>
              setPlanOverrides((prev) => ({ ...prev, [memberId]: planId }))
            }
            onBack={back}
            onGoBuy={() =>
              startHandoff({
                kind: "trip",
                items: itinerary.members.flatMap((m) =>
                  selectedPlans[m.id] ? [{ memberId: m.id, who: m.name, plan: selectedPlans[m.id] }] : [],
                ),
              })
            }
            onOpenChat={() => push("chat")}
          />
        );
      case "handoff":
        return handoff ? (
          <HandoffScreen
            title={handoff.kind === "trip" ? "前往購買" : "前往加買"}
            items={handoff.items}
            onBack={back}
            onDone={finishHandoff}
          />
        ) : (
          <div className="error">沒有要購買的方案</div>
        );
      case "team":
        return (
          <TeamScreen
            cards={teamCards}
            phase={phase}
            onOpenActivation={() => push("activation")}
            onBack={back}
          />
        );
      case "activation": {
        const organizer = itinerary.members.find((m) => m.isOrganizer);
        return <ActivationScreen device={organizer?.device ?? "手機"} onBack={back} />;
      }
      case "topup":
        return purchased && recommendation ? (
          <TopUpScreen
            itinerary={itinerary}
            extension={persona.extension}
            bought={purchased}
            addOns={recommendation.addOns}
            isAddOnBought={addOnsBought !== null}
            onBack={back}
            onGoBuy={(items) => startHandoff({ kind: "topup", items })}
          />
        ) : (
          <div className="error">還沒買這趟的網卡</div>
        );
      case "chat":
        return <ChatScreen onBack={back} />;
      case "companion":
        return (
          <CompanionScreen
            scenario={getCompanionScenario(persona.id)}
            companions={itinerary.companions}
            onBack={back}
            onDone={() => setStack(["trip"])}
          />
        );
      case "trip":
      default:
        return (
          <TripScreen
            itinerary={itinerary}
            networkPlanName={purchased ? `${Object.keys(purchased).length} 張 eSIM` : null}
            onOpenNetwork={openNetwork}
            onOpenCompanion={() => push("companion")}
          />
        );
    }
  }

  function renderTab() {
    switch (tab) {
      case "home":
        return (
          <HomeScreen
            phase={phase}
            isPurchased={purchased !== null}
            onPhase={setPhase}
            onOpenTrip={() => openInTrip("trip")}
            onAction={runAction}
            onOpenExplore={() => setTab("explore")}
          />
        );
      case "explore":
        return <ExploreScreen itinerary={itinerary} onOpenNetwork={goToNetwork} />;
      case "me":
        return <MeScreen currentId={personaId} onPick={pickPersona} />;
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
