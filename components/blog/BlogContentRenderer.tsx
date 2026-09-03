"use client";

import React, { useState } from "react";

interface BlogContentRendererProps {
  content: string;
}

// Helper to format inline markdown like **bold** and `code`
function renderInline(text: string): React.ReactNode {
  // Match bold **text** or inline code `code`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-primary-300 font-mono text-[13px]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts.length > 0 ? parts : text;
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-border/80 bg-surface-1 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-surface-2/70 text-xs text-muted-fg font-mono">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/60 inline-block" />
          </div>
          <span className="ml-2 uppercase tracking-wider text-[10px] text-muted-fg font-medium">
            {lang || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="px-2 py-0.5 rounded text-[11px] font-mono hover:bg-surface-3 hover:text-foreground transition-colors"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-neutral-200 leading-relaxed bg-[#0d1117]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MarkdownTable({ rows }: { rows: string[] }) {
  if (rows.length < 2) return null;

  const parseRow = (row: string) =>
    row
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

  const headers = parseRow(rows[0]);
  // rows[1] is the separator |---|---|
  const dataRows = rows.slice(2).map(parseRow);

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border bg-surface-1">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-2/60">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold text-foreground">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-surface-2/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-3 text-muted-fg">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BlogContentRenderer({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Code block ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <CodeBlock key={`code-${i}`} code={codeLines.join("\n")} lang={lang} />
      );
      continue;
    }

    // Markdown table starting with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableRows.push(lines[i].trim());
        i++;
      }
      elements.push(<MarkdownTable key={`table-${i}`} rows={tableRows} />);
      continue;
    }

    // H2 ##
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3 tracking-tight border-b border-border/40 pb-2"
        >
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // H3 ###
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="font-heading text-lg sm:text-xl font-bold text-foreground mt-6 mb-2 text-primary-300"
        >
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Unordered list item (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 space-y-2 list-none">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-fg leading-relaxed">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list item (e.g. 1. )
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-2 list-none">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-fg leading-relaxed">
              <span className="font-mono text-xs text-primary-400 font-bold mt-0.5 flex-shrink-0 w-5">
                {idx + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-sm sm:text-base text-muted-fg leading-relaxed my-3">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="article-body font-sans">{elements}</div>;
}
