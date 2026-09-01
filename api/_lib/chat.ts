import { getClient, hasApiKey, MODEL } from "./anthropic.js";
import { CATALOG } from "./catalog.js";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatInput {
  messages: ChatMessage[];
}

const CHAT_SYSTEM = [
  "你是「去趣 eSIM」的客服顧問，親切、精準、講重點。",
  "專門解答旅客出國上網的疑問，特別是三種焦慮：",
  "1. 相容性：iPhone XS/XR 以後、以及支援 eSIM 的 Android 才能用；中港澳版手機可能不支援，需請使用者確認。",
  "2. 何時開通：建議出發前在 Wi-Fi 環境掃 QR Code 安裝、先別開啟，落地後再打開行動數據，就能用滿天數、也不怕落地沒網。",
  "3. 中國上網：去趣的中國方案免翻牆，可直接使用 Line / Google / IG，不需另外裝 VPN。",
  "回答用繁體中文，簡潔友善，必要時可主動推薦合適方案。",
  `可販售方案（JSON）：${JSON.stringify(CATALOG)}`,
].join("\n");

export async function chat({ messages }: ChatInput): Promise<{ reply: string }> {
  if (!hasApiKey()) return { reply: mockChatReply(messages) };

  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: CHAT_SYSTEM,
    messages,
  });

  const reply = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return { reply: reply || "抱歉，我沒有理解，可以再說一次嗎？" };
}

function mockChatReply(messages: ChatMessage[]): string {
  const last = messages[messages.length - 1]?.content ?? "";
  if (/中國|翻牆|VPN|line|google|ig/i.test(last)) {
    return "去趣的中國方案是免翻牆的，落地後直接就能用 Line、Google、IG，不用另外裝 VPN。（此為未串接金鑰時的示範回覆）";
  }
  if (/相容|支援|型號|iphone|android|安卓/i.test(last)) {
    return "iPhone XS/XR 以後的機型都支援 eSIM；Android 要看型號，中港澳版可能不支援，建議先到設定確認。告訴我你的手機型號，我幫你確認。（示範回覆）";
  }
  if (/開通|安裝|什麼時候|落地|沒網/i.test(last)) {
    return "建議出發前在家用 Wi-Fi 掃 QR Code 安裝好、先別開啟，落地後再打開行動數據，就能用滿天數、也不怕一下飛機沒網。（示範回覆）";
  }
  return "這是未串接 ANTHROPIC_API_KEY 時的示範回覆。填入金鑰後，這裡會由 Claude 即時回答旅客的上網問題。";
}
