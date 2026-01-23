import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// In production, this would be connected to your database (e.g., Supabase, MongoDB, etc.)
// Orders would be created when Stripe webhook receives checkout.session.completed

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

// Mock database - In production, replace with real database queries
// Orders are keyed by email for quick lookup
const ordersDB: Map<string, Order[]> = new Map();

// Initialize with empty - orders will come from Stripe webhooks
// Example of how an order would look when created:
/*
ordersDB.set('customer@example.com', [{
  id: 'ORD-2026-001',
  email: 'customer@example.com',
  product: 'US LLC Formation Package',
  productCode: 'FC-FORM-001',
  status: 'in_progress',
  progress: 60,
  date: '2026-01-20',
  amount: 1200,
  customerName: 'John Doe',
  steps: [
    { name: 'Order Received', nameAr: 'تم استلام الطلب', status: 'completed', date: '2026-01-20' },
    { name: 'Intake Form Completed', nameAr: 'تم اكتمال نموذج المعلومات', status: 'completed', date: '2026-01-21' },
    { name: 'Articles Filed with Wyoming', nameAr: 'تم تقديم المستندات لوايومنغ', status: 'completed', date: '2026-01-22' },
    { name: 'EIN Application', nameAr: 'طلب الرقم الضريبي', status: 'in_progress', date: null },
    { name: 'Documents Delivered', nameAr: 'تسليم المستندات', status: 'pending', date: null },
  ],
  documents: [],
  messages: []
}]);
*/

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
  // For now, we'll trust the token and extract email from request
  // This should be verified against the token store in portal-auth.ts

  const path = event.path.replace('/.netlify/functions/portal-data', '');

  try {
    // GET /orders - Get customer's orders
    if (event.httpMethod === "GET" && path === '/orders') {
      const email = event.queryStringParameters?.email;

      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email parameter required' })
        };
      }

      // Get orders for this customer
      const customerOrders = ordersDB.get(email.toLowerCase()) || [];

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
          stats
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

      const customerOrders = ordersDB.get(email.toLowerCase()) || [];
      const order = customerOrders.find(o => o.id === orderId);

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

      // In production: Save message to database and notify support team
      console.log('New support message from:', email);
      console.log('Order ID:', orderId);
      console.log('Message:', message);

      // TODO: Send notification to support team via email/Slack

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
