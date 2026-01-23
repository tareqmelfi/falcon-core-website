import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Order Intake API - Receives customer data after purchase
// This endpoint collects customer information for order fulfillment

interface OrderIntakeData {
  orderId: string;
  productCode: string;
  formData: Record<string, any>;
  submittedAt: string;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data: OrderIntakeData = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!data.productCode || !data.formData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    console.log('Order intake received:', {
      orderId: data.orderId,
      productCode: data.productCode,
      customerEmail: data.formData.email,
      submittedAt: data.submittedAt
    });

    // TODO: Store in database (Airtable/PocketBase)
    // const airtableResponse = await fetch('https://api.airtable.com/v0/BASE_ID/Orders', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     fields: {
    //       'Order ID': data.orderId,
    //       'Product': data.productCode,
    //       'Customer Name': data.formData.fullName,
    //       'Email': data.formData.email,
    //       'Phone': data.formData.phone,
    //       'Status': 'Data Received',
    //       'Form Data': JSON.stringify(data.formData),
    //       'Submitted At': data.submittedAt
    //     }
    //   })
    // });

    // TODO: Send confirmation email via Resend
    // const emailResponse = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: 'Falcon Core <orders@fc.sa>',
    //     to: data.formData.email,
    //     subject: `Order ${data.orderId} - Information Received`,
    //     html: `<p>Thank you for submitting your information...</p>`
    //   })
    // });

    // TODO: Trigger n8n webhook for automation
    // await fetch(process.env.N8N_WEBHOOK_URL + '/order-intake', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Order information received successfully",
        orderId: data.orderId
      })
    };

  } catch (error) {
    console.error('Order intake error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process order information' })
    };
  }
};

export { handler };
