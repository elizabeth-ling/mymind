import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import {
  PrismaClient,
  ContentType,
  type ItemType,
} from "../src/generated/prisma/client";

// ---------------------------------------------------------------------------
// System item types
// ---------------------------------------------------------------------------

const systemItemTypes: Array<{
  name: string;
  slug: string;
  icon: string;
  color: string;
  softBg: string;
  borderColor: string;
  contentType: ContentType;
  isProOnly: boolean;
}> = [
  {
    name: "Snippet",
    slug: "snippet",
    icon: "Code",
    color: "#2563eb",
    softBg: "#eff6ff",
    borderColor: "#bfdbfe",
    contentType: ContentType.TEXT,
    isProOnly: false,
  },
  {
    name: "Prompt",
    slug: "prompt",
    icon: "Sparkles",
    color: "#7c3aed",
    softBg: "#f5f3ff",
    borderColor: "#ddd6fe",
    contentType: ContentType.TEXT,
    isProOnly: false,
  },
  {
    name: "Command",
    slug: "command",
    icon: "Terminal",
    color: "#ea580c",
    softBg: "#fff7ed",
    borderColor: "#fed7aa",
    contentType: ContentType.TEXT,
    isProOnly: false,
  },
  {
    name: "Note",
    slug: "note",
    icon: "StickyNote",
    color: "#ca8a04",
    softBg: "#fefce8",
    borderColor: "#fde68a",
    contentType: ContentType.TEXT,
    isProOnly: false,
  },
  {
    name: "File",
    slug: "file",
    icon: "FileText",
    color: "#64748b",
    softBg: "#f8fafc",
    borderColor: "#e2e8f0",
    contentType: ContentType.FILE,
    isProOnly: true,
  },
  {
    name: "Image",
    slug: "image",
    icon: "Image",
    color: "#db2777",
    softBg: "#fdf2f8",
    borderColor: "#fbcfe8",
    contentType: ContentType.IMAGE,
    isProOnly: true,
  },
  {
    name: "Link",
    slug: "link",
    icon: "Link",
    color: "#059669",
    softBg: "#ecfdf5",
    borderColor: "#a7f3d0",
    contentType: ContentType.URL,
    isProOnly: false,
  },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SeedItem = {
  type: "snippet" | "prompt" | "command" | "note" | "link";
  title: string;
  description: string;
  content?: string;
  url?: string;
  language?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
};

type SeedCollection = {
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
};

const collections: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        type: "snippet",
        title: "useDebounce hook",
        description: "Debounce a rapidly changing value",
        language: "typescript",
        tags: ["react", "hooks"],
        isFavorite: true,
        isPinned: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        type: "snippet",
        title: "useLocalStorage hook",
        description: "State synced to localStorage",
        language: "typescript",
        tags: ["react", "hooks"],
        content: `import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        type: "snippet",
        title: "Theme context provider",
        description: "Compound context provider with a typed hook",
        language: "typescript",
        tags: ["react", "context"],
        content: `import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    items: [
      {
        type: "prompt",
        title: "Code review prompt",
        description: "Thorough code review with prioritized findings",
        tags: ["ai", "review"],
        isPinned: true,
        content: `You are a senior engineer reviewing a pull request.

Review the diff below for:
1. Correctness bugs and edge cases
2. Security issues (auth, input validation, injection)
3. Performance concerns (N+1 queries, unnecessary work)
4. Readability and adherence to existing patterns

Return findings grouped by severity (Critical, High, Medium, Low).
For each finding include the file, the issue, and a concrete fix.

Diff:
"""
{{diff}}
"""`,
      },
      {
        type: "prompt",
        title: "Documentation generator",
        description: "Generate clear docs from source code",
        tags: ["ai", "docs"],
        content: `Generate developer documentation for the following code.

Include:
- A one-paragraph overview of what it does
- Parameters and return values with types
- A short, runnable usage example
- Any gotchas or edge cases

Write in clear Markdown. Do not restate the code line by line.

Code:
"""
{{code}}
"""`,
      },
      {
        type: "prompt",
        title: "Refactoring assistant",
        description: "Suggest safe, incremental refactors",
        tags: ["ai", "refactor"],
        content: `Act as a refactoring assistant.

Given the code below, propose refactors that improve readability and
maintainability without changing behavior. For each suggestion:
- Explain the problem briefly
- Show the before/after
- Note any risk and how to verify behavior is preserved

Prefer small, incremental changes over large rewrites.

Code:
"""
{{code}}
"""`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        type: "snippet",
        title: "Multi-stage Dockerfile for Next.js",
        description: "Production Docker build using the standalone output",
        language: "dockerfile",
        tags: ["docker", "nextjs"],
        content: `FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: "command",
        title: "Deploy to Vercel (production)",
        description: "Build and deploy the current project to production",
        language: "bash",
        tags: ["deploy", "vercel"],
        content: `vercel pull --yes --environment=production && \\
vercel build --prod && \\
vercel deploy --prebuilt --prod`,
      },
      {
        type: "link",
        title: "GitHub Actions documentation",
        description: "Official docs for CI/CD workflows on GitHub",
        url: "https://docs.github.com/en/actions",
        tags: ["ci", "github"],
      },
      {
        type: "link",
        title: "Docker documentation",
        description: "Official Docker reference and guides",
        url: "https://docs.docker.com/",
        tags: ["docker"],
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        type: "command",
        title: "Undo last commit (keep changes)",
        description: "Reset the last commit but keep the work in the index",
        language: "bash",
        tags: ["git"],
        isFavorite: true,
        content: "git reset --soft HEAD~1",
      },
      {
        type: "command",
        title: "Remove all stopped containers",
        description: "Clean up exited Docker containers",
        language: "bash",
        tags: ["docker"],
        content: "docker container prune -f",
      },
      {
        type: "command",
        title: "Kill process on a port",
        description: "Find and kill whatever is listening on port 3000",
        language: "bash",
        tags: ["process"],
        content: "lsof -ti:3000 | xargs kill -9",
      },
      {
        type: "command",
        title: "Find outdated npm packages",
        description: "List dependencies with newer versions available",
        language: "bash",
        tags: ["npm"],
        content: "npm outdated",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        type: "link",
        title: "Tailwind CSS documentation",
        description: "Utility-first CSS framework reference",
        url: "https://tailwindcss.com/docs",
        tags: ["css", "tailwind"],
      },
      {
        type: "link",
        title: "shadcn/ui",
        description: "Accessible, copy-paste React component library",
        url: "https://ui.shadcn.com/",
        tags: ["components", "react"],
        isFavorite: true,
      },
      {
        type: "link",
        title: "Material Design 3",
        description: "Google's design system guidelines",
        url: "https://m3.material.io/",
        tags: ["design-system"],
      },
      {
        type: "link",
        title: "Lucide Icons",
        description: "Beautiful, consistent open-source icon set",
        url: "https://lucide.dev/icons/",
        tags: ["icons"],
      },
    ],
  },
];

const CONTENT_TYPE_BY_ITEM: Record<SeedItem["type"], ContentType> = {
  snippet: ContentType.TEXT,
  prompt: ContentType.TEXT,
  command: ContentType.TEXT,
  note: ContentType.TEXT,
  link: ContentType.URL,
};

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // --- System item types (idempotent upsert) ---
    for (const type of systemItemTypes) {
      const existing = await prisma.itemType.findFirst({
        where: { isSystem: true, slug: type.slug, userId: null },
      });

      if (existing) {
        await prisma.itemType.update({
          where: { id: existing.id },
          data: {
            name: type.name,
            icon: type.icon,
            color: type.color,
            softBg: type.softBg,
            borderColor: type.borderColor,
            contentType: type.contentType,
            isProOnly: type.isProOnly,
          },
        });
      } else {
        await prisma.itemType.create({
          data: { ...type, isSystem: true },
        });
      }
    }
    console.log(`Seeded ${systemItemTypes.length} system item types`);

    const itemTypesBySlug = new Map<string, ItemType>();
    for (const type of await prisma.itemType.findMany({
      where: { isSystem: true, userId: null },
    })) {
      itemTypesBySlug.set(type.slug, type);
    }

    // --- Demo user (upsert by email) ---
    const passwordHash = await bcrypt.hash("12345678", 12);
    const user = await prisma.user.upsert({
      where: { email: "demo@mymind.io" },
      update: {
        name: "Demo User",
        passwordHash,
        isPro: false,
        emailVerified: new Date(),
      },
      create: {
        email: "demo@mymind.io",
        name: "Demo User",
        passwordHash,
        isPro: false,
        emailVerified: new Date(),
      },
    });
    console.log(`Seeded demo user (${user.email})`);

    // --- Reset the demo user's sample data so the seed is re-runnable ---
    await prisma.item.deleteMany({ where: { userId: user.id } });
    await prisma.collection.deleteMany({ where: { userId: user.id } });
    await prisma.tag.deleteMany({ where: { userId: user.id } });

    // --- Tags (collected across all items, created once per user) ---
    const tagNames = new Set<string>();
    for (const collection of collections) {
      for (const item of collection.items) {
        for (const tag of item.tags ?? []) tagNames.add(tag);
      }
    }

    const tagsByName = new Map<string, { id: string }>();
    for (const name of tagNames) {
      const tag = await prisma.tag.create({
        data: { userId: user.id, name, slug: slugify(name) },
        select: { id: true },
      });
      tagsByName.set(name, tag);
    }
    console.log(`Seeded ${tagsByName.size} tags`);

    // --- Collections + items ---
    let itemCount = 0;
    // Stagger lastUsedAt so the dashboard "recent" ordering looks natural.
    let minutesAgo = 0;

    for (const collection of collections) {
      const created = await prisma.collection.create({
        data: {
          userId: user.id,
          name: collection.name,
          slug: slugify(collection.name),
          description: collection.description,
          isFavorite: collection.isFavorite ?? false,
        },
      });

      for (const item of collection.items) {
        const itemType = itemTypesBySlug.get(item.type);
        if (!itemType) {
          throw new Error(`Missing system item type for slug "${item.type}"`);
        }

        const lastUsedAt = new Date(Date.now() - minutesAgo * 60_000);
        minutesAgo += 137; // ~2.3h between items

        await prisma.item.create({
          data: {
            userId: user.id,
            itemTypeId: itemType.id,
            title: item.title,
            description: item.description,
            contentType: CONTENT_TYPE_BY_ITEM[item.type],
            content: item.content ?? null,
            url: item.url ?? null,
            language: item.language ?? null,
            isFavorite: item.isFavorite ?? false,
            isPinned: item.isPinned ?? false,
            lastUsedAt,
            collections: {
              create: { collectionId: created.id },
            },
            tags: {
              create: (item.tags ?? []).map((name) => ({
                tagId: tagsByName.get(name)!.id,
              })),
            },
          },
        });
        itemCount += 1;
      }
    }

    console.log(
      `Seeded ${collections.length} collections and ${itemCount} items`,
    );
    console.log("Seed complete");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
