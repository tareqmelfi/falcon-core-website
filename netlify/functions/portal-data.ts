import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Portal Data API - Customer Order Management
 *
 * Database Integration:
 * - Production: Airtable (set AIRTABLE_API_KEY and AIRTABLE_BASE_ID)
 * - Development: Returns empty orders (no demo data)
 *
 * Endpoints:
 * - GET /orders?email=xxx - Get customer's orders with pipeline status
 * - GET /order/:id?email=xxx - Get specific order details
 * - POST /message - Send message to support
 *
 * Orders are created when:
 * 1. Stripe webhook receives checkout.session.completed
 * 2. Admin manually creates order in Airtable dashboard
 *
 * Airtable Tables Required:
 * - Orders: OrderId, Email, Product, ProductCode, Status, Progress, Date, Amount, CustomerName
 * - OrderSteps: OrderId, Name, NameAr, Status, Date, StepOrder
 * - Documents: OrderId, Name, Size, Date, URL
 * - Messages: OrderId, Email, From, Message, Date, IsTeam
 */

// Airtable Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

interface Order {
  id: string;
  email: string;
  product: string;
  productCode: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  date: string;
  amount: number;
  customerName?: string;
  steps: {
    name: string;
    nameAr?: string;
    status: 'pending' | 'in_progress' | 'completed';
    date: string | null;
  }[];
  documents?: {
    name: string;
    size: string;
    date: string;
    url?: string;
  }[];
  messages?: {
    from: string;
    message: string;
    date: string;
    isTeam: boolean;
  }[];
}

/**
 * Check if Airtable is configured
 */
function isAirtableConfigured(): boolean {
  return !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

/**
 * Make Airtable API request
 */
async function airtableRequest(endpoint: string, method = 'GET', body?: any): Promise<any> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch orders from Airtable for a customer email
 */
async function fetchOrdersFromAirtable(email: string): Promise<Order[]> {
  const filterFormula = `LOWER({Email}) = '${email.toLowerCase()}'`;
  const ordersResponse = await airtableRequest(
    `Orders?filterByFormula=${encodeURIComponent(filterFormula)}&sort[0][field]=Date&sort[0][direction]=desc`
  );

  const orders: Order[] = [];

  for (const record of ordersResponse.records || []) {
    const orderId = record.fields.OrderId || record.id;

    // Fetch steps for this order
    let steps: Order['steps'] = [];
    try {
      const stepsFilter = `{OrderId} = '${orderId}'`;
      const stepsResponse = await airtableRequest(
        `OrderSteps?filterByFormula=${encodeURIComponent(stepsFilter)}&sort[0][field]=StepOrder&sort[0][direction]=asc`
      );
      steps = (stepsResponse.records || []).map((s: any) => ({
        name: s.fields.Name,
        nameAr: s.fields.NameAr,
        status: s.fields.Status || 'pending',
        date: s.fields.Date || null,
      }));
    } catch (e) {
      console.log('OrderSteps table not found or empty');
    }

    // Fetch documents for this order
    let documents: Order['documents'] = [];
    try {
      const docsFilter = `{OrderId} = '${orderId}'`;
      const docsResponse = await airtableRequest(
        `Documents?filterByFormula=${encodeURIComponent(docsFilter)}`
      );
      documents = (docsResponse.records || []).map((d: any) => ({
        name: d.fields.Name,
        size: d.fields.Size || '',
        date: d.fields.Date,
        url: d.fields.URL,
      }));
    } catch (e) {
      console.log('Documents table not found or empty');
    }

    // Fetch messages for this order
    let messages: Order['messages'] = [];
    try {
      const msgsFilter = `{OrderId} = '${orderId}'`;
      const msgsResponse = await airtableRequest(
        `Messages?filterByFormula=${encodeURIComponent(msgsFilter)}&sort[0][field]=Date&sort[0][direction]=asc`
      );
      messages = (msgsResponse.records || []).map((m: any) => ({
        from: m.fields.From,
        message: m.fields.Message,
        date: m.fields.Date,
        isTeam: m.fields.IsTeam || false,
      }));
    } catch (e) {
      console.log('Messages table not found or empty');
    }

    orders.push({
      id: orderId,
      email: record.fields.Email,
      product: record.fields.Product,
      productCode: record.fields.ProductCode || '',
      status: record.fields.Status || 'pending',
      progress: record.fields.Progress || 0,
      date: record.fields.Date,
      amount: record.fields.Amount || 0,
      customerName: record.fields.CustomerName,
      steps,
      documents,
      messages,
    });
  }

  return orders;
}

/**
 * Save message to Airtable
 */
async function saveMessageToAirtable(email: string, orderId: string | undefined, message: string): Promise<void> {
  await airtableRequest('Messages', 'POST', {
    records: [{
      fields: {
        OrderId: orderId || '',
        Email: email,
        From: email,
        Message: message,
        Date: new Date().toISOString(),
        IsTeam: false,
      }
    }]
  });
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Validate session token from Authorization header
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized - No session token provided' })
    };
  }

  const sessionToken = authHeader.replace('Bearer ', '');

  // In production: Validate session token against your auth system
  // TODO: Verify session token validity against stored sessions

  const path = event.path.replace('/.netlify/functions/portal-data', '');

  try {
    // GET /orders - Get customer's orders with full pipeline data
    if (event.httpMethod === "GET" && path === '/orders') {
      const email = event.queryStringParameters?.email;

      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email parameter required' })
        };
      }

      let customerOrders: Order[] = [];

      // Fetch from Airtable if configured
      if (isAirtableConfigured()) {
        try {
          customerOrders = await fetchOrdersFromAirtable(email);
          console.log(`Fetched ${customerOrders.length} orders from Airtable for ${email}`);
        } catch (error) {
          console.error('Airtable fetch error:', error);
          // Continue with empty orders rather than failing
        }
      } else {
        console.log('Airtable not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.');
      }

      // Calculate stats
      const stats = {
        activeOrders: customerOrders.filter(o => o.status === 'in_progress' || o.status === 'pending').length,
        completedOrders: customerOrders.filter(o => o.status === 'completed').length,
        totalDocuments: customerOrders.reduce((sum, o) => sum + (o.documents?.length || 0), 0)
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          orders: customerOrders,
          stats,
          // Helpful message for debugging
          debug: {
            airtableConfigured: isAirtableConfigured(),
            orderCount: customerOrders.length,
          }
        })
      };
    }

    // GET /order/:id - Get specific order details
    if (event.httpMethod === "GET" && path.startsWith('/order/')) {
      const orderId = path.replace('/order/', '');
      const email = event.queryStringParameters?.email;

      if (!email || !orderId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and order ID required' })
        };
      }

      let order: Order | undefined;

      if (isAirtableConfigured()) {
        try {
          const customerOrders = await fetchOrdersFromAirtable(email);
          order = customerOrders.find(o => o.id === orderId);
        } catch (error) {
          console.error('Airtable fetch error:', error);
        }
      }

      if (!order) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Order not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          order
        })
      };
    }

    // POST /message - Send message to support
    if (event.httpMethod === "POST" && path === '/message') {
      const body = JSON.parse(event.body || '{}');
      const { email, orderId, message } = body;

      if (!email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and message required' })
        };
      }

      console.log('New support message from:', email);
      console.log('Order ID:', orderId);
      console.log('Message:', message);

      // Save to Airtable if configured
      if (isAirtableConfigured()) {
        try {
          await saveMessageToAirtable(email, orderId, message);
          console.log('Message saved to Airtable');
        } catch (error) {
          console.error('Failed to save message to Airtable:', error);
          // Don't fail the request, just log the error
        }
      }

      // TODO: Send notification to support team via email/Slack
      // Consider using SendGrid, Mailgun, or Slack webhook

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Message sent successfully. Our team will respond shortly.'
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Portal data error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };
