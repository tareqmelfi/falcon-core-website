import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

// Store contact submissions (in memory for demo, would be database in production)
const submissions: Array<any> = [];

// POST /api/contact - Submit contact form
router.post("/", (req: Request, res: Response) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    // Create submission record
    const submission = {
      id: Date.now().toString(),
      ...validatedData,
      timestamp: new Date().toISOString(),
      status: "new"
    };

    // Store in memory
    submissions.push(submission);

    // In production, you would:
    // 1. Send email notification to admin
    // 2. Save to PocketBase database
    // 3. Send confirmation email to user
    // 4. Create CRM/ticket in your system

    console.log("New contact submission:", submission);

    // Simulate email sending
    console.log(`📧 Email would be sent to: info@falconcore.us`);
    console.log(`📧 Subject: New Contact Form: ${validatedData.subject}`);

    res.status(200).json({
      success: true,
      message: "Your message has been received. We'll get back to you soon.",
      submissionId: submission.id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request"
    });
  }
});

// GET /api/contact/submissions - Get all submissions (admin only)
// In production, this would require authentication
router.get("/submissions", (req: Request, res: Response) => {
  // TODO: Add authentication check
  res.json({
    total: submissions.length,
    submissions: submissions
  });
});

export default router;
