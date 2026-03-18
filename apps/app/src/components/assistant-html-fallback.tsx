"use client";

import { useEffect } from "react";
import { createRoot, Root } from "react-dom/client";

import { WidgetRenderer } from "@/components/generative-ui/widget-renderer";

const roots = new WeakMap<HTMLElement, Root>();

function looksLikeHtml(html: string) {
  const text = html.trim();
  if (!text.startsWith("<")) return false;
  return /<(div|section|article|main|svg|canvas|style|script|table|form|button|input)\b/i.test(text);
}

function extractHtmlFromCodeBlock(pre: HTMLPreElement) {
  const code = pre.querySelector("code");
  if (!code) return null;

  const html = code.textContent?.trim() ?? "";
  if (!looksLikeHtml(html)) return null;

  return html;
}

function renderFallback(pre: HTMLPreElement, html: string) {
  if (pre.dataset.htmlFallbackMounted === "true") return;

  const mountPoint = document.createElement("div");
  mountPoint.dataset.htmlFallbackRoot = "true";
  pre.dataset.htmlFallbackMounted = "true";
  pre.style.display = "none";
  pre.insertAdjacentElement("afterend", mountPoint);

  const root = createRoot(mountPoint);
  roots.set(mountPoint, root);
  root.render(
    <WidgetRenderer
      title="Generated UI"
      description="Rendered from an assistant HTML code block fallback."
      html={html}
    />
  );
}

function scanAssistantMessages() {
  const messages = document.querySelectorAll<HTMLElement>('[data-testid="copilot-assistant-message"]');
  for (const message of messages) {
    const codeBlocks = message.querySelectorAll<HTMLPreElement>("pre");
    for (const pre of codeBlocks) {
      const html = extractHtmlFromCodeBlock(pre);
      if (!html) continue;
      renderFallback(pre, html);
    }
  }
}

export function AssistantHtmlFallback() {
  useEffect(() => {
    scanAssistantMessages();

    const observer = new MutationObserver(() => {
      scanAssistantMessages();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      document.querySelectorAll<HTMLElement>("[data-html-fallback-root]").forEach((node) => {
        roots.get(node)?.unmount();
        roots.delete(node);
      });
    };
  }, []);

  return null;
}
