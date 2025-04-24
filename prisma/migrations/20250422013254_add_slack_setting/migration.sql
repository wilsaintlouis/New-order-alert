-- CreateTable
CREATE TABLE "SlackSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "slackWebhookUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SlackSetting_shop_key" ON "SlackSetting"("shop");
