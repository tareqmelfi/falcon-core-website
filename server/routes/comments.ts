import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

// Comment validation schema
const commentSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  content: z.string().min(5, "Comment must be at least 5 characters")
});

// Store comments in memory (in production, would use PocketBase)
const comments: Array<any> = [
  {
    id: "1",
    articleId: "1",
    name: "Ali Hassan",
    email: "ali@example.com",
    content: "Great article! Very informative about AI implementation. Looking forward to more.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approved: true
  },
  {
    id: "2",
    articleId: "1",
    name: "Fatima Al-Dosari",
    email: "fatima@example.com",
    content: "Excellent breakdown of the implementation strategies. Will definitely apply these insights to our project.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    approved: true
  }
];

let commentIdCounter = comments.length + 1;

// GET /api/comments/:articleId - Get comments for an article
router.get("/:articleId", (req: Request, res: Response) => {
  const articleComments = comments
    .filter(c => c.articleId === req.params.articleId && c.approved)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json(articleComments);
});

// POST /api/comments - Submit a new comment
router.post("/", (req: Request, res: Response) => {
  try {
    const validatedData = commentSchema.parse(req.body);

    const newComment = {
      id: commentIdCounter.toString(),
      ...validatedData,
      timestamp: new Date().toISOString(),
      approved: false // Comments require moderation
    };

    comments.push(newComment);
    commentIdCounter++;

    // In production, would:
    // 1. Save to PocketBase
    // 2. Send moderation notification to admin
    // 3. Send confirmation email to commenter

    console.log("New comment submitted:", newComment);

    res.status(201).json({
      success: true,
      message: "Thank you for your comment! It will appear after moderation.",
      commentId: newComment.id
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
      message: "An error occurred while processing your comment"
    });
  }
});

// GET /api/comments/pending - Get pending comments (admin)
router.get("/pending", (req: Request, res: Response) => {
  // TODO: Add authentication check
  const pending = comments.filter(c => !c.approved);
  res.json(pending);
});

export default router;
