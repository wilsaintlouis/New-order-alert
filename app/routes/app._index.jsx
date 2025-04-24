import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Box,
  List,
  Link,
  Divider,
  CalloutCard,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function Index() {
  return (
    <Page>
      <TitleBar title="Shopify to Slack Notifications" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <CalloutCard
              title="Welcome to your Shopify to Slack Notification App"
              illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
              primaryAction={{
                content: "View Webhooks Settings",
                url: "/app/settings",
              }}
            >
              <p>
                This app allows you to receive instant notifications in Slack whenever
                a new order is created in your Shopify store.
              </p>
            </CalloutCard>

            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Set Up Your Slack Integration
                </Text>

                <Divider />
                
                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">
                    Step 1: Create a Slack Incoming Webhook
                  </Text>
                  
                  <List type="number">
                    <List.Item>
                      Go to  
                        <Link
                        url="https://api.slack.com/messaging/webhooks"
                        target="_blank"
                        removeUnderline
                      >
                           ( https://api.slack.com/messaging/webhooks )
                      </Link>
                       and follow instructions
                    </List.Item>
                   
                    <List.Item>Slack will generate a unique Webhook URL - copy this URL</List.Item>
                  </List>
                </BlockStack>

                <Divider />

                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">
                    Step 2: Enter Your Webhook URL in Shopify
                  </Text>
                  
                  <List type="number">
                    <List.Item>
                      In your Shopify admin sidebar, locate and click on the <strong>Webhooks</strong> section or click the "View Webhooks Settings" button on this page  
                    </List.Item>
                    
                    <List.Item>
                      Paste your Slack Webhook URL in the designated field
                    </List.Item>
                    <List.Item>
                      Click "Save" to activate your Slack notifications
                    </List.Item>
                  </List>
                </BlockStack>

                <Divider />

                <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="200">
                    <Text variant="headingSm">✨ What happens next?</Text>
                    <Text variant="bodyMd">
                      Once your webhook is saved, every time a new order is created in your Shopify store, 
                      you'll receive an instant notification in your selected Slack channel with details 
                      about the order.
                    </Text>
                  </BlockStack>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Finding the Webhooks Section
                  </Text>
                  <Text variant="bodyMd" as="p">
                    The <strong>Webhooks</strong> section can be found:
                  </Text>
                  <Box paddingBlockStart="200">
                    <List>
                      <List.Item>
                        In the left navigation menu of our app
                      </List.Item>
                      <List.Item>
                        Click on "Webhooks" to enter your Slack webhook URL
                      </List.Item>
                    </List>
                  </Box>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Notification Details
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Your Slack notifications will include:
                  </Text>
                  <List>
                    
                    
                    <List.Item>
                      Order total  
                    </List.Item>
                    <List.Item>
                    items purchased
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Need Help?
                  </Text>
                  <Text variant="bodyMd" as="p">
                    If you encounter any issues setting up your Slack integration:
                  </Text>
                  <List>
                    <List.Item>
                      Check our{" "}
                      <Link
                        url="#"
                        removeUnderline
                      >
                        documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      Contact{" "}
                      <Link
                        url="mailto:support@example.com"
                        removeUnderline
                      >
                        support
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}