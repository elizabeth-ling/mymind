import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, ContentType } from "../src/generated/prisma/client";

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

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
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
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
