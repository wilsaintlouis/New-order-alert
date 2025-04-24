import {
    Page,
    Layout,
    Card,
    TextField,
    Button,
  } from "@shopify/polaris";
  import { Form, useLoaderData, useSubmit } from "@remix-run/react";
  import prisma from "../db.server";
  import { authenticate } from "../shopify.server";
  import { useState, useEffect } from "react";
  
  // Load current Slack URL from DB
  export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
  
    const settings = await prisma.shopSettings.findUnique({ where: { shop } });
  
    return ({
      slackWebhookUrl: settings?.slackWebhookUrl || "",
    });
  };
  
  // Save new Slack URL to DB
  export const action = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
  
    const formData = await request.formData();
    const slackWebhookUrl = formData.get("slackWebhookUrl");
  
    await prisma.shopSettings.upsert({
      where: { shop },
      update: { slackWebhookUrl },
      create: { shop, slackWebhookUrl },
    });
  
    return ({ success: true });
  };
  
  export default function SettingsPage() {
    const { slackWebhookUrl } = useLoaderData();
    const [webhookUrl, setWebhookUrl] = useState("");
    const submit = useSubmit();
  
    // Initialize state with the data from loader when it becomes available
    useEffect(() => {
      setWebhookUrl(slackWebhookUrl);
    }, [slackWebhookUrl]);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
        //prevents submission if its not a slack webhook url 
        return;
      }
      const formData = new FormData(event.target);
      submit(formData, { method: "post" });
    };
  
    return (
      <Page title="App Settings">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Form method="post" onSubmit={handleSubmit}>
                <TextField
                  label="Slack Webhook URL"
                  name="slackWebhookUrl"
                  value={webhookUrl}
                  onChange={setWebhookUrl}
                  placeholder="https://hooks.slack.com/services/..."
                  autoComplete="off"
                />
                <div style={{ marginTop: "1rem" }}>
                  <Button submit primary>Save</Button>
                </div>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }