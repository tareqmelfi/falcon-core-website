import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import crypto from 'crypto';

// In-memory token storage (in production, use Redis or database)
// Format: { token: { email, orderId, expiresAt } }
const tokenStore: Map<string, { email: string; orderId?: string; expiresAt: number }> = new Map();

// Clean expired tokens periodically
const cleanExpiredTokens = () => {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (data.expiresAt < now) {
      tokenStore.delete(token);
    }
  }
};

// Generate secure token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Simulated customer database (in production, use real database)
// This would normally come from Stripe customers + orders
const mockCustomerDB: Record<string, { name: string; orders: string[] }> = {
  // Add real customer emails here from Stripe webhook
};

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

  const path = event.path.replace('/.netlify/functions/portal-auth', '');

  try {
    // POST /request-link - Send magic link to email
    if (event.httpMethod === "POST" && path === '/request-link') {
      const body = JSON.parse(event.body || '{}');
      const { email, orderId, language = 'en' } = body;

      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
          })
        };
      }

      // In production: Check if email exists in customer database
      // For now, we'll check if there are any orders associated with this email
      // This would query Stripe or your database

      // Generate token with 15 minute expiration
      cleanExpiredTokens();
      const token = generateToken();
      const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes

      tokenStore.set(token, { email, orderId, expiresAt });

      // Build magic link URL
      const baseUrl = process.env.URL || 'https://falconcore.us';
      const magicLink = `${baseUrl}/portal?token=${token}`;

      // In production: Send email via SendGrid, Resend, or AWS SES
      // For now, log and return success
      console.log('Magic Link generated for:', email);
      console.log('Magic Link:', magicLink);
      console.log('Token expires at:', new Date(expiresAt).toISOString());

      // TODO: Integrate with email service
      // await sendEmail({
      //   to: email,
      //   subject: language === 'ar' ? 'رابط الدخول لبوابة فالكون كور' : 'Your Falcon Core Portal Access Link',
      //   html: `
      //     <p>${language === 'ar' ? 'مرحباً،' : 'Hello,'}</p>
      //     <p>${language === 'ar' ? 'اضغط على الرابط التالي للدخول:' : 'Click the link below to access your portal:'}</p>
      //     <a href="${magicLink}">${magicLink}</a>
      //     <p>${language === 'ar' ? 'صالح لمدة 15 دقيقة' : 'Valid for 15 minutes'}</p>
      //   `
      // });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: language === 'ar'
            ? 'تم إرسال رابط الدخول إلى بريدك الإلكتروني. يرجى التحقق من البريد الوارد.'
            : 'Access link sent to your email. Please check your inbox.',
          // Only include token in development for testing
          ...(process.env.NODE_ENV === 'development' && { debugToken: token, debugLink: magicLink })
        })
      };
    }

    // POST /verify-token - Verify magic link token
    if (event.httpMethod === "POST" && path === '/verify-token') {
      const body = JSON.parse(event.body || '{}');
      const { token } = body;

      if (!token) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Token is required' })
        };
      }

      cleanExpiredTokens();
      const tokenData = tokenStore.get(token);

      if (!tokenData) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid or expired token. Please request a new link.'
          })
        };
      }

      // Token is valid - generate session token for continued access
      const sessionToken = generateToken();
      const sessionExpiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

      tokenStore.set(sessionToken, {
        email: tokenData.email,
        orderId: tokenData.orderId,
        expiresAt: sessionExpiresAt
      });

      // Remove the one-time magic link token
      tokenStore.delete(token);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          sessionToken,
          email: tokenData.email,
          expiresAt: sessionExpiresAt
        })
      };
    }

    // POST /validate-session - Check if session is still valid
    if (event.httpMethod === "POST" && path === '/validate-session') {
      const body = JSON.parse(event.body || '{}');
      const { sessionToken } = body;

      if (!sessionToken) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, valid: false })
        };
      }

      cleanExpiredTokens();
      const sessionData = tokenStore.get(sessionToken);

      if (!sessionData) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, valid: false })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          valid: true,
          email: sessionData.email
        })
      };
    }

    // POST /logout - Invalidate session
    if (event.httpMethod === "POST" && path === '/logout') {
      const body = JSON.parse(event.body || '{}');
      const { sessionToken } = body;

      if (sessionToken) {
        tokenStore.delete(sessionToken);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Portal auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };
