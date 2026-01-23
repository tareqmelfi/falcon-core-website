import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Stripe webhook handler for processing payment events
// This will be called by Stripe when payment events occur

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const payload = event.body;
    const sig = event.headers['stripe-signature'];

    // In production, verify the webhook signature with Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    const webhookEvent = JSON.parse(payload || '{}');

    console.log('Stripe webhook received:', webhookEvent.type);

    // Handle different event types
    switch (webhookEvent.type) {
      case 'checkout.session.completed':
        const session = webhookEvent.data.object;
        console.log('Payment completed for session:', session.id);
        console.log('Customer email:', session.customer_details?.email);
        console.log('Amount:', session.amount_total);

        // TODO: Send confirmation email
        // TODO: Create order in database
        // TODO: Trigger fulfillment workflow
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = webhookEvent.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = webhookEvent.data.object;
        console.log('Payment failed:', failedPayment.id);
        // TODO: Send payment failed notification
        break;

      default:
        console.log('Unhandled event type:', webhookEvent.type);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook handler failed' })
    };
  }
};

export { handler };
