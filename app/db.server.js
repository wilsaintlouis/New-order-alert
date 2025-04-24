import { PrismaClient } from "@prisma/client";

// 🔧 MOVE THIS TO THE TOP FIRST
const prisma = global.prismaGlobal ?? new PrismaClient();

// ✅ Define helper functions after `prisma` exists
export async function getSlackWebhookUrl(shop) {
  const setting = await prisma.shopSettings.findUnique({ where: { shop } });
  return setting?.slackWebhookUrl || null;
}

export async function saveSlackWebhookUrl(shop, url) {
  return await prisma.shopSettings.upsert({
    where: { shop },
    update: { slackWebhookUrl: url },
    create: { shop, slackWebhookUrl: url },
  });
}

// ✅ Ensure only one client in dev
if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = prisma;
  }
}

export default prisma;
