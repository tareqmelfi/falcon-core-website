import PocketBase from 'pocketbase';

/**
 * Server-Side PocketBase Client Instance
 * 
 * This is the PocketBase client for server-side operations.
 * It connects to your PocketBase server using the URL from environment variables.
 * 
 * Usage in server routes:
 * ```ts
 * import pb from '../lib/pocketbase';
 * 
 * // Fetch articles
 * router.get('/articles', async (req, res) => {
 *   try {
 *     const articles = await pb.collection('articles').getFullList({
 *       sort: '-created',
 *       filter: 'published = true'
 *     });
 *     res.json(articles);
 *   } catch (error) {
 *     res.status(500).json({ error: 'Failed to fetch articles' });
 *   }
 * });
 * 
 * // Create a contact submission
 * await pb.collection('contacts').create({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello!'
 * });
 * 
 * // Admin authentication (if needed for protected operations)
 * await pb.admins.authWithPassword(
 *   process.env.POCKETBASE_ADMIN_EMAIL,
 *   process.env.POCKETBASE_ADMIN_PASSWORD
 * );
 * ```
 * 
 * Environment Variables:
 * - POCKETBASE_URL: Your PocketBase server URL
 *   - Development: http://localhost:8090
 *   - Production: https://your-pocketbase-domain.com
 * - POCKETBASE_ADMIN_EMAIL: (Optional) Admin email for protected operations
 * - POCKETBASE_ADMIN_PASSWORD: (Optional) Admin password for protected operations
 */

const pb = new PocketBase(
  process.env.POCKETBASE_URL || 'http://localhost:8090'
);

// Disable auto-cancellation for server-side operations
pb.autoCancellation(false);

// Optional: Authenticate as admin on startup for protected operations
// (Only do this if your server routes need admin access)
// if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
//   pb.admins.authWithPassword(
//     process.env.POCKETBASE_ADMIN_EMAIL,
//     process.env.POCKETBASE_ADMIN_PASSWORD
//   ).catch((err) => {
//     console.error('Failed to authenticate PocketBase admin:', err);
//   });
// }

export default pb;
