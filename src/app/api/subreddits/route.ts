import { initDb } from "@/db/schema"
import {
  getAllSubreddits,
  getSubredditHistory,
  getTopPosts,
} from "@/db/queries"

export async function GET() {
  await initDb()

  const subs = await getAllSubreddits()
  const result = []

  for (const s of subs) {
    const history = await getSubredditHistory(s.subreddit)
    const topPosts = await getTopPosts(s.subreddit, 5)

    const allUps = history.map((h) => h.ups).filter((u): u is number => u !== null)
    const allComments = history
      .map((h) => h.num_comments)
      .filter((c): c is number => c !== null)

    const totalUps = allUps.reduce((a, b) => a + b, 0)
    const totalComments = allComments.reduce((a, b) => a + b, 0)
    const avgUps = allUps.length ? Math.round(totalUps / allUps.length) : null
    const avgComments = allComments.length
      ? Math.round(totalComments / allComments.length)
      : null

    result.push({
      subreddit: s.subreddit,
      subscribers: s.subreddit_subscribers,
      totalSnapshots: history.length,
      totalPosts: new Set(history.map((h) => h.post_id)).size,
      totalUps,
      totalComments,
      avgUps,
      avgComments,
      lastScraped: s.fetched_at,
      topPosts: topPosts.map((p) => ({
        id: p.post_id,
        title: p.title,
        author: p.author,
        ups: p.ups,
        comments: p.num_comments,
        upvoteRatio: p.upvote_ratio,
        permalink: p.permalink,
        url: p.url,
        fetchedAt: p.fetched_at,
      })),
      engagementHistory: history.map((h) => ({
        date: h.fetched_at,
        ups: h.ups,
        comments: h.num_comments,
      })),
    })
  }

  return Response.json({ subreddits: result })
}
