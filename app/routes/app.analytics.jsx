import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  SkeletonBodyText,
  Banner,
  InlineStack,
  Select,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  // In a real implementation, you would fetch order analytics data
  // This would use GraphQL to fetch order data and then process it
  
  // Sample data structure for demonstration
  const analyticsData = {
    totalOrders: 127,
    totalRevenue: 12480.75,
    averageOrderValue: 98.27,
    topProducts: [
      { title: "Blue T-Shirt", count: 42, revenue: 1890.00 },
      { title: "Black Jeans", count: 28, revenue: 1680.00 },
      { title: "Vintage Hoodie", count: 24, revenue: 1440.00 }
    ],
    dailyOrders: [
      { date: "2025-04-14", count: 12, revenue: 1180.50 },
      { date: "2025-04-15", count: 15, revenue: 1475.25 },
      { date: "2025-04-16", count: 18, revenue: 1764.90 },
      { date: "2025-04-17", count: 14, revenue: 1375.60 },
      { date: "2025-04-18", count: 22, revenue: 2161.70 },
      { date: "2025-04-19", count: 25, revenue: 2456.50 },
      { date: "2025-04-20", count: 21, revenue: 2066.30 }
    ],
    notificationsSent: 127, // Number of Slack notifications sent
    notificationStats: {
      newOrders: 127,
      canceledOrders: 3,
      fulfilledOrders: 110
    }
  };
  
  return { analyticsData };
};

export default function AnalyticsPage() {
  const fetcher = useFetcher();
  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load data when component mounts
    fetcher.load("/app/analytics");
  }, []);
  
  // Set loading state based on fetcher state
  useEffect(() => {
    if (fetcher.state === "loading") {
      setIsLoading(true);
    } else if (fetcher.data) {
      setIsLoading(false);
    }
  }, [fetcher.state, fetcher.data]);
  
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    // In a real app, you would reload data with the new time range
  };
  
  const data = fetcher.data?.analyticsData;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Page>
      <TitleBar title="Order Analytics" />
      <BlockStack gap="500">
        <InlineStack align="end">
          <div style={{ marginLeft: "auto" }}>
            <Select
              label="Time range"
              options={[
                { label: "Last 7 days", value: "7days" },
                { label: "Last 30 days", value: "30days" },
                { label: "Last 90 days", value: "90days" }
              ]}
              value={timeRange}
              onChange={handleTimeRangeChange}
            />
          </div>
        </InlineStack>
        
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Orders Overview</Text>
                  
                  {isLoading ? (
                    <SkeletonBodyText lines={3} />
                  ) : (
                    <InlineStack gap="800" align="space-evenly" blockAlign="center">
                      <BlockStack gap="200" alignment="center">
                        <Text as="p" variant="headingXl">{data?.totalOrders || 0}</Text>
                        <Text as="p" variant="bodySm">Total Orders</Text>
                      </BlockStack>
                      
                      <BlockStack gap="200" alignment="center">
                        <Text as="p" variant="headingXl">{formatCurrency(data?.totalRevenue || 0)}</Text>
                        <Text as="p" variant="bodySm">Total Revenue</Text>
                      </BlockStack>
                      
                      <BlockStack gap="200" alignment="center">
                        <Text as="p" variant="headingXl">{formatCurrency(data?.averageOrderValue || 0)}</Text>
                        <Text as="p" variant="bodySm">Average Order Value</Text>
                      </BlockStack>
                    </InlineStack>
                  )}
                </BlockStack>
              </Card>
              
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Daily Order Volume</Text>
                  
                  {isLoading ? (
                    <SkeletonBodyText lines={8} />
                  ) : (
                    <div style={{ height: "300px", marginTop: "20px" }}>
                      {/* In a real app, you would render a chart here using a library like recharts */}
                      <Text as="p" variant="bodyMd">
                        [Chart would display daily order volume for the selected time period]
                      </Text>
                      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Date</th>
                            <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>Orders</th>
                            <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.dailyOrders.map(day => (
                            <tr key={day.date}>
                              <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>
                                {new Date(day.date).toLocaleDateString()}
                              </td>
                              <td style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>
                                {day.count}
                              </td>
                              <td style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>
                                {formatCurrency(day.revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
          
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Notification Stats</Text>
                  
                  {isLoading ? (
                    <SkeletonBodyText lines={4} />
                  ) : (
                    <BlockStack gap="300">
                      <Text as="p" variant="bodyMd">
                        <strong>Total notifications sent:</strong> {data?.notificationsSent || 0}
                      </Text>
                      <BlockStack gap="200">
                        <Text variant="bodyMd">By notification type:</Text>
                        <ul style={{ marginLeft: "20px" }}>
                          <li>New orders: {data?.notificationStats.newOrders || 0}</li>
                          <li>Canceled orders: {data?.notificationStats.canceledOrders || 0}</li>
                          <li>Fulfilled orders: {data?.notificationStats.fulfilledOrders || 0}</li>
                        </ul>
                      </BlockStack>
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
              
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Top Products</Text>
                  
                  {isLoading ? (
                    <SkeletonBodyText lines={6} />
                  ) : (
                    <BlockStack gap="200">
                      {data?.topProducts.map((product, index) => (
                        <BlockStack key={index} gap="100">
                          <InlineStack align="space-between">
                            <Text variant="bodyMd" fontWeight="bold">{product.title}</Text>
                            <Text variant="bodyMd">{formatCurrency(product.revenue)}</Text>
                          </InlineStack>
                          <Text variant="bodySm">Sold {product.count} units</Text>
                        </BlockStack>
                      ))}
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}