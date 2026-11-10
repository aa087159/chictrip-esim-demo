import { useEffect, useRef, useState } from "react";

const TOAST_MS = 1600;

// 首頁 / 探索 上不屬於 demo 流程的入口，點了顯示一個短暫提示，避免看起來像壞掉的按鈕。
export function useDemoToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(text = "Demo 示意，此入口未開放") {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(null), TOAST_MS);
  }

  return { message, show };
}
