import PocketBase from 'pocketbase';

/**
 * PocketBase Client Instance
 * 
 * This is the main PocketBase client used throughout the application.
 * It connects to your PocketBase server using the URL from environment variables.
 * 
 * Usage:
 * ```ts
 * import pb from '@/lib/pocketbase';
 * 
 * // Fetch articles
 * const articles = await pb.collection('articles').getFullList();
 * 
 * // Create a comment
 * await pb.collection('comments').create({
 *   article: articleId,
 *   author: 'John Doe',
 *   content: 'Great article!'
 * });
 * 
 * // Authenticate (if needed)
 * await pb.collection('users').authWithPassword(email, password);
 * ```
 * 
 * Environment Variables:
 * - Development: VITE_POCKETBASE_URL=http://localhost:8090
 * - Production: VITE_POCKETBASE_URL=https://your-pocketbase-domain.com
 */

const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090'
);

// Enable auto-cancellation of pending requests on route change
pb.autoCancellation(false);

// Optional: Enable real-time subscriptions
// pb.collection('articles').subscribe('*', function (e) {
//   console.log('Article changed:', e.action, e.record);
// });

export default pb;
