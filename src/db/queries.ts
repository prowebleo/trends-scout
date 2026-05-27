import { getDb } from "./client"
import type { RedditSnapshot } from "@/scraper/types"

type RedditRow = {
  id: number
  subreddit: string
  post_id: string
  title: string | null
  author: string | null
  ups: number | null
  num_comments: number | null
  upvote_ratio: number | null
  permalink: string | null
  url: string | null
  subreddit_subscribers: number | null
  created_utc: number | null
  fetched_at: string
}

export async function saveSnapshot(post: RedditSnapshot) {
  const db = await getDb()
  await db.execute({
    sql: `INSERT INTO reddit_snapshots (subreddit, post_id, title, author, ups, num_comments, upvote_ratio, permalink, url, subreddit_subscribers, created_utc)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      post.subreddit,
      post.postId,
      post.title,
      post.author,
      post.ups,
      post.numComments,
      post.upvoteRatio,
      post.permalink,
      post.url,
      post.subredditSubscribers,
      post.createdUtc,
    ],
  })
}

export async function getHistory(
  subreddit: string,
  postId: string
): Promise<RedditRow[]> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM reddit_snapshots WHERE subreddit = ? AND post_id = ? ORDER BY fetched_at ASC`,
    args: [subreddit, postId],
  })
  return result.rows as unknown as RedditRow[]
}

export async function getLatestPosts(
  subreddit: string,
  limit = 25
): Promise<RedditRow[]> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM reddit_snapshots WHERE subreddit = ? ORDER BY fetched_at DESC LIMIT ?`,
    args: [subreddit, limit],
  })
  return result.rows as unknown as RedditRow[]
}

export async function getAllSubreddits(): Promise<RedditRow[]> {
  const db = await getDb()
  const result = await db.execute(`
    SELECT * FROM reddit_snapshots WHERE id IN (
      SELECT MIN(id) FROM reddit_snapshots GROUP BY subreddit
    ) ORDER BY fetched_at DESC
  `)
  return result.rows as unknown as RedditRow[]
}

export async function getSubredditLatest(
  subreddit: string
): Promise<RedditRow | null> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM reddit_snapshots WHERE subreddit = ? ORDER BY fetched_at DESC LIMIT 1`,
    args: [subreddit],
  })
  const rows = result.rows as unknown as RedditRow[]
  return rows[0] ?? null
}

export async function getSubredditHistory(
  subreddit: string
): Promise<RedditRow[]> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM reddit_snapshots WHERE subreddit = ? ORDER BY fetched_at ASC`,
    args: [subreddit],
  })
  return result.rows as unknown as RedditRow[]
}

export async function getTopPosts(
  subreddit: string,
  limit = 10
): Promise<RedditRow[]> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM reddit_snapshots WHERE id IN (
      SELECT MAX(id) FROM reddit_snapshots WHERE subreddit = ? GROUP BY post_id
    ) ORDER BY ups DESC LIMIT ?`,
    args: [subreddit, limit],
  })
  return result.rows as unknown as RedditRow[]
}
