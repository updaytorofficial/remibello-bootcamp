/** Very light content renderer: paragraphs + line breaks, escaped HTML. */
export function renderPostHtml(content: string): string {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      const withBreaks = block.trim().replace(/\n/g, "<br />");
      if (!withBreaks) return "";
      // Simple markdown-ish headings: lines starting with # 
      if (withBreaks.startsWith("# ")) {
        return `<h2 class="font-display text-3xl tracking-wide text-mist-50 mt-8 mb-3">${withBreaks.slice(2)}</h2>`;
      }
      if (withBreaks.startsWith("## ")) {
        return `<h3 class="font-display text-2xl tracking-wide text-mist-50 mt-6 mb-2">${withBreaks.slice(3)}</h3>`;
      }
      return `<p class="text-mist-200 leading-relaxed mb-5">${withBreaks}</p>`;
    })
    .join("");
}
