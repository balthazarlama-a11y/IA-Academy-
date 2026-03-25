export type PostKind = "blog" | "tool" | "guide" | "news";
export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export type PostContentParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type PostContentHeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
};

export type PostContentImageBlock = {
  type: "image";
  src: string;
  alt?: string | null;
  caption?: string | null;
};

export type PostContentQuoteBlock = {
  type: "quote";
  text: string;
  cite?: string | null;
};

export type PostContentCalloutBlock = {
  type: "callout";
  tone?: "info" | "success" | "warning" | "note";
  text: string;
};

export type PostContentListBlock = {
  type: "list";
  ordered?: boolean;
  items: string[];
};

export type PostContentDividerBlock = {
  type: "divider";
};

export type PostContentToolEmbedBlock = {
  type: "tool_embed";
  toolSlug: string;
  note?: string | null;
};

export type PostContentBlock =
  | PostContentParagraphBlock
  | PostContentHeadingBlock
  | PostContentImageBlock
  | PostContentQuoteBlock
  | PostContentCalloutBlock
  | PostContentListBlock
  | PostContentDividerBlock
  | PostContentToolEmbedBlock;

export type PostSummary = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  hero_image_alt: string | null;
  hero_image_caption: string | null;
  ia_type: string | null;
  post_kind: PostKind;
  published_at: string | null;
};

export type Post = PostSummary;

export type PostDetail = PostSummary & {
  content_md: string;
  content_json: PostContentBlock[];
  created_at: string;
  updated_at: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown): string | null {
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : null;
}

function parseListItems(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeText(item))
    .filter((item) => item.length > 0);
}

function parseTone(value: unknown): "info" | "success" | "warning" | "note" | undefined {
  const normalized = normalizeText(value);
  if (normalized === "info" || normalized === "success" || normalized === "warning" || normalized === "note") {
    return normalized;
  }
  return undefined;
}

export function normalizePostContentBlocks(value: unknown): PostContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const blocks: PostContentBlock[] = [];

  for (const item of value) {
    if (!isRecord(item) || typeof item.type !== "string") {
      continue;
    }

    switch (item.type) {
      case "paragraph": {
        const text = normalizeText(item.text);
        if (text) {
          blocks.push({ type: "paragraph", text });
        }
        break;
      }
      case "heading": {
        const rawLevel = Number(item.level);
        const level = rawLevel === 1 || rawLevel === 2 || rawLevel === 3 ? rawLevel : 2;
        const text = normalizeText(item.text);
        if (text) {
          blocks.push({ type: "heading", level, text });
        }
        break;
      }
      case "image": {
        const src = normalizeText(item.src);
        if (!src) break;
        blocks.push({
          type: "image",
          src,
          alt: normalizeOptionalText(item.alt),
          caption: normalizeOptionalText(item.caption),
        });
        break;
      }
      case "quote": {
        const text = normalizeText(item.text);
        if (text) {
          blocks.push({
            type: "quote",
            text,
            cite: normalizeOptionalText(item.cite),
          });
        }
        break;
      }
      case "callout": {
        const text = normalizeText(item.text);
        if (text) {
          blocks.push({
            type: "callout",
            tone: parseTone(item.tone),
            text,
          });
        }
        break;
      }
      case "list": {
        const items = parseListItems(item.items);
        if (items.length > 0) {
          blocks.push({
            type: "list",
            ordered: Boolean(item.ordered),
            items,
          });
        }
        break;
      }
      case "divider": {
        blocks.push({ type: "divider" });
        break;
      }
      case "tool_embed": {
        const toolSlug = normalizeText(item.toolSlug);
        if (toolSlug) {
          blocks.push({
            type: "tool_embed",
            toolSlug,
            note: normalizeOptionalText(item.note),
          });
        }
        break;
      }
      default:
        break;
    }
  }

  return blocks;
}

function parseMarkdownImage(line: string): PostContentImageBlock | null {
  const match = line.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]+)")?\)$/);
  if (!match) return null;
  const [, alt, src, caption] = match;
  return {
    type: "image",
    src,
    alt: normalizeOptionalText(alt),
    caption: normalizeOptionalText(caption),
  };
}

function parseMarkdownQuote(blockLines: string[]): PostContentQuoteBlock | null {
  const text = blockLines
    .map((line) => line.replace(/^>\s?/, "").trim())
    .filter(Boolean)
    .join(" ");

  if (!text) return null;

  return { type: "quote", text };
}

function parseMarkdownList(blockLines: string[], ordered: boolean): PostContentListBlock | null {
  const items = blockLines
    .map((line) => line.replace(/^(?:[-*]|\d+\.)\s+/, "").trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return { type: "list", ordered, items };
}

export function markdownToPostContentBlocks(markdown: string): PostContentBlock[] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const rawBlocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const blocks: PostContentBlock[] = [];

  for (const rawBlock of rawBlocks) {
    const lines = rawBlock.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      continue;
    }

    if (lines.length === 1) {
      const line = lines[0];

      const imageBlock = parseMarkdownImage(line);
      if (imageBlock) {
        blocks.push(imageBlock);
        continue;
      }

      if (/^#{1,3}\s+/.test(line)) {
        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
          const level = Math.min(3, Math.max(1, headingMatch[1].length)) as 1 | 2 | 3;
          const text = headingMatch[2].trim();
          if (text) {
            blocks.push({ type: "heading", level, text });
          }
        }
        continue;
      }

      if (/^---+$/.test(line)) {
        blocks.push({ type: "divider" });
        continue;
      }

      if (/^>\s?/.test(line)) {
        const quoteBlock = parseMarkdownQuote(lines);
        if (quoteBlock) {
          blocks.push(quoteBlock);
        }
        continue;
      }

      blocks.push({ type: "paragraph", text: line });
      continue;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      const listBlock = parseMarkdownList(lines, false);
      if (listBlock) {
        blocks.push(listBlock);
      }
      continue;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      const listBlock = parseMarkdownList(lines, true);
      if (listBlock) {
        blocks.push(listBlock);
      }
      continue;
    }

    if (lines.every((line) => /^>\s?/.test(line))) {
      const quoteBlock = parseMarkdownQuote(lines);
      if (quoteBlock) {
        blocks.push(quoteBlock);
      }
      continue;
    }

    blocks.push({ type: "paragraph", text: lines.join(" ") });
  }

  return blocks;
}

export function postContentBlocksToMarkdown(blocks: PostContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.text;
        case "heading":
          return `${"#".repeat(block.level)} ${block.text}`;
        case "image":
          return `![${block.alt ?? ""}](${block.src}${block.caption ? ` "${block.caption}"` : ""})`;
        case "quote":
          return block.text
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n");
        case "callout":
          return block.text;
        case "list":
          return block.items
            .map((item, index) => (block.ordered ? `${index + 1}. ${item}` : `- ${item}`))
            .join("\n");
        case "divider":
          return "---";
        case "tool_embed":
          return `[[tool:${block.toolSlug}]]${block.note ? ` ${block.note}` : ""}`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function postContentBlocksToPlainText(blocks: PostContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
        case "heading":
        case "quote":
        case "callout":
          return block.text;
        case "image":
          return block.caption || block.alt || "";
        case "list":
          return block.items.join(" ");
        case "tool_embed":
          return `${block.toolSlug} ${block.note ?? ""}`.trim();
        case "divider":
          return "";
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function collectPostContentImageUrls(blocks: PostContentBlock[]): string[] {
  const urls = new Set<string>();

  for (const block of blocks) {
    if (block.type !== "image") continue;
    const src = block.src.trim();
    if (!src) continue;
    urls.add(src);
  }

  return Array.from(urls);
}
