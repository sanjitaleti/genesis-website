"use client";

import { useState } from "react";
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

/**
 * The always-on assistant. Collapsed to a pill until asked for, then it opens
 * into the full composer. This is the interface only; wiring it to a model is
 * a separate, metered step.
 */
export function AiDock() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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

          <div className="v2-ai-thread">
            <p className="v2-ai-msg v2-ai-msg--you">
              How many calls did we miss last week?
            </p>
            <p className="v2-ai-msg v2-ai-msg--ai">
              None went unanswered. 47 came in after hours, all of them picked up,
              and 12 turned into booked jobs.
            </p>
          </div>

          <div className="v2-ai-composer">
            <textarea
              className="v2-ai-textarea"
              placeholder="Ask anything about your numbers, your calls, or what we're working on…"
              rows={3}
              maxLength={MAX}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Ask the assistant"
            />

            <div className="v2-ai-tools">
              <div className="v2-ai-tool-group">
                <button className="v2-ai-tool" aria-label="Attach a file" type="button">
                  <IconPaperclip />
                </button>
                <button className="v2-ai-tool" aria-label="Add a link" type="button">
                  <IconLink />
                </button>
                <button className="v2-ai-tool" aria-label="Insert code" type="button">
                  <IconCode />
                </button>
                <button className="v2-ai-tool" aria-label="Use voice" type="button">
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
