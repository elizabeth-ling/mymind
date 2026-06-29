import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Verify we can reach the database
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Connected to database");

    // 2. Report row counts for each model
    const [
      users,
      itemTypes,
      items,
      collections,
      tags,
      usageEvents,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.item.count(),
      prisma.collection.count(),
      prisma.tag.count(),
      prisma.itemUsageEvent.count(),
    ]);

    console.log("\nRow counts:");
    console.log(`  users:        ${users}`);
    console.log(`  itemTypes:    ${itemTypes}`);
    console.log(`  items:        ${items}`);
    console.log(`  collections:  ${collections}`);
    console.log(`  tags:         ${tags}`);
    console.log(`  usageEvents:  ${usageEvents}`);

    // 3. Show seeded system item types
    const systemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
      select: { name: true, slug: true, contentType: true, isProOnly: true },
    });

    console.log(`\nSystem item types (${systemTypes.length}):`);
    for (const type of systemTypes) {
      const pro = type.isProOnly ? " [Pro]" : "";
      console.log(`  ${type.name} (${type.slug}) — ${type.contentType}${pro}`);
    }

    console.log("\n✓ Database test completed successfully");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("✗ Database test failed:");
  console.error(error);
  process.exit(1);
});
