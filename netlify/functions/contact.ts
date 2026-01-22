import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body || "{}");

    // Validate the data
    const validatedData = contactSchema.parse(body);

    // Create submission record
    const submission = {
      id: Date.now().toString(),
      ...validatedData,
      timestamp: new Date().toISOString(),
      status: "new"
    };

    // Log the submission (in production, you would save to database/send email)
    console.log("New contact submission:", submission);
    console.log(`📧 Email would be sent to: info@fc.sa`);
    console.log(`📧 Subject: New Contact Form: ${validatedData.subject}`);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Your message has been received. We'll get back to you soon.",
        submissionId: submission.id
      })
    };
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          errors: error.errors
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "An error occurred while processing your request"
      })
    };
  }
};

export { handler };
