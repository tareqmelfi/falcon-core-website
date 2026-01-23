import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Stripe Webhook Handler
 *
 * Creates orders in Airtable when payments complete.
 * Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID to enable.
 *
 * Airtable Tables Required:
 * - Orders: OrderId, Email, CustomerName, Product, ProductCode, Status, Progress, Date, Amount, StripeSessionId
 * - OrderSteps: OrderId, Name, NameAr, Status, Date, StepOrder
 * - Messages: OrderId, Email, From, Message, Date, IsTeam
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

// Product pipeline templates
const PRODUCT_MAP: Record<string, { name: string; code: string; steps: { name: string; nameAr: string }[] }> = {
  'FC-WY-001': {
    name: 'Wyoming LLC Formation - Basic',
    code: 'FC-WY-001',
    steps: [
      { name: 'Order Received', nameAr: 'تم استلام الطلب' },
      { name: 'Name Availability Check', nameAr: 'التحقق من توفر الاسم' },
      { name: 'Articles Filed', nameAr: 'تقديم عقد التأسيس' },
      { name: 'State Approval', nameAr: 'موافقة الولاية' },
      { name: 'Documents Delivered', nameAr: 'تسليم المستندات' },
    ],
  },
  'FC-WY-002': {
    name: 'Wyoming LLC Formation - Standard',
    code: 'FC-WY-002',
    steps: [
      { name: 'Order Received', nameAr: 'تم استلام الطلب' },
      { name: 'Name Availability Check', nameAr: 'التحقق من توفر الاسم' },
      { name: 'Articles Filed', nameAr: 'تقديم عقد التأسيس' },
      { name: 'State Approval', nameAr: 'موافقة الولاية' },
      { name: 'EIN Application', nameAr: 'طلب الرقم الضريبي' },
      { name: 'Operating Agreement', nameAr: 'اتفاقية التشغيل' },
      { name: 'Documents Delivered', nameAr: 'تسليم المستندات' },
    ],
  },
  'FC-WY-003': {
    name: 'Wyoming LLC Formation - Premium',
    code: 'FC-WY-003',
    steps: [
      { name: 'Order Received', nameAr: 'تم استلام الطلب' },
      { name: 'Strategy Call', nameAr: 'مكالمة الاستراتيجية' },
      { name: 'Name Check', nameAr: 'التحقق من الاسم' },
      { name: 'Articles Filed', nameAr: 'تقديم عقد التأسيس' },
      { name: 'State Approval', nameAr: 'موافقة الولاية' },
      { name: 'EIN Received', nameAr: 'استلام الرقم الضريبي' },
      { name: 'Operating Agreement', nameAr: 'اتفاقية التشغيل' },
      { name: 'Banking Setup', nameAr: 'فتح الحساب البنكي' },
      { name: 'Tax Consultation', nameAr: 'الاستشارة الضريبية' },
      { name: 'Documents Delivered', nameAr: 'تسليم المستندات' },
    ],
  },
  'FC-ADV-001': {
    name: 'Executive Advisory Session',
    code: 'FC-ADV-001',
    steps: [
      { name: 'Session Scheduled', nameAr: 'تم جدولة الجلسة' },
      { name: 'Questionnaire', nameAr: 'الاستبيان' },
      { name: 'Session Completed', nameAr: 'اكتمال الجلسة' },
      { name: 'Memo Delivered', nameAr: 'تسليم المذكرة' },
    ],
  },
  'FC-FORM-001': {
    name: 'US LLC Formation Package',
    code: 'FC-FORM-001',
    steps: [
      { name: 'Order Received', nameAr: 'تم استلام الطلب' },
      { name: 'Documents Review', nameAr: 'مراجعة المستندات' },
      { name: 'LLC Filing', nameAr: 'تسجيل الشركة' },
      { name: 'State Approval', nameAr: 'موافقة الولاية' },
      { name: 'EIN Application', nameAr: 'طلب الرقم الضريبي' },
      { name: 'Final Documents', nameAr: 'المستندات النهائية' },
    ],
  },
  'FC-WEB-001': {
    name: 'Ready-Made Website Package',
    code: 'FC-WEB-001',
    steps: [
      { name: 'Kickoff', nameAr: 'انطلاق المشروع' },
      { name: 'Design', nameAr: 'التصميم' },
      { name: 'Development', nameAr: 'التطوير' },
      { name: 'Content', nameAr: 'المحتوى' },
      { name: 'Review', nameAr: 'المراجعة' },
      { name: 'Launch', nameAr: 'الإطلاق' },
      { name: 'Training', nameAr: 'التدريب' },
    ],
  },
};

function isAirtableConfigured(): boolean {
  return !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

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
    throw new Error(`Airtable error: ${response.status}`);
  }
  return response.json();
}

async function createOrderInAirtable(
  orderId: string,
  email: string,
  customerName: string,
  productCode: string,
  amount: number,
  stripeSessionId: string
): Promise<void> {
  const product = PRODUCT_MAP[productCode] || PRODUCT_MAP['FC-FORM-001'];

  // Create order
  await airtableRequest('Orders', 'POST', {
    records: [{
      fields: {
        OrderId: orderId,
        Email: email,
        CustomerName: customerName,
        Product: product.name,
        ProductCode: product.code,
        Status: 'pending',
        Progress: 0,
        Date: new Date().toISOString().split('T')[0],
        Amount: amount / 100,
        StripeSessionId: stripeSessionId,
      }
    }]
  });

  // Create pipeline steps
  const stepRecords = product.steps.map((step, index) => ({
    fields: {
      OrderId: orderId,
      Name: step.name,
      NameAr: step.nameAr,
      Status: index === 0 ? 'completed' : 'pending',
      Date: index === 0 ? new Date().toISOString().split('T')[0] : null,
      StepOrder: index + 1,
    }
  }));
  await airtableRequest('OrderSteps', 'POST', { records: stepRecords });

  // Welcome message
  await airtableRequest('Messages', 'POST', {
    records: [{
      fields: {
        OrderId: orderId,
        Email: email,
        From: 'Falcon Core Team',
        Message: `Thank you for your order! Your ${product.name} has been received. Track progress in the Customer Portal.`,
        Date: new Date().toISOString(),
        IsTeam: true,
      }
    }]
  });

  console.log(`Order ${orderId} created in Airtable for ${email}`);
}

function generateOrderId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}-${random}`;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const payload = event.body;
    const sig = event.headers['stripe-signature'];

    // TODO: Verify signature with STRIPE_WEBHOOK_SECRET in production
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

    const webhookEvent = JSON.parse(payload || '{}');
    console.log('Stripe webhook:', webhookEvent.type);

    switch (webhookEvent.type) {
      case 'checkout.session.completed':
        const session = webhookEvent.data.object;
        console.log('Payment completed:', session.id, session.customer_details?.email);

        if (isAirtableConfigured()) {
          const productCode = session.metadata?.product_code || 'FC-FORM-001';
          const orderId = generateOrderId();
          try {
            await createOrderInAirtable(
              orderId,
              session.customer_details?.email || '',
              session.customer_details?.name || '',
              productCode,
              session.amount_total || 0,
              session.id
            );
          } catch (error) {
            console.error('Airtable create order failed:', error);
          }
        } else {
          console.log('Airtable not configured - set AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
        }
        break;

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', webhookEvent.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', webhookEvent.data.object.id);
        break;

      default:
        console.log('Unhandled event:', webhookEvent.type);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error('Webhook error:', error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Webhook handler failed' }) };
  }
};

export { handler };
