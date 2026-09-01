import { useState } from "react";
import { postChat, type ChatMessage } from "../lib/api";

const SUGGESTIONS = [
  "我的手機是 iPhone 12，可以用嗎？",
  "eSIM 什麼時候開通？落地沒網怎麼辦？",
  "去中國能用 Line 和 Google 嗎？",
];

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await postChat(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: `出錯了：${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat-log">
        {messages.length === 0 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bubble assistant typing">AI 客服輸入中…</div>}
      </div>

      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入你的上網疑問…"
        />
        <button className="chat-send" type="submit" disabled={loading}>
          送出
        </button>
      </form>
    </div>
  );
}
