import { NavBar } from "../components/NavBar";
import { ChatPanel } from "../components/ChatPanel";

interface Props {
  onBack: () => void;
}

export function ChatScreen({ onBack }: Props) {
  return (
    <>
      <NavBar title="AI 上網管家" onBack={onBack} />
      <div className="chat-screen">
        <ChatPanel />
      </div>
    </>
  );
}
