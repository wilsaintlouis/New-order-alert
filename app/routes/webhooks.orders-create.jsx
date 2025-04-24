import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  try {
    // Payload is obtained here
    const { topic, shop, payload } = await authenticate.webhook(request);

    console.log(`Webhook received: ${topic} for shop ${shop}`);

    // --- Add this line to log the payload ---
    console.log("Webhook Payload:", JSON.stringify(payload, null, 2));
    // --- End of added line ---

    if (topic !== "ORDERS_CREATE") {
      console.warn(`Received unexpected webhook topic: ${topic}`);
      // It's good practice to still return success for webhooks you don't handle
      // to prevent Shopify from resending them unnecessarily.
      return ({ success: true });
    }

    // Now you can safely use the payload, knowing it has been logged
    const order = payload;
    const settings = await prisma.shopSettings.findUnique({ where: { shop } });

    if (!settings?.slackWebhookUrl) {
      console.warn(`No Slack URL configured for ${shop}`);
      return ({ success: true }); // Still success, just not processed
    }
const totalPrice = order.total_price || "0.00";

const lineItems = order.line_items?.map(item => {
  return `- ${item.title} (${item.variant_title || "Default Variant"}) x${item.quantity} – $${item.price}`;
}).join('\n') || "No items found";

const message = {
  text: `🛒 New order 
💵 Total: $${totalPrice}
📦 Items:
${lineItems}`
};

    // Use await for the fetch call to ensure it completes or errors properly
    const slackResponse = await fetch(settings.slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    // Optional: Check if the message was sent successfully to Slack
    if (!slackResponse.ok) {
        console.error(`Error sending message to Slack: ${slackResponse.status} ${slackResponse.statusText}`, await slackResponse.text());
        // Decide if this should be a 500 error or still a success from Shopify's perspective
    } else {
        console.log(`Successfully sent message to Slack for order ${order.id}`);
    }


    return ({ success: true });
  } catch (err) {
    // Log the specific error that occurred
    console.error("Webhook processing error:", err);
    // Return a 500 status to indicate a server error during processing
    return ({ success: false, error: err.message }, { status: 500 });
  }
};
