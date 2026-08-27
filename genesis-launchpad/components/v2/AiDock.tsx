"use client";

import { useRef, useState } from "react";
import {
  IconSpark,
  IconSend,
  IconX,
  IconPaperclip,
  IconLink,
  IconCode,
  IconMic,
} from "./icons";

const MAX = 2000;

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hey — I'm the Genesis assistant. Ask me about pricing, how the AI receptionist works, or what's included in each plan.",
};

const FALLBACK_ERROR =
  "I'm having trouble connecting right now. You can book a free 20-minute call at /contact, or try again in a moment.";

/**
 * The always-on assistant. Collapsed to a pill until asked for, then it
 * opens into the full composer. Talks to /api/ai-dock, which is grounded
 * only in real public product/pricing facts — it has no access to any
 * visitor's actual account or call data.
 */
export function AiDock() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [sending, setSending] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = threadRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const send = async () => {
    const text = value.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setValue("");
    setSending(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/ai-dock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json().catch(() => null)) as { ok: boolean; reply?: string } | null;

      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: data?.ok && data.reply ? data.reply : FALLBACK_ERROR },
      ]);
    } catch {
      setMessages((cur) => [...cur, { role: "assistant", content: FALLBACK_ERROR }]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="v2-ai-shell">
      {open ? (
        <div className="v2-ai-panel" role="dialog" aria-label="Genesis assistant">
          <header className="v2-ai-head">
            <span className="v2-ai-title">
              <span className="v2-live-dot" />
              Genesis assistant
            </span>
            <span className="v2-ai-head-right">
              <span className="v2-ai-badge">Your data</span>
              <button
                className="v2-ai-x"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                <IconX />
              </button>
            </span>
          </header>

          <div className="v2-ai-thread" ref={threadRef}>
            {messages.map((m, i) => (
              <p key={i} className={`v2-ai-msg v2-ai-msg--${m.role === "user" ? "you" : "ai"}`}>
                {m.content}
              </p>
            ))}
            {sending ? <p className="v2-ai-msg v2-ai-msg--ai v2-ai-msg--typing">Thinking…</p> : null}
          </div>

          <div className="v2-ai-composer">
            <textarea
              className="v2-ai-textarea"
              placeholder="Ask anything about pricing, how it works, or what's included…"
              rows={3}
              maxLength={MAX}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Ask the assistant"
            />

            <div className="v2-ai-tools">
              <div className="v2-ai-tool-group">
                <button className="v2-ai-tool" aria-label="Attach a file (coming soon)" type="button" disabled>
                  <IconPaperclip />
                </button>
                <button className="v2-ai-tool" aria-label="Add a link (coming soon)" type="button" disabled>
                  <IconLink />
                </button>
                <button className="v2-ai-tool" aria-label="Insert code (coming soon)" type="button" disabled>
                  <IconCode />
                </button>
                <button className="v2-ai-tool" aria-label="Use voice (coming soon)" type="button" disabled>
                  <IconMic />
                </button>
              </div>

              <div className="v2-ai-tool-group">
                <span className="v2-ai-count">
                  {value.length}/{MAX}
                </span>
                <button
                  className="v2-ai-send"
                  aria-label="Send message"
                  type="button"
                  disabled={sending || !value.trim()}
                  onClick={send}
                >
                  <IconSend />
                </button>
              </div>
            </div>
          </div>

          <footer className="v2-ai-foot">
            <span>
              Press <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line
            </span>
            <span className="v2-ai-status">
              <span className="v2-ai-status-dot" />
              All systems operational
            </span>
          </footer>
        </div>
      ) : (
        <button
          className="v2-ai-fab"
          onClick={() => setOpen(true)}
          aria-label="Ask Genesis"
        >
          <IconSpark />
          <span className="v2-ai-fab-label">Ask Genesis</span>
        </button>
      )}
    </div>
  );
}
